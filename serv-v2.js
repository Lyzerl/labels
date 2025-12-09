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
      const fetchAll = url.searchParams.get('fetchAll') === 'true'; // חדש: משיכת כל הנתונים בבקשה אחת

      const baseUrl = 'https://p.priority-connect.online/odata/Priority/tabbc66b.ini/a080724';
      const apiUrl = `${baseUrl}/${table}`;
      
      const username = 'API';
      const password = '49b9417A';
      const authHeader = 'Basic ' + btoa(username + ':' + password);

      // אם fetchAll=true, נמשוך את כל הדפים ונחבר אותם בצד השרת
      if (fetchAll) {
        return await fetchAllPages(apiUrl, filter, authHeader, corsHeaders);
      }

      // ברירת מחדל - משיכה רגילה (דף בודד)
      const fullUrl = filter ? `${apiUrl}?${filter}` : `${apiUrl}?$top=25`;

      console.log('Fetching from table:', table);
      console.log('Full URL:', fullUrl);

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
      const statusCode = priorityResponse.status;

      return new Response(data, {
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        error: error.message,
        details: 'Failed to fetch from Priority API'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  },
};

/**
 * פונקציה למשיכת כל הדפים בבת אחת בצד השרת
 * זה פותר את בעיית חוסר העקביות כי כל הבקשות נעשות ברצף מהשרת
 */
async function fetchAllPages(apiUrl, baseFilter, authHeader, corsHeaders) {
  const pageSize = 200; // הגדלת גודל דף ל-200 במקום 100 - פחות בקשות
  const maxPages = 200;
  let allData = [];
  let skip = 0;
  let pageNum = 0;
  let hasMore = true;
  
  // יצירת מזהה ייחודי למשיכה - לזיהוי עקביות
  const fetchId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  
  console.log(`[${fetchId}] Starting full fetch...`);

  try {
    while (hasMore && pageNum < maxPages) {
      pageNum++;
      
      // בניית הפילטר עם $orderby להבטחת עקביות
      let fullFilter = baseFilter;
      
      // הוספת $orderby אם לא קיים (קריטי לעקביות!)
      if (!fullFilter.includes('$orderby')) {
        fullFilter += '&$orderby=ORDNAME,PARTNAME';
      }
      
      fullFilter += `&$top=${pageSize}&$skip=${skip}`;
      
      const fullUrl = `${apiUrl}?${fullFilter}`;
      
      console.log(`[${fetchId}] Fetching page ${pageNum}...`);

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
        const errorText = await response.text();
        throw new Error(`Server error ${response.status}: ${errorText.substring(0, 200)}`);
      }

      const jsonData = await response.json();
      const data = jsonData.value || jsonData;

      if (!data || data.length === 0) {
        hasMore = false;
      } else {
        allData = allData.concat(data);
        
        if (data.length < pageSize) {
          hasMore = false;
        } else {
          skip += pageSize;
          // ללא המתנה - מהירות מקסימלית (Priority יכול להתמודד)
        }
      }
    }

    console.log(`[${fetchId}] Fetch complete: ${allData.length} records in ${pageNum} pages`);

    // החזרת כל הנתונים עם מטא-דאטה
    const result = {
      value: allData,
      meta: {
        fetchId: fetchId,
        totalRecords: allData.length,
        pagesLoaded: pageNum,
        timestamp: new Date().toISOString(),
        orderBy: 'ORDNAME,PARTNAME'
      }
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Fetch-Id': fetchId,
        'X-Total-Records': allData.length.toString(),
        'Cache-Control': 'public, max-age=300', // cache ל-5 דקות
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error(`[${fetchId}] Error:`, error);
    return new Response(JSON.stringify({
      error: error.message,
      details: 'Failed to fetch all pages',
      fetchId: fetchId,
      pagesLoadedBeforeError: pageNum
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

