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
      const url = new URL(request.url);
      const filter = url.searchParams.get('filter') || '';
      const table = url.searchParams.get('table') || 'PRIT_ORDPACK_ONE';
      const fetchAll = url.searchParams.get('fetchAll') === 'true';

      const baseUrl = 'https://p.priority-connect.online/odata/Priority/tabbc66b.ini/a080724';
      const apiUrl = `${baseUrl}/${table}`;
      
      const username = 'API';
      const password = '49b9417A';
      const authHeader = 'Basic ' + btoa(username + ':' + password);

      // אם fetchAll=true, נמשוך את כל הדפים במקביל
      if (fetchAll) {
        return await fetchAllPagesParallel(apiUrl, filter, authHeader, corsHeaders);
      }

      // ברירת מחדל - משיכה רגילה (דף בודד)
      const fullUrl = filter ? `${apiUrl}?${filter}` : `${apiUrl}?$top=25`;

      const priorityResponse = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const data = await priorityResponse.text();
      return new Response(data, {
        status: priorityResponse.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        error: error.message,
        details: 'Failed to fetch from Priority API'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  },
};

/**
 * משיכת כל הדפים במקביל - הרבה יותר מהיר!
 */
async function fetchAllPagesParallel(apiUrl, baseFilter, authHeader, corsHeaders) {
  const pageSize = 100;
  const parallelBatchSize = 20; // 20 בקשות במקביל - טורבו!
  const maxPages = 100;
  
  const fetchId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  console.log(`[${fetchId}] Starting parallel fetch...`);

  // הוספת $orderby לפילטר
  let fullFilter = baseFilter;
  if (!fullFilter.includes('$orderby')) {
    fullFilter += '&$orderby=ORDNAME,PARTNAME';
  }

  // פונקציה למשיכת דף בודד
  async function fetchPage(pageNum) {
    const skip = pageNum * pageSize;
    const pageFilter = `${fullFilter}&$top=${pageSize}&$skip=${skip}`;
    const fullUrl = `${apiUrl}?${pageFilter}`;
    
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        console.error(`[${fetchId}] Page ${pageNum} error: ${response.status}`);
        return { pageNum, data: [], error: true };
      }

      const jsonData = await response.json();
      const data = jsonData.value || jsonData || [];
      return { pageNum, data, error: false };
    } catch (err) {
      console.error(`[${fetchId}] Page ${pageNum} fetch error:`, err);
      return { pageNum, data: [], error: true };
    }
  }

  try {
    let allData = [];
    let currentPage = 0;
    let hasMore = true;
    let totalPagesLoaded = 0;

    while (hasMore && currentPage < maxPages) {
      // יצירת batch של בקשות במקביל
      const batchPromises = [];
      for (let i = 0; i < parallelBatchSize && (currentPage + i) < maxPages; i++) {
        batchPromises.push(fetchPage(currentPage + i));
      }

      // המתנה לכל הבקשות ב-batch
      const batchResults = await Promise.all(batchPromises);
      
      // מיון התוצאות לפי מספר דף (חשוב לסדר הנכון!)
      batchResults.sort((a, b) => a.pageNum - b.pageNum);
      
      // עיבוד התוצאות
      let batchHasData = false;
      for (const result of batchResults) {
        if (result.data && result.data.length > 0) {
          allData = allData.concat(result.data);
          totalPagesLoaded++;
          batchHasData = true;
          
          // אם הדף לא מלא, זה הדף האחרון
          if (result.data.length < pageSize) {
            hasMore = false;
            break;
          }
        } else if (!result.error) {
          // דף ריק ללא שגיאה = סיימנו
          hasMore = false;
          break;
        }
      }

      // אם אף דף ב-batch לא החזיר נתונים, סיימנו
      if (!batchHasData) {
        hasMore = false;
      }

      currentPage += parallelBatchSize;
      console.log(`[${fetchId}] Loaded ${allData.length} records so far...`);
    }

    console.log(`[${fetchId}] Fetch complete: ${allData.length} records in ${totalPagesLoaded} pages`);

    return new Response(JSON.stringify({
      value: allData,
      meta: {
        fetchId: fetchId,
        totalRecords: allData.length,
        pagesLoaded: totalPagesLoaded,
        timestamp: new Date().toISOString(),
        orderBy: 'ORDNAME,PARTNAME',
        parallelMode: true
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Fetch-Id': fetchId,
        'X-Total-Records': allData.length.toString(),
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error(`[${fetchId}] Error:`, error);
    return new Response(JSON.stringify({
      error: error.message,
      details: 'Failed to fetch pages in parallel',
      fetchId: fetchId
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

