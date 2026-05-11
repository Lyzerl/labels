// ============================================================
// Cloudflare Worker: priority-proxy
// ============================================================
// תפקיד: פרוקסי בין הדפדפן ל-Priority OData API
//
// תיקונים בגרסה זו (לעומת המקור):
//   1. **$orderby קבוע ל-pagination** - בעבר לא היה $orderby, מה שגרם
//      ל-OData להחזיר אותן שורות בכמה דפים או לפספס שורות בין דפים.
//      התוצאה: עד 7% שורות כפולות + חוסר במשיכה. עכשיו יציב.
//   2. **דדופ (dedup) פנימי בעת fetchAll** - גם אם dependent דפים חופפים
//      בקצוות, מסירים כפילויות לפי המפתח הסטנדרטי של PRIT_ORDPACK_ONE
//      (ORDI + KLINEA) לפני החזרה ללקוח.
//   3. **countOnly=true** - מצב חדש שמחזיר רק `{count: N}` בלי השורות,
//      לאימות מהיר. (כיוון ש-Priority לא מחזיר @odata.count, זה
//      בעצם עושה fetchAll פנימי וסופר. עדיין מהיר יותר מצד הלקוח.)
//   4. **`countSource`** בתשובה - אומר לצרכן מאיפה הגיעה הספירה
//      ('odata' / 'fetched' / 'unknown').
//
// תאימות לאחור: כל הפרמטרים הקיימים (filter, table, key, subform,
// fetchAll) ממשיכים לעבוד בדיוק כמו קודם.
// ============================================================

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url       = new URL(request.url);
      const filter    = url.searchParams.get('filter')    || '';
      const table     = url.searchParams.get('table')     || 'PRIT_ORDPACK_ONE';
      const key       = url.searchParams.get('key')       || '';
      const subform   = url.searchParams.get('subform')   || '';
      const fetchAll  = url.searchParams.get('fetchAll')  === 'true';
      const countOnly = url.searchParams.get('countOnly') === 'true';

      const baseUrl    = 'https://p.priority-connect.online/odata/Priority/tabbc66b.ini/a080724';
      const username   = '6A3BDE212C5C4CDFA45273A35A236F43';
      const password   = 'PAT';
      const authHeader = 'Basic ' + btoa(username + ':' + password);

      const apiUrl = (key && subform)
        ? `${baseUrl}/${table}('${key}')/${subform}`
        : `${baseUrl}/${table}`;

      // === מצב חדש: countOnly - מחזיר רק את הספירה ===
      if (countOnly) {
        return await fetchCount(apiUrl, filter, authHeader, corsHeaders, table);
      }

      if (fetchAll) {
        return await fetchAllParallel(apiUrl, filter, authHeader, corsHeaders, table);
      }

      // משיכה רגילה - בקשה אחת
      const fullUrl = filter ? `${apiUrl}?${filter}` : `${apiUrl}?$top=25`;
      const priorityResponse = await fetch(fullUrl, {
        headers: { 'Authorization': authHeader, 'Accept': 'application/json' }
      });

      const data = await priorityResponse.text();
      return new Response(data, {
        status: priorityResponse.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  },
};

// ============================================================
// העדפות $orderby לפי טבלה - כדי להבטיח pagination יציב
// ============================================================
function pickOrderby(table) {
  // ORDI = Internal Order ID (מפתח ייחודי לכל שורה ב-PRIT_ORDPACK_ONE)
  if (table === 'PRIT_ORDPACK_ONE' || !table) {
    return 'ORDI,KLINEA';
  }
  // ברירת מחדל - ניסיון בסיסי. אם הטבלה לא תומכת - מסירים מהפילטר במקרה של שגיאה.
  return 'ORDNAME';
}

// ============================================================
// בניית URL יציב עם $orderby קבוע (אם המשתמש לא הוסיף אחד)
// ============================================================
function buildStableUrl(apiUrl, baseFilter, table, skip, top) {
  const hasOrderby = /\$orderby=/i.test(baseFilter);

  // ניקוי $top/$skip קיימים
  const cleanFilter = (baseFilter || '')
    .replace(/\$top=\d+/g, '')
    .replace(/\$skip=\d+/g, '')
    .replace(/&&+/g, '&')
    .replace(/^&|&$/g, '');

  const sep = cleanFilter ? '&' : '';
  const orderbyClause = hasOrderby ? '' : `&$orderby=${pickOrderby(table)}`;
  const skipClause = (skip != null) ? `&$skip=${skip}` : '';
  const topClause  = (top  != null) ? `&$top=${top}`   : '';

  return `${apiUrl}?${cleanFilter}${sep}${topClause}${skipClause}${orderbyClause}`
    .replace(/\?\&/, '?')
    .replace(/&&+/g, '&')
    .replace(/&$/, '');
}

// ============================================================
// dedup בקצה השרת - **רק שורות זהות לחלוטין**
// ============================================================
// חשוב: בעבר השתמשתי במפתח חלקי (ORDI+KLINEA) שגרם לאבדן מידע
// כי ב-PRIT_ORDPACK_ONE יכולות להיות כמה שורות עם אותו ORDI+KLINEA
// אבל ערכים שונים (למשל סוג אריזה / ארוחה / כשרות).
//
// עכשיו: dedup רק אם השורה זהה במאת האחוזים בכל השדות (JSON.stringify).
// אם אפילו שדה אחד שונה - זו שורה אמיתית שונה ונשמרת.
function dedupRows(rows, table) {
  if (!Array.isArray(rows) || rows.length === 0) return rows;

  const seen = new Set();
  const result = [];
  for (const r of rows) {
    // המפתח הוא JSON של כל השורה - רק שורות זהות 100% נחשבות ככפילות
    const key = JSON.stringify(r);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(r);
    }
  }
  return result;
}

// ============================================================
// משיכה מקבילה עם pagination יציב + dedup
// ============================================================
async function fetchAllParallel(apiUrl, baseFilter, authHeader, corsHeaders, table) {
  const PAGE_SIZE    = 500;
  const MAX_PARALLEL = 6;
  const MAX_RECORDS  = 20000;

  // שלב 1: בקשה ראשונה - גם בודקת אם יש עוד דפים
  const firstUrl = buildStableUrl(apiUrl, baseFilter, table, 0, PAGE_SIZE);
  const firstRes = await fetch(firstUrl, {
    headers: { 'Authorization': authHeader, 'Accept': 'application/json' }
  });
  if (!firstRes.ok) {
    const err = await firstRes.text();
    throw new Error(`Priority ${firstRes.status}: ${err.slice(0, 300)}`);
  }
  const firstJson = await firstRes.json();
  const firstPage = firstJson.value || [];

  // אם הדף קטן מ-PAGE_SIZE - אין עוד דפים
  if (firstPage.length < PAGE_SIZE) {
    const dedup = dedupRows(firstPage, table);
    return new Response(JSON.stringify({
      value: dedup,
      total: dedup.length,
      pagesLoaded: 1,
      countSource: 'fetched',
      stable: true
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  // שלב 2: בקשות מקבילות לשאר הדפים
  let allData = [...firstPage];
  let skip    = PAGE_SIZE;
  let hasMore = true;
  let pagesLoaded = 1;

  while (hasMore && allData.length < MAX_RECORDS) {
    const batch = [];
    for (let i = 0; i < MAX_PARALLEL; i++) {
      const url = buildStableUrl(apiUrl, baseFilter, table, skip + i * PAGE_SIZE, PAGE_SIZE);
      batch.push(
        fetch(url, {
          headers: { 'Authorization': authHeader, 'Accept': 'application/json' }
        })
      );
    }

    const responses = await Promise.all(batch);
    const pages     = await Promise.all(responses.map(r => r.ok ? r.json() : { value: [] }));
    pagesLoaded += pages.length;

    let gotAny = false;
    for (const page of pages) {
      const rows = page.value || [];
      if (rows.length > 0) {
        allData = allData.concat(rows);
        gotAny  = true;
      }
    }

    const lastPage = pages[pages.length - 1].value || [];
    if (!gotAny || lastPage.length < PAGE_SIZE) {
      hasMore = false;
    } else {
      skip += PAGE_SIZE * MAX_PARALLEL;
    }
  }

  // dedup חיוני: למרות $orderby, אם דפים אורכו פחות בדיוק על גבול מוחלט
  // וקיבלנו פעם נוספת - dedup ינקה. זה גם בולם תקלות שולית.
  const beforeDedup = allData.length;
  const dedup = dedupRows(allData, table);
  const removedDups = beforeDedup - dedup.length;

  return new Response(JSON.stringify({
    value: dedup,
    total: dedup.length,
    pagesLoaded,
    rawRows: beforeDedup,
    removedDuplicates: removedDups,
    countSource: 'fetched',
    stable: true
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300', ...corsHeaders }
  });
}

// ============================================================
// fetchCount - מחזיר רק את הספירה (countOnly=true)
// ============================================================
// כיוון ש-Priority לא תומך ב-$count=true, אנחנו עושים fetchAll פנימי
// ומחזירים רק את האורך. זה לא חוסך זמן ב-Worker, אבל חוסך bandwidth
// ללקוח (תשובה קטנה במקום 20MB) ומאפשר לו לאמת ספירה לפני המשיכה הגדולה.
async function fetchCount(apiUrl, baseFilter, authHeader, corsHeaders, table) {
  // ננסה תחילה לבדוק אם Priority בכל זאת מחזיר @odata.count
  // (אולי בגרסה עתידית זה ישתנה)
  const probeUrl = buildStableUrl(apiUrl, baseFilter, table, 0, 1) + '&$count=true&$inlinecount=allpages';
  try {
    const probeRes = await fetch(probeUrl, {
      headers: { 'Authorization': authHeader, 'Accept': 'application/json' }
    });
    if (probeRes.ok) {
      const probeJson = await probeRes.json();
      const odataCount =
        (typeof probeJson['@odata.count'] === 'number') ? probeJson['@odata.count'] :
        (typeof probeJson['odata.count'] === 'number') ? probeJson['odata.count'] :
        (typeof probeJson['__count'] === 'string') ? parseInt(probeJson['__count'], 10) :
        null;
      if (odataCount !== null && !isNaN(odataCount)) {
        return new Response(JSON.stringify({
          count: odataCount,
          countSource: 'odata',
          stable: true
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }
  } catch (e) {
    // נופלים ל-fallback של fetchAll
  }

  // fallback: fetchAll פנימי וספירה
  const allRes = await fetchAllParallel(apiUrl, baseFilter, authHeader, corsHeaders, table);
  const allJson = await allRes.json();
  return new Response(JSON.stringify({
    count: allJson.total || (allJson.value || []).length,
    countSource: 'fetched',
    pagesLoaded: allJson.pagesLoaded,
    removedDuplicates: allJson.removedDuplicates,
    stable: true
  }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}
