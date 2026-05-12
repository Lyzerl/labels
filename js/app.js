
// פונקציות לניהול הגדרות קרטונים
function openCartonSettingsModal() {
  const modal = document.getElementById('cartonSettingsModal');
  if (!modal) return;

  // טעינת הערכים הנוכחיים לשדות - חמגשית
  document.getElementById('settingLargeTrayPerCarton').value = CARTON_CONFIG.hotTray.largeTrayPerCarton;
  document.getElementById('settingSmallTrayPerCarton').value = CARTON_CONFIG.hotTray.smallTrayPerCarton;

  // תפזורת - קיבולת וגדלים יחסיים
  document.getElementById('settingCartonCapacity').value = CARTON_CONFIG.hotLoose.cartonCapacity;
  document.getElementById('settingContainerSize').value = CARTON_CONFIG.hotLoose.containerSizes.container;
  document.getElementById('settingGastronormSize').value = CARTON_CONFIG.hotLoose.containerSizes.gastronorm;
  document.getElementById('settingPack5Size').value = CARTON_CONFIG.hotLoose.containerSizes.pack5;
  document.getElementById('settingPack7Size').value = CARTON_CONFIG.hotLoose.containerSizes.pack7;

  // קר
  document.getElementById('settingFewItemsThreshold').value = CARTON_CONFIG.cold.fewItemsThreshold;
  document.getElementById('settingPortionsFewItems').value = CARTON_CONFIG.cold.portionsPerCartonFewItems;
  document.getElementById('settingPortionsManyItems').value = CARTON_CONFIG.cold.portionsPerCartonManyItems;

  modal.style.display = 'flex';
}

function closeCartonSettingsModal() {
  const modal = document.getElementById('cartonSettingsModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function saveCartonSettings() {
  // קריאת הערכים מהשדות
  const settings = {
    hotTray: {
      largeTrayPerCarton: parseInt(document.getElementById('settingLargeTrayPerCarton').value) || 28,
      smallTrayPerCarton: parseInt(document.getElementById('settingSmallTrayPerCarton').value) || 32
    },
    hotLoose: {
      cartonCapacity: parseFloat(document.getElementById('settingCartonCapacity').value) || 10,
      containerSizes: {
        container: parseFloat(document.getElementById('settingContainerSize').value) || 1,
        gastronorm: parseFloat(document.getElementById('settingGastronormSize').value) || 4,
        pack5: parseFloat(document.getElementById('settingPack5Size').value) || 0.5,
        pack7: parseFloat(document.getElementById('settingPack7Size').value) || 0.7
      }
    },
    cold: {
      fewItemsThreshold: parseInt(document.getElementById('settingFewItemsThreshold').value) || 5,
      portionsPerCartonFewItems: parseInt(document.getElementById('settingPortionsFewItems').value) || 20,
      portionsPerCartonManyItems: parseInt(document.getElementById('settingPortionsManyItems').value) || 15
    }
  };

  // עדכון ה-config הגלובלי
  CARTON_CONFIG.hotTray.largeTrayPerCarton = settings.hotTray.largeTrayPerCarton;
  CARTON_CONFIG.hotTray.smallTrayPerCarton = settings.hotTray.smallTrayPerCarton;
  CARTON_CONFIG.hotLoose.cartonCapacity = settings.hotLoose.cartonCapacity;
  CARTON_CONFIG.hotLoose.containerSizes = settings.hotLoose.containerSizes;
  CARTON_CONFIG.cold.fewItemsThreshold = settings.cold.fewItemsThreshold;
  CARTON_CONFIG.cold.portionsPerCartonFewItems = settings.cold.portionsPerCartonFewItems;
  CARTON_CONFIG.cold.portionsPerCartonManyItems = settings.cold.portionsPerCartonManyItems;

  // שמירה ב-localStorage
  localStorage.setItem('cartonConfig', JSON.stringify(settings));

  alert('ההגדרות נשמרו בהצלחה!');
  closeCartonSettingsModal();
}

function resetCartonSettings() {
  if (!confirm('האם אתה בטוח שברצונך לאפס את ההגדרות לברירת מחדל?')) return;

  // ערכי ברירת מחדל
  const defaults = {
    hotTray: { largeTrayPerCarton: 28, smallTrayPerCarton: 32 },
    hotLoose: {
      cartonCapacity: 10,
      containerSizes: { container: 1, gastronorm: 4, pack5: 0.5, pack7: 0.7 }
    },
    cold: { fewItemsThreshold: 5, portionsPerCartonFewItems: 20, portionsPerCartonManyItems: 15 }
  };

  // עדכון השדות - חמגשית
  document.getElementById('settingLargeTrayPerCarton').value = defaults.hotTray.largeTrayPerCarton;
  document.getElementById('settingSmallTrayPerCarton').value = defaults.hotTray.smallTrayPerCarton;

  // תפזורת
  document.getElementById('settingCartonCapacity').value = defaults.hotLoose.cartonCapacity;
  document.getElementById('settingContainerSize').value = defaults.hotLoose.containerSizes.container;
  document.getElementById('settingGastronormSize').value = defaults.hotLoose.containerSizes.gastronorm;
  document.getElementById('settingPack5Size').value = defaults.hotLoose.containerSizes.pack5;
  document.getElementById('settingPack7Size').value = defaults.hotLoose.containerSizes.pack7;

  // קר
  document.getElementById('settingFewItemsThreshold').value = defaults.cold.fewItemsThreshold;
  document.getElementById('settingPortionsFewItems').value = defaults.cold.portionsPerCartonFewItems;
  document.getElementById('settingPortionsManyItems').value = defaults.cold.portionsPerCartonManyItems;

  // עדכון ה-config
  Object.assign(CARTON_CONFIG.hotTray, defaults.hotTray);
  CARTON_CONFIG.hotLoose.cartonCapacity = defaults.hotLoose.cartonCapacity;
  CARTON_CONFIG.hotLoose.containerSizes = defaults.hotLoose.containerSizes;
  Object.assign(CARTON_CONFIG.cold, defaults.cold);

  // מחיקה מ-localStorage
  localStorage.removeItem('cartonConfig');

  alert('ההגדרות אופסו לברירת מחדל!');
}

function loadCartonSettingsFromStorage() {
  const saved = localStorage.getItem('cartonConfig');
  if (saved) {
    try {
      const settings = JSON.parse(saved);
      if (settings.hotTray) {
        CARTON_CONFIG.hotTray.largeTrayPerCarton = settings.hotTray.largeTrayPerCarton || 28;
        CARTON_CONFIG.hotTray.smallTrayPerCarton = settings.hotTray.smallTrayPerCarton || 32;
      }
      if (settings.hotLoose) {
        CARTON_CONFIG.hotLoose.cartonCapacity = settings.hotLoose.cartonCapacity || 10;
        if (settings.hotLoose.containerSizes) {
          CARTON_CONFIG.hotLoose.containerSizes = {
            container: settings.hotLoose.containerSizes.container || 1,
            gastronorm: settings.hotLoose.containerSizes.gastronorm || 4,
            pack5: settings.hotLoose.containerSizes.pack5 || 0.5,
            pack7: settings.hotLoose.containerSizes.pack7 || 0.7
          };
        }
      }
      if (settings.cold) {
        CARTON_CONFIG.cold.fewItemsThreshold = settings.cold.fewItemsThreshold || 5;
        CARTON_CONFIG.cold.portionsPerCartonFewItems = settings.cold.portionsPerCartonFewItems || 20;
        CARTON_CONFIG.cold.portionsPerCartonManyItems = settings.cold.portionsPerCartonManyItems || 15;
      }
    } catch (e) {
      console.error('Error loading carton settings:', e);
    }
  }
}

// טעינת הגדרות בעת טעינת הדף
document.addEventListener('DOMContentLoaded', function() {
  loadCartonSettingsFromStorage();
});

// פונקציות לניהול Modal
function openItemModal(itemName, itemKey) {
  const modal = document.getElementById('itemModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  if (!modal || !modalTitle || !modalBody) return;
  
  // Escape HTML כדי למנוע בעיות עם תווים מיוחדים
  const safeItemName = String(itemName || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  modalTitle.textContent = `פרטי הזמנות - ${safeItemName}`;
  
  let html = '';
  const ordersData = window.traysItemData && window.traysItemData[itemKey];
  
  if (ordersData && ordersData.length > 0) {
    // מיון לפי מספר הזמנה
    const sortedOrders = ordersData.sort((a, b) => {
      const nameA = String(a.orderName || '').trim();
      const nameB = String(b.orderName || '').trim();
      return nameA.localeCompare(nameB);
    });
    
    sortedOrders.forEach(order => {
      const orderName = String(order.orderName || 'ללא').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      const custDes = String(order.custDes || 'ללא').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      html += '<div class="modal-item">';
      html += `<strong>מספר הזמנה: ${orderName}</strong>`;
      html += `<span>שם לקוח: ${custDes}</span>`;
      html += '</div>';
    });
    
    html += `<div style="margin-top:15px;padding:10px;background:#e3f2fd;border-radius:5px;text-align:center;font-weight:bold;">סה"כ: ${sortedOrders.length} הזמנות</div>`;
  } else {
    html = '<p style="text-align:center;padding:20px;color:#999;">אין נתונים להצגה</p>';
  }
  
  modalBody.innerHTML = html;
  modal.classList.add('active');
}

function closeItemModal() {
  const modal = document.getElementById('itemModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// פונקציה לפתיחת פופאפ עם רשימת לקוחות אלרגנים לפי כשרות
function openAllergenKosherModal(kosherType) {
  const modal = document.getElementById('itemModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  if (!modal || !modalTitle || !modalBody) return;

  const data = window.allergenKosherData && window.allergenKosherData[kosherType];

  let title = '';
  if (kosherType === 'badatz') {
    title = 'לקוחות אלרגנים - בד"ץ';
  } else if (kosherType === 'chabad') {
    title = 'לקוחות אלרגנים - חב"ד';
  } else {
    title = 'לקוחות אלרגנים - אחר';
  }

  modalTitle.textContent = title;

  let html = '';
  if (data && data.length > 0) {
    // מיון לפי תיאור לקוח
    const sortedData = data.sort((a, b) => {
      const nameA = String(a.custDes || '').trim();
      const nameB = String(b.custDes || '').trim();
      return nameA.localeCompare(nameB);
    });

    sortedData.forEach(order => {
      const ordName = String(order.ordName || 'ללא').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      const custDes = String(order.custDes || 'ללא').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      const spec2 = String(order.spec2 || 'ללא').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      html += '<div class="modal-item">';
      html += `<strong>הזמנה: ${ordName}</strong>`;
      html += `<span>לקוח: ${custDes}</span>`;
      html += `<span>כשרות: ${spec2}</span>`;
      html += `<span>כמות: ${order.quantity.toFixed(0)}</span>`;
      html += '</div>';
    });

    const totalQuantity = data.reduce((sum, c) => sum + c.quantity, 0);
    html += `<div style="margin-top:15px;padding:10px;background:#e3f2fd;border-radius:5px;text-align:center;font-weight:bold;">סה"כ: ${data.length} הזמנות, ${totalQuantity.toFixed(0)} מנות</div>`;
  } else {
    html = '<p style="text-align:center;padding:20px;color:#999;">אין נתונים להצגה</p>';
  }

  modalBody.innerHTML = html;
  modal.classList.add('active');
}

// סגירת modal בלחיצה מחוץ לתוכן
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('itemModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeItemModal();
      }
    });
  }
});

// פונקציה להמרת נתונים למבנה NoSQL
function organizeAsNoSQL(rawData) {
  const orders = {};
  
  rawData.forEach(row => {
    const orderKey = row.ORDNAME || 'ללא_הזמנה';
    
    // אם זו הפעם הראשונה שמופיעה ההזמנה, צור אובייקט חדש
    if (!orders[orderKey]) {
      orders[orderKey] = {
        // שדות של ההזמנה - מופיעים רק פעם אחת
        orderName: row.ORDNAME || '',
        dueDate: row.DUEDATE || '',
        branchName: row.BRANCHNAME || '',
        custName: row.CUSTNAME || '',
        spec1: row.SPEC1 || '',
        custDes: row.CUSTDES || '',
        codeDes: row.CODEDES || '',
        pritClassname: row.PRIT_CLASSNAME || '',
        address: row.ADDRESS || '',
        phoneNum: row.PHONENUM || '',
        distrLineCode: row.DISTRLINECODE || '',
        distrLineDes: row.DISTRLINEDES || '',
        pritDistrOrder: row.PRIT_DISTRORDER || 0,
        state: row.STATE || '',
        spec2: row.SPEC2 || '',
        
        // כמות מנות - נלקחת רק פעם אחת לכל הזמנה
        eatQuant: parseFloat(row.EATQUANT) || 0,
        eatQuantNoAllergen: 0, // כמות מנות ללא אלרגני
        
        // פריטים - מערך של אובייקטים
        items: []
      };
    }
    
    // הוספת פריט למערך הפריטים
    const item = {
      partName: row.PARTNAME || '',
      partDes: row.PARTDES || '',
      pspec1: row.PSPEC1 || '',
      pspec6: row.PSPEC6 || '',
      pspec3: row.PSPEC3 || '',
      pspec2: row.PSPEC2 || '',
      packMethodCode: row.PACKMETHODCODE || '',
      eatQuant: parseFloat(row.EATQUANT) || 0,
      tQuant: parseFloat(row.TQUANT) || 0,
      tUnitName: row.TUNITNAME || '',
      pritGenQuant: parseFloat(row.PRIT_GENQUANT) || 0,
      pritVegQuant: parseFloat(row.PRIT_VEGQUANT) || 0, // כמות צמחונית - אם חיובי זו ארוחה צמחונית
      y9964: row.Y_9964_5_ESH || '',
      y9965: row.Y_9965_5_ESH || '',
      cartonType: row.Y_37210_5_ESH || '',
      containers: row.CONTAINERS || '',
      pack5: row.PACK5 || '',
      pack7: row.PACK7 || '',
      packDes: row.PACKDES || '',
      mealName: row.MEALNAME || '',
      isVegetarian: row.Y_36827_0_ESH === 'Y' || row.Y_36827_0_ESH === true || row.Y_36827_0_ESH === 1 || row.Y_36827_0_ESH === '1'
    };
    
    orders[orderKey].items.push(item);
    
    // בדיקה אם זה ללא אלרגני וסיכום כמות מנות
    const isNoAllergen = (row.SPEC2 && row.SPEC2.toString().toLowerCase().includes('ללא אלרגני')) ||
                         (row.PSPEC2 && row.PSPEC2.toString().toLowerCase().includes('ללא אלרגני')) ||
                         (row.SPEC2 && row.SPEC2.toString().toLowerCase().includes('לא אלרגני')) ||
                         (row.PSPEC2 && row.PSPEC2.toString().toLowerCase().includes('לא אלרגני'));
    
    if (isNoAllergen && item.eatQuant > 0) {
      orders[orderKey].eatQuantNoAllergen = Math.max(
        orders[orderKey].eatQuantNoAllergen || 0, 
        item.eatQuant
      );
    }
  });
  
  // לוגים לבדיקה - ספירת פריטים לכל הזמנה
  const ordersWithTrays = Object.values(orders).filter(order => {
    return order.items.some(item => {
      const pm = String(item.packMethodCode || '').trim().toLowerCase();
      return pm.includes('חמגשית');
    });
  });
  
  // Debug logs removed for performance
  
  return orders;
}

// תאריך ברירת מחדל להיום
document.getElementById('dateInput').valueAsDate = new Date();

// פונקציה לחישוב מיכלים ומארזים
// חשוב: הפונקציה הזו לא משנה את הנתונים המקוריים, רק מוסיפה שדות חישוב
function calculateContainersAndPacks(data) {
  return data.map(row => {
    // יצירת עותק עמוק של השורה כדי לא לשנות את הנתונים המקוריים
    const newRow = {};
    Object.keys(row).forEach(key => {
      newRow[key] = row[key];
    });
    
    // שימוש ב-TQUANT (כמות) במקום PRIT_GENQUANT (כמות מעוגל)
    const tQuant = parseFloat(newRow.TQUANT) || 0;
    
    // עיגול פרמטר 7 ל-2 ספרות אחרי הנקודה לפני החישוב
    let param7 = parseFloat(newRow.Y_9964_5_ESH);
    if (!isNaN(param7) && param7 > 0) {
      param7 = parseFloat(param7.toFixed(2));
      // עדכון הערך ב-newRow לערך המעוגל
      newRow.Y_9964_5_ESH = param7;
    }
    
    // עיגול פרמטר 8 ל-2 ספרות אחרי הנקודה לפני החישוב
    let param8 = parseFloat(newRow.Y_9965_5_ESH);
    if (!isNaN(param8) && param8 > 0) {
      param8 = parseFloat(param8.toFixed(2));
      // עדכון הערך ב-newRow לערך המעוגל
      newRow.Y_9965_5_ESH = param8;
    }
    
    // חישוב מיכלים - אם יש פרמטר 7: (TQUANT / Y_9964_5_ESH) / מחלק, עגול כלפי מעלה
    // מחלק: 6.5 לגסטרונום, 2 למיכל רגיל בסניף צפון (3,4), 1 לסניף דרום (0,1)
    // חשוב: עיגול התוצאה ל-2 ספרות אחרי הנקודה לפני Math.ceil כדי למנוע בעיות floating point
    if (!isNaN(param7) && param7 > 0) {
      const divisionResult = tQuant / param7;

      // בדיקה אם זה גסטרונום - לפי PSPEC1, PACKMETHODCODE או PACKDES
      const pspec1 = String(newRow.PSPEC1 || newRow.pspec1 || '').toLowerCase();
      const packMethod = String(newRow.PACKMETHODCODE || newRow.packMethodCode || '').toLowerCase();
      const packDes = String(newRow.PACKDES || newRow.packDes || '').toLowerCase();
      // ירק שאריזתו גסטרונום - מתייחסים אליו כתפזורת (לא כגסטרונום)
      const isVegetable = pspec1.includes('ירק');
      const isGastronomeRaw = pspec1.includes('גסטרונום') || packMethod.includes('גסטרונום') || packDes.includes('גסטרונום');
      const isGastronome = isGastronomeRaw && !isVegetable;

      // בדיקת סניף - סניף דרום (0,1), סניף צפון (3,4)
      const branchName = String(newRow.BRANCHNAME || '').trim();
      const isSouthBranch = branchName === '0' || branchName === '1';

      // בדיקת קטגוריה לפי PSPEC1 - ירקנית או פחמימה
      const isYarkenit = pspec1.includes('ירקנית');
      const isPachmima = pspec1.includes('פחמימה');

      // לגסטרונום: חילוק ב-6.5 ועיגול למעלה למספר שלם
      // למיכל רגיל בסניף צפון: חילוק ב-2
      // למיכל רגיל בסניף דרום:
      //   - ירקנית: חילוק ב-2 (כמו צפון)
      //   - פחמימה: לא מחלקים (מחלק = 1)
      let divisor;
      if (isGastronome) {
        divisor = 6.5;
      } else if (isSouthBranch) {
        // סניף דרום - ירקנית מחלקים ב-2, פחמימה לא מחלקים
        divisor = isYarkenit ? 2 : 1;
      } else {
        divisor = 2; // סניף צפון - תמיד מחלקים ב-2
      }
      const finalResult = divisionResult / divisor;

      // עיגול ל-2 ספרות אחרי הנקודה כדי למנוע בעיות floating point (למשל 3.0000000000000005 -> 3.00)
      const roundedResult = Math.round(finalResult * 100) / 100;
      newRow.CONTAINERS = Math.ceil(roundedResult);
    } else {
      newRow.CONTAINERS = '';
    }
    
    // חישוב מארז 5 ו-7 - אם יש פרמטר 8
    if (!isNaN(param8) && param8 > 0) {
      // חלוקת המשקל בפרמטר 8 ועגול כלפי מעלה למספר שלם
      // עיגול ל-10 ספרות אחרי הנקודה כדי למנוע בעיות floating point (למשל 14.000000000000002 -> 14)
      const divisionResult = Math.round((tQuant / param8) * 1e10) / 1e10;
      const totalServings = Math.ceil(divisionResult);
      const optimized = optimizeServings(totalServings);
      newRow.PACK5 = optimized.five;
      newRow.PACK7 = optimized.seven;
    } else {
      newRow.PACK5 = '';
      newRow.PACK7 = '';
    }
    
    return newRow;
  });
}

// פונקציה לאיחוד שורות כפולות - אותה הזמנה, אותו מוצר, אותה ארוחה
// שומרת רק שורה אחת לכל שילוב ייחודי, מסכמת כמויות
function deduplicateRows(data) {
  const uniqueRowsMap = new Map();
  let exactDuplicates = 0;
  let conflictingDuplicates = 0;
  const conflicts = [];

  data.forEach(row => {
    // מפתח ייחודי: הזמנה + מוצר + ארוחה
    const ordName = String(row.ORDNAME || '').trim();
    const partName = String(row.PARTNAME || '').trim();
    const partDes = String(row.PARTDES || '').trim();
    const mealName = String(row.MEALNAME || '').trim();

    const uniqueKey = `${ordName}|${partName}|${partDes}|${mealName}`;

    if (!uniqueRowsMap.has(uniqueKey)) {
      uniqueRowsMap.set(uniqueKey, { ...row });
    } else {
      const existing = uniqueRowsMap.get(uniqueKey);
      const sameTQuant = parseFloat(existing.TQUANT || 0) === parseFloat(row.TQUANT || 0);
      const sameEatQuant = parseFloat(existing.EATQUANT || 0) === parseFloat(row.EATQUANT || 0);

      if (sameTQuant && sameEatQuant) {
        exactDuplicates++;
      } else {
        conflictingDuplicates++;
        if (conflicts.length < 5) {
          conflicts.push({
            key: uniqueKey,
            existing: { TQUANT: existing.TQUANT, EATQUANT: existing.EATQUANT },
            duplicate: { TQUANT: row.TQUANT, EATQUANT: row.EATQUANT }
          });
        }
      }
    }
  });

  if (conflictingDuplicates > 0 && typeof console.error === 'function') {
    console.error(`⚠️ deduplicateRows: ${conflictingDuplicates} שורות עם אותו מפתח אבל כמויות שונות!`, conflicts);
  }

  window._lastDedupStats = {
    inputRows: data.length,
    outputRows: uniqueRowsMap.size,
    exactDuplicates,
    conflictingDuplicates,
    conflicts
  };

  return Array.from(uniqueRowsMap.values());
}

async function fetchData() {
  const dateInput = document.getElementById('dateInput').value;
  const branchSelect = document.getElementById('branchSelect').value;
  const statusDiv = document.getElementById('status');
  const tableContainer = document.getElementById('tableContainer');
  const fetchBtn = document.getElementById('fetchBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const recordCount = document.getElementById('recordCount');
  const pageCountEl = document.getElementById('pageCount');
  
  if (!dateInput) {
    alert('אנא בחר תאריך');
    return;
  }

  // איפוס
  const startTime = Date.now();
  statusDiv.className = 'status loading';
  statusDiv.innerHTML = '<div class="loader"></div><p>טוען נתונים מהשרת...</p>';
  fetchBtn.disabled = true;
  downloadBtn.disabled = true;
  recordCount.textContent = '0';
  pageCountEl.textContent = '0';
  tableContainer.innerHTML = '';
  currentData = [];
  currentStructuredData = {};

  try {
    // ========== משיכה מאומתת דרך helper משותף ==========
    // כולל: $orderby ל-pagination יציב, סינון סניף מפורש, retry, אימות פוסט-משיכה
    const result = await fetchPriorityData({
      date: dateInput,
      branchSelect: branchSelect,
      retries: 2
    });

    let allData = result.data;
    const fetchId = (result.meta && result.meta.fetchId) || ('local-' + Date.now());
    const pageNum = (result.meta && result.meta.pagesLoaded) || 1;

    // עדכון התצוגה
    const fetchDuration = ((Date.now() - startTime) / 1000).toFixed(1);
    recordCount.textContent = allData.length;
    pageCountEl.textContent = pageNum;

    // הצגת אזהרות אם האימות זיהה בעיות
    if (result.issues && result.issues.length > 0) {
      console.error('Validation issues:', result.issues);
      window._lastFetchWarnings = result.issues;
    } else {
      window._lastFetchWarnings = null;
    }

    // שמירת מידע אימות הספירה לתצוגה
    window._lastFetchCountInfo = {
      expectedCount: result.expectedCount,
      actualCount: allData.length,
      countVerified: result.countVerified,
      countError: result.countError
    };
    window._lastFetchWorkerInfo = result.workerInfo || {};

    if (typeof console.info === 'function') {
      const countMsg = result.countVerified
        ? `✅ אומת מול שרת (${result.expectedCount})`
        : (result.expectedCount !== null
            ? `❌ אי-התאמה: ${allData.length}/${result.expectedCount}`
            : `⚠️ ספירה לא אומתה (${result.countError || 'unknown'})`);
      console.info(`Fetch: ${allData.length} שורות | ${result.stats.uniqueOrders} הזמנות | סניפים: [${result.stats.branchesFound.join(',')}] | ${fetchDuration}s | ${countMsg}`);
    }
    
    // לוגים לבדיקה
    if (allData.length > 0) {
      console.log('📊 דוגמה לנתונים (3 שורות ראשונות):');
      allData.slice(0, 3).forEach((row, idx) => {
        console.log(`  שורה ${idx + 1}:`, {
          ORDNAME: row.ORDNAME,
          PARTDES: row.PARTDES,
          PARTNAME: row.PARTNAME,
          EATQUANT: row.EATQUANT,
          TQUANT: row.TQUANT
        });
      });
    }
    
    if (allData.length === 0) {
      statusDiv.className = 'status';
      statusDiv.textContent = 'לא נמצאו נתונים';
      tableContainer.innerHTML = '<p style="text-align:center;padding:50px;color:#999;">לא נמצאו הזמנות</p>';
    } else {
      // עיבוד מהיר - עותק אחד בלבד
      statusDiv.innerHTML = '<div class="loader"></div><p>מעבד נתונים...</p>';
      
      // איחוד שורות כפולות (אותה הזמנה + מוצר + ארוחה)
      const deduplicatedData = deduplicateRows(allData);
      console.log(`📊 איחוד שורות: ${allData.length} → ${deduplicatedData.length} (הוסרו ${allData.length - deduplicatedData.length} כפילויות)`);

      // ביצוע חישובים ישירות על הנתונים
      const allDataWithCalculations = calculateContainersAndPacks(deduplicatedData);
      
      // המרה למבנה NoSQL
      const structuredData = organizeAsNoSQL(allDataWithCalculations);
      
      // שמירת הנתונים
      currentData = allDataWithCalculations;
      currentStructuredData = structuredData;
      
      // הצגת הטבלה והדוחות
      createTable(allDataWithCalculations);
      createSummaryReport(structuredData);
      createTraysReport(structuredData);
      createAllergensReport(structuredData);
      createLabelsReport(structuredData, 'hot');
      createLabelsReport(structuredData, 'cold');
      createAllergenLabelsReport(structuredData);
      
      // הצגת טאבים
      document.getElementById('tabsContainer').style.display = 'flex';
      const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
      const dedupStats = window._lastDedupStats || {};
      const warnings = window._lastFetchWarnings || [];
      const countInfo = window._lastFetchCountInfo || {};

      // ========== הודעה ראשית עם אימות ספירה + מידע מה-Worker ==========
      const workerInfo = window._lastFetchWorkerInfo || {};
      let statusHtml = '';

      if (countInfo.countVerified === true) {
        // אומת מול ה-Worker - הודעה ירוקה
        const orders = Object.keys(structuredData).length;
        statusHtml = `✓ הצלחה! נמשכו <strong>${allData.length}</strong> רשומות `
                   + `<span style="color:#2e7d32">(✅ pagination יציב)</span> `
                   + `· <strong>${orders}</strong> הזמנות · ${totalTime}s`;
        // אם ה-Worker החדש החזיר מידע נוסף - הצגה
        if (workerInfo.removedDuplicates !== null && workerInfo.removedDuplicates !== undefined) {
          const dups = workerInfo.removedDuplicates;
          if (dups === 0) {
            statusHtml += `<br><small style="color:#2e7d32;opacity:0.85">📦 ${workerInfo.pagesLoaded || '?'} דפים נטענו · אפס כפילויות (pagination מושלם)</small>`;
          } else {
            statusHtml += `<br><small style="color:#f57c00;opacity:0.85">⚠️ ${workerInfo.pagesLoaded || '?'} דפים נטענו · ${dups} כפילויות נוקו על ידי ה-Worker</small>`;
          }
        }
        statusDiv.className = 'status success';
      } else if (countInfo.expectedCount !== null && countInfo.expectedCount !== undefined) {
        // אי-התאמה בספירה - הודעה אדומה
        const diff = countInfo.expectedCount - allData.length;
        statusHtml = `❌ <strong>אי-התאמה!</strong> data.length=${allData.length} אבל total=${countInfo.expectedCount} `
                   + `· הפרש: <strong>${diff}</strong>. אנא נסה למשוך שוב.`;
        statusDiv.className = 'status error';
      } else {
        // Worker ישן - אזהרה צהובה
        statusHtml = `✓ נמשכו <strong>${allData.length}</strong> רשומות `
                   + `<span style="color:#f57c00" title="${countInfo.countError || ''}">(⚠️ Worker ישן - שדרג לאימות מלא)</span> `
                   + `· <strong>${Object.keys(structuredData).length}</strong> הזמנות · ${totalTime}s`;
        statusDiv.className = 'status success';
      }

      // איחוד שורות
      if (dedupStats.exactDuplicates > 0 || dedupStats.conflictingDuplicates > 0) {
        statusHtml += `<br><small style="opacity:0.8">איחוד שורות: ${allData.length}→${deduplicatedData.length}`;
        if (dedupStats.conflictingDuplicates > 0) {
          statusHtml += ` | ⚠️ <span style="color:#d32f2f;font-weight:bold">${dedupStats.conflictingDuplicates} קונפליקטים בכמויות</span>`;
        }
        statusHtml += '</small>';
      }

      // אזהרות אימות נוספות
      if (warnings.length > 0) {
        statusHtml += '<br><br><strong style="color:#d32f2f">⚠️ אזהרות:</strong><br>';
        statusHtml += warnings.map(w => `<small style="color:#d32f2f">• ${w}</small>`).join('<br>');
      }

      statusDiv.innerHTML = statusHtml;
      downloadBtn.disabled = false;
    }
    
  } catch (error) {
    console.error('Error:', error);
    statusDiv.className = 'status error';
    statusDiv.textContent = `❌ שגיאה: ${error.message}`;
  } finally {
    fetchBtn.disabled = false;
  }
}

function createTable(data) {
  const tableContainer = document.getElementById('tableContainer');
  
  // אם יש טבלה קיימת, השמד אותה
  if (dataTable) {
    dataTable.destroy();
    dataTable = null;
  }
  
  const headers = SELECTED_FIELDS;
  
  // בניית הטבלה
  let html = '<table id="mainTable" class="display nowrap" style="width:100%"><thead><tr>';
  
  // כותרות
  headers.forEach(h => {
    html += `<th>${FIELD_NAMES_HEBREW[h] || h}</th>`;
  });
  
  html += '</tr></thead><tbody>';
  
  // שורות - ישירות ללא בדיקות מיותרות
  data.forEach(row => {
    html += '<tr>';
    headers.forEach(field => {
      let value = row[field] !== undefined && row[field] !== null ? row[field] : '';
      if (field === 'Y_9964_5_ESH' && value !== '') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) value = numValue.toFixed(2);
      }
      html += `<td>${value}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  tableContainer.innerHTML = html;
  
  // יצירת טבלת DataTables עם סינונים וחיפוש
  // חשוב: order: [] מבטיח שהשורות יוצגו בסדר שבו הן הגיעו, ללא מיון
  // חשוב: הנתונים מוצגים בדיוק כמו שהם הגיעו מהשרת, ללא שינויים
  dataTable = $('#mainTable').DataTable({
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/he.json',
      search: 'חיפוש בכל העמודות:',
      searchPlaceholder: 'הקלד לחיפוש...'
    },
    paging: false, // ללא עמודים - טבלה אחת גדולה
    order: [], // ללא מיון - השורות יוצגו בסדר שבו הן הגיעו מהשרת
    ordering: true, // מאפשר למשתמש למיין ידנית
    scrollX: true,
    scrollCollapse: true,
    fixedColumns: {
      left: 0
    },
    responsive: false,
    dom: 'Bfrtip',
    // וידוא שהנתונים לא משתנים
    processing: false,
    serverSide: false, // כל הנתונים בצד הלקוח
    // וידוא שהנתונים לא משתנים - ללא עיבוד נוסף
    data: null, // הנתונים כבר ב-HTML, לא צריך להעביר אותם שוב
    deferRender: false, // לא לדחות רינדור - להציג מיד
    // הפעלת חיפוש גלובלי בכל העמודות (ברירת מחדל)
    search: {
      smart: true,
      regex: false
    },
    // הוספת סינונים לכל עמודה
    initComplete: function() {
      const api = this.api();
      
      // הוספת שדות סינון לכל עמודה
      api.columns().every(function(index) {
        const column = this;
        const header = $(column.header());
        let title = header.text().trim();
        
        // אם הכותרת ריקה או לא קיימת, נסה לקבל אותה מהעמודה
        if (!title || title === '') {
          const cells = column.nodes();
          if (cells && cells.length > 0) {
            // נסה לקבל את הכותרת מהתא הראשון
            title = 'עמודה ' + (index + 1);
          }
        }
        
        // שמירת הכותרת והחלפת התוכן
        header.html('<div class="header-text">' + title + '</div>');
        
        // יצירת input לסינון
        const input = $('<input type="text" placeholder="סינון ' + title + '" class="column-filter" />')
          .appendTo(header)
          .on('keyup change', function() {
            const val = this.value;
            if (column.search() !== val) {
              // חיפוש רגיל (לא regex) לכל העמודה
              column.search(val).draw();
            }
          });
      });
    },
    buttons: [
      {
        extend: 'csv',
        text: '📥 הורד CSV',
        filename: () => {
          const branch = document.getElementById('branchSelect').value;
          const branchName = branch === 'south' ? 'דרום' : branch === 'north' ? 'צפון' : 'הכל';
          return `priority_${document.getElementById('dateInput').value}_${branchName}`;
        },
        bom: true,
        exportOptions: {
          format: {
            body: (data, row, column, node) => {
              return data;
            }
          }
        }
      }
    ]
  });
}

function downloadCSV() {
  if (currentData.length === 0) {
    alert('אין נתונים להורדה');
    return;
  }
  
  const headers = SELECTED_FIELDS;
  const hebrewHeaders = headers.map(h => FIELD_NAMES_HEBREW[h] || h);
  let csv = '\uFEFF' + hebrewHeaders.map(h => `"${h}"`).join(',') + '\n';

  currentData.forEach(row => {
    const values = headers.map(h => {
      const v = row[h];
      if (v === null || v === undefined) return '';
      const s = String(v);
      return s.includes(',') || s.includes('"') || s.includes('\n') ? '"' + s.replace(/"/g, '""') + '"' : s;
    });
    csv += values.join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  
  const branch = document.getElementById('branchSelect').value;
  const branchName = branch === 'south' ? 'דרום' : branch === 'north' ? 'צפון' : 'הכל';
  link.download = `priority_${document.getElementById('dateInput').value}_${branchName}.csv`;
  
  link.click();
}

// פונקציה להחלפת טאבים
function showTab(tabName, button) {
  // הסתרת כל התוכן
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // הצגת הטאב הנבחר
  document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).classList.add('active');
  if (button) {
    button.classList.add('active');
  }
}

// דוח סיכום לפי פריט - סכימה של כמות מעוגל
function createSummaryReport(data) {
  const container = document.getElementById('summaryContainer');
  const branchFilter = document.getElementById('summaryBranchFilter');
  const pspec6Filter = document.getElementById('summaryPSPEC6Filter');
  
  // המרה לנתונים שטוחים אם צריך (אם זה NoSQL) - שימוש בנתונים מהטבלה המקורית בלבד
  const flatData = Array.isArray(data) ? data : Object.values(data).flatMap(order => 
    order.items.map(item => ({
      ...item,
      BRANCHNAME: order.branchName || '',
      PSPEC6: String(item.pspec6 || '').trim(),
      PSPEC1: String(item.pspec1 || '').trim(),
      PARTNAME: String(item.partName || '').trim(),
      PARTDES: String(item.partDes || '').trim(),
      TQUANT: parseFloat(item.tQuant || 0) || 0,
      EATQUANT: parseFloat(item.eatQuant || 0) || 0,
      SPEC2: String(order.spec2 || '').trim(),
      CARTON_TYPE: String(item.cartonType || item.Y_37210_5_ESH || order.Y_37210_5_ESH || '').trim(),
      PACKMETHODCODE: String(item.packMethodCode || '').trim(), // שיטת אריזה - חשוב לבדיקה
      packMethodCode: String(item.packMethodCode || '').trim(), // גם בשדה הקטן
      CONTAINERS: item.containers || '',
      PACK5: parseFloat(item.pack5) || 0,
      PACK7: parseFloat(item.pack7) || 0,
      PACKDES: String(item.packDes || '').trim(),
      ORDNAME: String(order.orderName || '').trim()
    }))
  );
  
  // בדיקה - הצגת מידע על הנתונים
  console.log('📊 דוח סיכום - סה"כ נתונים:', flatData.length);
  if (flatData.length > 0) {
    const packMethods = [...new Set(flatData.map(r => r.PACKMETHODCODE || r.packMethodCode || '').filter(Boolean))];
    console.log('📊 שיטות אריזה שנמצאו:', packMethods);
  }
  
  // איסוף ערכים ייחודיים לסינונים
  const branches = [...new Set(flatData.map(r => r.BRANCHNAME || '').filter(Boolean))].sort();
  branchFilter.innerHTML = '<option value="">הכל</option>';
  branches.forEach(branch => {
    const option = document.createElement('option');
    option.value = branch;
    option.textContent = branch;
    branchFilter.appendChild(option);
  });
  
  const pspec6Values = [...new Set(flatData.map(r => r.PSPEC1 || '').filter(Boolean))].sort();
  pspec6Filter.innerHTML = '<option value="all">הכל</option>';
  pspec6Values.forEach(pspec6 => {
    const option = document.createElement('option');
    option.value = pspec6;
    option.textContent = pspec6;
    pspec6Filter.appendChild(option);
  });
  
  // שמירת נתונים מקוריים
  window.allSummaryData = flatData;
  
  // הוספת event listeners לסינונים
  branchFilter.addEventListener('change', applySummaryFilters);
  pspec6Filter.addEventListener('change', applySummaryFilters);
  
  // הצגה ראשונית
  applySummaryFilters();
}

function applySummaryFilters() {
  const container = document.getElementById('summaryContainer');
  const branchFilter = document.getElementById('summaryBranchFilter');
  const pspec6Filter = document.getElementById('summaryPSPEC6Filter');
  const flatData = window.allSummaryData || [];
  
  // סינון הנתונים
  let filteredData = flatData;
  
  if (branchFilter.value) {
    filteredData = filteredData.filter(r => String(r.BRANCHNAME) === branchFilter.value);
  }
  
  // סינון קבוע לפי קרטון קרים
  const beforeCartonFilter = filteredData.length;
      filteredData = filteredData.filter(r => {
    const ct = String(r.CARTON_TYPE || '').trim().toLowerCase();
    return ct.includes('קר') || ct.includes('קרים');
  });
  console.log('📊 דוח אריזה קרה - אחרי סינון קרטון קרים:', filteredData.length, 'מתוך', beforeCartonFilter);
  
  // סינון לפי שיטת אירוז - תמיד תפזורת (לא חמגשית)
  const beforePackingFilter = filteredData.length;
      filteredData = filteredData.filter(r => {
        const packMethod1 = String(r.PACKMETHODCODE || '').trim();
        const packMethod2 = String(r.packMethodCode || '').trim();
        const packMethod = packMethod1 || packMethod2;
        
        // כל מה שלא חמגשית 101
        const isNotTray = packMethod !== 'חמגשית 101' && 
                         !packMethod.includes('חמגשית 101') &&
                         packMethod !== 'חמגשית101' &&
                         !packMethod.includes('חמגשית101') &&
                         !(packMethod.toLowerCase().includes('חמגשית') && packMethod.includes('101'));
        
        return isNotTray;
      });
  console.log('📊 דוח אריזה קרה - אחרי סינון תפזורת:', filteredData.length, 'מתוך', beforePackingFilter);
  
  // סינון לפי קטגוריה (פרמטר 1)
  const beforeCategoryFilter = filteredData.length;
  if (pspec6Filter.value === 'notempty') {
      filteredData = filteredData.filter(r => {
        const pspec1 = String(r.PSPEC1 || r.pspec1 || '').trim();
        return pspec1 !== '' && pspec1 !== 'null' && pspec1 !== 'undefined';
      });
  } else if (pspec6Filter.value && pspec6Filter.value !== 'all') {
    filteredData = filteredData.filter(r => String(r.PSPEC1 || r.pspec1 || '') === pspec6Filter.value);
  }
  console.log('📊 דוח אריזה קרה - אחרי סינון קטגוריה:', filteredData.length, 'מתוך', beforeCategoryFilter);
  
  // לוגיקה רגילה (תפזורת) - קיבוץ לפי פריט (PARTNAME) וסיכום כמות (TQUANT)
  const summary = {};
  
  filteredData.forEach(row => {
    // תמיכה גם במבנה NoSQL וגם במבנה שטוח
    const partName = row.PARTNAME || row.partName || 'ללא שם';
    const partDes = row.PARTDES || row.partDes || '';
    const key = `${partName}|${partDes}`;
    const pspec1 = row.PSPEC1 || row.pspec1 || '';
    const quantity = parseFloat(row.TQUANT || row.tQuant || 0) || 0;
    const eatQuant = parseFloat(row.EATQUANT || row.eatQuant || 0) || 0;
    const containers = parseFloat(row.CONTAINERS || row.containers || 0) || 0;
    
    if (!summary[key]) {
      summary[key] = {
        partName: partName,
        partDes: partDes,
        pspec1: pspec1, // פרמטר 1 למוצר
        totalQuantity: 0,
        totalEatQuant: 0,
        totalContainers: 0,
        totalPack5: 0,
        totalPack7: 0,
        displayContainers: ''
      };
    }
    
    summary[key].totalQuantity += quantity;
    summary[key].totalEatQuant += eatQuant;
    summary[key].totalContainers += containers;
    const pack5 = parseFloat(row.PACK5 || row.pack5 || 0) || 0;
    const pack7 = parseFloat(row.PACK7 || row.pack7 || 0) || 0;
    summary[key].totalPack5 += pack5;
    summary[key].totalPack7 += pack7;
  });
  
  // המרה למערך ומיון לפי פרמטר 1 למוצר בסדר עולה
  const summaryArray = Object.values(summary).sort((a, b) => {
    const pspec1A = (a.pspec1 || '').toString().toLowerCase();
    const pspec1B = (b.pspec1 || '').toString().toLowerCase();
    return pspec1A.localeCompare(pspec1B);
  });
  
  console.log('📊 דוח אריזה קרה - סה"כ פריטים אחרי קיבוץ:', summaryArray.length);
  
  // הכנת טקסט להצגת מיכלים / מארזים
  summaryArray.forEach(item => {
    const pieces = [];
    if (item.totalContainers > 0) {
      const containersText = Number.isInteger(item.totalContainers) ? item.totalContainers.toFixed(0) : item.totalContainers.toFixed(2);
      pieces.push(`מיכלים: ${containersText}`);
    }
    if (item.totalPack5 > 0) {
      pieces.push(`מארז 5: ${item.totalPack5.toFixed(0)}`);
    }
    if (item.totalPack7 > 0) {
      pieces.push(`מארז 7: ${item.totalPack7.toFixed(0)}`);
    }
    item.displayContainers = pieces.join('<br>');
  });
  
  // יצירת טבלה (בלי עמודת מקט, רק תיאור מוצר)
  let html = '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;"><table style="width:100%;min-width:100%;"><thead><tr>';
  html += '<th>לפי קטגוריה</th><th>תיאור מוצר</th><th>ס&quot;ה מנות</th><th>ס&quot;ה לייצור</th>';
  html += '</tr></thead><tbody>';
  
  let grandTotal = 0;
  let grandTotalEatQuant = 0;
  summaryArray.forEach(item => {
    html += '<tr>';
    html += `<td>${item.pspec1}</td>`;
    html += `<td>${item.partDes}</td>`;
    html += `<td style="font-weight:bold;">${item.totalEatQuant > 0 ? item.totalEatQuant.toFixed(0) : ''}</td>`;
    html += `<td style="font-weight:bold;">${item.totalQuantity.toFixed(2)}</td>`;
    html += '</tr>';
    grandTotal += item.totalQuantity;
    grandTotalEatQuant += item.totalEatQuant || 0;
  });
  
  html += '</tbody></table></div>';
  
  if (summaryArray.length === 0) {
    html = '<p style="text-align:center;padding:50px;color:#999;">לא נמצאו נתונים להצגה</p>';
  }
  
  container.innerHTML = html;
  
  console.log('📊 דוח אריזה קרה - סה"כ שורות בטבלה:', summaryArray.length);
  
  // שמירת נתונים להורדה
  window.summaryData = summaryArray;
}

// דוח אריזה חמה - טבלאות נפרדות לפי קטגוריות
function createTraysReport(data) {
  const container = document.getElementById('traysContainer');
  
  // בדיקת בטיחות
  if (!container) {
    console.error('❌ אלמנטים לא נמצאו לדוח אריזה חמה');
    return;
  }
  
  if (!data || (Array.isArray(data) && data.length === 0) || (!Array.isArray(data) && Object.keys(data).length === 0)) {
    console.warn('⚠️ אין נתונים לדוח אריזה חמה');
    container.innerHTML = '<p style="text-align:center;padding:50px;color:#999;">אין נתונים להצגה</p>';
    window.allTraysData = [];
    return;
  }
  
  // המרה לנתונים שטוחים - שימוש בנתונים מהטבלה המקורית בלבד
  let flatData = Array.isArray(data) ? data : Object.values(data).flatMap(order => {
    if (!order || !order.items || !Array.isArray(order.items)) {
      return [];
    }
    return order.items.map(item => ({
      ...item,
      BRANCHNAME: order.branchName || '',
      DISTRLINECODE: String(order.distrLineCode || item.distrLineCode || '').trim(),
      distrLineCode: String(order.distrLineCode || item.distrLineCode || '').trim(),
      DISTRLINEDES: String(order.distrLineDes || item.distrLineDes || '').trim(),
      distrLineDes: String(order.distrLineDes || item.distrLineDes || '').trim(),
      CUSTDES: String(order.custDes || item.custDes || '').trim(),
      custDes: String(order.custDes || item.custDes || '').trim(),
      PSPEC1: String(item.pspec1 || '').trim(),
      PSPEC6: String(item.pspec6 || '').trim(),
      PARTDES: String(item.partDes || '').trim(),
      PACKMETHODCODE: String(item.packMethodCode || '').trim(),
      packMethodCode: String(item.packMethodCode || '').trim(),
      PACKDES: String(item.packDes || '').trim(),
      TQUANT: parseFloat(item.tQuant || 0) || 0,
      EATQUANT: parseFloat(item.eatQuant || 0) || 0,
      SPEC1: String(order.spec1 || '').trim(),
      SPEC2: String(order.spec2 || '').trim(),
      PSPEC2: String(item.pspec2 || '').trim(),
      ORDNAME: String(order.orderName || '').trim(),
      MEALNAME: String(item.mealName || '').trim(),
      CARTON_TYPE: String(item.cartonType || item.Y_37210_5_ESH || order.Y_37210_5_ESH || '').trim(),
      cartonType: String(item.cartonType || item.Y_37210_5_ESH || order.Y_37210_5_ESH || '').trim(),
      CONTAINERS: parseFloat(item.containers || 0) || 0,
      containers: parseFloat(item.containers || 0) || 0,
      PACK5: parseFloat(item.pack5 || 0) || 0,
      pack5: parseFloat(item.pack5 || 0) || 0,
      PACK7: parseFloat(item.pack7 || 0) || 0,
      pack7: parseFloat(item.pack7 || 0) || 0
    }));
  });
  
  console.log('📊 דוח אריזה חמה - סה"כ נתונים לפני סינון:', flatData.length);
  
  // לוגים לבדיקה - בדיקת הזמנות עם חמגשיות
  const ordersWithTrays = {};
  flatData.forEach(row => {
    const pm = String(row.PACKMETHODCODE || row.packMethodCode || '').trim().toLowerCase();
    if (pm.includes('חמגשית')) {
      const orderName = String(row.ORDNAME || row.orderName || '').trim();
      if (!ordersWithTrays[orderName]) {
        ordersWithTrays[orderName] = [];
      }
      ordersWithTrays[orderName].push({
        partDes: row.PARTDES || row.partDes || '',
        packMethodCode: row.PACKMETHODCODE || row.packMethodCode || '',
        eatQuant: row.EATQUANT || row.eatQuant || 0,
        mealName: row.MEALNAME || row.mealName || ''
      });
    }
  });
  
  if (Object.keys(ordersWithTrays).length > 0) {
    console.log('📊 הזמנות עם חמגשיות ב-flatData:', Object.keys(ordersWithTrays).length);
    Object.entries(ordersWithTrays).forEach(([orderName, items]) => {
      console.log(`  הזמנה ${orderName}: ${items.length} פריטי חמגשית`);
      items.forEach(item => {
        console.log(`    - ${item.partDes} (${item.packMethodCode}) - ארוחה: ${item.mealName}, כמות: ${item.eatQuant}`);
      });
    });
  }
  
  // שמירת כל הנתונים
  window.allTraysData = flatData;
  
  // מילוי סינון סניפים
  const branchFilter = document.getElementById('traysBranchFilter');
  if (branchFilter) {
    const branches = [...new Set(flatData.map(r => r.BRANCHNAME || r.branchName || '').filter(Boolean))].sort();
  branchFilter.innerHTML = '<option value="">הכל</option>';
  branches.forEach(branch => {
    const option = document.createElement('option');
    option.value = branch;
    option.textContent = branch;
    branchFilter.appendChild(option);
  });
  
    // שימוש ב-onchange במקום addEventListener כדי למנוע כפילות
    branchFilter.onchange = applyTraysFilters;
  }

  // רישום onchange לסינון סוג לקוח (מילגם / פרטיים)
  const customerTypeFilter = document.getElementById('traysCustomerTypeFilter');
  if (customerTypeFilter) {
    customerTypeFilter.onchange = applyTraysFilters;
  }
  
  // מילוי סינון קווי חלוקה
  const distrLineFilter = document.getElementById('traysDistrLineFilter');
  if (distrLineFilter) {
    // יצירת Map של קוד -> תיאור
    const distrLinesMap = new Map();
    flatData.forEach(r => {
      const code = String(r.DISTRLINECODE || r.distrLineCode || '').trim();
      const des = String(r.DISTRLINEDES || r.distrLineDes || '').trim();
      if (code) {
        // אם יש תיאור, נשתמש בו. אחרת נשתמש בקוד
        const displayText = des || code;
        distrLinesMap.set(code, displayText);
      }
    });
    
    // המרה למערך ומיון לפי תיאור
    const distrLinesArray = Array.from(distrLinesMap.entries())
      .map(([code, des]) => ({ code, des }))
      .sort((a, b) => a.des.localeCompare(b.des));
    
    distrLineFilter.innerHTML = '<option value="">הכל</option>';
    distrLinesArray.forEach(({ code, des }) => {
    const option = document.createElement('option');
      option.value = code; // הערך הוא הקוד (לסינון)
      option.textContent = des; // הטקסט הוא התיאור (להצגה)
      distrLineFilter.appendChild(option);
    });
    
    // שימוש ב-onchange במקום addEventListener כדי למנוע כפילות
    distrLineFilter.onchange = applyTraysFilters;
  }
  
  // הצגה ראשונית
  applyTraysFilters();
}

function applyTraysFilters() {
  const container = document.getElementById('traysContainer');
  const branchFilter = document.getElementById('traysBranchFilter');
  const distrLineFilter = document.getElementById('traysDistrLineFilter');
  const customerTypeFilter = document.getElementById('traysCustomerTypeFilter');
  
  // בדיקת בטיחות
  if (!container) {
    console.error('❌ אלמנטים לא נמצאו לדוח אריזה חמה');
    return;
  }
  
  // ניקוי container לפני יצירת דוח חדש
  container.innerHTML = '';
  
  // ניקוי נתונים גלובליים לפני יצירת דוח חדש
  if (window.traysItemData) {
    window.traysItemData = {};
  }
  if (window.smallTrayOrdersMap) {
    window.smallTrayOrdersMap = {};
  }
  if (window.largeTrayOrdersMap) {
    window.largeTrayOrdersMap = {};
  }
  
  const flatData = window.allTraysData || [];
  
  // סינון לפי סניף
  let filteredData = flatData;
  if (branchFilter && branchFilter.value) {
    filteredData = filteredData.filter(r => String(r.BRANCHNAME || r.branchName || '') === branchFilter.value);
  }
  
  // סינון לפי קו חלוקה
  if (distrLineFilter && distrLineFilter.value) {
    filteredData = filteredData.filter(r => String(r.DISTRLINECODE || r.distrLineCode || '') === distrLineFilter.value);
  }

  // סינון לפי סוג לקוח (מילגם / פרטיים) - לפי SPEC1
  if (customerTypeFilter && customerTypeFilter.value) {
    const ct = customerTypeFilter.value;
    filteredData = filteredData.filter(r => {
      const spec1 = String(r.SPEC1 || r.spec1 || '').toLowerCase();
      const isMilgam = spec1.includes('מילגם');
      if (ct === 'milgam') return isMilgam;
      if (ct === 'private') return !isMilgam;
      return true;
    });
  }
  
  // ללא סינון לפי חם/קר - מציגים לפי נתונים בעמודות הרלוונטיות:
  // - חמגשית: לפי שיטת אריזה שמכילה "חמגשית"
  // - מארז 5/7: לפי ערכים בעמודות PACK5/PACK7
  // - מיכלים/גסטרונום: לפי ערכים בעמודת CONTAINERS ושיטת אריזה

  console.log('✅ דוח אריזה חמה - סה"כ שורות:', filteredData.length);
  
  // לוגים לבדיקה - בדיקת הזמנות עם חמגשיות אחרי סינון
  const ordersWithTraysAfterFilter = {};
  filteredData.forEach(row => {
    const pm = String(row.PACKMETHODCODE || row.packMethodCode || '').trim().toLowerCase();
    if (pm.includes('חמגשית')) {
      const orderName = String(row.ORDNAME || row.orderName || '').trim();
      if (!ordersWithTraysAfterFilter[orderName]) {
        ordersWithTraysAfterFilter[orderName] = [];
      }
      ordersWithTraysAfterFilter[orderName].push({
        partDes: row.PARTDES || row.partDes || '',
        packMethodCode: row.PACKMETHODCODE || row.packMethodCode || '',
        eatQuant: row.EATQUANT || row.eatQuant || 0,
        mealName: row.MEALNAME || row.mealName || ''
      });
    }
  });
  
  if (Object.keys(ordersWithTraysAfterFilter).length > 0) {
    console.log('📊 הזמנות עם חמגשיות אחרי סינון:', Object.keys(ordersWithTraysAfterFilter).length);
    Object.entries(ordersWithTraysAfterFilter).forEach(([orderName, items]) => {
      console.log(`  הזמנה ${orderName}: ${items.length} פריטי חמגשית`);
      items.forEach(item => {
        console.log(`    - ${item.partDes} (${item.packMethodCode}) - ארוחה: ${item.mealName}, כמות: ${item.eatQuant}`);
      });
    });
  }
  if (filteredData.length === 0 && flatData.length > 0) {
    console.log('⚠️ לא נמצאו קרטון חמים! דוגמאות לנתונים:');
    const uniqueCartonTypes = [...new Set(flatData.slice(0, 10).map(r => String(r.CARTON_TYPE || r.cartonType || '').trim()))];
    const uniquePSPEC6 = [...new Set(flatData.slice(0, 10).map(r => String(r.PSPEC6 || r.pspec6 || '').trim()))];
    console.log('  CARTON_TYPE דוגמאות:', uniqueCartonTypes);
    console.log('  PSPEC6 דוגמאות:', uniquePSPEC6);
  }
  
  // הפרדה לפי קטגוריות
  const categories = {
    smallTray: [], // חמגשית קטנה
    largeTray: [], // חמגשית גדולה
    gastronome: [], // גסטרונום
    container1L: [], // מיכל 1 ליטר
    container2L: [], // מיכל 2 ליטר
    pack7: [], // מארז 7
    pack5: []  // מארז 5
  };
  
  // לוגים לדיבוג - בדיקת כמה שורות יש עם PACK5, PACK7, CONTAINERS
  const rowsWithPack5 = filteredData.filter(r => parseFloat(r.PACK5 || r.pack5 || 0) > 0);
  const rowsWithPack7 = filteredData.filter(r => parseFloat(r.PACK7 || r.pack7 || 0) > 0);
  const rowsWithContainers = filteredData.filter(r => parseFloat(r.CONTAINERS || r.containers || 0) > 0);
  console.log('🔍 דוח אריזה חמה - נתונים:', {
    totalRows: filteredData.length,
    rowsWithPack5: rowsWithPack5.length,
    rowsWithPack7: rowsWithPack7.length,
    rowsWithContainers: rowsWithContainers.length
  });

  // חיפוש ספציפי לתירס/שניצל
  const tirasRows = filteredData.filter(r => {
    const partDes = String(r.PARTDES || r.partDes || '').toLowerCase();
    return partDes.includes('תירס') || partDes.includes('שניצל');
  });
  if (tirasRows.length > 0) {
    console.log('🌽 פריטי תירס/שניצל שנמצאו:', tirasRows.length);
    tirasRows.forEach(r => {
      console.log(`  - ${r.PARTDES || r.partDes}: PACK5=${r.PACK5 || r.pack5 || 'אין'}, PACK7=${r.PACK7 || r.pack7 || 'אין'}, CONTAINERS=${r.CONTAINERS || r.containers || 'אין'}`);
    });
  } else {
    console.log('🌽 לא נמצאו פריטי תירס/שניצל ב-filteredData');
  }

  // הדפסת כל הפריטים עם PACK5/PACK7
  if (rowsWithPack5.length > 0 || rowsWithPack7.length > 0) {
    console.log('📦 כל הפריטים עם מארז 5/7:');
    const allPackRows = filteredData.filter(r => parseFloat(r.PACK5 || r.pack5 || 0) > 0 || parseFloat(r.PACK7 || r.pack7 || 0) > 0);
    allPackRows.forEach(r => {
      console.log(`  - ${r.PARTDES || r.partDes}: PACK5=${r.PACK5 || r.pack5 || 0}, PACK7=${r.PACK7 || r.pack7 || 0}`);
    });
  }

  filteredData.forEach(r => {
    const pm = String(r.PACKMETHODCODE || r.packMethodCode || '').trim();
    const packDes = String(r.PACKDES || r.packDes || '').trim().toLowerCase();
    const pspec1 = String(r.PSPEC1 || r.pspec1 || '').trim().toLowerCase();
    const pack7 = parseFloat(r.PACK7 || r.pack7 || 0) || 0;
    const pack5 = parseFloat(r.PACK5 || r.pack5 || 0) || 0;
    const containers = parseFloat(r.CONTAINERS || r.containers || 0) || 0;

    let addedToCategory = false;

    // חמגשית קטנה
    if (pm.includes('חמגשית') && (packDes.includes('קט') || packDes.includes('קטן') || packDes.includes('קטנה'))) {
      categories.smallTray.push(r);
      addedToCategory = true;
    }
    // חמגשית גדולה
    else if (pm.includes('חמגשית') && (packDes.includes('גד') || packDes.includes('גדול') || packDes.includes('גדולה'))) {
      categories.largeTray.push(r);
      addedToCategory = true;
    }

    // מארז 7 - בנפרד, לפי ערך PACK7 (לא else if!)
    if (pack7 > 0) {
      categories.pack7.push(r);
      addedToCategory = true;
    }

    // מארז 5 - בנפרד, לפי ערך PACK5 (לא else if!)
    if (pack5 > 0) {
      categories.pack5.push(r);
      addedToCategory = true;
    }

    // גסטרונום - לפי PSPEC1 או PACKMETHODCODE, רק אם יש כמות (containers > 0)
    // ירק שאריזתו גסטרונום - מתייחסים אליו כתפזורת (לא ייכנס לקטגוריית גסטרונום)
    const isVegetableItem = pspec1.includes('ירק');
    if ((pspec1.includes('גסטרונום') || pm.includes('גסטרונום') || packDes.includes('גסטרונום')) && containers > 0 && !isVegetableItem) {
      categories.gastronome.push(r);
      addedToCategory = true;
    }
    // מיכל 2 ליטר
    else if (packDes.includes('2 ליטר') || (packDes.includes('2') && packDes.includes('ליטר'))) {
      categories.container2L.push(r);
      addedToCategory = true;
    }
    // מיכל 1 ליטר
    else if (packDes.includes('1 ליטר') || (packDes.includes('1') && packDes.includes('ליטר') && !packDes.includes('2'))) {
      categories.container1L.push(r);
      addedToCategory = true;
    }
    // אם יש CONTAINERS אבל לא נכנס לגסטרונום/מיכל, נכניס למיכל 2 ליטר
    else if (containers > 0 && !addedToCategory) {
      categories.container2L.push(r);
    }
  });
  
  console.log('📊 דוח אריזה חמה - קטגוריות:', {
    smallTray: categories.smallTray.length,
    largeTray: categories.largeTray.length,
    gastronome: categories.gastronome.length,
    container1L: categories.container1L.length,
    container2L: categories.container2L.length,
    pack7: categories.pack7.length,
    pack5: categories.pack5.length
  });
  
  // פונקציה ליצירת טבלה לפי קטגוריה
  const createCategoryTable = (categoryName, categoryData, getValueFn) => {
    if (categoryData.length === 0) return '';
    
    // קיבוץ לפי פריט עם שמירת נתוני הזמנות
    const summary = {};
    categoryData.forEach(row => {
      const partDes = String(row.PARTDES || row.partDes || '').trim();
      if (!summary[partDes]) {
        summary[partDes] = {
          partDes: partDes,
          totalValue: 0,
          orders: new Map() // Map של orderName -> custDes
        };
      }
      summary[partDes].totalValue += getValueFn(row);
      
      // שמירת נתוני הזמנה
      const orderName = String(row.ORDNAME || row.orderName || '').trim();
      const custDes = String(row.CUSTDES || row.custDes || '').trim();
      if (orderName) {
        summary[partDes].orders.set(orderName, custDes || 'ללא שם לקוח');
      }
    });
    
    const summaryArray = Object.values(summary).sort((a, b) => 
      a.partDes.localeCompare(b.partDes)
    );
    
    // שמירת נתונים גלובלית לפתיחת modal
    if (!window.traysItemData) {
      window.traysItemData = {};
    }
    
    let html = `<div class="tray-category-table" style="display:inline-block;width:48%;margin:1%;vertical-align:top;margin-bottom:20px;box-sizing:border-box;">`;
    html += `<h3 style="background:#c8e6c9;padding:10px;margin:0;text-align:center;border:1px solid #4caf50;font-size:1.1em;font-weight:bold;color:#333;">${categoryName}</h3>`;
    html += `<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;"><table style="width:100%;border-collapse:collapse;border:1px solid #4CAF50;min-width:200px;"><thead><tr>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:right;font-size:1em;font-weight:bold;color:#333;">${categoryName}</th>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:center;font-size:1em;font-weight:bold;color:#333;">כמות</th>`;
    html += `</tr></thead><tbody>`;
    
    summaryArray.forEach((item, index) => {
      const itemKey = `${categoryName}_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const ordersArray = Array.from(item.orders.entries()).map(([orderName, custDes]) => ({
        orderName: orderName,
        custDes: custDes
      }));
      
      // שמירת נתונים גלובלית
      window.traysItemData[itemKey] = ordersArray;
      
      // Escape של תווים מיוחדים לשם הפריט
      const safePartDes = String(item.partDes || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      
      html += '<tr>';
      html += `<td class="clickable-item" style="border:1px solid #ccc;padding:8px;text-align:right;font-size:0.85em;word-wrap:break-word;cursor:pointer;" onclick="openItemModal('${safePartDes}', '${itemKey}')">${item.partDes}</td>`;
      html += `<td class="clickable-item" style="border:1px solid #ccc;padding:8px;font-weight:bold;text-align:center;font-size:0.85em;cursor:pointer;" onclick="openItemModal('${safePartDes}', '${itemKey}')">${item.totalValue.toFixed(0)}</td>`;
      html += '</tr>';
    });
    
    html += '</tbody></table></div></div>';
    return html;
  };
  
  // יצירת טבלאות לפי קטגוריות
  let html = '<div style="width:100%;display:block;">';
  
  // חמגשית קטנה - קיבוץ לפי הזמנה, ארוחה, והפרדת אלרגני
  if (categories.smallTray.length > 0) {
    console.log('📊 חמגשית קטנה - סה"כ פריטים:', categories.smallTray.length);
    const ordersMap = {};
    categories.smallTray.forEach(row => {
      const orderName = String(row.ORDNAME || row.orderName || '').trim();
      if (!ordersMap[orderName]) {
        ordersMap[orderName] = [];
      }
      ordersMap[orderName].push(row);
    });
    
    console.log('📊 חמגשית קטנה - הזמנות:', Object.keys(ordersMap).length);
    Object.entries(ordersMap).forEach(([orderName, items]) => {
      console.log(`  הזמנה ${orderName}: ${items.length} פריטים`);
      items.forEach(item => {
        console.log(`    - ${item.PARTDES || item.partDes || ''} (${item.PACKMETHODCODE || item.packMethodCode || ''}) - ארוחה: ${item.MEALNAME || item.mealName || ''}, כמות: ${item.EATQUANT || item.eatQuant || 0}`);
      });
    });
    
    const summary = {};
    Object.entries(ordersMap).forEach(([orderName, orderItems]) => {
      // חלוקה לפי ארוחה (MEALNAME) בתוך אותה הזמנה
      const itemsByMeal = {};
      orderItems.forEach(item => {
        const mealName = String(item.MEALNAME || item.mealName || '').trim() || 'ללא_ארוחה';
        if (!itemsByMeal[mealName]) {
          itemsByMeal[mealName] = [];
        }
        itemsByMeal[mealName].push(item);
      });
      
      // עבור כל ארוחה בנפרד
      Object.entries(itemsByMeal).forEach(([mealName, mealItems]) => {
        // הפרדה בין פריטים רגילים לאלרגני
    const normalItems = [];
    const allergenItems = [];
    
        mealItems.forEach(item => {
      const pspec1 = String(item.PSPEC1 || item.pspec1 || '').trim().toLowerCase();
          if (pspec1.includes('ללא אלרגני') || pspec1.includes('לא אלרגני')) {
        allergenItems.push(item);
      } else {
        normalItems.push(item);
      }
    });
    
        // עיבוד פריטים רגילים
    if (normalItems.length > 0) {
          // יצירת רשימת פריטים ייחודית (ללא כפילויות)
          const uniquePartDes = [...new Set(normalItems
            .map(item => String(item.PARTDES || item.partDes || '').trim())
            .filter(Boolean))];
          
          const itemsKey = uniquePartDes.sort().join('+');
          
          // עבור פריטים רגילים - משתמשים רק ב-itemsKey (ללא mealName) כדי לאחד פריטים זהים מארוחות שונות
          const groupKey = itemsKey;
          if (!summary[groupKey]) {
            summary[groupKey] = {
              itemsKey: itemsKey,
              totalQuantity: 0,
              orderNames: new Set(), // שמירת רשימת הזמנות
              ordersMap: new Map() // Map של orderName -> custDes
            };
          }
          
          // החמגשית נספרת פעם אחת לכל ארוחה - לוקחים את הכמות מהפריט הראשון
          // (כי כל הפריטים באותה ארוחה באותה כמות EATQUANT)
          const eatQuant = parseFloat(normalItems[0]?.EATQUANT || normalItems[0]?.eatQuant || 0) || 0;
          
          // בדיקה שכל הפריטים באותה ארוחה באותה כמות (למניעת טעויות)
          const allSameQuantity = normalItems.every(item => {
            const itemEatQuant = parseFloat(item?.EATQUANT || item?.eatQuant || 0) || 0;
            return Math.abs(itemEatQuant - eatQuant) < 0.01; // השוואה עם טולרנס קטן
          });
          
          if (!allSameQuantity) {
            console.warn(`⚠️ חמגשית קטנה - הזמנה ${orderName}, ארוחה ${mealName}: כמויות שונות!`, 
              normalItems.map(item => ({ partDes: item.PARTDES, eatQuant: item.EATQUANT })));
          }
          
          // הוספת הכמות פעם אחת בלבד (לא לסכם את כל הפריטים)
          summary[groupKey].totalQuantity += eatQuant;
          
          // הוספת מספרי ההזמנה ושמות לקוחות לרשימה
          const orderNameStr = String(orderItems[0]?.ORDNAME || orderItems[0]?.orderName || orderName || '').trim();
          const custDes = String(orderItems[0]?.CUSTDES || orderItems[0]?.custDes || '').trim();
          if (orderNameStr) {
            summary[groupKey].orderNames.add(orderNameStr);
            summary[groupKey].ordersMap.set(orderNameStr, custDes || 'ללא שם לקוח');
          }
        }
        
        // עיבוד פריטים אלרגני - מאחדים גם אם מארוחות שונות
    if (allergenItems.length > 0) {
          // יצירת רשימת פריטים ייחודית (ללא כפילויות)
          const uniquePartDes = [...new Set(allergenItems
            .map(item => String(item.PARTDES || item.partDes || '').trim())
            .filter(Boolean))];
          
          const itemsKey = uniquePartDes.sort().join('+');
          
          // עבור אלרגני - משתמשים רק ב-itemsKey עם סימון אלרגני כדי לאחד פריטים זהים מארוחות שונות
          const groupKey = `${itemsKey}|אלרגני`;
          if (!summary[groupKey]) {
            summary[groupKey] = {
              itemsKey: itemsKey + ' (ללא אלרגנים)',
              totalQuantity: 0,
              orderNames: new Set(), // שמירת רשימת הזמנות
              ordersMap: new Map() // Map של orderName -> custDes
            };
          }
          
          // החמגשית נספרת פעם אחת לכל ארוחה - לוקחים את הכמות מהפריט הראשון
          // (כי כל הפריטים באותה ארוחה באותה כמות EATQUANT)
          const eatQuant = parseFloat(allergenItems[0]?.EATQUANT || allergenItems[0]?.eatQuant || 0) || 0;
          
          // בדיקה שכל הפריטים באותה ארוחה באותה כמות (למניעת טעויות)
          const allSameQuantity = allergenItems.every(item => {
            const itemEatQuant = parseFloat(item?.EATQUANT || item?.eatQuant || 0) || 0;
            return Math.abs(itemEatQuant - eatQuant) < 0.01; // השוואה עם טולרנס קטן
          });
          
          if (!allSameQuantity) {
            console.warn(`⚠️ חמגשית קטנה (אלרגני) - הזמנה ${orderName}, ארוחה ${mealName}: כמויות שונות!`, 
              allergenItems.map(item => ({ partDes: item.PARTDES, eatQuant: item.EATQUANT })));
          }
          
          // הוספת הכמות פעם אחת בלבד (לא לסכם את כל הפריטים)
          summary[groupKey].totalQuantity += eatQuant;
          
          // הוספת מספרי ההזמנה ושמות לקוחות לרשימה
          const orderNameStr = String(orderItems[0]?.ORDNAME || orderItems[0]?.orderName || orderName || '').trim();
          const custDes = String(orderItems[0]?.CUSTDES || orderItems[0]?.custDes || '').trim();
          if (orderNameStr) {
            summary[groupKey].orderNames.add(orderNameStr);
            summary[groupKey].ordersMap.set(orderNameStr, custDes || 'ללא שם לקוח');
          }
        }
      });
    });
    
    const summaryArray = Object.values(summary).sort((a, b) => 
      a.itemsKey.localeCompare(b.itemsKey)
    );
    
    console.log('📊 חמגשית קטנה - אחרי קיבוץ:', summaryArray.length, 'שורות סיכום');
    summaryArray.forEach(item => {
      console.log(`  - ${item.itemsKey}: כמות ${item.totalQuantity}, הזמנות: ${item.orderNames ? item.orderNames.size : 0}`);
    });
    
    html += `<div class="tray-category-table" style="display:inline-block;width:48%;margin:1%;vertical-align:top;margin-bottom:20px;box-sizing:border-box;">`;
    html += `<h3 style="background:#c8e6c9;padding:10px;margin:0;text-align:center;border:1px solid #4caf50;font-size:1.1em;font-weight:bold;color:#333;">חמגשית קטנה</h3>`;
    html += `<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;"><table style="width:100%;border-collapse:collapse;border:1px solid #4CAF50;min-width:200px;"><thead><tr>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:right;font-size:1em;font-weight:bold;color:#333;">חמגשית קטנה</th>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:center;font-size:1em;font-weight:bold;color:#333;">כמות</th>`;
    html += `</tr></thead><tbody>`;
    
    // שמירת נתונים להורדה ולפופ-אפ
    const smallTrayOrdersMap = {};
    if (!window.traysItemData) {
      window.traysItemData = {};
    }
    
    summaryArray.forEach((item, index) => {
      const rowId = `small-tray-row-${index}`;
      const itemKey = `small-tray-${index}`;
      const orderNamesArray = Array.from(item.orderNames || []).sort();
      smallTrayOrdersMap[rowId] = orderNamesArray;
      
      // יצירת מערך של הזמנות עם שמות לקוחות
      const ordersArray = Array.from(item.ordersMap.entries()).map(([orderName, custDes]) => ({
        orderName: orderName,
        custDes: custDes
      }));
      window.traysItemData[itemKey] = ordersArray;
      
      // Escape של תווים מיוחדים לשם הפריט
      const safeItemsKey = String(item.itemsKey || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      
      html += '<tr>';
      html += `<td class="clickable-item" style="border:1px solid #ccc;padding:8px;text-align:right;font-size:0.85em;word-wrap:break-word;cursor:pointer;" onclick="openItemModal('${safeItemsKey}', '${itemKey}')">${item.itemsKey}</td>`;
      html += `<td class="clickable-item" style="border:1px solid #ccc;padding:8px;font-weight:bold;text-align:center;font-size:0.85em;cursor:pointer;" onclick="openItemModal('${safeItemsKey}', '${itemKey}')">${item.totalQuantity.toFixed(0)}</td>`;
      html += '</tr>';
    });
    
    // שמירת המפה של הזמנות (למקרה שיהיה צורך בעתיד)
    window.smallTrayOrdersMap = smallTrayOrdersMap;
    
    html += '</tbody></table></div></div>';
  }
  
  // חמגשית גדולה - קיבוץ לפי הזמנה, ארוחה, והפרדת אלרגני
  if (categories.largeTray.length > 0) {
    const ordersMap = {};
    categories.largeTray.forEach(row => {
      const orderName = String(row.ORDNAME || row.orderName || '').trim();
      if (!ordersMap[orderName]) {
        ordersMap[orderName] = [];
      }
      ordersMap[orderName].push(row);
    });
    
    const summary = {};
    Object.entries(ordersMap).forEach(([orderName, orderItems]) => {
      // חלוקה לפי ארוחה (MEALNAME) בתוך אותה הזמנה
      const itemsByMeal = {};
      orderItems.forEach(item => {
        const mealName = String(item.MEALNAME || item.mealName || '').trim() || 'ללא_ארוחה';
        if (!itemsByMeal[mealName]) {
          itemsByMeal[mealName] = [];
        }
        itemsByMeal[mealName].push(item);
      });
      
      // עבור כל ארוחה בנפרד
      Object.entries(itemsByMeal).forEach(([mealName, mealItems]) => {
        // הפרדה בין פריטים רגילים לאלרגני
        const normalItems = [];
        const allergenItems = [];
        
        mealItems.forEach(item => {
          const pspec1 = String(item.PSPEC1 || item.pspec1 || '').trim().toLowerCase();
          if (pspec1.includes('ללא אלרגני') || pspec1.includes('לא אלרגני')) {
            allergenItems.push(item);
          } else {
            normalItems.push(item);
          }
        });
        
        // עיבוד פריטים רגילים
        if (normalItems.length > 0) {
          // יצירת רשימת פריטים ייחודית (ללא כפילויות)
          const uniquePartDes = [...new Set(normalItems
            .map(item => String(item.PARTDES || item.partDes || '').trim())
            .filter(Boolean))];
          
          const itemsKey = uniquePartDes.sort().join('+');
          
          // עבור פריטים רגילים - משתמשים רק ב-itemsKey (ללא mealName) כדי לאחד פריטים זהים מארוחות שונות
          const groupKey = itemsKey;
          if (!summary[groupKey]) {
            summary[groupKey] = {
              itemsKey: itemsKey,
              totalQuantity: 0,
              orderNames: new Set(), // שמירת רשימת הזמנות
              ordersMap: new Map() // Map של orderName -> custDes
            };
          }
          
          // החמגשית נספרת פעם אחת לכל ארוחה - לוקחים את הכמות מהפריט הראשון
          // (כי כל הפריטים באותה ארוחה באותה כמות EATQUANT)
          const eatQuant = parseFloat(normalItems[0]?.EATQUANT || normalItems[0]?.eatQuant || 0) || 0;
          
          // בדיקה שכל הפריטים באותה ארוחה באותה כמות (למניעת טעויות)
          const allSameQuantity = normalItems.every(item => {
            const itemEatQuant = parseFloat(item?.EATQUANT || item?.eatQuant || 0) || 0;
            return Math.abs(itemEatQuant - eatQuant) < 0.01; // השוואה עם טולרנס קטן
          });
          
          if (!allSameQuantity) {
            console.warn(`⚠️ חמגשית גדולה - הזמנה ${orderName}, ארוחה ${mealName}: כמויות שונות!`, 
              normalItems.map(item => ({ partDes: item.PARTDES, eatQuant: item.EATQUANT })));
          }
          
          // הוספת הכמות פעם אחת בלבד (לא לסכם את כל הפריטים)
          summary[groupKey].totalQuantity += eatQuant;
          
          // הוספת מספרי ההזמנה ושמות לקוחות לרשימה
          const orderNameStr = String(orderItems[0]?.ORDNAME || orderItems[0]?.orderName || orderName || '').trim();
          const custDes = String(orderItems[0]?.CUSTDES || orderItems[0]?.custDes || '').trim();
          if (orderNameStr) {
            summary[groupKey].orderNames.add(orderNameStr);
            summary[groupKey].ordersMap.set(orderNameStr, custDes || 'ללא שם לקוח');
          }
        }
        
        // עיבוד פריטים אלרגני - מאחדים גם אם מארוחות שונות
        if (allergenItems.length > 0) {
          // יצירת רשימת פריטים ייחודית (ללא כפילויות)
          const uniquePartDes = [...new Set(allergenItems
            .map(item => String(item.PARTDES || item.partDes || '').trim())
            .filter(Boolean))];
          
          const itemsKey = uniquePartDes.sort().join('+');
          
          // עבור אלרגני - משתמשים רק ב-itemsKey עם סימון אלרגני כדי לאחד פריטים זהים מארוחות שונות
          const groupKey = `${itemsKey}|אלרגני`;
          if (!summary[groupKey]) {
            summary[groupKey] = {
              itemsKey: itemsKey + ' (ללא אלרגנים)',
              totalQuantity: 0,
              orderNames: new Set(), // שמירת רשימת הזמנות
              ordersMap: new Map() // Map של orderName -> custDes
            };
          }
          
          // החמגשית נספרת פעם אחת לכל ארוחה - לוקחים את הכמות מהפריט הראשון
          // (כי כל הפריטים באותה ארוחה באותה כמות EATQUANT)
          const eatQuant = parseFloat(allergenItems[0]?.EATQUANT || allergenItems[0]?.eatQuant || 0) || 0;
          
          // בדיקה שכל הפריטים באותה ארוחה באותה כמות (למניעת טעויות)
          const allSameQuantity = allergenItems.every(item => {
            const itemEatQuant = parseFloat(item?.EATQUANT || item?.eatQuant || 0) || 0;
            return Math.abs(itemEatQuant - eatQuant) < 0.01; // השוואה עם טולרנס קטן
          });
          
          if (!allSameQuantity) {
            console.warn(`⚠️ חמגשית גדולה (אלרגני) - הזמנה ${orderName}, ארוחה ${mealName}: כמויות שונות!`, 
              allergenItems.map(item => ({ partDes: item.PARTDES, eatQuant: item.EATQUANT })));
          }
          
          // הוספת הכמות פעם אחת בלבד (לא לסכם את כל הפריטים)
          summary[groupKey].totalQuantity += eatQuant;
          
          // הוספת מספרי ההזמנה ושמות לקוחות לרשימה
          const orderNameStr = String(orderItems[0]?.ORDNAME || orderItems[0]?.orderName || orderName || '').trim();
          const custDes = String(orderItems[0]?.CUSTDES || orderItems[0]?.custDes || '').trim();
          if (orderNameStr) {
            summary[groupKey].orderNames.add(orderNameStr);
            summary[groupKey].ordersMap.set(orderNameStr, custDes || 'ללא שם לקוח');
          }
        }
      });
    });
    
    const summaryArray = Object.values(summary).sort((a, b) => 
      a.itemsKey.localeCompare(b.itemsKey)
    );
    
    html += `<div class="tray-category-table" style="display:inline-block;width:48%;margin:1%;vertical-align:top;margin-bottom:20px;box-sizing:border-box;">`;
    html += `<h3 style="background:#c8e6c9;padding:10px;margin:0;text-align:center;border:1px solid #4caf50;font-size:1.1em;font-weight:bold;color:#333;">חמגשית גדולה</h3>`;
    html += `<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;"><table style="width:100%;border-collapse:collapse;border:1px solid #4CAF50;min-width:200px;"><thead><tr>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:right;font-size:1em;font-weight:bold;color:#333;">חמגשית גדולה</th>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:center;font-size:1em;font-weight:bold;color:#333;">כמות</th>`;
    html += `</tr></thead><tbody>`;
    
    // שמירת נתונים להורדה ולפופ-אפ
    const largeTrayOrdersMap = {};
    if (!window.traysItemData) {
      window.traysItemData = {};
    }
    
    summaryArray.forEach((item, index) => {
      const rowId = `large-tray-row-${index}`;
      const itemKey = `large-tray-${index}`;
      const orderNamesArray = Array.from(item.orderNames || []).sort();
      largeTrayOrdersMap[rowId] = orderNamesArray;
      
      // יצירת מערך של הזמנות עם שמות לקוחות
      const ordersArray = Array.from(item.ordersMap.entries()).map(([orderName, custDes]) => ({
        orderName: orderName,
        custDes: custDes
      }));
      window.traysItemData[itemKey] = ordersArray;
      
      // Escape של תווים מיוחדים לשם הפריט
      const safeItemsKey = String(item.itemsKey || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      
    html += '<tr>';
      html += `<td class="clickable-item" style="border:1px solid #ccc;padding:8px;text-align:right;font-size:0.85em;word-wrap:break-word;cursor:pointer;" onclick="openItemModal('${safeItemsKey}', '${itemKey}')">${item.itemsKey}</td>`;
      html += `<td class="clickable-item" style="border:1px solid #ccc;padding:8px;font-weight:bold;text-align:center;font-size:0.85em;cursor:pointer;" onclick="openItemModal('${safeItemsKey}', '${itemKey}')">${item.totalQuantity.toFixed(0)}</td>`;
      html += '</tr>';
    });
    
    // שמירת המפה של הזמנות (למקרה שיהיה צורך בעתיד)
    window.largeTrayOrdersMap = largeTrayOrdersMap;
    
    html += '</tbody></table></div></div>';
  }
  
  // גסטרונום - טבלה מותאמת עם עמודת ק"ג למיכל
  if (categories.gastronome.length > 0) {
    const gastroSummary = {};
    categories.gastronome.forEach(row => {
      const partDes = String(row.PARTDES || row.partDes || '').trim();
      if (!gastroSummary[partDes]) {
        gastroSummary[partDes] = {
          partDes: partDes,
          totalValue: 0,
          param7: parseFloat(row.Y_9964_5_ESH || row.y9964 || 0) || 0,
          orders: new Map()
        };
      }
      gastroSummary[partDes].totalValue += parseFloat(row.CONTAINERS || row.containers || 0) || 0;
      const orderName = String(row.ORDNAME || row.orderName || '').trim();
      const custDes = String(row.CUSTDES || row.custDes || '').trim();
      if (orderName) {
        gastroSummary[partDes].orders.set(orderName, custDes || 'ללא שם לקוח');
      }
    });

    const gastroArray = Object.values(gastroSummary).sort((a, b) => a.partDes.localeCompare(b.partDes));

    if (!window.traysItemData) window.traysItemData = {};

    html += `<div class="tray-category-table" style="display:inline-block;width:48%;margin:1%;vertical-align:top;margin-bottom:20px;box-sizing:border-box;">`;
    html += `<h3 style="background:#c8e6c9;padding:10px;margin:0;text-align:center;border:1px solid #4caf50;font-size:1.1em;font-weight:bold;color:#333;">גסטרונום</h3>`;
    html += `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;border:1px solid #4CAF50;min-width:200px;"><thead><tr>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:right;font-size:1em;font-weight:bold;color:#333;">פריט</th>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:center;font-size:1em;font-weight:bold;color:#333;">כמות</th>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:center;font-size:1em;font-weight:bold;color:#333;">ק"ג למיכל</th>`;
    html += `</tr></thead><tbody>`;

    gastroArray.forEach((item, index) => {
      const itemKey = `gastro_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const ordersArray = Array.from(item.orders.entries()).map(([orderName, custDes]) => ({ orderName, custDes }));
      window.traysItemData[itemKey] = ordersArray;
      const safePartDes = String(item.partDes || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      // גסטרונום: param7 × 6.5
      const kgPerContainer = item.param7 * 6.5;

      html += '<tr>';
      html += `<td class="clickable-item" style="border:1px solid #ccc;padding:8px;text-align:right;font-size:0.85em;cursor:pointer;" onclick="openItemModal('${safePartDes}', '${itemKey}')">${item.partDes}</td>`;
      html += `<td class="clickable-item" style="border:1px solid #ccc;padding:8px;font-weight:bold;text-align:center;font-size:0.85em;cursor:pointer;" onclick="openItemModal('${safePartDes}', '${itemKey}')">${item.totalValue.toFixed(0)}</td>`;
      html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;font-size:0.85em;">${kgPerContainer.toFixed(2)}</td>`;
      html += '</tr>';
    });

    html += '</tbody></table></div></div>';
  }
  
  // טבלת מיכלים - מכל הנתונים של קרטון חמים, לפי CONTAINERS, רק תפזורת או סיפט
  const containersData = filteredData.filter(r => {
    const containers = parseFloat(r.CONTAINERS || r.containers || 0) || 0;
    if (containers <= 0) return false;
    
    // בדיקה שזה לא חמגשית ולא גסטרונום
    const pm = String(r.PACKMETHODCODE || r.packMethodCode || '').trim().toLowerCase();
    const packDes = String(r.PACKDES || r.packDes || '').trim().toLowerCase();
    const pspec1 = String(r.PSPEC1 || r.pspec1 || '').trim().toLowerCase();
    const pspec6 = String(r.PSPEC6 || r.pspec6 || '').trim().toLowerCase();
    
    // אם זה חמגשית - לא נכלל (בודק בכל השדות הרלוונטיים)
    if (pm.includes('חמגשית') || packDes.includes('חמגשית') || pspec1.includes('חמגשית')) {
      return false;
    }
    
    // אם זה גסטרונום - לא נכלל (בודק בכל השדות הרלוונטיים)
    // יוצא דופן: ירק שאריזתו גסטרונום - מתייחסים אליו כתפזורת ולכן כן נכלל
    const isVeg = pspec1.includes('ירק');
    const isGastro = pspec1.includes('גסטרונום') || pm.includes('גסטרונום') || packDes.includes('גסטרונום');
    if (isGastro && !isVeg) {
      return false;
    }

    // בדיקה אם זה סיפט - בודק בכל השדות הרלוונטיים
    const isSift = pm.includes('סיפט') || packDes.includes('סיפט') || pspec1.includes('סיפט');

    // אם זה צמחוני בפרמטר 6 - לא נכלל, אלא אם כן זה סיפט
    if (pspec6.includes('צמחוני') && !isSift) {
      return false;
    }

    // רק תפזורת, תפזורת101 או סיפט
    // יוצא דופן: ירק שאריזתו גסטרונום - מתייחסים אליו כתפזורת
    const isBulk = pm.includes('תפזורת') || packDes.includes('תפזורת') ||
                   pm.includes('תפזורת101') || packDes.includes('תפזורת101') || isSift ||
                   (isVeg && isGastro);

    return isBulk;
  });
  if (containersData.length > 0) {
    const summary = {};
    // קיבוץ לפי הזמנה + ארוחה + פריט כדי למנוע כפילות מאותה הזמנה ואותה ארוחה
    const orderMealItemMap = new Map(); // Map של "orderName|mealName|partDes" -> containers value
    
    console.log('📊 מיכלים - סה"כ שורות לפני קיבוץ:', containersData.length);
    
    containersData.forEach((row, idx) => {
      const partDes = String(row.PARTDES || row.partDes || '').trim();
      if (!partDes) return;
      
      const orderName = String(row.ORDNAME || row.orderName || '').trim();
      const mealName = String(row.MEALNAME || row.mealName || '').trim() || 'ללא_ארוחה';
      const containersValue = parseFloat(row.CONTAINERS || row.containers || 0) || 0;
      
      // לוגים לבדיקה - רק עבור 10 השורות הראשונות
      if (idx < 10) {
        console.log(`  שורה ${idx + 1}: פריט="${partDes}", מיכלים=${containersValue}, הזמנה=${orderName}, ארוחה="${mealName}"`);
      }
      
      if (orderName) {
        // יצירת מפתח ייחודי לכל הזמנה + ארוחה + פריט
        const orderMealItemKey = `${orderName}|${mealName}|${partDes}`;
        
        // אם יש כבר ערך עבור הזמנה + ארוחה + פריט הזה, לא נוסיף אותו שוב (למניעת כפילות)
        // נשתמש רק בערך הראשון שנמצא
        if (!orderMealItemMap.has(orderMealItemKey)) {
          orderMealItemMap.set(orderMealItemKey, containersValue);
      } else {
          // אם יש כבר ערך, נדלג על השורה הזו (כי זה אותו פריט מאותה הזמנה ואותה ארוחה)
          console.log(`  ⚠️ דילוג על שורה ${idx + 1}: פריט="${partDes}" כבר קיים עבור הזמנה ${orderName} וארוחה "${mealName}"`);
        }
      }
      
      // קיבוץ לפי פריט לסיכום
      if (!summary[partDes]) {
        summary[partDes] = {
          partDes: partDes,
          totalValue: 0,
          ordersMap: new Map() // Map של orderName -> custDes
        };
      }
      
      // שמירת נתוני הזמנה
      const custDes = String(row.CUSTDES || row.custDes || '').trim();
      if (orderName) {
        summary[partDes].ordersMap.set(orderName, custDes || 'ללא שם לקוח');
      }
    });
    
    console.log('📊 מיכלים - סה"כ שורות ייחודיות אחרי קיבוץ:', orderMealItemMap.size);
    
    // חישוב הסיכום לפי הזמנות + ארוחות ייחודיות
    orderMealItemMap.forEach((containersValue, orderMealItemKey) => {
      const [orderName, mealName, partDes] = orderMealItemKey.split('|');
      if (summary[partDes]) {
        summary[partDes].totalValue += containersValue;
      }
    });
    
    const summaryArray = Object.values(summary).sort((a, b) => 
      a.partDes.localeCompare(b.partDes)
    );
    
    if (!window.traysItemData) {
      window.traysItemData = {};
    }
    
    // חישוב ק"ג למיכל לפי פריט - צריך להוסיף param7 לסיכום
    containersData.forEach(row => {
      const partDes = String(row.PARTDES || row.partDes || '').trim();
      if (!partDes || !summary[partDes]) return;
      const param7 = parseFloat(row.Y_9964_5_ESH || row.y9964 || 0) || 0;
      const branchName = String(row.BRANCHNAME || row.branchName || '').trim();
      const isSouthBranch = branchName === '0' || branchName === '1';
      const partName = String(row.PARTNAME || row.partName || '').trim().toLowerCase();
      if (!summary[partDes].param7) {
        summary[partDes].param7 = param7;
        summary[partDes].isSouthBranch = isSouthBranch;
        summary[partDes].partName = partName; // שמירת המק"ט לבדיקת פחמימה
      }
    });

    html += `<div class="tray-category-table" style="display:inline-block;width:48%;margin:1%;vertical-align:top;margin-bottom:20px;box-sizing:border-box;">`;
    html += `<h3 style="background:#c8e6c9;padding:10px;margin:0;text-align:center;border:1px solid #4caf50;font-size:1.1em;font-weight:bold;color:#333;">מיכלים (תפזורת)</h3>`;
    html += `<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;"><table style="width:100%;border-collapse:collapse;border:1px solid #4CAF50;min-width:200px;"><thead><tr>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:right;font-size:1em;font-weight:bold;color:#333;">פריט</th>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:center;font-size:1em;font-weight:bold;color:#333;">כמות</th>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:center;font-size:1em;font-weight:bold;color:#333;">ק"ג למיכל</th>`;
    html += `</tr></thead><tbody>`;

    summaryArray.forEach((item, index) => {
      const itemKey = `containers_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const ordersArray = Array.from(item.ordersMap.entries()).map(([orderName, custDes]) => ({
        orderName: orderName,
        custDes: custDes
      }));
      window.traysItemData[itemKey] = ordersArray;

      // Escape של תווים מיוחדים לשם הפריט
      const safePartDes = String(item.partDes || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');

      // חישוב ק"ג למיכל: param7 × מכפיל
      // ירקני ואחרים - תמיד מכפיל 2 (גם בדרום וגם בצפון)
      // פחמימה - מכפיל 1 רק בסניף דרום (0,1), מכפיל 2 בצפון (3,4)
      const param7 = item.param7 || 0;
      const partName = item.partName || '';
      const isCarbohydrate = partName.includes('פחמימה');
      // פחמימה בדרום = מכפיל 1, כל השאר = מכפיל 2
      const multiplier = (isCarbohydrate && item.isSouthBranch) ? 1 : 2;
      const kgPerContainer = param7 * multiplier;

    html += '<tr>';
      html += `<td class="clickable-item" style="border:1px solid #ccc;padding:8px;text-align:right;font-size:0.85em;word-wrap:break-word;cursor:pointer;" onclick="openItemModal('${safePartDes}', '${itemKey}')">${item.partDes}</td>`;
      html += `<td class="clickable-item" style="border:1px solid #ccc;padding:8px;font-weight:bold;text-align:center;font-size:0.85em;cursor:pointer;" onclick="openItemModal('${safePartDes}', '${itemKey}')">${item.totalValue.toFixed(0)}</td>`;
      html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;font-size:0.85em;">${kgPerContainer.toFixed(2)}</td>`;
    html += '</tr>';
  });

    html += '</tbody></table></div></div>';
  }
  
  // טבלת מארז 5 - פריטי תפזורת וגסטרונום עם PACK5 > 0, וגם חמגשיות בכשרות חב"ד
  const pack5Data = filteredData.filter(r => {
    const pack5 = parseFloat(r.PACK5 || r.pack5 || 0) || 0;
    if (pack5 <= 0) return false;

    const pm = String(r.PACKMETHODCODE || r.packMethodCode || '').trim().toLowerCase();
    const packDes = String(r.PACKDES || r.packDes || '').trim().toLowerCase();
    const pspec1 = String(r.PSPEC1 || r.pspec1 || '').trim().toLowerCase();
    const spec2 = String(r.SPEC2 || r.spec2 || '').trim().toLowerCase();

    // בדיקה אם זה חמגשית
    const isTray = pm.includes('חמגשית') || packDes.includes('חמגשית') || pspec1.includes('חמגשית');

    // בדיקה אם זה כשרות חב"ד (ירוסלבסקי או ביסטריצקי)
    const isChabadKashrut = spec2.includes('חבד') || spec2.includes('חב"ד') || spec2.includes("חב'ד") ||
                            spec2.includes('ירוסלבסקי') || spec2.includes('ביסטריצקי');

    // אם זה חמגשית - נכלל רק אם זה כשרות חב"ד
    if (isTray && !isChabadKashrut) {
      return false;
    }

    return true;
  });
  if (pack5Data.length > 0) {
    const summary = {};
    
    console.log('📊 מארז 5 - סה"כ שורות אחרי סינון:', pack5Data.length);
    
    // בדיקה - השוואה עם הטבלה הכללית
    // נבדוק את כל הנתונים עם PACK5 > 0 (ללא סינון)
    const allPack5Rows = filteredData.filter(r => {
      const pack5 = parseFloat(r.PACK5 || r.pack5 || 0) || 0;
      return pack5 > 0;
    });
    console.log('📊 מארז 5 - סה"כ שורות עם PACK5 > 0 (ללא סינון):', allPack5Rows.length);
    
    pack5Data.forEach((row, idx) => {
      const partDes = String(row.PARTDES || row.partDes || '').trim();
      if (!partDes) return;
      
      const pack5Value = parseFloat(row.PACK5 || row.pack5 || 0) || 0;
      const orderName = String(row.ORDNAME || row.orderName || '').trim();
      const custDes = String(row.CUSTDES || row.custDes || '').trim();
      
      // לוגים לבדיקה - רק עבור 5 השורות הראשונות
      if (idx < 5) {
        const pm = String(row.PACKMETHODCODE || row.packMethodCode || '').trim();
        const packDes = String(row.PACKDES || row.packDes || '').trim();
        console.log(`  שורה ${idx + 1}: פריט="${partDes}", מארז 5=${pack5Value}, הזמנה=${orderName}, PACKMETHODCODE="${pm}", PACKDES="${packDes}"`);
      }
      
      // קיבוץ לפי פריט בלבד - מסכמים את כל השורות עם אותו פריט
      if (!summary[partDes]) {
        summary[partDes] = {
          partDes: partDes,
          totalValue: 0,
          ordersMap: new Map(), // Map של orderName -> custDes
          rows: [] // שמירת כל השורות לבדיקה
        };
      }
      
      // הוספת הערך לסיכום
      summary[partDes].totalValue += pack5Value;
      summary[partDes].rows.push({
        orderName: orderName,
        pack5: pack5Value,
        packMethodCode: String(row.PACKMETHODCODE || row.packMethodCode || '').trim(),
        packDes: String(row.PACKDES || row.packDes || '').trim()
      });
      
      // שמירת נתוני הזמנה
      if (orderName) {
        summary[partDes].ordersMap.set(orderName, custDes || 'ללא שם לקוח');
      }
    });
    
    // לוגים לבדיקה - סיכום לפי פריט + השוואה עם הטבלה הכללית
    console.log('📊 מארז 5 - סיכום לפי פריט:');
    Object.values(summary).forEach(item => {
      // חישוב סכום מהטבלה הכללית עבור אותו פריט
      const totalFromTable = allPack5Rows
        .filter(r => String(r.PARTDES || r.partDes || '').trim() === item.partDes)
        .reduce((sum, r) => sum + (parseFloat(r.PACK5 || r.pack5 || 0) || 0), 0);
      
      console.log(`  "${item.partDes}":`);
      console.log(`    בדוח: ${item.totalValue.toFixed(0)} מארזים`);
      console.log(`    בטבלה הכללית (SUM): ${totalFromTable.toFixed(0)} מארזים`);
      console.log(`    מספר שורות בדוח: ${item.rows.length}`);
      console.log(`    מספר שורות בטבלה הכללית: ${allPack5Rows.filter(r => String(r.PARTDES || r.partDes || '').trim() === item.partDes).length}`);
      
      if (Math.abs(item.totalValue - totalFromTable) > 0.01) {
        console.warn(`    ⚠️ הבדל! בדוח: ${item.totalValue.toFixed(0)}, בטבלה: ${totalFromTable.toFixed(0)}, הפרש: ${(item.totalValue - totalFromTable).toFixed(0)}`);
        // הצגת השורות שנכללו בדוח
        console.log(`    שורות שנכללו בדוח:`);
        item.rows.forEach((r, i) => {
          console.log(`      ${i + 1}. הזמנה=${r.orderName}, מארז 5=${r.pack5}, PACKMETHODCODE="${r.packMethodCode}", PACKDES="${r.packDes}"`);
        });
      }
    });
    
    const summaryArray = Object.values(summary).sort((a, b) => 
      a.partDes.localeCompare(b.partDes)
    );
    
    if (!window.traysItemData) {
      window.traysItemData = {};
    }
    
    // הוספת param8 לסיכום
    pack5Data.forEach(row => {
      const partDes = String(row.PARTDES || row.partDes || '').trim();
      if (!partDes || !summary[partDes]) return;
      const param8 = parseFloat(row.Y_9965_5_ESH || row.y9965 || 0) || 0;
      if (!summary[partDes].param8) {
        summary[partDes].param8 = param8;
      }
    });

    html += `<div class="tray-category-table" style="display:inline-block;width:48%;margin:1%;vertical-align:top;margin-bottom:20px;box-sizing:border-box;">`;
    html += `<h3 style="background:#c8e6c9;padding:10px;margin:0;text-align:center;border:1px solid #4caf50;font-size:1.1em;font-weight:bold;color:#333;">מארז 5</h3>`;
    html += `<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;"><table style="width:100%;border-collapse:collapse;border:1px solid #4CAF50;min-width:200px;"><thead><tr>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:right;font-size:1em;font-weight:bold;color:#333;">פריט</th>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:center;font-size:1em;font-weight:bold;color:#333;">כמות</th>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:center;font-size:1em;font-weight:bold;color:#333;">ק"ג למארז</th>`;
    html += `</tr></thead><tbody>`;

    summaryArray.forEach((item, index) => {
      const itemKey = `pack5_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const ordersArray = Array.from(item.ordersMap.entries()).map(([orderName, custDes]) => ({
        orderName: orderName,
        custDes: custDes
      }));
      window.traysItemData[itemKey] = ordersArray;

      // Escape של תווים מיוחדים לשם הפריט
      const safePartDes = String(item.partDes || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');

      // מארז 5: param8 × 5
      const kgPerPack = (item.param8 || 0) * 5;

      html += '<tr>';
      html += `<td class="clickable-item" style="border:1px solid #ccc;padding:8px;text-align:right;font-size:0.85em;word-wrap:break-word;cursor:pointer;" onclick="openItemModal('${safePartDes}', '${itemKey}')">${item.partDes}</td>`;
      html += `<td class="clickable-item" style="border:1px solid #ccc;padding:8px;font-weight:bold;text-align:center;font-size:0.85em;cursor:pointer;" onclick="openItemModal('${safePartDes}', '${itemKey}')">${item.totalValue.toFixed(0)}</td>`;
      html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;font-size:0.85em;">${kgPerPack.toFixed(2)}</td>`;
    html += '</tr>';
  });

    html += '</tbody></table></div></div>';
  }
  
  // טבלת מארז 7 - פריטי תפזורת וגסטרונום עם PACK7 > 0, וגם חמגשיות בכשרות חב"ד
  const pack7Data = filteredData.filter(r => {
    const pack7 = parseFloat(r.PACK7 || r.pack7 || 0) || 0;
    if (pack7 <= 0) return false;

    const pm = String(r.PACKMETHODCODE || r.packMethodCode || '').trim().toLowerCase();
    const packDes = String(r.PACKDES || r.packDes || '').trim().toLowerCase();
    const pspec1 = String(r.PSPEC1 || r.pspec1 || '').trim().toLowerCase();
    const spec2 = String(r.SPEC2 || r.spec2 || '').trim().toLowerCase();

    // בדיקה אם זה חמגשית
    const isTray = pm.includes('חמגשית') || packDes.includes('חמגשית') || pspec1.includes('חמגשית');

    // בדיקה אם זה כשרות חב"ד (ירוסלבסקי או ביסטריצקי)
    const isChabadKashrut = spec2.includes('חבד') || spec2.includes('חב"ד') || spec2.includes("חב'ד") ||
                            spec2.includes('ירוסלבסקי') || spec2.includes('ביסטריצקי');

    // אם זה חמגשית - נכלל רק אם זה כשרות חב"ד
    if (isTray && !isChabadKashrut) {
      return false;
    }

    return true;
  });
  if (pack7Data.length > 0) {
    const summary = {};
    
    console.log('📊 מארז 7 - סה"כ שורות אחרי סינון:', pack7Data.length);
    
    // בדיקה - השוואה עם הטבלה הכללית
    // נבדוק את כל הנתונים עם PACK7 > 0 (ללא סינון)
    const allPack7Rows = filteredData.filter(r => {
      const pack7 = parseFloat(r.PACK7 || r.pack7 || 0) || 0;
      return pack7 > 0;
    });
    console.log('📊 מארז 7 - סה"כ שורות עם PACK7 > 0 (ללא סינון):', allPack7Rows.length);
    
    pack7Data.forEach((row, idx) => {
      const partDes = String(row.PARTDES || row.partDes || '').trim();
      if (!partDes) return;
      
      const pack7Value = parseFloat(row.PACK7 || row.pack7 || 0) || 0;
      const orderName = String(row.ORDNAME || row.orderName || '').trim();
      const custDes = String(row.CUSTDES || row.custDes || '').trim();
      
      // לוגים לבדיקה - רק עבור 5 השורות הראשונות
      if (idx < 5) {
        const pm = String(row.PACKMETHODCODE || row.packMethodCode || '').trim();
        const packDes = String(row.PACKDES || row.packDes || '').trim();
        console.log(`  שורה ${idx + 1}: פריט="${partDes}", מארז 7=${pack7Value}, הזמנה=${orderName}, PACKMETHODCODE="${pm}", PACKDES="${packDes}"`);
      }
      
      // קיבוץ לפי פריט בלבד - מסכמים את כל השורות עם אותו פריט
      if (!summary[partDes]) {
        summary[partDes] = {
          partDes: partDes,
          totalValue: 0,
          ordersMap: new Map(), // Map של orderName -> custDes
          rows: [] // שמירת כל השורות לבדיקה
        };
      }
      
      // הוספת הערך לסיכום
      summary[partDes].totalValue += pack7Value;
      summary[partDes].rows.push({
        orderName: orderName,
        pack7: pack7Value,
        packMethodCode: String(row.PACKMETHODCODE || row.packMethodCode || '').trim(),
        packDes: String(row.PACKDES || row.packDes || '').trim()
      });
      
      // שמירת נתוני הזמנה
      if (orderName) {
        summary[partDes].ordersMap.set(orderName, custDes || 'ללא שם לקוח');
      }
    });
    
    // לוגים לבדיקה - סיכום לפי פריט + השוואה עם הטבלה הכללית
    console.log('📊 מארז 7 - סיכום לפי פריט:');
    Object.values(summary).forEach(item => {
      // חישוב סכום מהטבלה הכללית עבור אותו פריט
      const totalFromTable = allPack7Rows
        .filter(r => String(r.PARTDES || r.partDes || '').trim() === item.partDes)
        .reduce((sum, r) => sum + (parseFloat(r.PACK7 || r.pack7 || 0) || 0), 0);
      
      console.log(`  "${item.partDes}":`);
      console.log(`    בדוח: ${item.totalValue.toFixed(0)} מארזים`);
      console.log(`    בטבלה הכללית (SUM): ${totalFromTable.toFixed(0)} מארזים`);
      console.log(`    מספר שורות בדוח: ${item.rows.length}`);
      console.log(`    מספר שורות בטבלה הכללית: ${allPack7Rows.filter(r => String(r.PARTDES || r.partDes || '').trim() === item.partDes).length}`);
      
      if (Math.abs(item.totalValue - totalFromTable) > 0.01) {
        console.warn(`    ⚠️ הבדל! בדוח: ${item.totalValue.toFixed(0)}, בטבלה: ${totalFromTable.toFixed(0)}, הפרש: ${(item.totalValue - totalFromTable).toFixed(0)}`);
        // הצגת השורות שנכללו בדוח
        console.log(`    שורות שנכללו בדוח:`);
        item.rows.forEach((r, i) => {
          console.log(`      ${i + 1}. הזמנה=${r.orderName}, מארז 7=${r.pack7}, PACKMETHODCODE="${r.packMethodCode}", PACKDES="${r.packDes}"`);
        });
      }
    });
    
    const summaryArray = Object.values(summary).sort((a, b) => 
      a.partDes.localeCompare(b.partDes)
    );
    
    if (!window.traysItemData) {
      window.traysItemData = {};
    }
    
    // הוספת param8 לסיכום
    pack7Data.forEach(row => {
      const partDes = String(row.PARTDES || row.partDes || '').trim();
      if (!partDes || !summary[partDes]) return;
      const param8 = parseFloat(row.Y_9965_5_ESH || row.y9965 || 0) || 0;
      if (!summary[partDes].param8) {
        summary[partDes].param8 = param8;
      }
    });

    html += `<div class="tray-category-table" style="display:inline-block;width:48%;margin:1%;vertical-align:top;margin-bottom:20px;box-sizing:border-box;">`;
    html += `<h3 style="background:#c8e6c9;padding:10px;margin:0;text-align:center;border:1px solid #4caf50;font-size:1.1em;font-weight:bold;color:#333;">מארז 7</h3>`;
    html += `<div style="overflow-x:auto;-webkit-overflow-scrolling:touch;"><table style="width:100%;border-collapse:collapse;border:1px solid #4CAF50;min-width:200px;"><thead><tr>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:right;font-size:1em;font-weight:bold;color:#333;">פריט</th>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:center;font-size:1em;font-weight:bold;color:#333;">כמות</th>`;
    html += `<th style="border:1px solid #4CAF50;padding:8px;background:#c8e6c9;text-align:center;font-size:1em;font-weight:bold;color:#333;">ק"ג למארז</th>`;
    html += `</tr></thead><tbody>`;

    summaryArray.forEach((item, index) => {
      const itemKey = `pack7_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const ordersArray = Array.from(item.ordersMap.entries()).map(([orderName, custDes]) => ({
        orderName: orderName,
        custDes: custDes
      }));
      window.traysItemData[itemKey] = ordersArray;

      // Escape של תווים מיוחדים לשם הפריט
      const safePartDes = String(item.partDes || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');

      // מארז 7: param8 × 7
      const kgPerPack = (item.param8 || 0) * 7;

      html += '<tr>';
      html += `<td class="clickable-item" style="border:1px solid #ccc;padding:8px;text-align:right;font-size:0.85em;word-wrap:break-word;cursor:pointer;" onclick="openItemModal('${safePartDes}', '${itemKey}')">${item.partDes}</td>`;
      html += `<td class="clickable-item" style="border:1px solid #ccc;padding:8px;font-weight:bold;text-align:center;font-size:0.85em;cursor:pointer;" onclick="openItemModal('${safePartDes}', '${itemKey}')">${item.totalValue.toFixed(0)}</td>`;
      html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;font-size:0.85em;">${kgPerPack.toFixed(2)}</td>`;
      html += '</tr>';
    });

    html += '</tbody></table></div></div>';
  }
  
  html += '</div>';
  
  if (html === '<div style="width:100%;"></div>') {
    html = '<p style="text-align:center;padding:50px;color:#999;">לא נמצאו נתונים להצגה</p>';
  }
  
  container.innerHTML = html;
  window.traysData = categories;

  console.log('✅ דוח אריזה חמה - הושלם, HTML length:', html.length);
}

// מצב תצוגה טבלאית
let isTabularViewActive = false;

// מעבר בין תצוגה רגילה לטבלאית
function toggleTabularView() {
  const traysContainer = document.getElementById('traysContainer');
  const tabularContainer = document.getElementById('tabularViewContainer');
  const toggleBtn = document.getElementById('toggleTabularViewBtn');

  if (!traysContainer || !tabularContainer) return;

  isTabularViewActive = !isTabularViewActive;

  if (isTabularViewActive) {
    // הצג תצוגה טבלאית
    traysContainer.style.display = 'none';
    tabularContainer.style.display = 'block';
    toggleBtn.textContent = '📋 תצוגה רגילה';
    toggleBtn.style.background = '#2196F3';

    // יצירת התצוגה הטבלאית
    createTabularView();
  } else {
    // חזור לתצוגה רגילה
    traysContainer.style.display = 'block';
    tabularContainer.style.display = 'none';
    toggleBtn.textContent = '📊 תצוגה טבלאית';
    toggleBtn.style.background = '#4CAF50';
  }
}

// יצירת תצוגה טבלאית לפי קווי חלוקה
function createTabularView() {
  const container = document.getElementById('tabularViewContainer');
  if (!container || !window.allTraysData) {
    container.innerHTML = '<p style="text-align:center;padding:50px;color:#999;">אין נתונים להצגה</p>';
    return;
  }

  const data = window.allTraysData;

  // קבלת הסינונים הנוכחיים
  const branchFilter = document.getElementById('traysBranchFilter')?.value || '';
  const distrLineFilter = document.getElementById('traysDistrLineFilter')?.value || '';

  // סינון הנתונים
  let filteredData = data.filter(r => {
    const ct = String(r.CARTON_TYPE || r.cartonType || '').trim().toLowerCase();
    const pspec6 = String(r.PSPEC6 || r.pspec6 || '').trim().toLowerCase();
    const isHot = ct.includes('חם') || ct.includes('חמים') || pspec6.includes('חם') || pspec6.includes('חמים');
    return isHot;
  });

  if (branchFilter) {
    filteredData = filteredData.filter(r => String(r.BRANCHNAME || '').trim() === branchFilter);
  }
  if (distrLineFilter) {
    filteredData = filteredData.filter(r => String(r.DISTRLINEDES || '').trim() === distrLineFilter);
  }

  // מציאת כל קווי החלוקה הייחודיים - מיון לפי מספר הקו בסדר עולה
  const distrLinesMap = {};
  filteredData.forEach(r => {
    const des = String(r.DISTRLINEDES || '').trim();
    const code = String(r.DISTRLINECODE || r.distrLineCode || '').trim();
    if (des && !distrLinesMap[des]) {
      distrLinesMap[des] = parseInt(code) || 9999;
    }
  });
  const distrLines = Object.keys(distrLinesMap).sort((a, b) => distrLinesMap[a] - distrLinesMap[b]);

  // הפרדה למיכלים וחמגשיות
  const containerItems = {}; // מיכלים לפי קו חלוקה
  const trayItems = {}; // חמגשיות לפי קו חלוקה (מקובצות לפי שילוב פריטים)

  // קיבוץ חמגשיות לפי הזמנה וארוחה (כמו בדוח הרגיל)
  const traysByOrderMeal = {};

  filteredData.forEach(r => {
    const distrLine = String(r.DISTRLINEDES || '').trim() || 'ללא קו';
    const pm = String(r.PACKMETHODCODE || r.packMethodCode || '').trim().toLowerCase();
    const packDes = String(r.PACKDES || r.packDes || '').trim().toLowerCase();
    const pspec1 = String(r.PSPEC1 || r.pspec1 || '').trim().toLowerCase();
    const partDes = String(r.PARTDES || r.partDes || '').trim();
    const containers = parseFloat(r.CONTAINERS || r.containers || 0) || 0;
    const eatQuant = parseFloat(r.EATQUANT || r.eatQuant || 0) || 0;
    const orderName = String(r.ORDNAME || r.orderName || '').trim();
    const mealName = String(r.MEALNAME || r.mealName || '').trim() || 'ללא_ארוחה';

    // בדיקה אם זה חמגשית
    const isTray = pm.includes('חמגשית') || packDes.includes('חמגשית') || pspec1.includes('חמגשית');

    // זיהוי גודל חמגשית
    const isLargeTray = packDes.includes('גד') || packDes.includes('גדול') || packDes.includes('גדולה');

    if (isTray) {
      // חמגשית - קיבוץ לפי הזמנה, ארוחה וגודל
      const trayKey = `${orderName}|${mealName}|${isLargeTray ? 'large' : 'small'}|${distrLine}`;
      if (!traysByOrderMeal[trayKey]) {
        traysByOrderMeal[trayKey] = {
          distrLine,
          orderName,
          mealName,
          isLarge: isLargeTray,
          items: [],
          eatQuant: eatQuant
        };
      }
      traysByOrderMeal[trayKey].items.push(partDes);
    } else {
      // מיכל או מארז - בדיקה אם יש containers, תפזורת, או מארזים
      const pack5 = parseFloat(r.PACK5 || r.pack5 || 0) || 0;
      const pack7 = parseFloat(r.PACK7 || r.pack7 || 0) || 0;
      const hasContainers = containers > 0 || pspec1.includes('תפזורת') || pspec1.includes('סיפט');
      const hasPacks = pack5 > 0 || pack7 > 0;

      if (hasContainers || hasPacks) {
        if (!containerItems[distrLine]) containerItems[distrLine] = {};
        if (!containerItems[distrLine][partDes]) {
          containerItems[distrLine][partDes] = { containers: 0, pack5: 0, pack7: 0 };
        }
        if (hasContainers) {
          containerItems[distrLine][partDes].containers += containers > 0 ? containers : eatQuant;
        }
        containerItems[distrLine][partDes].pack5 += pack5;
        containerItems[distrLine][partDes].pack7 += pack7;
      }
    }
  });

  // יצירת שילובי חמגשיות לפי קו חלוקה - עם הפרדה לקטנה/גדולה
  Object.values(traysByOrderMeal).forEach(tray => {
    const distrLine = tray.distrLine;
    // יצירת שילוב פריטים ייחודי (בלי הגודל)
    const uniqueItems = [...new Set(tray.items)].sort().join('+');

    if (!trayItems[distrLine]) trayItems[distrLine] = {};
    if (!trayItems[distrLine][uniqueItems]) {
      trayItems[distrLine][uniqueItems] = { small: 0, large: 0 };
    }
    if (tray.isLarge) {
      trayItems[distrLine][uniqueItems].large += tray.eatQuant;
    } else {
      trayItems[distrLine][uniqueItems].small += tray.eatQuant;
    }
  });

  // מציאת כל הפריטים הייחודיים
  const allContainerProducts = new Set();
  const allTrayProducts = new Set();

  Object.values(containerItems).forEach(products => {
    Object.keys(products).forEach(p => allContainerProducts.add(p));
  });
  Object.values(trayItems).forEach(products => {
    Object.keys(products).forEach(p => allTrayProducts.add(p));
  });

  // מיון מיכלים - פריטים עם מארזים בתחתית
  const containerProductsList = [...allContainerProducts].sort((a, b) => {
    // בדיקה אם לפריט יש מארזים
    let aHasPacks = false, bHasPacks = false;
    distrLines.forEach(line => {
      const dataA = containerItems[line]?.[a];
      const dataB = containerItems[line]?.[b];
      if (dataA && (dataA.pack5 > 0 || dataA.pack7 > 0)) aHasPacks = true;
      if (dataB && (dataB.pack5 > 0 || dataB.pack7 > 0)) bHasPacks = true;
    });
    // פריטים עם מארזים בתחתית
    if (aHasPacks && !bHasPacks) return 1;
    if (!aHasPacks && bHasPacks) return -1;
    return a.localeCompare(b);
  });
  const trayProductsList = [...allTrayProducts].sort();

  let html = '<div style="display:flex;flex-wrap:wrap;gap:20px;justify-content:center;padding:20px;">';

  // טבלת מיכלים
  if (containerProductsList.length > 0) {
    html += '<div style="flex:1;min-width:400px;max-width:600px;">';
    html += '<h3 style="text-align:center;background:#4FC3F7;padding:10px;margin:0;border-radius:5px 5px 0 0;">פירוט מיכלים טבלאי</h3>';
    html += '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;border:1px solid #ccc;">';

    // כותרת עם קווי חלוקה - הוספת עמודה למארז קטן/גדול ועמודת סה"כ
    html += '<thead><tr style="background:#4FC3F7;">';
    html += '<th style="border:1px solid #ccc;padding:8px;text-align:right;min-width:150px;" colspan="2">פריט</th>';
    distrLines.forEach(line => {
      html += `<th style="border:1px solid #ccc;padding:8px;text-align:center;min-width:80px;">${line}</th>`;
    });
    html += '<th style="border:1px solid #ccc;padding:8px;text-align:center;min-width:80px;background:#FFD54F;">סה"כ</th>';
    html += '</tr></thead><tbody>';

    // שורות פריטים - רק שורות עם נתונים
    containerProductsList.forEach((product, idx) => {
      const bgColor = idx % 2 === 0 ? '#fff' : '#f5f5f5';

      // חישוב סה"כ לכל סוג עבור הפריט הזה
      let totalContainers = 0, totalPack5 = 0, totalPack7 = 0;
      distrLines.forEach(line => {
        const data = containerItems[line]?.[product];
        if (data) {
          totalContainers += data.containers || 0;
          totalPack5 += data.pack5 || 0;
          totalPack7 += data.pack7 || 0;
        }
      });

      // ספירת כמה שורות יש לפריט זה
      const rowCount = (totalContainers > 0 ? 1 : 0) + (totalPack5 > 0 ? 1 : 0) + (totalPack7 > 0 ? 1 : 0);
      if (rowCount === 0) return; // אין נתונים לפריט זה

      let isFirstRow = true;

      // שורה מיכלים - רק אם יש
      if (totalContainers > 0) {
        html += `<tr style="background:${bgColor};">`;
        html += `<td style="border:1px solid #ccc;padding:8px;text-align:right;font-weight:bold;"${rowCount > 1 ? ` rowspan="${rowCount}"` : ''}>${product}</td>`;
        html += `<td style="border:1px solid #ccc;padding:4px;text-align:center;font-size:0.85em;background:#e3f2fd;">מיכלים</td>`;
        distrLines.forEach(line => {
          const data = containerItems[line]?.[product];
          const qty = data ? data.containers : 0;
          html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;font-weight:bold;">${qty > 0 ? qty.toFixed(0) : ''}</td>`;
        });
        html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;font-weight:bold;background:#FFE082;">${totalContainers.toFixed(0)}</td>`;
        html += '</tr>';
        isFirstRow = false;
      }

      // שורה מארז 5 - רק אם יש
      if (totalPack5 > 0) {
        html += `<tr style="background:${bgColor};">`;
        if (isFirstRow) {
          html += `<td style="border:1px solid #ccc;padding:8px;text-align:right;font-weight:bold;"${rowCount > 1 ? ` rowspan="${rowCount}"` : ''}>${product}</td>`;
          isFirstRow = false;
        }
        html += `<td style="border:1px solid #ccc;padding:4px;text-align:center;font-size:0.85em;background:#c8e6c9;">מארז 5</td>`;
        distrLines.forEach(line => {
          const data = containerItems[line]?.[product];
          const qty = data ? data.pack5 : 0;
          html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;font-weight:bold;background:#e8f5e9;">${qty > 0 ? qty.toFixed(0) : ''}</td>`;
        });
        html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;font-weight:bold;background:#FFE082;">${totalPack5.toFixed(0)}</td>`;
        html += '</tr>';
      }

      // שורה מארז 7 - רק אם יש
      if (totalPack7 > 0) {
        html += `<tr style="background:${bgColor};">`;
        if (isFirstRow) {
          html += `<td style="border:1px solid #ccc;padding:8px;text-align:right;font-weight:bold;"${rowCount > 1 ? ` rowspan="${rowCount}"` : ''}>${product}</td>`;
        }
        html += `<td style="border:1px solid #ccc;padding:4px;text-align:center;font-size:0.85em;background:#fff9c4;">מארז 7</td>`;
        distrLines.forEach(line => {
          const data = containerItems[line]?.[product];
          const qty = data ? data.pack7 : 0;
          html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;font-weight:bold;background:#fffde7;">${qty > 0 ? qty.toFixed(0) : ''}</td>`;
        });
        html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;font-weight:bold;background:#FFE082;">${totalPack7.toFixed(0)}</td>`;
        html += '</tr>';
      }
    });

    html += '</tbody></table></div></div>';
  }

  // טבלת חמגשיות
  if (trayProductsList.length > 0) {
    html += '<div style="flex:1;min-width:400px;max-width:600px;">';
    html += '<h3 style="text-align:center;background:#4FC3F7;padding:10px;margin:0;border-radius:5px 5px 0 0;">פירוט חמגשיות טבלאי</h3>';
    html += '<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;border:1px solid #ccc;">';

    // כותרת עם קווי חלוקה ועמודת סה"כ
    html += '<thead><tr style="background:#4FC3F7;">';
    html += '<th style="border:1px solid #ccc;padding:8px;text-align:right;min-width:150px;" colspan="2">פריט</th>';
    distrLines.forEach(line => {
      html += `<th style="border:1px solid #ccc;padding:8px;text-align:center;min-width:80px;">${line}</th>`;
    });
    html += '<th style="border:1px solid #ccc;padding:8px;text-align:center;min-width:80px;background:#FFD54F;">סה"כ</th>';
    html += '</tr></thead><tbody>';

    // שורות פריטים - עם הפרדה לקטנה/גדולה
    trayProductsList.forEach((product, idx) => {
      const bgColor = idx % 2 === 0 ? '#fff' : '#f5f5f5';

      // חישוב סה"כ לכל גודל עבור הפריט הזה
      let totalSmall = 0, totalLarge = 0;
      distrLines.forEach(line => {
        const data = trayItems[line]?.[product];
        if (data) {
          totalSmall += data.small || 0;
          totalLarge += data.large || 0;
        }
      });

      // ספירת כמה שורות יש לפריט זה
      const rowCount = (totalSmall > 0 ? 1 : 0) + (totalLarge > 0 ? 1 : 0);
      if (rowCount === 0) return;

      let isFirstRow = true;

      // שורה חמגשית קטנה - רק אם יש
      if (totalSmall > 0) {
        html += `<tr style="background:${bgColor};">`;
        html += `<td style="border:1px solid #ccc;padding:8px;text-align:right;font-weight:bold;"${rowCount > 1 ? ` rowspan="${rowCount}"` : ''}>${product}</td>`;
        html += `<td style="border:1px solid #ccc;padding:4px;text-align:center;font-size:0.85em;background:#c8e6c9;">קטנה</td>`;
        distrLines.forEach(line => {
          const data = trayItems[line]?.[product];
          const qty = data ? data.small : 0;
          html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;font-weight:bold;background:#e8f5e9;">${qty > 0 ? qty.toFixed(0) : ''}</td>`;
        });
        html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;font-weight:bold;background:#FFE082;">${totalSmall.toFixed(0)}</td>`;
        html += '</tr>';
        isFirstRow = false;
      }

      // שורה חמגשית גדולה - רק אם יש
      if (totalLarge > 0) {
        html += `<tr style="background:${bgColor};">`;
        if (isFirstRow) {
          html += `<td style="border:1px solid #ccc;padding:8px;text-align:right;font-weight:bold;"${rowCount > 1 ? ` rowspan="${rowCount}"` : ''}>${product}</td>`;
        }
        html += `<td style="border:1px solid #ccc;padding:4px;text-align:center;font-size:0.85em;background:#fff9c4;">גדולה</td>`;
        distrLines.forEach(line => {
          const data = trayItems[line]?.[product];
          const qty = data ? data.large : 0;
          html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;font-weight:bold;background:#fffde7;">${qty > 0 ? qty.toFixed(0) : ''}</td>`;
        });
        html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;font-weight:bold;background:#FFE082;">${totalLarge.toFixed(0)}</td>`;
        html += '</tr>';
      }
    });

    html += '</tbody></table></div></div>';
  }

  html += '</div>';

  if (containerProductsList.length === 0 && trayProductsList.length === 0) {
    html = '<p style="text-align:center;padding:50px;color:#999;">אין נתונים להצגה בתצוגה טבלאית</p>';
  }

  container.innerHTML = html;
}

// דוח ייצור - ספירת מנות לפי פריט בודד בחמגשיות
function showProductionReport() {
  if (!window.allTraysData) {
    alert('אין נתונים להצגה');
    return;
  }

  const data = window.allTraysData;

  // קבלת הסינונים הנוכחיים
  const branchFilter = document.getElementById('traysBranchFilter')?.value || '';
  const distrLineFilter = document.getElementById('traysDistrLineFilter')?.value || '';

  // סינון הנתונים - רק פריטים חמים
  let filteredData = data.filter(r => {
    const ct = String(r.CARTON_TYPE || r.cartonType || '').trim().toLowerCase();
    const pspec6 = String(r.PSPEC6 || r.pspec6 || '').trim().toLowerCase();
    const isHot = ct.includes('חם') || ct.includes('חמים') || pspec6.includes('חם') || pspec6.includes('חמים');
    return isHot;
  });

  if (branchFilter) {
    filteredData = filteredData.filter(r => String(r.BRANCHNAME || '').trim() === branchFilter);
  }
  if (distrLineFilter) {
    filteredData = filteredData.filter(r => String(r.DISTRLINEDES || '').trim() === distrLineFilter);
  }

  // סינון רק חמגשיות
  const trayData = filteredData.filter(r => {
    const pm = String(r.PACKMETHODCODE || r.packMethodCode || '').trim().toLowerCase();
    const packDes = String(r.PACKDES || r.packDes || '').trim().toLowerCase();
    const pspec1 = String(r.PSPEC1 || r.pspec1 || '').trim().toLowerCase();
    return pm.includes('חמגשית') || packDes.includes('חמגשית') || pspec1.includes('חמגשית');
  });

  // ספירת מנות לפי פריט בודד
  // כל פריט (PARTDES) נספר עם הכמות (EATQUANT) שלו
  const itemPortions = {};

  trayData.forEach(r => {
    const partDes = String(r.PARTDES || r.partDes || '').trim();
    const eatQuant = parseFloat(r.EATQUANT || r.eatQuant || 0) || 0;

    if (!partDes) return;

    if (!itemPortions[partDes]) {
      itemPortions[partDes] = 0;
    }
    itemPortions[partDes] += eatQuant;
  });

  // יצירת HTML לדוח
  let html = '<div style="padding:20px;direction:rtl;">';
  html += '<h2 style="text-align:center;color:#4CAF50;font-weight:bold;font-size:1.5em;">🍱 דוח ייצור חמגשיות (ספירת מנות)</h2>';

  // טבלת פריטים וכמות מנות
  const sortedItems = Object.entries(itemPortions).sort((a, b) => a[0].localeCompare(b[0]));

  if (sortedItems.length > 0) {
    html += '<table style="width:100%;border-collapse:collapse;border:2px solid #4CAF50;margin-bottom:20px;">';
    html += '<thead><tr style="background:#4CAF50;">';
    html += '<th style="border:1px solid #4CAF50;padding:12px;text-align:right;font-size:1.2em;font-weight:bold;color:white;">פריט</th>';
    html += '<th style="border:1px solid #4CAF50;padding:12px;text-align:center;font-size:1.2em;font-weight:bold;color:white;">כמות מנות</th>';
    html += '</tr></thead><tbody>';

    let totalPortions = 0;
    sortedItems.forEach(([partDes, portions], idx) => {
      const bgColor = idx % 2 === 0 ? '#fff' : '#e8f5e9';
      const portionText = portions === 1 ? 'מנה אחת' : `${portions.toFixed(0)} מנות`;
      html += `<tr style="background:${bgColor};">`;
      html += `<td style="border:1px solid #c8e6c9;padding:10px;text-align:right;font-weight:bold;font-size:1em;">${partDes}</td>`;
      html += `<td style="border:1px solid #c8e6c9;padding:10px;text-align:center;font-weight:bold;font-size:1.1em;">${portionText}</td>`;
      html += '</tr>';
      totalPortions += portions;
    });

    html += `<tr style="background:#4CAF50;font-weight:bold;">`;
    html += `<td style="border:1px solid #4CAF50;padding:12px;text-align:right;font-size:1.2em;color:white;">סה"כ</td>`;
    html += `<td style="border:1px solid #4CAF50;padding:12px;text-align:center;font-size:1.3em;color:white;">${totalPortions.toFixed(0)} מנות</td>`;
    html += '</tr></tbody></table>';
  } else {
    html += '<p style="text-align:center;color:#666;font-size:1.1em;">לא נמצאו פריטי חמגשיות</p>';
  }

  html += '<div style="text-align:center;margin-top:20px;">';
  html += '<button onclick="downloadProductionReportPDF()" style="padding:10px 30px;font-size:1.1em;background:#4CAF50;color:white;border:none;border-radius:5px;cursor:pointer;margin-left:10px;">📄 הורד PDF</button>';
  html += '<button onclick="closeProductionReport()" style="padding:10px 30px;font-size:1.1em;background:#f44336;color:white;border:none;border-radius:5px;cursor:pointer;">✕ סגור</button>';
  html += '</div>';
  html += '</div>';

  // הצגה בחלון מודאל
  const modal = document.createElement('div');
  modal.id = 'productionReportModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:9999;overflow:auto;';
  modal.innerHTML = `<div style="background:white;margin:20px auto;max-width:900px;border-radius:10px;max-height:90vh;overflow:auto;">${html}</div>`;
  document.body.appendChild(modal);
}

// סגירת דוח ייצור
function closeProductionReport() {
  const modal = document.getElementById('productionReportModal');
  if (modal) {
    modal.remove();
  }
}

// הורדת דוח ייצור כ-PDF
function downloadProductionReportPDF() {
  const modal = document.getElementById('productionReportModal');
  if (!modal) {
    alert('אין דוח להורדה');
    return;
  }

  const content = modal.querySelector('div > div');
  if (!content) {
    alert('אין תוכן להורדה');
    return;
  }

  // יצירת חלון חדש להדפסה
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('לא ניתן לפתוח חלון חדש. אנא אפשר חלונות קופצים בדפדפן.');
    return;
  }

  const dateValue = document.getElementById('dateInput').value || new Date().toISOString().split('T')[0];

  // העתקת התוכן בלי הכפתורים
  const contentClone = content.cloneNode(true);
  const buttons = contentClone.querySelectorAll('button');
  buttons.forEach(btn => btn.remove());

  printWindow.document.open('text/html', 'replace');
  printWindow.document.write('<!DOCTYPE html>');
  printWindow.document.write('<html lang="he" dir="rtl">');
  printWindow.document.write('<head>');
  printWindow.document.write('<meta charset="UTF-8">');
  printWindow.document.write('<title>דוח ייצור - ' + dateValue + '</title>');
  printWindow.document.write('<style>');
  printWindow.document.write('@page { size: A4; margin: 15mm; }');
  printWindow.document.write('* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }');
  printWindow.document.write('body { font-family: Arial, sans-serif; direction: rtl; margin: 0; padding: 20px; font-size: 12pt; }');
  printWindow.document.write('h2 { text-align: center; color: #FF9800; margin-bottom: 20px; }');
  printWindow.document.write('h3 { padding: 10px; margin: 20px 0 0 0; border-radius: 5px 5px 0 0; }');
  printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-bottom: 20px; page-break-inside: auto; }');
  printWindow.document.write('th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }');
  printWindow.document.write('th { background-color: #e3f2fd; }');
  printWindow.document.write('tr { page-break-inside: avoid; }');
  printWindow.document.write('tr:nth-child(even) { background-color: #f5f5f5; }');
  printWindow.document.write('@media print { body { padding: 0; } }');
  printWindow.document.write('</style>');
  printWindow.document.write('</head>');
  printWindow.document.write('<body>');
  printWindow.document.write(contentClone.innerHTML);
  printWindow.document.write('<script>window.onload = function() { setTimeout(function() { window.print(); }, 300); };<\/script>');
  printWindow.document.write('</body>');
  printWindow.document.write('</html>');
  printWindow.document.close();
}

// הורדת CSV של הזמנות לשורה ספציפית בטבלת חמגשיות
function downloadTrayRowOrdersCSV(rowId, trayType) {
  const ordersMap = window[`${trayType}TrayOrdersMap`] || {};
  const orders = ordersMap[rowId] || [];
  
  if (orders.length === 0) {
    alert('אין הזמנות להורדה');
    return;
  }
  
  const trayName = trayType === 'small' ? 'חמגשית_קטנה' : 'חמגשית_גדולה';
  
  // יצירת CSV עם רשימת מספרי הזמנות
  let csv = '\uFEFFמספר הזמנה\n';
  orders.forEach(orderName => {
    csv += `"${orderName}"\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  
  const dateInput = document.getElementById('dateInput');
  const dateStr = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];
  link.download = `הזמנות_${trayName}_${rowId}_${dateStr}.csv`;
  
  link.click();
}

// דוח אלרגנים - סיכום מנות ללא אלרגני לפי קו חלוקה, לקוח, כשרות ושיטת אירוז
function createAllergensReport(data) {
  const container = document.getElementById('allergensContainer');
  
  if (!container) {
    console.error('❌ אלמנט לא נמצא לדוח אלרגנים');
    return;
  }
  
  if (!data || (Array.isArray(data) && data.length === 0) || (!Array.isArray(data) && Object.keys(data).length === 0)) {
    console.warn('⚠️ אין נתונים לדוח אלרגנים');
    container.innerHTML = '<p style="text-align:center;padding:50px;color:#999;">אין נתונים להצגה</p>';
    return;
  }
  
  // פונקציה לבדוק אם כל הפריטים החמים בהזמנה הם חמגשית
  const isOrderTrayOnly = (order) => {
    if (!order || !order.items) return false;

    let hasHotTray = false;
    let hasHotNonTray = false;

    order.items.forEach(item => {
      // בדיקה אם זה פריט חם
      const cartonType = String(item.cartonType || '').toLowerCase();
      const pspec6 = String(item.pspec6 || '').toLowerCase();
      const pspec3 = String(item.pspec3 || '').toLowerCase();
      const isHotItem = cartonType.includes('חם') || pspec6.includes('חם') || pspec3.includes('חם');

      if (isHotItem) {
        const packMethodCode = String(item.packMethodCode || '').toLowerCase();
        const packDes = String(item.packDes || '').toLowerCase();

        if (packMethodCode.includes('חמגשית') || packDes.includes('חמגשית')) {
          hasHotTray = true;
        } else if (packMethodCode || packDes) {
          hasHotNonTray = true;
        }
      }
    });

    // אם יש פריט חם שאינו חמגשית - זה תפזורת
    if (hasHotNonTray) return false;
    // רק אם כל הפריטים החמים הם חמגשית
    return hasHotTray;
  };

  // המרה לנתונים שטוחים - עם זיהוי שיטת אריזה ברמת ההזמנה
  let flatData = Array.isArray(data) ? data : Object.values(data).flatMap(order => {
    if (!order || !order.items || !Array.isArray(order.items)) {
      return [];
    }

    // קביעת שיטת אריזה לפי כל הפריטים החמים בהזמנה
    const orderIsTrayOnly = isOrderTrayOnly(order);

    return order.items.map(item => ({
      ...item,
      ORDNAME: order.orderName || '',
      CUSTDES: order.custDes || '',
      CODEDES: order.codeDes || '',
      CUSTNAME: order.custName || '',
      BRANCHNAME: order.branchName || '',
      PSPEC1: String(item.pspec1 || '').trim(),
      SPEC1: String(order.spec1 || '').trim(),
      SPEC2: String(order.spec2 || '').trim(),
      DISTRLINECODE: String(order.distrLineCode || item.distrLineCode || '').trim(),
      DISTRLINEDES: String(order.distrLineDes || item.distrLineDes || '').trim(),
      PACKMETHODCODE: String(item.packMethodCode || '').trim(),
      PACKDES: String(item.packDes || '').trim(),
      EATQUANT: parseFloat(item.eatQuant || 0) || 0,
      ORDER_IS_TRAY_ONLY: orderIsTrayOnly // שיטת אריזה ברמת ההזמנה
    }));
  });
  
  // סינון רק פריטים ללא אלרגנים
  const allergenFreeData = flatData.filter(r => {
    const pspec1 = String(r.PSPEC1 || '').trim().toLowerCase();
    return pspec1.includes('ללא אלרגני') || pspec1.includes('לא אלרגני');
  });
  
  console.log('📊 דוח אלרגנים - סה"כ נתונים:', flatData.length, 'פריטים ללא אלרגנים:', allergenFreeData.length);
  
  if (allergenFreeData.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:50px;color:#999;">לא נמצאו פריטים ללא אלרגנים</p>';
    return;
  }
  
  // קיבוץ לפי: לקוח (SPEC1), כשרות (SPEC2), קו חלוקה (DISTRLINECODE), שיטת אירוז (PACKMETHODCODE/PACKDES)
  const summary = {};
  
  allergenFreeData.forEach(row => {
    const spec1 = String(row.SPEC1 || '').trim() || 'ללא סוג לקוח';
    const spec2 = String(row.SPEC2 || '').trim() || 'ללא כשרות';
    const distrLineCode = String(row.DISTRLINECODE || '').trim() || 'ללא קו';
    const distrLineDes = String(row.DISTRLINEDES || '').trim() || 'ללא תיאור';
    
    // קביעת שיטת אירוז
    const packMethod = String(row.PACKMETHODCODE || '').trim();
    const packDes = String(row.PACKDES || '').trim().toLowerCase();
    const pspec1 = String(row.PSPEC1 || '').trim().toLowerCase();
    const isVeg = pspec1.includes('ירק');
    let packingMethod = 'אחר';

    if (packMethod.includes('חמגשית') || packDes.includes('חמגשית')) {
      packingMethod = 'חמגשית';
    } else if (packMethod.includes('תפזורת') || packDes.includes('תפזורת') || packMethod.includes('סיפט') || packDes.includes('סיפט')) {
      packingMethod = 'תפזורת';
    } else if (packDes.includes('גסטרונום') || packMethod.includes('גסטרונום')) {
      // ירק שאריזתו גסטרונום - מתייחסים אליו כתפזורת
      packingMethod = isVeg ? 'תפזורת' : 'גסטרונום';
    }
    
    // יצירת מפתח ייחודי
    const key = `${spec1}|${spec2}|${distrLineCode}|${packingMethod}`;
    
    if (!summary[key]) {
      summary[key] = {
        spec1: spec1,
        spec2: spec2,
        distrLineCode: distrLineCode,
        distrLineDes: distrLineDes,
        packingMethod: packingMethod,
        totalQuantity: 0
      };
    }
    
    summary[key].totalQuantity += row.EATQUANT || 0;
  });
  
  // קיבוץ לפי לקוח + כשרות + שיטת אירוז
  const groupedByCustomer = {};
  
  Object.values(summary).forEach(item => {
    const customerKey = `${item.spec1}|${item.spec2}|${item.packingMethod}`;
    if (!groupedByCustomer[customerKey]) {
      groupedByCustomer[customerKey] = {
        spec1: item.spec1,
        spec2: item.spec2,
        packingMethod: item.packingMethod,
        lines: []
      };
    }
    groupedByCustomer[customerKey].lines.push({
      distrLineCode: item.distrLineCode,
      distrLineDes: item.distrLineDes,
      totalQuantity: item.totalQuantity
    });
  });
  
  // קיבוץ לפי הזמנה (לקוח) לכל כשרות ושיטת אריזה
  // המבנה: ordersByCategory[כשרות][שיטת אריזה][מספר הזמנה]
  const ordersByCategory = {
    badatz: { tray: {}, tafzoret: {} },
    chabad: { tray: {}, tafzoret: {} },
    other: { tray: {}, tafzoret: {} }
  };

  allergenFreeData.forEach(row => {
    const spec2Lower = String(row.SPEC2 || '').toLowerCase();
    const ordName = String(row.ORDNAME || '').trim();
    const custDes = String(row.CUSTDES || '').trim();
    const codeDes = String(row.CODEDES || '').trim();
    const custName = String(row.CUSTNAME || '').trim();
    const distrLineCode = String(row.DISTRLINECODE || '').trim();
    const distrLineDes = String(row.DISTRLINEDES || '').trim();
    const quantity = row.EATQUANT || 0;

    // קביעת כשרות
    let kosherType = 'other';
    if (spec2Lower.includes('חבד') || spec2Lower.includes('חב"ד') || spec2Lower.includes('חב\'ד') ||
        spec2Lower.includes('נחלת') || spec2Lower.includes('ירוסלבסקי') || spec2Lower.includes('ביסטריצקי')) {
      kosherType = 'chabad';
    } else if (spec2Lower.includes('בדץ') || spec2Lower.includes('בד"ץ') || spec2Lower.includes('ירושלם') ||
               spec2Lower.includes('ירושלים') || spec2Lower.includes('badatz')) {
      kosherType = 'badatz';
    }

    // קביעת שיטת אריזה - לפי כל הפריטים החמים בהזמנה (לא רק הפריט האלרגני)
    const packingType = row.ORDER_IS_TRAY_ONLY ? 'tray' : 'tafzoret';

    // קיבוץ לפי מספר הזמנה
    if (!ordersByCategory[kosherType][packingType][ordName]) {
      ordersByCategory[kosherType][packingType][ordName] = {
        ordName: ordName,
        distrLineCode: distrLineCode,
        distrLineDes: distrLineDes,
        custName: custName,
        codeDes: codeDes,
        quantity: 0
      };
    }
    ordersByCategory[kosherType][packingType][ordName].quantity += quantity;
  });

  // המרה למערכים וחישוב סיכומים
  const sortByLine = (orders) => Object.values(orders).sort((a, b) => a.distrLineCode.localeCompare(b.distrLineCode));

  const badatzTray = sortByLine(ordersByCategory.badatz.tray);
  const badatzTafzoret = sortByLine(ordersByCategory.badatz.tafzoret);
  const chabadTray = sortByLine(ordersByCategory.chabad.tray);
  const chabadTafzoret = sortByLine(ordersByCategory.chabad.tafzoret);
  const otherTray = sortByLine(ordersByCategory.other.tray);
  const otherTafzoret = sortByLine(ordersByCategory.other.tafzoret);

  const calcTotal = (orders) => orders.reduce((sum, o) => sum + o.quantity, 0);

  const totalBadatzTray = calcTotal(badatzTray);
  const totalBadatzTafzoret = calcTotal(badatzTafzoret);
  const totalChabadTray = calcTotal(chabadTray);
  const totalChabadTafzoret = calcTotal(chabadTafzoret);
  const totalOtherTray = calcTotal(otherTray);
  const totalOtherTafzoret = calcTotal(otherTafzoret);

  // קיבוץ ההזמנות לפי קו חלוקה בתוך כל כשרות
  const groupOrdersByLine = (orders) => {
    const byLine = {};
    orders.forEach(order => {
      const lineKey = order.distrLineCode || 'ללא קו';
      if (!byLine[lineKey]) {
        byLine[lineKey] = {
          distrLineCode: order.distrLineCode,
          distrLineDes: order.distrLineDes,
          orders: []
        };
      }
      byLine[lineKey].orders.push(order);
    });
    // מיון לפי קוד קו
    return Object.values(byLine).sort((a, b) => {
      const aCode = String(a.distrLineCode || '');
      const bCode = String(b.distrLineCode || '');
      return aCode.localeCompare(bCode);
    });
  };

  // פונקציה ליצירת קטגוריה שלמה (בד"ץ/חב"ד) עם טבלאות לפי קו
  const createKosherSection = (title, orders, total, bgColor, borderColor) => {
    if (orders.length === 0) return '';

    const lineGroups = groupOrdersByLine(orders);

    let sectionHtml = `<div style="display:inline-block;margin:10px;vertical-align:top;">`;

    // כותרת ראשית עם סה"כ
    sectionHtml += `<div style="background:${bgColor};padding:8px 15px;border:2px solid ${borderColor};border-radius:5px;margin-bottom:10px;">`;
    sectionHtml += `<h3 style="margin:0;text-align:center;color:${borderColor};font-size:1.1em;font-weight:bold;">${title} - סה"כ: ${total.toFixed(0)}</h3>`;
    sectionHtml += `</div>`;

    // טבלאות לפי קו חלוקה
    lineGroups.forEach(lineGroup => {
      const lineTitle = lineGroup.distrLineDes || lineGroup.distrLineCode || 'ללא קו';
      // חישוב סה"כ כמות לקו זה
      const lineTotal = lineGroup.orders.reduce((sum, order) => sum + order.quantity, 0);

      sectionHtml += `<table style="border-collapse:collapse;border:1px solid ${borderColor};font-size:0.85em;margin-bottom:10px;">`;
      sectionHtml += `<thead>`;
      sectionHtml += `<tr style="background:${bgColor};">`;
      sectionHtml += `<th colspan="3" style="border:1px solid ${borderColor};padding:5px 8px;text-align:right;">`;
      sectionHtml += `<strong style="color:#000;font-size:0.9em;">${lineTitle} - ${lineGroup.distrLineCode} (סה"כ: ${lineTotal.toFixed(0)})</strong>`;
      sectionHtml += `</th></tr>`;
      sectionHtml += `<tr style="background:#f9f9f9;">`;
      sectionHtml += `<th style="border:1px solid #ccc;padding:4px;text-align:center;width:45px;">כמות</th>`;
      sectionHtml += `<th style="border:1px solid #ccc;padding:4px;text-align:right;">אתר</th>`;
      sectionHtml += `<th style="border:1px solid #ccc;padding:4px;text-align:right;">לקוח</th>`;
      sectionHtml += `</tr></thead><tbody>`;

      lineGroup.orders.forEach(order => {
        sectionHtml += `<tr>`;
        sectionHtml += `<td style="border:1px solid #ccc;padding:3px;text-align:center;font-weight:bold;">${order.quantity.toFixed(0)}</td>`;
        sectionHtml += `<td style="border:1px solid #ccc;padding:3px;text-align:right;">${order.codeDes}</td>`;
        sectionHtml += `<td style="border:1px solid #ccc;padding:3px;text-align:right;">${order.custName}</td>`;
        sectionHtml += `</tr>`;
      });

      sectionHtml += `</tbody></table>`;
    });

    sectionHtml += `</div>`;
    return sectionHtml;
  };

  // יצירת HTML - הפרדה לפי חמגשית ותפזורת
  let html = '';

  // === חלק חמגשית ===
  const hasTrayData = badatzTray.length > 0 || chabadTray.length > 0 || otherTray.length > 0;
  if (hasTrayData) {
    html += '<div style="width:100%;margin-bottom:30px;">';
    html += '<h2 style="text-align:center;background:#c8e6c9;padding:15px;margin:0 0 20px 0;border:2px solid #4caf50;border-radius:8px;color:#2e7d32;">🍽️ חמגשית</h2>';
    html += '<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:40px;padding:10px 20px;">';

    // בד"ץ חמגשית
    html += createKosherSection('אלרגני בד"ץ חמגשית', badatzTray, totalBadatzTray, '#e3f2fd', '#1976d2');

    // חב"ד חמגשית
    html += createKosherSection('אלרגני חב"ד חמגשית', chabadTray, totalChabadTray, '#fff3e0', '#f57c00');

    // אחר חמגשית (אם יש)
    html += createKosherSection('אלרגני אחר חמגשית', otherTray, totalOtherTray, '#f5f5f5', '#757575');

    html += '</div></div>';
  }

  // === חלק תפזורת ===
  const hasTafzoretData = badatzTafzoret.length > 0 || chabadTafzoret.length > 0 || otherTafzoret.length > 0;
  if (hasTafzoretData) {
    html += '<div style="width:100%;">';
    html += '<h2 style="text-align:center;background:#bbdefb;padding:15px;margin:0 0 20px 0;border:2px solid #1976d2;border-radius:8px;color:#0d47a1;">📦 תפזורת</h2>';
    html += '<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:40px;padding:10px 20px;">';

    // בד"ץ תפזורת
    html += createKosherSection('אלרגני בד"ץ תפזורת', badatzTafzoret, totalBadatzTafzoret, '#e3f2fd', '#1976d2');

    // חב"ד תפזורת
    html += createKosherSection('אלרגני חב"ד תפזורת', chabadTafzoret, totalChabadTafzoret, '#fff3e0', '#f57c00');

    // אחר תפזורת (אם יש)
    html += createKosherSection('אלרגני אחר תפזורת', otherTafzoret, totalOtherTafzoret, '#f5f5f5', '#757575');

    html += '</div></div>';
  }

  if (!hasTrayData && !hasTafzoretData) {
    html = '<p style="text-align:center;padding:50px;color:#999;">לא נמצאו פריטים ללא אלרגנים</p>';
  }

  container.innerHTML = html;

  const totalOrders = badatzTray.length + badatzTafzoret.length + chabadTray.length + chabadTafzoret.length + otherTray.length + otherTafzoret.length;
  const totalQuantity = totalBadatzTray + totalBadatzTafzoret + totalChabadTray + totalChabadTafzoret + totalOtherTray + totalOtherTafzoret;
  console.log('✅ דוח אלרגנים - הושלם, סה"כ הזמנות:', totalOrders, 'סה"כ מנות:', totalQuantity);
}

// הדפסת דוח אלרגנים
function printAllergensReport() {
  const container = document.getElementById('allergensContainer');
  if (!container) {
    alert('אין נתונים להדפסה');
    return;
  }

  const printWindow = window.open('', '_blank');
  printWindow.document.write('<html dir="rtl"><head><title>דוח אלרגנים</title>');
  printWindow.document.write('<style>');
  printWindow.document.write('@page { size: A4 landscape; margin: 8mm; }');
  printWindow.document.write('* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }');
  printWindow.document.write('body { font-family: Arial, sans-serif; direction: rtl; margin: 0; padding: 10px; }');
  printWindow.document.write('h2 { text-align: center; margin: 5px 0 15px 0; font-size: 16px; }');

  // כותרות חמגשית/תפזורת
  printWindow.document.write('.section-title { text-align: center; padding: 8px; margin: 10px 0; border-radius: 5px; font-size: 14px; font-weight: bold; }');

  // מיכל לטבלאות - 4 עמודות
  printWindow.document.write('.tables-container { display: flex; flex-wrap: wrap; justify-content: flex-start; gap: 5px; }');
  printWindow.document.write('.table-block { width: 24%; box-sizing: border-box; break-inside: avoid; page-break-inside: avoid; }');

  // טבלאות - גופן קטן יותר ל-4 עמודות
  printWindow.document.write('table { border-collapse: collapse; width: 100%; margin-bottom: 5px; font-size: 8px; }');
  printWindow.document.write('th, td { border: 1px solid #999; padding: 2px 3px; text-align: right; }');
  printWindow.document.write('th { background: #e0e0e0 !important; font-weight: bold; }');
  printWindow.document.write('thead { display: table-header-group; }');
  printWindow.document.write('tr { page-break-inside: avoid; break-inside: avoid; }');

  // כותרות קטגוריות (בד"ץ/חב"ד)
  printWindow.document.write('.category-header { padding: 5px 8px; margin-bottom: 5px; border-radius: 4px; font-weight: bold; font-size: 11px; }');

  // מניעת שבירת טבלאות באמצע
  printWindow.document.write('@media print {');
  printWindow.document.write('  .table-block { break-inside: avoid !important; page-break-inside: avoid !important; }');
  printWindow.document.write('  table { break-inside: avoid !important; page-break-inside: avoid !important; }');
  printWindow.document.write('  tr { break-inside: avoid !important; }');
  printWindow.document.write('}');

  printWindow.document.write('</style></head><body>');
  printWindow.document.write('<h2>דוח אלרגנים</h2>');

  // עיבוד התוכן - שינוי מבנה ל-3 עמודות
  let content = container.innerHTML;

  // החלפת ה-inline-block ב-class שלנו
  content = content.replace(/display:\s*inline-block[^"']*/g, '');
  content = content.replace(/style="[^"]*margin:\s*10px[^"]*vertical-align:\s*top[^"]*"/g, 'class="table-block"');

  // עדכון גודל הטבלאות
  content = content.replace(/style="[^"]*display:\s*flex[^"]*flex-wrap:\s*wrap[^"]*justify-content:\s*center[^"]*gap:\s*40px[^"]*padding[^"]*"/g, 'class="tables-container"');

  printWindow.document.write(content);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 500);
}

// הורדת רשימת מספרי הזמנות לקבוצה מסוימת
function downloadOrderNames(groupIndex) {
  if (!window.traysData || !window.traysData[groupIndex]) {
    alert('אין נתונים להורדה');
    return;
  }
  
  const group = window.traysData[groupIndex];
  const orderNames = group.orderNames || [];
  
  if (orderNames.length === 0) {
    alert('אין מספרי הזמנות להורדה');
    return;
  }
  
  // יצירת CSV עם רשימת מספרי הזמנות
  let csv = '\uFEFFמספר הזמנה\n';
  orderNames.forEach(orderName => {
    csv += `"${orderName}"\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  
  // שם הקובץ עם פרטי הקבוצה
  const itemsDesc = group.items.map(item => item.partDes).join('_').substring(0, 30);
  link.download = `orders_${itemsDesc}_${document.getElementById('dateInput').value}.csv`;
  link.click();
}

// דוח מיכלים - תפזורת/סיפט
function createContainersReport(data) {
  const container = document.getElementById('containersContainer');
  const branchFilter = document.getElementById('containersBranchFilter');
  
  // המרה לנתונים שטוחים
  const flatData = Array.isArray(data) ? data : Object.values(data).flatMap(order => 
    order.items.map(item => ({
      ...item,
      BRANCHNAME: order.branchName,
      PACKMETHODCODE: item.packMethodCode || '',
      PACKDES: item.packDes || '',
      CONTAINERS: item.containers || '',
      PACK5: parseFloat(item.pack5) || 0,
      PACK7: parseFloat(item.pack7) || 0,
      PARTDES: item.partDes || ''
    }))
  );
  
  // איסוף סניפים ייחודיים
  const branches = [...new Set(flatData.map(r => r.BRANCHNAME || '').filter(Boolean))].sort();
  branchFilter.innerHTML = '<option value="">הכל</option>';
  branches.forEach(branch => {
    const option = document.createElement('option');
    option.value = branch;
    option.textContent = branch;
    branchFilter.appendChild(option);
  });
  
  // שמירת נתונים מקוריים
  window.allContainersData = flatData;
  
  // הצגה ראשונית
  applyContainersFilters();
}

function applyContainersFilters() {
  const container = document.getElementById('containersContainer');
  const branchFilter = document.getElementById('containersBranchFilter');
  const flatData = window.allContainersData || [];
  
  // סינון לפי סניף
  let filteredData = flatData;
  if (branchFilter.value) {
    filteredData = filteredData.filter(r => String(r.BRANCHNAME) === branchFilter.value);
  }
  
  // סינון רק תפזורת/סיפט (לא חמגשית 101)
  filteredData = filteredData.filter(r => {
    const packMethod = String(r.PACKMETHODCODE || r.packMethodCode || '').trim();
    return packMethod !== 'חמגשית 101' && !packMethod.includes('חמגשית 101');
  });
  
  // קיבוץ לפי תיאור מיכל (PACKDES) ופריט
  const summary = {};
  filteredData.forEach(row => {
    const packDes = String(row.PACKDES || row.packDes || '').trim();
    const partDes = String(row.PARTDES || row.partDes || '').trim();
    const key = `${packDes}|${partDes}`;
    
    if (!summary[key]) {
      summary[key] = {
        packDes: packDes || 'ללא תיאור',
        partDes: partDes,
        totalContainers: 0,
        totalPack5: 0,
        totalPack7: 0
      };
    }
    
    summary[key].totalContainers += parseFloat(row.CONTAINERS || row.containers || 0) || 0;
    summary[key].totalPack5 += parseFloat(row.PACK5 || row.pack5 || 0) || 0;
    summary[key].totalPack7 += parseFloat(row.PACK7 || row.pack7 || 0) || 0;
  });
  
  const summaryArray = Object.values(summary).sort((a, b) => {
    return (a.packDes || '').localeCompare(b.packDes || '');
  });
  
  // יצירת טבלה
  let html = '<table><thead><tr>';
  html += '<th>תיאור מיכל</th><th>תיאור מוצר</th><th>כמות מיכלים</th><th>סה"כ מארז 5</th><th>סה"כ מארז 7</th>';
  html += '</tr></thead><tbody>';
  
  let grandTotalContainers = 0;
  let grandTotalPack5 = 0;
  let grandTotalPack7 = 0;
  summaryArray.forEach(item => {
    html += '<tr>';
    html += `<td>${item.packDes}</td>`;
    html += `<td>${item.partDes}</td>`;
    html += `<td style="font-weight:bold;">${item.totalContainers > 0 ? item.totalContainers.toFixed(0) : ''}</td>`;
    html += `<td style="font-weight:bold;">${item.totalPack5 > 0 ? item.totalPack5.toFixed(0) : ''}</td>`;
    html += `<td style="font-weight:bold;">${item.totalPack7 > 0 ? item.totalPack7.toFixed(0) : ''}</td>`;
    html += '</tr>';
    grandTotalContainers += item.totalContainers;
    grandTotalPack5 += item.totalPack5;
    grandTotalPack7 += item.totalPack7;
  });
  
  html += '<tr style="background:#e8f5e9;font-weight:bold;">';
  html += '<td colspan="2">סה"כ כללי</td>';
  html += `<td>${grandTotalContainers > 0 ? grandTotalContainers.toFixed(0) : ''}</td>`;
  html += `<td>${grandTotalPack5 > 0 ? grandTotalPack5.toFixed(0) : ''}</td>`;
  html += `<td>${grandTotalPack7 > 0 ? grandTotalPack7.toFixed(0) : ''}</td>`;
  html += '</tr>';
  html += '</tbody></table>';
  
  container.innerHTML = html;
  window.containersData = summaryArray;
}

// דוח מדבקות - לפי קו חלוקה וסדר הפצה
function createLabelsReport(data, labelType = 'hot') {
  const isHot = labelType === 'hot';
  const suffix = isHot ? 'Hot' : 'Cold';
  const container = document.getElementById('labelsContainer' + suffix);
  const distrLineSelect = document.getElementById('distrLineFilter' + suffix);
  const packingMethodSelect = document.getElementById('packingMethodFilter' + suffix);
  const labelsMode = isHot ? 'hot' : 'cold'; // קבוע לפי סוג הטאב
  
  // אם זה NoSQL, המרה לנתונים שטוחים
  const orders = Array.isArray(data) ? null : data;
  const flatData = orders ? Object.values(orders).flatMap(order => 
    order.items.map(item => ({
      ...item,
      ORDNAME: order.orderName,
      DISTRLINECODE: order.distrLineCode,
      DISTRLINEDES: order.distrLineDes,
      PRIT_DISTRORDER: order.pritDistrOrder,
      CODEDES: order.codeDes,
      CUSTDES: order.custDes,
      ADDRESS: order.address,
      STATE: order.state,
      PHONENUM: order.phoneNum,
      EATQUANT: order.eatQuant,
      SPEC2: order.spec2,
      PSPEC2: item.pspec2
    }))
  ) : data;
  
  // איסוף קווי חלוקה ייחודיים - עם תיאור
  const distrLinesMap = new Map();
  flatData.forEach(r => {
    const code = String(r.DISTRLINECODE || '').trim();
    const des = String(r.DISTRLINEDES || '').trim();
    if (code && !distrLinesMap.has(code)) {
      distrLinesMap.set(code, des || code);
    }
  });
  const distrLinesArray = Array.from(distrLinesMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  distrLineSelect.innerHTML = '<option value="">הכל</option>';
  distrLinesArray.forEach(([code, des]) => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = des;
    distrLineSelect.appendChild(option);
  });
  
  // שיטת אריזה - כעת עם אופציות קבועות: חמגשיות, גסטרונום בלבד, תפזורת
  // האופציות כבר מוגדרות ב-HTML

  // איסוף כשרויות ייחודיות (רק לחמים)
  const kashrutSelect = document.getElementById('kashrutFilter' + suffix);
  const customerTypeSelect = document.getElementById('customerTypeFilter' + suffix);
  // סוג מוסד (רק לקרים)
  const institutionTypeSelect = document.getElementById('institutionTypeFilter' + suffix);

  if (isHot && kashrutSelect) {
    const kashrutSet = new Set();
    if (orders) {
      Object.values(orders).forEach(order => {
        // כשרות מגיעה מ-SPEC2 או PSPEC2
        const kashrut = order.spec2 || '';
        if (kashrut) kashrutSet.add(kashrut);
      });
    } else {
      flatData.forEach(r => {
        const kashrut = r.SPEC2 || '';
        if (kashrut) kashrutSet.add(kashrut);
      });
    }

    kashrutSelect.innerHTML = '<option value="">הכל</option>';
    Array.from(kashrutSet).sort().forEach(kashrut => {
      const option = document.createElement('option');
      option.value = kashrut;
      option.textContent = kashrut;
      kashrutSelect.appendChild(option);
    });
  }
  
  // בורר סדר מיון
  const sortModeSelect = document.getElementById('labelsSortModeFilter' + suffix);
  // שדה חיפוש
  const searchInput = document.getElementById('labelsSearchInput' + suffix);

  // פונקציה לסינון
  const applyFilters = () => {
    const selectedLine = distrLineSelect.value;
    const selectedPackingMethod = packingMethodSelect.value;
    const sortMode = sortModeSelect ? sortModeSelect.value : 'distribution';
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const selectedCustomerType = customerTypeSelect ? customerTypeSelect.value : '';
    const selectedKashrut = kashrutSelect ? kashrutSelect.value : '';
    const selectedInstitutionType = institutionTypeSelect ? institutionTypeSelect.value : '';

    if (orders) {
      // עבודה עם מבנה NoSQL
      let filteredOrders = orders;

      if (selectedLine) {
        filteredOrders = Object.fromEntries(Object.entries(filteredOrders).filter(([key, order]) =>
          order.distrLineCode === selectedLine
        ));
      }

      // סינון לפי שיטת אריזה (חמגשיות / גסטרונום בלבד / תפזורת)
      // בודקים רק פריטים חמים! (אותה לוגיקה כמו isTrayOnlyOrder)
      if (selectedPackingMethod) {
        filteredOrders = Object.fromEntries(Object.entries(filteredOrders).filter(([key, order]) => {
          // בדיקת בטיחות
          if (!order || !order.items || !Array.isArray(order.items)) return false;

          // בדיקת שיטת אריזה של פריטים חמים בלבד
          let hasHotTray = false;      // יש פריט חם שהוא חמגשית
          let hasHotGastronorm = false; // יש פריט חם שהוא גסטרונום (לא חמגשית)
          let hasHotLoose = false;     // יש פריט חם תפזורת (לא חמגשית ולא גסטרונום)

          order.items.forEach(item => {
            // בדיקה אם זה פריט חם - משתמשים ב-DEFINITIONS אם קיים
            const isHotItem = (typeof DEFINITIONS !== 'undefined' && DEFINITIONS.isHotItem)
              ? DEFINITIONS.isHotItem(item)
              : (String(item.cartonType || '').includes('חם') ||
                 String(item.pspec6 || '').includes('חם') ||
                 String(item.pspec3 || '').includes('חם'));

            // רק פריטים חמים רלוונטיים לסינון
            if (!isHotItem) return;

            const packMethodCode = String(item.packMethodCode || '').toLowerCase();
            const packDes = String(item.packDes || '').toLowerCase();
            const pspec1 = String(item.pspec1 || '').toLowerCase();

            // זיהוי סוג אריזה - סדר עדיפות: חמגשית > גסטרונום > תפזורת
            // ירק שאריזתו גסטרונום - מתייחסים אליו כתפזורת
            const isVeggie = pspec1.includes('ירק');
            const isTrayItem = packMethodCode.includes('חמגשית') || packDes.includes('חמגשית');
            const isGastronormRaw = packDes.includes('גסטרונום') || packDes.includes('גסטרו') || pspec1.includes('גסטרונום');
            const isGastronormItem = isGastronormRaw && !isVeggie;

            if (isTrayItem) {
              hasHotTray = true;
            } else if (isGastronormItem) {
              hasHotGastronorm = true;
            } else {
              // פריט חם שאינו חמגשית ואינו גסטרונום = תפזורת
              hasHotLoose = true;
            }
          });

          // אם אין פריטים חמים כלל, לא להציג
          if (!hasHotTray && !hasHotGastronorm && !hasHotLoose) return false;

          if (selectedPackingMethod === 'tray') {
            // חמגשיות - כל הפריטים החמים הם חמגשית בלבד (אין גסטרונום ואין תפזורת)
            return hasHotTray && !hasHotGastronorm && !hasHotLoose;
          } else if (selectedPackingMethod === 'gastronorm') {
            // גסטרונום בלבד - יש גסטרונום חם, ללא חמגשית
            return hasHotGastronorm && !hasHotTray;
          } else if (selectedPackingMethod === 'loose') {
            // תפזורת - יש תפזורת או גסטרונום, אבל לא חמגשית בלבד
            // (כלומר: לא כל הפריטים הם חמגשית)
            return (hasHotLoose || hasHotGastronorm) && !(hasHotTray && !hasHotGastronorm && !hasHotLoose);
          }
          return true;
        }));
      }

      // סינון לפי סוג לקוח (מילגם / לא מילגם / פרטי)
      if (selectedCustomerType) {
        filteredOrders = Object.fromEntries(Object.entries(filteredOrders).filter(([key, order]) => {
          const spec1 = (order.spec1 || '').toLowerCase();
          const isMilgam = spec1.includes('מילגם');

          if (selectedCustomerType === 'milgam') {
            return isMilgam;
          } else if (selectedCustomerType === 'notMilgam' || selectedCustomerType === 'private') {
            return !isMilgam;
          }
          return true;
        }));
      }

      // סינון לפי סוג מוסד (גן / בית ספר) - לפי PRIT_CLASSNAME
      if (selectedInstitutionType) {
        filteredOrders = Object.fromEntries(Object.entries(filteredOrders).filter(([key, order]) => {
          const pritClassname = (order.pritClassname || '').toLowerCase();
          const isGan = pritClassname.includes('גן');

          if (selectedInstitutionType === 'gan') {
            return isGan;
          } else if (selectedInstitutionType === 'school') {
            return !isGan;
          }
          return true;
        }));
      }

      // סינון לפי כשרות
      if (selectedKashrut) {
        filteredOrders = Object.fromEntries(Object.entries(filteredOrders).filter(([key, order]) => {
          return order.spec2 === selectedKashrut;
        }));
      }

      // סינון לפי חיפוש - שם מוסד או מספר לקוח
      if (searchTerm) {
        filteredOrders = Object.fromEntries(Object.entries(filteredOrders).filter(([key, order]) => {
          const custDes = String(order.custDes || '').toLowerCase();
          const custName = String(order.custName || '').toLowerCase();
          const codeDes = String(order.codeDes || '').toLowerCase();
          return custDes.includes(searchTerm) || custName.includes(searchTerm) || codeDes.includes(searchTerm);
        }));
      }

      renderLabelsTableNoSQL(filteredOrders, container, labelsMode, sortMode, isHot);
    } else {
      let filtered = flatData;
      if (selectedLine) {
        filtered = filtered.filter(r => r.DISTRLINECODE === selectedLine);
      }

      // סינון לפי שיטת אריזה (חמגשיות / גסטרונום בלבד / תפזורת)
      if (selectedPackingMethod) {
        const ordersByPacking = {};
        filtered.forEach(r => {
          const orderKey = r.ORDNAME;
          if (!ordersByPacking[orderKey]) {
            ordersByPacking[orderKey] = [];
          }
          ordersByPacking[orderKey].push(r);
        });

        const filteredOrders = {};
        Object.keys(ordersByPacking).forEach(orderKey => {
          const orderItems = ordersByPacking[orderKey];

          // סינון רק פריטים חמים (לא קרים)
          const hotItems = orderItems.filter(item => {
            const pspec6 = String(item.PSPEC6 || '').toLowerCase();
            return !pspec6.includes('קר');
          });

          // אם אין פריטים חמים, לא להציג
          if (hotItems.length === 0) return;

          // בדיקה אם כל הפריטים החמים הם חמגשית
          const allItemsTray = hotItems.every(item => {
            const packMethod = String(item.PACKMETHODCODE || '').trim();
            return packMethod.includes('חמגשית');
          });

          // בדיקה אם יש לפחות פריט אחד שאינו חמגשית
          const hasNonTray = hotItems.some(item => {
            const packMethod = String(item.PACKMETHODCODE || '').trim();
            return !packMethod.includes('חמגשית');
          });

          // בדיקה אם יש גסטרונום (ללא חמגשית)
          // ירק שאריזתו גסטרונום - מתייחסים אליו כתפזורת ולכן לא ייחשב כגסטרונום
          const hasOnlyGastronorm = hotItems.length > 0 && !allItemsTray && hotItems.some(item => {
            const packDes = String(item.PACKDES || '').toLowerCase();
            const pspec1 = String(item.PSPEC1 || '').toLowerCase();
            const packMethod = String(item.PACKMETHODCODE || '').trim();
            const isVeggie = pspec1.includes('ירק');
            const isGastronorm = (packDes.includes('גסטרונום') || packDes.includes('גסטרו') || pspec1.includes('גסטרונום')) && !isVeggie;
            const isTray = packMethod.includes('חמגשית');
            return isGastronorm && !isTray;
          });

          let match = false;
          if (selectedPackingMethod === 'tray') {
            // חמגשיות - כל הפריטים החמים הם חמגשית
            match = allItemsTray;
          } else if (selectedPackingMethod === 'gastronorm') {
            // גסטרונום בלבד - יש גסטרונום, ללא חמגשית
            match = hasOnlyGastronorm;
          } else if (selectedPackingMethod === 'loose') {
            // תפזורת - יש לפחות פריט אחד שאינו חמגשית
            match = hasNonTray;
          }

          if (match) {
            filteredOrders[orderKey] = orderItems;
          }
        });
        filtered = Object.values(filteredOrders).flat();
      }

      // סינון לפי סוג לקוח (מילגם / לא מילגם / פרטי)
      if (selectedCustomerType) {
        const ordersByCustomer = {};
        filtered.forEach(r => {
          const orderKey = r.ORDNAME;
          if (!ordersByCustomer[orderKey]) {
            ordersByCustomer[orderKey] = { items: [], spec1: r.SPEC1 };
          }
          ordersByCustomer[orderKey].items.push(r);
        });

        const filteredOrders = {};
        Object.keys(ordersByCustomer).forEach(orderKey => {
          const order = ordersByCustomer[orderKey];
          const spec1 = (order.spec1 || '').toLowerCase();
          const isMilgam = spec1.includes('מילגם');

          let match = false;
          if (selectedCustomerType === 'milgam') {
            match = isMilgam;
          } else if (selectedCustomerType === 'notMilgam' || selectedCustomerType === 'private') {
            match = !isMilgam;
          }

          if (match) {
            filteredOrders[orderKey] = order.items;
          }
        });
        filtered = Object.values(filteredOrders).flat();
      }

      // סינון לפי סוג מוסד (גן / בית ספר) - לפי PRIT_CLASSNAME
      if (selectedInstitutionType) {
        const ordersByInstitution = {};
        filtered.forEach(r => {
          const orderKey = r.ORDNAME;
          if (!ordersByInstitution[orderKey]) {
            ordersByInstitution[orderKey] = { items: [], pritClassname: r.PRIT_CLASSNAME };
          }
          ordersByInstitution[orderKey].items.push(r);
        });

        const filteredOrders = {};
        Object.keys(ordersByInstitution).forEach(orderKey => {
          const order = ordersByInstitution[orderKey];
          const pritClassname = (order.pritClassname || '').toLowerCase();
          const isGan = pritClassname.includes('גן');

          let match = false;
          if (selectedInstitutionType === 'gan') {
            match = isGan;
          } else if (selectedInstitutionType === 'school') {
            match = !isGan;
          }

          if (match) {
            filteredOrders[orderKey] = order.items;
          }
        });
        filtered = Object.values(filteredOrders).flat();
      }

      // סינון לפי כשרות
      if (selectedKashrut) {
        filtered = filtered.filter(r => r.SPEC2 === selectedKashrut);
      }

      // סינון לפי חיפוש - שם מוסד או מספר לקוח
      if (searchTerm) {
        filtered = filtered.filter(r => {
          const custDes = String(r.CUSTDES || '').toLowerCase();
          const custName = String(r.CUSTNAME || '').toLowerCase();
          const codeDes = String(r.CODEDES || '').toLowerCase();
          return custDes.includes(searchTerm) || custName.includes(searchTerm) || codeDes.includes(searchTerm);
        });
      }

      renderLabelsTable(filtered, container);
    }
  };

  // הוספת event listeners לסינון
  distrLineSelect.onchange = applyFilters;
  packingMethodSelect.onchange = applyFilters;
  if (sortModeSelect) sortModeSelect.onchange = applyFilters;
  if (customerTypeSelect) customerTypeSelect.onchange = applyFilters;
  if (kashrutSelect) kashrutSelect.onchange = applyFilters;
  if (institutionTypeSelect) institutionTypeSelect.onchange = applyFilters;

  // הוספת event listener לשדה החיפוש
  if (searchInput) {
    searchInput.oninput = applyFilters;
  }

  // הצגה ראשונית
  if (orders) {
    const initialSortMode = sortModeSelect ? sortModeSelect.value : 'distribution';
    renderLabelsTableNoSQL(orders, container, labelsMode, initialSortMode, isHot);
    // שמירת הנתונים לפי סוג
    if (isHot) {
      window.labelsDataHot = orders;
    } else {
      window.labelsDataCold = orders;
    }
  } else {
    renderLabelsTable(flatData, container);
    if (isHot) {
      window.labelsDataHot = flatData;
    } else {
      window.labelsDataCold = flatData;
    }
  }
}

// רינדור דוח מדבקות ממבנה NoSQL (יותר נקי ויעיל)
function renderLabelsTableNoSQL(orders, container, labelsMode = 'all', sortMode = 'distribution', isHot = true) {
  // איפוס אוסף המנות בתחילת רנדור חדש (רק למדבקות חמות)
  if (isHot) {
    window.labelsDishesSet = new Set();
  }

  // פונקציה לזיהוי כשרות - האם זה חב"ד או בד"ץ
  const isChabad = (order) => {
    const spec2 = String(order.spec2 || '').trim().toLowerCase();
    // בדיקה אם הכשרות מכילה חב"ד
    if (spec2.includes('חבד') || spec2.includes('חב"ד') || spec2.includes('חב\'ד') ||
        spec2.includes('נחלת') || spec2.includes('ירוסלבסקי')) {
      return true;
    }
    // בדיקה גם ברמת הפריט - pspec6
    const hasAnyChabadItem = order.items && order.items.some(item => {
      const pspec6 = String(item.pspec6 || '').trim().toLowerCase();
      return pspec6.includes('חבד') || pspec6.includes('חב"ד') || pspec6.includes('חב\'ד');
    });
    return hasAnyChabadItem;
  };

  // פונקציה לזיהוי שיטת אריזה - האם זה חמגשית או תפזורת
  // בודקים רק פריטים חמים!
  // אם יש אפילו פריט חם אחד שהוא לא חמגשית - זה תפזורת
  // רק אם כל הפריטים החמים הם חמגשית - זה חמגשית
  const isTrayOnlyOrder = (order) => {
    if (!order.items) return false;

    let hasHotTray = false;
    let hasHotNonTray = false;

    order.items.forEach(item => {
      // בדיקה אם זה פריט חם - לפי CARTON_TYPE, PSPEC6 או PSPEC3
      const cartonType = String(item.cartonType || '').toLowerCase();
      const pspec6 = String(item.pspec6 || '').toLowerCase();
      const pspec3 = String(item.pspec3 || '').toLowerCase();
      const isHotItem = cartonType.includes('חם') || pspec6.includes('חם') || pspec3.includes('חם');

      // רק פריטים חמים רלוונטיים למיון
      if (isHotItem) {
        const packMethodCode = String(item.packMethodCode || '').toLowerCase();
        const packDes = String(item.packDes || '').toLowerCase();

        if (packMethodCode.includes('חמגשית') || packDes.includes('חמגשית')) {
          hasHotTray = true;
        } else if (packMethodCode || packDes) {
          // פריט חם עם שיטת אריזה שהיא לא חמגשית = תפזורת
          hasHotNonTray = true;
        }
      }
    });

    // אם יש אפילו פריט חם אחד שהוא לא חמגשית - זה תפזורת
    if (hasHotNonTray) {
      return false;
    }

    // רק אם כל הפריטים החמים הם חמגשית
    return hasHotTray;
  };

  // הצגת כל הלקוחות (ללא סינון מילגם)
  let ordersArray = Object.values(orders);
  const totalBeforeFilter = ordersArray.length;

  // מיון לפי סדר המבוקש
  if (sortMode === 'loading' && isHot) {
    // מיון לפי סדר העמסה - רק למדבקות חמות
    // הסדר הנכון: בד"ץ תפזורת → חב"ד תפזורת → חב"ד חמגשית → בד"ץ חמגשית

    // קיבוץ לפי קו חלוקה
    const ordersByDistrLine = {};
    ordersArray.forEach(order => {
      const lineCode = order.distrLineCode || 'ללא_קו';
      if (!ordersByDistrLine[lineCode]) {
        ordersByDistrLine[lineCode] = [];
      }
      ordersByDistrLine[lineCode].push(order);
    });

    // מיון קווי החלוקה
    const sortedLines = Object.keys(ordersByDistrLine).sort();

    ordersArray = []; // נאפס ונבנה מחדש

    sortedLines.forEach((lineCode) => {
      const lineOrders = ordersByDistrLine[lineCode];

      // חלוקה ל-4 קטגוריות לפי הסדר המבוקש
      const categories = {
        'tafzoret-badatz': [],  // 1. בד"ץ תפזורת
        'tafzoret-chabad': [],  // 2. חב"ד תפזורת
        'tray-chabad': [],      // 3. חב"ד חמגשית
        'tray-badatz': []       // 4. בד"ץ חמגשית
      };

      lineOrders.forEach(order => {
        const chabad = isChabad(order);
        const trayOnly = isTrayOnlyOrder(order);

        // לוג לדיבוג
        console.log(`🔍 ${order.custDes}: כשרות=${chabad ? 'חב"ד' : 'בד"ץ'}, אריזה=${trayOnly ? 'חמגשית' : 'תפזורת'}`);

        if (!trayOnly && !chabad) {
          categories['tafzoret-badatz'].push(order);
        } else if (!trayOnly && chabad) {
          categories['tafzoret-chabad'].push(order);
        } else if (trayOnly && chabad) {
          categories['tray-chabad'].push(order);
        } else { // trayOnly && !chabad
          categories['tray-badatz'].push(order);
        }
      });

      // מיון בתוך כל קטגוריה לפי סדר הפצה
      Object.keys(categories).forEach(cat => {
        categories[cat].sort((a, b) => {
          if (a.pritDistrOrder !== b.pritDistrOrder) return (a.pritDistrOrder || 0) - (b.pritDistrOrder || 0);
          return (a.orderName || '').localeCompare(b.orderName || '');
        });
      });

      // הסדר הקבוע: בד"ץ תפזורת → חב"ד תפזורת → חב"ד חמגשית → בד"ץ חמגשית
      const categoryOrder = ['tafzoret-badatz', 'tafzoret-chabad', 'tray-chabad', 'tray-badatz'];

      // הוספה לפי הסדר שנקבע
      categoryOrder.forEach(cat => {
        ordersArray.push(...categories[cat]);
      });
    });
  } else {
    // מיון רגיל - לפי קו חלוקה, סדר הפצה והזמנה
    ordersArray.sort((a, b) => {
      if (a.distrLineCode !== b.distrLineCode) return (a.distrLineCode || '').localeCompare(b.distrLineCode || '');
      if (a.pritDistrOrder !== b.pritDistrOrder) return (a.pritDistrOrder || 0) - (b.pritDistrOrder || 0);
      return (a.orderName || '').localeCompare(b.orderName || '');
    });
  }
  
  console.log('📊 דוח מדבקות - סה"כ הזמנות:', ordersArray.length);
  
  if (ordersArray.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:50px;color:#d32f2f;background:#ffebee;border:2px solid #d32f2f;border-radius:8px;margin:20px;">' +
      '<h3 style="color:#d32f2f;margin-bottom:10px;">⚠️ לא נמצאו הזמנות</h3>' +
      '<p style="font-size:0.9em;margin-top:10px;">אנא ודא שיש הזמנות בתאריך שנבחר</p>' +
      '</div>';
    return;
  }
  
  let html = '<div class="labels-print-wrapper">';
  
  ordersArray.forEach(order => {
    // זיהוי שיטת אריזה עיקרית לפי PSPEC1 - מחפש פריט עם "עיקר" בפרמטר 1
    let mainPackingMethod = '';
    order.items.forEach(item => {
      if (item.pspec1 && item.packMethodCode) {
        const pspec1Str = (item.pspec1 || '').toString().toLowerCase();
        // אם פרמטר 1 מכיל את המילה "עיקר" - זה הפריט העיקרי
        if (pspec1Str.includes('עיקר') && !mainPackingMethod) {
          mainPackingMethod = item.packMethodCode || '';
        }
      }
    });
    
    // אם לא מצאנו פריט עם "עיקר", ניקח את הראשון
    if (!mainPackingMethod) {
      const pspec1Groups = {};
      order.items.forEach(item => {
        if (item.pspec1 && item.packMethodCode) {
          if (!pspec1Groups[item.pspec1] || !pspec1Groups[item.pspec1].packMethodCode) {
            pspec1Groups[item.pspec1] = {
              packMethodCode: item.packMethodCode || ''
            };
          }
        }
      });
      const firstPSpec1 = Object.keys(pspec1Groups).sort()[0];
      if (firstPSpec1 && pspec1Groups[firstPSpec1]) {
        mainPackingMethod = pspec1Groups[firstPSpec1].packMethodCode || '';
      }
    }
    
    // זיהוי אם יש אלרגנים
    const hasNoAllergen = (order.eatQuantNoAllergen || 0) > 0;
    // זיהוי צמחוני - לפי Y_36827_0_ESH (אם יש פריט מסומן כצמחוני)
    const isVegetarian = order.items.some(item => item.isVegetarian === true);
    
    // הפרדה בין פריטים לפי שיטת אריזה (חמגשית / לא חמגשית)
    const trayItemsRaw = []; // פריטים גולמיים עם חמגשית (לקבץ לפי ארוחה)
    const nonTrayItemsMap = {}; // פריטים ללא חמגשית (לקבץ לפי partKey)
    const coldRawItems = []; // פריטים קרים גולמיים - ללא קיבוץ (למדבקות קר)
    
    order.items.forEach(item => {
      // רק פריטים שיש להם סוג קרטון
      // לוג לדיבוג - נבדוק מה הערך של cartonType
      if (!item.cartonType) {
        console.log(`⚠️ פריט בלי cartonType: לקוח=${order.codeDes}, פריט=${item.partDes}, CARTON_TYPE=${item.CARTON_TYPE}, cartonType=${item.cartonType}`);
        return;
      }

      // זיהוי אם זה חמגשית לפי PACKMETHODCODE, PACKDES, PSPEC1, או mainPackingMethod
      const packMethodCode = String(item.packMethodCode || '').toLowerCase();
      const packDes = String(item.packDes || '').toLowerCase();
      const pspec1 = String(item.pspec1 || '').toLowerCase();
      const mainPackingMethodStr = String(mainPackingMethod || '').toLowerCase();

      // זיהוי אלרגני/צמחוני - תמיד יטופלו כחמגשית!
      const pspec1Lower = String(item.pspec1 || '').toLowerCase();
      const isAllergenItem = pspec1Lower.includes('ללא אלרגני') || pspec1Lower.includes('לא אלרגני') ||
                             pspec1Lower.includes('אלרגני');
      const isVegetarianItem = item.isVegetarian === true;

      // זיהוי חמגשית רק לפי שיטת האריזה של הפריט עצמו (לא לפי mainPackingMethod!)
      // כל פריט מסווג בנפרד לפי packMethodCode, packDes או pspec1 שלו
      const isTray = packMethodCode.includes('חמגשית') ||
                     packDes.includes('חמגשית') ||
                     pspec1.includes('חמגשית') ||
                     isAllergenItem || isVegetarianItem; // אלרגני/צמחוני = תמיד חמגשית

      if (isTray) {
        // עבור חמגשית - שמירת פריטים גולמיים (נקבץ אחר כך לפי ארוחה)
        const trayItem = {
          ...item,
          mealName: item.mealName || '',
          eatQuant: parseFloat(item.eatQuant || item.EATQUANT || 0) || 0,
          EATQUANT: parseFloat(item.eatQuant || item.EATQUANT || 0) || 0,
          PSPEC1: item.pspec1 || item.PSPEC1 || '',
          PARTDES: item.partDes || item.PARTDES || '',
          partDes: item.partDes || item.PARTDES || '',
          packMethodCode: item.packMethodCode || item.PACKMETHODCODE || '',
          packDes: item.packDes || item.PACKDES || '',
          isVegetarian: item.isVegetarian || false
        };
        trayItemsRaw.push(trayItem);

        // גם פריטי חמגשית קרים נשמרים למערך הגולמי (למדבקות קר ללא קיבוץ)
        const cartonTypeLower = String(item.cartonType || '').toLowerCase();
        const pspec6Lower = String(item.pspec6 || item.PSPEC6 || '').toLowerCase();
        const isColdTrayItem = cartonTypeLower.includes('קר') || pspec6Lower.includes('קר');
        if (isColdTrayItem) {
          coldRawItems.push({
            partName: item.partName,
            partDes: item.partDes || item.PARTDES || '',
            cartonType: item.cartonType || '',
            mealName: item.mealName || '',
            tQuant: parseFloat(item.tQuant) || 0,
            eatQuant: parseFloat(item.eatQuant || item.EATQUANT || 0) || 0,
            hasNoAllergen: isAllergenItem,
            isVegetarian: isVegetarianItem
          });
        }
      } else {
        // עבור לא חמגשית - קיבוץ לפי partKey (partName + partDes) + ארוחה
        const partKey = `${item.partName}|${item.partDes}`;
        const mealName = item.mealName || '';

        // זיהוי אם זה אלרגני
        const pspec1Str = String(item.pspec1 || item.PSPEC1 || '').trim().toLowerCase();
        const spec2Str = String(item.pspec2 || order.spec2 || '').toLowerCase();
        const partDesStr = String(item.partDes || '').toLowerCase();
        const partNameStr = String(item.partName || '').toLowerCase();

        const isNoAllergenItem = pspec1Str.includes('ללא אלרגני') || pspec1Str.includes('לא אלרגני') ||
                                  spec2Str.includes('ללא אלרג') || spec2Str.includes('לא אלרג') ||
                                  partDesStr.includes('ללא אלרג') || partDesStr.includes('לא אלרג') ||
                                  partNameStr.includes('ללא אלרג') || partNameStr.includes('לא אלרג') ||
                                  spec2Str.includes('אלרגני') || partDesStr.includes('אלרגני') || partNameStr.includes('אלרגני');

        // זיהוי צמחוני - לפי שדה Y_36827_0_ESH (בוליאני)
        const isVegetarianItem = item.isVegetarian || false;

        // שמירת פריט גולמי למדבקות קר (ללא קיבוץ)
        // בדיקה אם הפריט קר לפי cartonType
        const cartonTypeLower = String(item.cartonType || '').toLowerCase();
        const isColdItem = cartonTypeLower.includes('קר') || cartonTypeLower.includes('cold');
        if (isColdItem) {
          coldRawItems.push({
            partName: item.partName,
            partDes: item.partDes,
            cartonType: item.cartonType || '',
            mealName: item.mealName || '',
            tQuant: parseFloat(item.tQuant) || 0,
            eatQuant: parseFloat(item.eatQuant || item.EATQUANT || 0) || 0,
            hasNoAllergen: isNoAllergenItem,
            isVegetarian: isVegetarianItem
          });
        }

        // יצירת מפתח ייחודי - כולל ארוחה וסימון אלרגני/צמחוני
        // פריטים מאותה ארוחה יקובצו יחד
        let uniqueKey = `${partKey}|${mealName}`;
        if (isNoAllergenItem) {
          uniqueKey += '|אלרגני';
        } else if (isVegetarianItem) {
          uniqueKey += '|צמחוני';
        }

        if (!nonTrayItemsMap[uniqueKey]) {
          nonTrayItemsMap[uniqueKey] = {
            partName: item.partName,
            partDes: item.partDes,
            pspec1: item.pspec1 || item.PSPEC1 || '',
            cartonType: item.cartonType || '',
            mealName: item.mealName || '',
            sumQuant: 0,
            sumContainers: 0,
            sumPack5: 0,
            sumPack7: 0,
            hasNoAllergen: false,
            isVegetarian: false,
            countedMeals: new Set() // מעקב אחרי ארוחות שכבר נספרו לפריט זה
          };
        }

      // יצירת מפתח ייחודי לארוחה + משקל - כדי לזהות כפילויות
      // אם יש שני פריטים עם אותה ארוחה ואותו משקל, זו כנראה כפילות
      const mealKey = `${item.mealName || ''}|${item.tQuant || ''}`;

      // סיכום הכמויות
        nonTrayItemsMap[uniqueKey].sumQuant += parseFloat(item.tQuant) || 0;

      // סיכום מיכלים - אם יש פרמטר 7 (CONTAINERS)
      if (item.containers !== '' && item.containers !== null && item.containers !== undefined) {
          nonTrayItemsMap[uniqueKey].sumContainers += parseFloat(item.containers) || 0;
      }

      // סיכום מארז 5 ו-7 - רק אם הארוחה הזו עוד לא נספרה לפריט זה
      if (!nonTrayItemsMap[uniqueKey].countedMeals.has(mealKey)) {
        nonTrayItemsMap[uniqueKey].countedMeals.add(mealKey);

        // סיכום מארז 5 - אם יש פרמטר 8 (PACK5)
        if (item.pack5 !== '' && item.pack5 !== null && item.pack5 !== undefined) {
            nonTrayItemsMap[uniqueKey].sumPack5 += parseFloat(item.pack5) || 0;
        }

        // סיכום מארז 7 - אם יש פרמטר 8 (PACK7)
        if (item.pack7 !== '' && item.pack7 !== null && item.pack7 !== undefined) {
            nonTrayItemsMap[uniqueKey].sumPack7 += parseFloat(item.pack7) || 0;
        }
      }
        
        // עדכון סטטוס אלרגני/צמחוני
        if (isNoAllergenItem) {
          nonTrayItemsMap[uniqueKey].hasNoAllergen = true;
        }
        if (isVegetarianItem) {
          nonTrayItemsMap[uniqueKey].isVegetarian = true;
        }
      }
    });

    // אם אין בכלל פריטים - לדלג על ההזמנה
    if (trayItemsRaw.length === 0 && Object.keys(nonTrayItemsMap).length === 0) {
      return;
    }

    // פונקציה פנימית לקבץ פריטי חמגשית לפי ארוחה (כמו בדוח אריזה חמה)
    const groupTrayItemsByMeal = (trayItems, order) => {
      // חלוקה לפי ארוחה (MEALNAME) בתוך אותה הזמנה
      const itemsByMeal = {};
      trayItems.forEach(item => {
        const mealName = String(item.mealName || item.MEALNAME || '').trim() || 'ללא_ארוחה';
        if (!itemsByMeal[mealName]) {
          itemsByMeal[mealName] = [];
        }
        itemsByMeal[mealName].push(item);
      });
      
      const summary = [];
      
      // עבור כל ארוחה בנפרד - בדיקה אם הארוחה צמחונית (לפי Y_36827_0_ESH)
      Object.entries(itemsByMeal).forEach(([mealName, mealItems]) => {
        // ארוחה צמחונית = אם לפחות פריט אחד מסומן כצמחוני
        const isVegetarianMeal = mealItems.some(item => item.isVegetarian === true);

        // פונקציה לעיבוד כל הפריטים באותה ארוחה יחד
        const processItemGroup = (items, isVegetarianGroup) => {
          if (items.length === 0) return;

          // איסוף כל שמות הפריטים (ללא כפילויות)
          const uniquePartDes = [];
          const partDesCategory = {}; // partDes -> עדיפות קטגוריה (0=עיקר, 1=פחמימה, 2=ירק, 3=אחר)
          let hasNoAllergen = false;
          let isChabadKashrut = false; // בדיקה אם יש כשרות חב"ד
          let eatQuantSmall = 0; // כמות לחמגשית קטנה
          let eatQuantLarge = 0; // כמות לחמגשית גדולה
          let itemCartonType = ''; // סוג קרטון (חם/קר) מהפריט הראשון

          items.forEach((item, index) => {
            const partDes = String(item.partDes || item.PARTDES || item.partName || item.PARTNAME || '').trim();
            if (!partDes) return;

            // הוספת הפריט לרשימה (ללא כפילויות)
            if (!uniquePartDes.includes(partDes)) {
              uniquePartDes.push(partDes);
            }

            // בדיקת אלרגני
            const pspec1 = String(item.pspec1 || item.PSPEC1 || '').trim().toLowerCase();
            if (pspec1.includes('ללא אלרגני') || pspec1.includes('לא אלרגני')) {
              hasNoAllergen = true;
            }

            // קביעת עדיפות קטגוריה לסידור: מנה עיקרית → פחמימה → ירק → אחר
            let catPriority = 3;
            if (pspec1.includes('עיקר')) catPriority = 0;
            else if (pspec1.includes('פחמימה')) catPriority = 1;
            else if (pspec1.includes('ירק')) catPriority = 2;
            // אם לאותו partDes יש כבר עדיפות נמוכה יותר (=חשוב יותר), נשמור אותה
            if (partDesCategory[partDes] === undefined || catPriority < partDesCategory[partDes]) {
              partDesCategory[partDes] = catPriority;
            }
            const pspec6 = String(item.pspec6 || item.PSPEC6 || '').trim().toLowerCase();
            // בדיקה אם הכשרות היא חב"ד (בפרמטר 6 למוצר)
            if (pspec6.includes('חבד') || pspec6.includes('חב"ד') || pspec6.includes('חב\'ד')) {
              isChabadKashrut = true;
            }

            // שמירת סוג קרטון מהפריט הראשון (לזיהוי חם/קר)
            if (!itemCartonType && item.cartonType) {
              itemCartonType = item.cartonType;
            }

            // זיהוי גודל חמגשית וסיכום כמות
            const packDes = String(item.packDes || item.PACKDES || '').toLowerCase();
            const packMethodCode = String(item.packMethodCode || item.PACKMETHODCODE || '').toLowerCase();
            const isLarge = packDes.includes('גד') || packDes.includes('גדול') || packDes.includes('גדולה') ||
                            packMethodCode.includes('גד') || packMethodCode.includes('גדול');
            const eatQuant = parseFloat(item?.eatQuant || item?.EATQUANT || 0) || 0;

            // נשתמש בכמות מהפריט הראשון (כי כל הפריטים באותה ארוחה צריכים להיות עם אותה כמות)
            if (isLarge) {
              if (eatQuantLarge === 0 && eatQuant > 0) {
                eatQuantLarge = eatQuant; // רק אם עדיין לא נקבעה כמות
              }
            } else {
              if (eatQuantSmall === 0 && eatQuant > 0) {
                eatQuantSmall = eatQuant; // רק אם עדיין לא נקבעה כמות
              }
            }
          });

          if (uniquePartDes.length === 0) return;

          // יצירת מפתח ייחודי לכל הפריטים יחד (מחוברים ב-"+")
          // סידור לפי קטגוריה: מנה עיקרית → פחמימה → ירק → אחר, ואז לפי א"ב כשבירת שוויון
          const sortedPartDes = [...uniquePartDes].sort((a, b) => {
            const pa = partDesCategory[a] ?? 3;
            const pb = partDesCategory[b] ?? 3;
            if (pa !== pb) return pa - pb;
            return a.localeCompare(b, 'he');
          });
          const itemsKey = sortedPartDes.join('+');
          // העדיפות הנמוכה (הכי חשובה) בקבוצה - לשימוש בסידור השורות במדבקה
          const groupCatPriority = Math.min(...Object.values(partDesCategory), 3);

          // אם יש אלרגני, להוסיף סימון
          let finalItemsKey = itemsKey;
          if (hasNoAllergen) {
            finalItemsKey = itemsKey + ' (ללא אלרגנים)';
          }

          // הוספת פריט אחד עם כל הפריטים יחד
          // אם יש גם קטנה וגם גדולה, ניצור שני פריטים נפרדים
          if (eatQuantSmall > 0 && eatQuantLarge > 0) {
            // יש גם קטנה וגם גדולה - שני פריטים נפרדים
            summary.push({
              itemsKey: finalItemsKey,
              eatQuant: eatQuantSmall,
              eatQuantSmall: eatQuantSmall,
              eatQuantLarge: 0,
              totalQuantity: eatQuantSmall,
              hasNoAllergen: hasNoAllergen,
              isVegetarian: isVegetarianGroup,
              pspec6: isChabadKashrut ? 'חבד' : '',
              cartonType: itemCartonType,
              traySize: 'small',
              _catPriority: groupCatPriority
            });
            summary.push({
              itemsKey: finalItemsKey,
              eatQuant: eatQuantLarge,
              eatQuantSmall: 0,
              eatQuantLarge: eatQuantLarge,
              totalQuantity: eatQuantLarge,
              hasNoAllergen: hasNoAllergen,
              isVegetarian: isVegetarianGroup,
              pspec6: isChabadKashrut ? 'חבד' : '',
              cartonType: itemCartonType,
              traySize: 'large',
              _catPriority: groupCatPriority
            });
          } else if (eatQuantSmall > 0) {
            // רק קטנה
            summary.push({
              itemsKey: finalItemsKey,
              eatQuant: eatQuantSmall,
              eatQuantSmall: eatQuantSmall,
              eatQuantLarge: 0,
              totalQuantity: eatQuantSmall,
              hasNoAllergen: hasNoAllergen,
              isVegetarian: isVegetarianGroup,
              pspec6: isChabadKashrut ? 'חבד' : '',
              cartonType: itemCartonType,
              traySize: 'small',
              _catPriority: groupCatPriority
            });
          } else if (eatQuantLarge > 0) {
            // רק גדולה
            summary.push({
              itemsKey: finalItemsKey,
              eatQuant: eatQuantLarge,
              eatQuantSmall: 0,
              eatQuantLarge: eatQuantLarge,
              totalQuantity: eatQuantLarge,
              hasNoAllergen: hasNoAllergen,
              isVegetarian: isVegetarianGroup,
              pspec6: isChabadKashrut ? 'חבד' : '',
              cartonType: itemCartonType,
              traySize: 'large',
              _catPriority: groupCatPriority
            });
          }
        };

        // עיבוד כל הפריטים באותה ארוחה יחד - אם הארוחה צמחונית, כולם יהיו ירוקים
        processItemGroup(mealItems, isVegetarianMeal);
      });
      
      return summary;
    };

    // פונקציה פנימית ליצירת מדבקה לפי שיטת אריזה
    const renderLabelSticker = (itemsArray, isTray, traySize = '', currentLabelsMode = 'all', cartonNumber = 0, totalCartons = 1) => {
      if (!itemsArray || itemsArray.length === 0) return;

      // בדיקה אם זה מדבקה קרה
      const isColdLabel = currentLabelsMode === 'cold';

      // הכנת טקסט מספר קרטון (אם יש יותר מ-1)
      const cartonText = totalCartons > 1 ? `${cartonNumber}/${totalCartons}` : '';

      // קביעת טקסט למטה לפי סוג לקוח - אם מתחיל ב"מילגם" אז מילגם, אחרת פרטיים
      const spec1 = String(order.spec1 || '').trim();
      const contactText = spec1.startsWith('מילגם') ? 'מוקד תוכנית ההזנה 0732088557' : 'שירות לקוחות ביכורים 0778992889';
      
      // זיהוי כשרות לפי SPEC2 וקביעת לוגו מתאים
      const spec2 = String(order.spec2 || '').trim().toLowerCase();
      
      // קביעת שם הקובץ לפי סוג הכשרות (מחפש גם שמות קיימים)
      let logoFileNames = ['בדץ.png', 'badatz-jerusalem.png']; // ברירת מחדל - בד"ץ
      let kashrutLogoAlt = 'בהשגחת הבד"ץ ירושלם';
      
      if (spec2.includes('בדץ') || spec2.includes('בד"ץ') || spec2.includes('ירושלם') || spec2.includes('ירושלים')) {
        // בד"ץ ירושלם
        logoFileNames = ['בדץ.png', 'badatz-jerusalem.png'];
        kashrutLogoAlt = 'בהשגחת הבד"ץ ירושלם של העדה החרדית';
      } else if (spec2.includes('למהדרין') || spec2.includes('מהדרין') || spec2.includes('צפת') || spec2.includes('תובב"א') || spec2.includes('ביסטריצקי')) {
        // כשר למהדרין - רבנות צפת
        logoFileNames = ['דבק ביסטריצקי.jpg', 'mehadrin-tzfat.png'];
        kashrutLogoAlt = 'כשר למהדרין - רבנות צפת תובב"א';
      } else if (spec2.includes('נחלת') || spec2.includes('ירוסלבסקי') || spec2.includes('נחלת הר חב"ד')) {
        // נחלת הכשרות
        logoFileNames = ['לוגו ירוסלבסקי.jpg', 'nachalat-kashrut.png'];
        kashrutLogoAlt = 'נחלת הכשרות - בהשגחת הרה"ג הרב יצחק יהודה ירוסלבסקי נחלת הר חב"ד';
      } else if (spec2.includes('חבד') || spec2.includes('חב"ד')) {
        // חב"ד (אם אין לוגו ספציפי, נשתמש בבד"ץ)
        logoFileNames = ['בדץ.png', 'badatz-jerusalem.png'];
        kashrutLogoAlt = 'בהשגחת חב"ד';
      }
      
      // ניסיון מספר אפשרויות של נתיבים
      const getImagePath = (fileName) => {
        // אם זה נתיב file:// (קובץ מקומי)
        if (window.location.protocol === 'file:') {
          // נשתמש בנתיב יחסי לתיקיית images
          return 'images/' + fileName;
        } else {
          // אם זה http/https - נשתמש בנתיב יחסי למיקום הנוכחי
          const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
          return basePath + 'images/' + fileName;
        }
      };
      
      // ננסה את כל השמות האפשריים
      const kashrutLogoPath = getImagePath(logoFileNames[0]);
      
      // חישוב סה"כ הזמנה
      let totalOrder = 0;
      if (isTray) {
        // עבור חמגשית - משתמשים ב-EATQUANT (רק פעם אחת לכל קבוצה)
        totalOrder = itemsArray.reduce((sum, item) => sum + (item.eatQuant || 0), 0);
      } else {
        // עבור לא חמגשית - משתמשים ב-sumQuant
        totalOrder = itemsArray.reduce((sum, item) => sum + (item.sumQuant || 0), 0);
      }

      // חישוב גובה שורה דינמי: (500px - 95px כותרת - 18px הערות - 25px פוטר - שורות מארז) / מספר פריטים
      const labelHeight = 500;
      const headerHeight = 95; // הקטנתי ל-95 - גבהים קבועים לשורות
      const notesHeight = 18; // הקטנתי - מספר מנות קטן יותר
      const footerHeight = 25;

      // בדיקה מוקדמת אם תהיה שורת מארזים - לחישוב גובה דינמי
      // רק במדבקות חמות (לא קרות!)
      const checkHasTrayOnly = itemsArray.every(item => item.isTray === true);
      const checkSpec2 = String(order.spec2 || '').trim().toLowerCase();
      const willHavePacksRow = !isColdLabel && checkHasTrayOnly && itemsArray.length > 0 &&
                               (checkSpec2.includes('חבד') || checkSpec2.includes('חב"ד') || checkSpec2.includes('חב\'ד') ||
                                checkSpec2.includes('נחלת') || checkSpec2.includes('ירוסלבסקי') || checkSpec2.includes('ביסטריצקי'));

      // חישוב כמה שורות מארז יהיו (כל מוצר עם PACK5/PACK7 = שורה)
      let packsRowsCount = 0;
      if (willHavePacksRow) {
        // ספירה מהירה של כמה פריטים יש עם PACK5 או PACK7
        const uniqueProducts = new Set();
        trayItemsRaw.forEach(item => {
          const pack5 = parseFloat(item.pack5 || item.PACK5 || 0) || 0;
          const pack7 = parseFloat(item.pack7 || item.PACK7 || 0) || 0;
          if (pack5 > 0 || pack7 > 0) {
            const productName = String(item.partDes || item.PARTDES || '').trim();
            if (productName) uniqueProducts.add(productName);
          }
        });
        packsRowsCount = uniqueProducts.size;
      }

      // גובה שורת מארז - 50px לכל שורת מוצר + 10px למרווחים
      const packsRowHeight = packsRowsCount > 0 ? (packsRowsCount * 50 + 10) : 0;

      const availableHeight = labelHeight - headerHeight - notesHeight - footerHeight - packsRowHeight;

      // לוג לבדיקה
      if (packsRowsCount > 0) {
        console.log('🔍 חישוב גובה:', {
          labelHeight,
          headerHeight,
          notesHeight,
          footerHeight,
          packsRowsCount,
          packsRowHeight,
          availableHeight,
          numberOfItems: itemsArray.length
        });
      }
      const maxRowHeight = 40; // מקסימום 40px לשורה
      const minRowHeight = 8; // מינימום 8px לשורה (הורדתי עוד יותר כדי שיכנסו יותר פריטים)
      const allergenRowMinHeight = 20; // גובה מינימלי לשורות אלרגניות (הורדתי מ-22 ל-20)
      const numberOfItems = itemsArray.length;
      
      // חישוב גובה שורה דינמי - כולל שורת כותרת
      const totalRowsNeeded = numberOfItems + 1; // כולל כותרת
      
      // חישוב גובה שורה: אם יש הרבה פריטים, נצמצם את גובה השורות כדי שכולם יכנסו
      let calculatedRowHeight = maxRowHeight;
      if (numberOfItems > 0 && totalRowsNeeded > 0) {
        // חישוב בסיסי - חלוקת הגובה הזמין בין כל השורות
        // נשתמש ב-Math.floor כדי לוודא שכל השורות יכנסו
        calculatedRowHeight = Math.floor(availableHeight / totalRowsNeeded);
        
        // אם יש פריטים אלרגניים, נבדוק אם צריך להקצות להם מקום נוסף
        const allergenRowsCount = itemsArray.filter(item => item.hasNoAllergen || 
          (item.itemsKey && (item.itemsKey.includes('אלרגני') || item.itemsKey.includes('ללא אלרגנים')))).length;
        
        if (allergenRowsCount > 0 && calculatedRowHeight < allergenRowMinHeight) {
          // אם הגובה המחושב קטן מדי עבור שורות אלרגניות, נצטרך להקטין את כל השורות
          // נחשב מחדש - נקצה מקום מינימלי לשורות אלרגניות ונחלק את השאר
          const allergenRowsHeight = allergenRowsCount * allergenRowMinHeight;
          const availableHeightForRegular = availableHeight - allergenRowsHeight;
          const regularRowsCount = numberOfItems - allergenRowsCount;
          const regularRowsNeeded = regularRowsCount + 1; // כולל כותרת
          
          if (regularRowsNeeded > 0) {
            const regularRowHeight = Math.floor(availableHeightForRegular / regularRowsNeeded);
            // נשתמש בגובה הקטן יותר, אבל לא פחות מ-10px
            calculatedRowHeight = Math.max(minRowHeight, regularRowHeight);
          } else {
            calculatedRowHeight = allergenRowMinHeight;
          }
        }
        
        // אבל לא פחות מ-10px ולא יותר מ-40px
        calculatedRowHeight = Math.max(minRowHeight, Math.min(maxRowHeight, calculatedRowHeight));
        
        // בדיקה נוספת - אם יש יותר מדי שורות, נקטין עוד יותר
        // נחשב את הגובה הכולל הנדרש ונוודא שהוא לא עולה על הגובה הזמין
        const totalHeightNeeded = (numberOfItems * calculatedRowHeight) + calculatedRowHeight; // כולל כותרת
        if (totalHeightNeeded > availableHeight && calculatedRowHeight > minRowHeight) {
          // נקטין את הגובה עד שכל השורות יכנסו
          calculatedRowHeight = Math.floor(availableHeight / totalRowsNeeded);
          calculatedRowHeight = Math.max(minRowHeight, calculatedRowHeight);
        }
      }
      
      const rowHeight = calculatedRowHeight;
      
      html += '<div class="label-card" style="border:2px solid #000 !important;padding:10px !important;background:#fff !important;direction:rtl !important;font-family:Arial,sans-serif !important;page-break-inside:avoid !important;height:148.5mm !important;box-sizing:border-box !important;display:flex !important;flex-direction:column !important;overflow:hidden !important;position:relative !important;">';
      
      // אזור עליון - טבלה עם פרטי הלקוח ופרטי הלוגיסטיקה - גודל קבוע, לא דינמי
      html += `<table style="width:100% !important;border-collapse:collapse !important;margin-bottom:15px !important;border:1px solid #000 !important;flex-shrink:0 !important;flex-grow:0 !important;height:${headerHeight}px !important;min-height:${headerHeight}px !important;">`;
      html += '<tbody>';
      
      // שורה ראשונה - לוגו כשרות ופרטי לקוח
      html += '<tr>';
      
      // לוגו כשרות משמאל
      const safeAlt = kashrutLogoAlt.replace(/'/g, "&#39;").replace(/"/g, '&quot;');
      const allPaths = logoFileNames.map(f => getImagePath(f));
      const pathsStr = allPaths.map(p => `'${p.replace(/'/g, "\\'").replace(/"/g, '\\"')}'`).join(',');
      const imgOnError = `(function(){var img=this;var paths=[${pathsStr}];var idx=paths.indexOf(img.src);if(idx<paths.length-1){img.src=paths[idx+1];}else{if(img && img.parentElement && img.parentElement.parentElement){img.parentElement.parentElement.innerHTML='<div style=&quot;display:flex !important;flex-direction:column !important;align-items:center !important;justify-content:center !important;&quot;><div style=&quot;font-size:0.65em !important;color:#000 !important;font-weight:bold !important;line-height:1.3 !important;text-align:center !important;&quot;>${safeAlt}</div><div style=&quot;font-size:0.9em !important;font-weight:bold !important;color:#000 !important;margin-top:3px !important;&quot;>בשרי</div></div>';}}})()`;
      
      html += `<td rowspan="3" style="width:100px !important;text-align:center !important;padding:4px !important;border:1px solid #000 !important;background:#fff !important;vertical-align:middle !important;">`;
      html += `<div style="display:flex !important;flex-direction:column !important;align-items:center !important;justify-content:center !important;">`;
      html += `<img src="${kashrutLogoPath}" alt="${safeAlt}" style="max-width:100% !important;max-height:65px !important;width:auto !important;height:auto !important;object-fit:contain !important;display:block !important;" onerror="${imgOnError}" />`;
      html += `<div style="font-size:1.1em !important;font-weight:bold !important;color:#000 !important;margin-top:3px !important;">בשרי</div>`;
      html += `</div>`;
      html += '</td>';
      
      // פורמט תאריך - DD/MM/YY
      let formattedDate = '';
      if (order.dueDate) {
        try {
          const date = new Date(order.dueDate);
          if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);
            formattedDate = `${day}/${month}/${year}`;
          } else {
            formattedDate = order.dueDate;
          }
        } catch (e) {
          formattedDate = order.dueDate;
        }
      }
      
      // עיבוד כיתה - תמיד להציג את השם המלא כמו שהוא ב-PRIT_CLASSNAME
      // (כולל "גן חובה" / "גן טרום חובה" / "כיתה א" / "כיתה ב" וכו')
      let classText = '';
      if (order.pritClassname) {
        classText = String(order.pritClassname).trim();
      }
      
      // בדיקת כתובת - אם אין כתובת, לנסות גם state
      const addressText = order.address || order.state || '';
      console.log('📍 כתובת להזמנה', order.orderName, ':', order.address, '| state:', order.state, '| תוצאה:', addressText);
      
      // פרטי לקוח ולוגיסטיקה - שם מוסד רספונסיבי לפי אורך הטקסט
      // חישוב גודל פונט לפי אורך שם המוסד - שימוש ב-pt לאמינות בהדפסה
      const institutionName = order.codeDes || '';
      const nameLength = institutionName.length;
      let institutionFontSize = '22pt';
      if (nameLength > 30) {
        institutionFontSize = '11pt';
      } else if (nameLength > 25) {
        institutionFontSize = '13pt';
      } else if (nameLength > 20) {
        institutionFontSize = '15pt';
      } else if (nameLength > 15) {
        institutionFontSize = '18pt';
      }

      // שורה ראשונה - שם מוסד וקו חלוקה - גובה קבוע
      html += '<td style="text-align:right !important;padding:1px 3px !important;border:1px solid #000 !important;line-height:1.0 !important;max-height:35px !important;height:35px !important;overflow:hidden !important;"><span style="font-size:1.2em !important;">שם מוסד: </span><strong style="font-size:' + institutionFontSize + ' !important;">' + institutionName + '</strong></td>';
      // אם יש מספר קרטונים - להציג בעמודה נפרדת
      if (cartonText) {
        html += '<td style="text-align:center !important;padding:1px 3px !important;border:1px solid #000 !important;font-size:1.4em !important;line-height:1.0 !important;max-height:35px !important;height:35px !important;"><strong>קו חלוקה:</strong> ' + (order.distrLineDes || order.distrLineCode || '') + ' <span style="background:#ffeb3b !important;padding:2px 8px !important;border-radius:4px !important;font-weight:bold !important;font-size:1.2em !important;margin-right:10px !important;">' + cartonText + '</span></td>';
      } else {
        html += '<td style="text-align:right !important;padding:1px 3px !important;border:1px solid #000 !important;font-size:1.4em !important;line-height:1.0 !important;max-height:35px !important;height:35px !important;"><strong>קו חלוקה:</strong> ' + (order.distrLineDes || order.distrLineCode || '') + '</td>';
      }
      html += '</tr>';

      html += '<tr>';
      html += '<td style="text-align:right !important;padding:1px 3px !important;border:1px solid #000 !important;font-size:1.3em !important;line-height:1.0 !important;max-height:28px !important;height:28px !important;overflow:hidden !important;"><strong>כתובת:</strong> ' + addressText + '</td>';
      html += '<td style="text-align:right !important;padding:1px 3px !important;border:1px solid #000 !important;font-size:1.3em !important;line-height:1.0 !important;max-height:28px !important;height:28px !important;"><strong>מס תחנה:</strong> ' + (order.pritDistrOrder || 0) + '</td>';
      html += '</tr>';

      html += '<tr>';
      html += '<td style="text-align:right !important;padding:1px 3px !important;border:1px solid #000 !important;font-size:1.3em !important;line-height:1.0 !important;max-height:28px !important;height:28px !important;"><strong>מס לקוח:</strong> ' + (order.custName || '') + (classText ? ' | <strong>כיתה:</strong> ' + classText : '') + '</td>';
      html += '<td style="text-align:right !important;padding:1px 3px !important;border:1px solid #000 !important;font-size:1.3em !important;line-height:1.0 !important;max-height:28px !important;height:28px !important;"><strong>תאריך:</strong> ' + formattedDate + '</td>';
      html += '</tr>';
      
      html += '</tbody></table>';

      // שורת מספר מנות - בין הכותרת לטבלת הפריטים - מוקטן
      const eatQuantValue = order.eatQuant || 0;
      html += `<div style="text-align:center !important;padding:2px 4px !important;margin-bottom:4px !important;background:#f5f5f5 !important;border:1px solid #000 !important;border-radius:3px !important;font-size:1.8em !important;font-weight:bold !important;">מספר מנות: ${eatQuantValue > 0 ? eatQuantValue : '-'}</div>`;

      // אזור שני - טבלה עם פרטי אריזה - גובה דינמי, מוגבל לגובה הזמין
      // rowHeight כבר חושב נכון בהתאם למספר הפריטים, אז נשתמש בו ישירות
      const finalRowHeight = rowHeight;
      
      // חישוב padding וגודל טקסט דינמי - אם יש הרבה פריטים, נקטין את ה-padding והטקסט
      // חישוב דינמי יותר - בהתאם לגובה השורה - פונטים מוגדלים, פדינג מוקטן
      let headerPadding, headerFontSize;
      if (finalRowHeight < 15) {
        headerPadding = '1px';
        headerFontSize = '1.2em';
      } else if (finalRowHeight < 20) {
        headerPadding = '1px';
        headerFontSize = '1.4em';
      } else if (finalRowHeight < 25) {
        headerPadding = '2px';
        headerFontSize = '1.5em';
      } else if (finalRowHeight < 30) {
        headerPadding = '2px';
        headerFontSize = '1.6em';
      } else {
        headerPadding = '3px';
        headerFontSize = '1.8em';
      }
      
      // עטיפה ב-div שמגביל את הגובה כדי שהטבלה לא תעבור את הפוטר
      html += `<div style="flex:1 !important;max-height:${availableHeight}px !important;min-height:0 !important;display:flex !important;flex-direction:column !important;overflow:hidden !important;position:relative !important;">`;

      // === מדבקות קר - פורמט פשוט: רק פריט + כמות ===
      if (isColdLabel) {
        const maxItemsPerColumn = 6; // מקסימום פריטים בעמודה אחת לפני פיצול
        const useTwoColumns = itemsArray.length > maxItemsPerColumn;

        // פונקציה לבניית טבלה עם פריטים
        const buildColdTable = (items, tableWidth) => {
          let tableHtml = `<table class="label-card-table" style="width:${tableWidth} !important;border-collapse:collapse !important;border:1px solid #000 !important;table-layout:fixed !important;display:table !important;">`;
          tableHtml += '<thead><tr>';
          tableHtml += `<th style="border:1px solid #000 !important;padding:${headerPadding} !important;background:#b3e5fc !important;text-align:center !important;font-weight:bold !important;font-size:1em !important;height:${finalRowHeight}px !important;width:20% !important;">כמות</th>`;
          tableHtml += `<th style="border:1px solid #000 !important;padding:${headerPadding} !important;background:#b3e5fc !important;text-align:right !important;font-weight:bold !important;font-size:1em !important;height:${finalRowHeight}px !important;width:80% !important;">פריט</th>`;
          tableHtml += '</tr></thead><tbody>';

          items.forEach(item => {
            const partDes = item.partDes || item.itemsKey || item.partName || '';
            const quantity = item.tQuant || item.eatQuant || item.sumQuant || item.totalQuantity || 0;

            const isAllergen = item.hasNoAllergen || partDes.includes('אלרגני');
            const isVeg = item.isVegetarian;
            const isSoup = partDes.toLowerCase().includes('מרק');
            const bgColor = isAllergen ? '#ff5252' : (isVeg ? '#64b5f6' : (isSoup ? '#fff59d' : '#fff'));

            tableHtml += '<tr>';
            tableHtml += `<td style="border:1px solid #000 !important;padding:2px !important;text-align:center !important;font-weight:bold !important;background:${bgColor} !important;font-size:1.8em !important;height:${finalRowHeight}px !important;">${quantity > 0 ? (quantity % 1 === 0 ? quantity : quantity.toFixed(2)) : ''}</td>`;
            tableHtml += `<td style="border:1px solid #000 !important;padding:2px 4px !important;text-align:right !important;background:${bgColor} !important;font-size:1em !important;height:${finalRowHeight}px !important;">${partDes}</td>`;
            tableHtml += '</tr>';
          });

          tableHtml += '</tbody></table>';
          return tableHtml;
        };

        if (useTwoColumns) {
          // פיצול ל-2 עמודות זו לצד זו
          const midPoint = Math.ceil(itemsArray.length / 2);
          const leftItems = itemsArray.slice(0, midPoint);
          const rightItems = itemsArray.slice(midPoint);

          html += `<div style="display:flex !important;gap:5px !important;width:100% !important;">`;
          html += `<div style="flex:1 !important;">${buildColdTable(rightItems, '100%')}</div>`;
          html += `<div style="flex:1 !important;">${buildColdTable(leftItems, '100%')}</div>`;
          html += `</div>`;
        } else {
          // עמודה אחת רגילה
          html += buildColdTable(itemsArray, '100%');
        }

        html += '</div>'; // סוגר את ה-div שמגביל את הגובה

      } else {
        // === מדבקות חם - הפורמט המלא עם מיכלים/מארזים ===
        html += `<table class="label-card-table" style="width:100% !important;border-collapse:collapse !important;margin-bottom:10px !important;border:1px solid #000 !important;table-layout:auto !important;display:table !important;">`;
        html += '<thead><tr>';

      // בדיקה אם יש גם חמגשית וגם תפזורת (mixed mode)
      const hasTrayItems = itemsArray.some(item => item.isTray === true);
      const hasNonTrayItems = itemsArray.some(item => item.isTray === false || !item.isTray);
      const isMixedMode = hasTrayItems && hasNonTrayItems;
      
      // חישוב כמה פריטים יש - אם יש יותר מ-3, נחלק לשתי שורות
      const totalItems = itemsArray.length;
      const itemsPerRow = totalItems > 3 ? Math.ceil(totalItems / 2) : totalItems;
      
      // כותרת טבלה - אם יש רק חמגשית (ללא תפזורת), נציג 2 עמודות בלבד
      if (hasTrayItems && !hasNonTrayItems && !isMixedMode) {
        // רק חמגשית - נציג 2 עמודות: כמות ותיאור מוצר
        // בדיקה אם יש גם קטנות וגם גדולות
        const trayItems = itemsArray.filter(item => item.isTray === true);
        const hasSmall = trayItems.some(item => item.traySize === 'small' || (item.eatQuantSmall > 0 && item.eatQuantLarge === 0));
        const hasLarge = trayItems.some(item => item.traySize === 'large' || (item.eatQuantLarge > 0 && item.eatQuantSmall === 0));
        
        // אם יש רק קטנות - ירוק, אם יש רק גדולות - אפור, אם יש גם וגם - נציג כל קבוצה בנפרד
        let headerBgColor = '#c8e6c9'; // ירוק - ברירת מחדל
        let headerText = 'חמגשית קטנה';
        if (hasLarge && !hasSmall) {
          headerBgColor = '#d3d3d3'; // אפור - רק גדולות
          headerText = 'חמגשית גדולה';
        } else if (hasSmall && !hasLarge) {
          headerBgColor = '#c8e6c9'; // ירוק - רק קטנות
          headerText = 'חמגשית קטנה';
        } else {
          // יש גם וגם - נציג "כמות" (כי כל קבוצה תוצג בנפרד)
          headerText = 'כמות';
        }
        
        html += `<th style="border:1px solid #000 !important;padding:${headerPadding} !important;background:#e0e0e0 !important;text-align:right !important;font-weight:bold !important;font-size:${headerFontSize} !important;height:${finalRowHeight}px !important;min-height:${finalRowHeight}px !important;max-height:${maxRowHeight}px !important;vertical-align:middle !important;">תיאור מוצר</th>`;
        html += `<th style="border:1px solid #000 !important;padding:${headerPadding} !important;background:${headerBgColor} !important;text-align:center !important;font-weight:bold !important;font-size:${headerFontSize} !important;height:${finalRowHeight}px !important;min-height:${finalRowHeight}px !important;max-height:${maxRowHeight}px !important;vertical-align:middle !important;">${headerText}</th>`;
      } else if (isMixedMode || (hasTrayItems && !hasNonTrayItems)) {
        // מצב מעורב או רק חמגשית - נציג טבלה עם כל העמודות, כמות בצד שמאל
        html += `<th style="border:1px solid #000 !important;padding:${headerPadding} !important;background:#d3d3d3 !important;text-align:right !important;font-weight:bold !important;font-size:${headerFontSize} !important;height:${finalRowHeight}px !important;min-height:${finalRowHeight}px !important;max-height:${maxRowHeight}px !important;vertical-align:middle !important;">תיאור מוצר</th>`;
        html += `<th style="border:1px solid #000 !important;padding:${headerPadding} !important;background:#d3d3d3 !important;text-align:center !important;font-weight:bold !important;font-size:${headerFontSize} !important;height:${finalRowHeight}px !important;min-height:${finalRowHeight}px !important;max-height:${maxRowHeight}px !important;vertical-align:middle !important;">מיכלים</th>`;
        html += `<th style="border:1px solid #000 !important;padding:${headerPadding} !important;background:#d3d3d3 !important;text-align:center !important;font-weight:bold !important;font-size:${headerFontSize} !important;height:${finalRowHeight}px !important;min-height:${finalRowHeight}px !important;max-height:${maxRowHeight}px !important;vertical-align:middle !important;">מארז קטן</th>`;
        html += `<th style="border:1px solid #000 !important;padding:${headerPadding} !important;background:#d3d3d3 !important;text-align:center !important;font-weight:bold !important;font-size:${headerFontSize} !important;height:${finalRowHeight}px !important;min-height:${finalRowHeight}px !important;max-height:${maxRowHeight}px !important;vertical-align:middle !important;">מארז גדול</th>`;
        html += `<th style="border:1px solid #000 !important;padding:${headerPadding} !important;background:#d3d3d3 !important;text-align:center !important;font-weight:bold !important;font-size:${headerFontSize} !important;height:${finalRowHeight}px !important;min-height:${finalRowHeight}px !important;max-height:${maxRowHeight}px !important;vertical-align:middle !important;">משקל</th>`;
      } else {
        // רק תפזורת - 5 עמודות: תיאור מוצר, מיכלים, מארז קטן (5), מארז גדול (7), כמות (בצד שמאל)
        html += `<th style="border:1px solid #000 !important;padding:${headerPadding} !important;background:#d3d3d3 !important;text-align:right !important;font-weight:bold !important;font-size:${headerFontSize} !important;height:${finalRowHeight}px !important;min-height:${finalRowHeight}px !important;max-height:${maxRowHeight}px !important;vertical-align:middle !important;">תיאור מוצר</th>`;
        html += `<th style="border:1px solid #000 !important;padding:${headerPadding} !important;background:#d3d3d3 !important;text-align:center !important;font-weight:bold !important;font-size:${headerFontSize} !important;height:${finalRowHeight}px !important;min-height:${finalRowHeight}px !important;max-height:${maxRowHeight}px !important;vertical-align:middle !important;">מיכלים</th>`;
        html += `<th style="border:1px solid #000 !important;padding:${headerPadding} !important;background:#d3d3d3 !important;text-align:center !important;font-weight:bold !important;font-size:${headerFontSize} !important;height:${finalRowHeight}px !important;min-height:${finalRowHeight}px !important;max-height:${maxRowHeight}px !important;vertical-align:middle !important;">מארז קטן</th>`;
        html += `<th style="border:1px solid #000 !important;padding:${headerPadding} !important;background:#d3d3d3 !important;text-align:center !important;font-weight:bold !important;font-size:${headerFontSize} !important;height:${finalRowHeight}px !important;min-height:${finalRowHeight}px !important;max-height:${maxRowHeight}px !important;vertical-align:middle !important;">מארז גדול</th>`;
        html += `<th style="border:1px solid #000 !important;padding:${headerPadding} !important;background:#d3d3d3 !important;text-align:center !important;font-weight:bold !important;font-size:${headerFontSize} !important;height:${finalRowHeight}px !important;min-height:${finalRowHeight}px !important;max-height:${maxRowHeight}px !important;vertical-align:middle !important;">משקל</th>`;
      }
      
      html += '</tr></thead><tbody>';
      
      // חלוקה לשתי שורות אם יש יותר מ-3 פריטים
      const renderItemRow = (item) => {
        const rowClasses = [];
        let partDesText = item.itemsKey || item.partDes || '';
        
        
        // אם partDesText ריק, ננסה לקחת מ-partName
        if (!partDesText && item.partName) {
          partDesText = item.partName;
        }
        
        // אם עדיין ריק, נציג הודעה
        if (!partDesText) {
          console.warn('renderItemRow - partDesText ריק עבור פריט:', item);
          partDesText = 'פריט ללא תיאור';
        }
        
        // זיהוי אם זה אלרגני, צמחוני או מרק
        const isSoupRow = partDesText.toLowerCase().includes('מרק');

        if (item.hasNoAllergen || partDesText.includes('אלרגני') || partDesText.includes('ללא אלרגנים')) {
          rowClasses.push('label-row-no-allergen');
          if (!partDesText.includes('אלרגני') && !partDesText.includes('ללא אלרגנים')) {
            partDesText += ' (אלרגני)';
          }
        } else if (item.isVegetarian) {
          // צמחוני מזוהה לפי Y_36827_0_ESH (שדה בוליאני)
          rowClasses.push('label-row-vegetarian');
        } else if (isSoupRow) {
          // מרק - רקע צהוב
          rowClasses.push('label-row-soup');
        }

        // קביעת רקע תא לפי סוג השורה - צבע חזק יותר לאלרגני/צמחוני/מרק
        const isNoAllergenRow = rowClasses.includes('label-row-no-allergen');
        const isVegetarianRow = rowClasses.includes('label-row-vegetarian');
        const isSoupStyleRow = rowClasses.includes('label-row-soup');
        // בדיקת הדגשה ידנית מהמשתמש
        const highlightColor = getHighlightColor(partDesText);
        // צבעים חזקים יותר שיגברו על צבע החמגשית - הדגשה ידנית מקבלת עדיפות
        const rowBgColor = highlightColor ? highlightColor : (isNoAllergenRow ? '#ff5252' : (isVegetarianRow ? '#64b5f6' : (isSoupStyleRow ? '#fff59d' : '#fff')));
        
        let rowHtml = `<tr class="${rowClasses.join(' ')}">`;
        
        // חישוב padding וגודל טקסט דינמי - אם יש הרבה פריטים, נקטין את ה-padding והטקסט
        // חישוב דינמי יותר - בהתאם לגובה השורה
        // עבור שורות אלרגניות - נשתמש בגובה מינימלי גדול יותר, אבל לא יותר מדי
        const isAllergenRow = item.hasNoAllergen || partDesText.includes('אלרגני') || partDesText.includes('ללא אלרגנים');
        const allergenRowMinHeight = 20; // גובה מינימלי לשורות אלרגניות (הורדתי מ-22 ל-20)
        const effectiveRowHeight = isAllergenRow ? Math.max(finalRowHeight, allergenRowMinHeight) : finalRowHeight;
        
        let cellPadding, cellFontSize, cellLineHeight, numberFontSize;
        // פונטים מוגדלים באופן יחסי - מספרים תמיד גדולים יותר (2.8em)
        numberFontSize = '2.8em';
        if (effectiveRowHeight < 10) {
          cellPadding = '1px';
          cellFontSize = '0.9em';
          cellLineHeight = '1.0';
        } else if (effectiveRowHeight < 12) {
          cellPadding = '1px';
          cellFontSize = '0.95em';
          cellLineHeight = '1.0';
        } else if (effectiveRowHeight < 15) {
          cellPadding = '1px';
          cellFontSize = '1.05em';
          cellLineHeight = '1.1';
        } else if (effectiveRowHeight < 18) {
          cellPadding = '1px';
          cellFontSize = '1.1em';
          cellLineHeight = '1.15';
        } else if (effectiveRowHeight < 22) {
          cellPadding = '1px';
          cellFontSize = '1.15em';
          cellLineHeight = '1.2';
        } else if (effectiveRowHeight < 25) {
          cellPadding = '2px';
          cellFontSize = '1.2em';
          cellLineHeight = '1.25';
        } else if (effectiveRowHeight < 30) {
          cellPadding = '2px';
          cellFontSize = '1.3em';
          cellLineHeight = '1.3';
        } else {
          cellPadding = '3px';
          cellFontSize = '1.4em';
          cellLineHeight = '1.3';
        }
        
        // בדיקה אם זה פריט חמגשית או תפזורת
        // פריטים אלרגניים או צמחוניים תמיד מוצגים כחמגשית!
        const isAllergenOrVegetarian = item.hasNoAllergen || item.isVegetarian ||
                                        partDesText.includes('אלרגני') || partDesText.includes('ללא אלרגנים');
        const itemIsTray = item.isTray === true || isAllergenOrVegetarian;

        // בדיקה אם יש רק חמגשית (ללא תפזורת) - נשתמש במשתנים שנקבעו לפני הפונקציה
        // אם יש פריט אלרגני/צמחוני - גם הוא נחשב כחמגשית לעניין זה
        const isTrayOnly = (hasTrayItems && !hasNonTrayItems && !isMixedMode) || isAllergenOrVegetarian;

        if (itemIsTray && isTrayOnly) {
          // עבור חמגשית בלבד - 2 עמודות: כמות ותיאור מוצר
          const traySize = item.traySize || (item.eatQuantSmall > 0 && item.eatQuantLarge === 0 ? 'small' : 'large');
          const eatQuant = item.eatQuant || item.totalQuantity || 0;
          
          // זיהוי גודל חמגשית - קטנה=ירוק, גדולה=אפור
          // אבל אם יש הדגשה ידנית, אלרגני או צמחוני - נשתמש ב-rowBgColor
          let quantityBgColor = traySize === 'large' ? '#d3d3d3' : '#c8e6c9'; // גדולה=אפור, קטנה=ירוק
          let productBgColor = '#e0e0e0'; // רקע רגיל לתיאור מוצר

          // אם יש הדגשה ידנית, אלרגני או צמחוני - נשתמש ב-rowBgColor לכל התאים
          if (highlightColor || isNoAllergenRow || isVegetarianRow) {
            quantityBgColor = rowBgColor;
            productBgColor = rowBgColor;
          }
          
          rowHtml += `<td style="border:1px solid #000 !important;padding:${cellPadding} !important;text-align:right !important;background:${productBgColor} !important;font-size:${cellFontSize} !important;min-height:${effectiveRowHeight}px !important;max-height:${maxRowHeight}px !important;height:${effectiveRowHeight}px !important;vertical-align:middle !important;line-height:${cellLineHeight} !important;">${partDesText}</td>`;
          rowHtml += `<td style="border:1px solid #000 !important;padding:${cellPadding} !important;text-align:center !important;font-weight:bold !important;background:${quantityBgColor} !important;font-size:${numberFontSize} !important;min-height:${effectiveRowHeight}px !important;max-height:${maxRowHeight}px !important;height:${effectiveRowHeight}px !important;vertical-align:middle !important;line-height:${cellLineHeight} !important;">${eatQuant > 0 ? eatQuant.toFixed(0) : ''}</td>`;
        } else if (itemIsTray) {
          // עבור חמגשית במצב מעורב - 5 עמודות: מוצר, מיכלים (ריק), מארז קטן/גדול, כמות (ריק בצד שמאל)
          const traySize = item.traySize || 'small';
          const eatQuant = item.eatQuant || item.totalQuantity || 0;

          // בדיקה אם הכשרות היא חב"ד (בפרמטר 6 למוצר - PSPEC6)
          const pspec6 = String(item.pspec6 || item.PSPEC6 || '').trim().toLowerCase();
          const isChabadInPSPEC6 = pspec6.includes('חבד') || pspec6.includes('חב"ד') || pspec6.includes('חב\'ד');

          // רק אם הכשרות היא חב"ד - להציג מארז 5 ומארז 7
          const pack5 = (isChabadInPSPEC6 && traySize === 'small') ? eatQuant : 0;
          const pack7 = (isChabadInPSPEC6 && traySize === 'large') ? eatQuant : 0;

          rowHtml += `<td style="border:1px solid #000 !important;padding:${cellPadding} !important;text-align:right !important;background:${rowBgColor} !important;font-size:${cellFontSize} !important;min-height:${effectiveRowHeight}px !important;max-height:${maxRowHeight}px !important;height:${effectiveRowHeight}px !important;vertical-align:middle !important;line-height:${cellLineHeight} !important;">${partDesText}</td>`;
          rowHtml += `<td style="border:1px solid #000 !important;padding:${cellPadding} !important;text-align:center !important;font-weight:bold !important;background:${rowBgColor} !important;font-size:${numberFontSize} !important;min-height:${effectiveRowHeight}px !important;max-height:${maxRowHeight}px !important;height:${effectiveRowHeight}px !important;vertical-align:middle !important;line-height:${cellLineHeight} !important;"></td>`; // מיכלים ריק
          rowHtml += `<td style="border:1px solid #000 !important;padding:${cellPadding} !important;text-align:center !important;font-weight:bold !important;background:${rowBgColor} !important;font-size:${numberFontSize} !important;min-height:${effectiveRowHeight}px !important;max-height:${maxRowHeight}px !important;height:${effectiveRowHeight}px !important;vertical-align:middle !important;line-height:${cellLineHeight} !important;">${pack5 > 0 ? pack5.toFixed(0) : ''}</td>`;
          rowHtml += `<td style="border:1px solid #000 !important;padding:${cellPadding} !important;text-align:center !important;font-weight:bold !important;background:${rowBgColor} !important;font-size:${numberFontSize} !important;min-height:${effectiveRowHeight}px !important;max-height:${maxRowHeight}px !important;height:${effectiveRowHeight}px !important;vertical-align:middle !important;line-height:${cellLineHeight} !important;">${pack7 > 0 ? pack7.toFixed(0) : ''}</td>`;
          rowHtml += `<td style="border:1px solid #000 !important;padding:${cellPadding} !important;text-align:center !important;font-weight:bold !important;background:${rowBgColor} !important;font-size:${numberFontSize} !important;min-height:${effectiveRowHeight}px !important;max-height:${maxRowHeight}px !important;height:${effectiveRowHeight}px !important;vertical-align:middle !important;line-height:${cellLineHeight} !important;">${eatQuant > 0 ? eatQuant.toFixed(0) : ''}</td>`; // כמות לחמגשית
        } else {
          // עבור תפזורת - 5 עמודות: מוצר מימין, מיכלים, מארז קטן, מארז גדול, כמות (בצד שמאל)
          // כמות - sumQuant לתפזורת רגילה, או eatQuant/totalQuantity לשורות אלרגני
          const rawQuantity = item.sumQuant || item.eatQuant || item.totalQuantity || 0;
          const quantity = rawQuantity > 0 ? (rawQuantity % 1 === 0 ? rawQuantity.toFixed(0) : rawQuantity.toFixed(2)) : '';
          const containers = item.sumContainers ? item.sumContainers.toFixed(0) : '';
          const pack5 = item.sumPack5 ? item.sumPack5.toFixed(0) : '';
          const pack7 = item.sumPack7 ? item.sumPack7.toFixed(0) : '';

          rowHtml += `<td style="border:1px solid #000 !important;padding:${cellPadding} !important;text-align:right !important;background:${rowBgColor} !important;font-size:${cellFontSize} !important;min-height:${effectiveRowHeight}px !important;max-height:${maxRowHeight}px !important;height:${effectiveRowHeight}px !important;vertical-align:middle !important;line-height:${cellLineHeight} !important;">${partDesText}</td>`;
          rowHtml += `<td style="border:1px solid #000 !important;padding:${cellPadding} !important;text-align:center !important;font-weight:bold !important;background:${rowBgColor} !important;font-size:${numberFontSize} !important;min-height:${effectiveRowHeight}px !important;max-height:${maxRowHeight}px !important;height:${effectiveRowHeight}px !important;vertical-align:middle !important;line-height:${cellLineHeight} !important;">${containers}</td>`;
          rowHtml += `<td style="border:1px solid #000 !important;padding:${cellPadding} !important;text-align:center !important;font-weight:bold !important;background:${rowBgColor} !important;font-size:${numberFontSize} !important;min-height:${effectiveRowHeight}px !important;max-height:${maxRowHeight}px !important;height:${effectiveRowHeight}px !important;vertical-align:middle !important;line-height:${cellLineHeight} !important;">${pack5}</td>`;
          rowHtml += `<td style="border:1px solid #000 !important;padding:${cellPadding} !important;text-align:center !important;font-weight:bold !important;background:${rowBgColor} !important;font-size:${numberFontSize} !important;min-height:${effectiveRowHeight}px !important;max-height:${maxRowHeight}px !important;height:${effectiveRowHeight}px !important;vertical-align:middle !important;line-height:${cellLineHeight} !important;">${pack7}</td>`;
          rowHtml += `<td style="border:1px solid #000 !important;padding:${cellPadding} !important;text-align:center !important;font-weight:bold !important;background:${rowBgColor} !important;font-size:${numberFontSize} !important;min-height:${effectiveRowHeight}px !important;max-height:${maxRowHeight}px !important;height:${effectiveRowHeight}px !important;vertical-align:middle !important;line-height:${cellLineHeight} !important;">${quantity}</td>`;
        }
        
        rowHtml += '</tr>';
        return rowHtml;
      };
      
      // הצגת כל הפריטים במדבקה אחת - ללא הגבלה, גובה דינמי
      // שמירת המנות לאוסף גלובלי (להדגשות)
      if (!window.labelsDishesSet) window.labelsDishesSet = new Set();
      itemsArray.forEach(item => {
        html += renderItemRow(item);
        // שמירת שם המנה/שילוב לאוסף
        const dishName = (item.itemsKey || item.partDes || '').trim()
          .replace(/\s*\(אלרגני\)\s*/g, '')
          .replace(/\s*\(ללא אלרגנים\)\s*/g, '')
          .replace(/\s*\(צמחוני\)\s*/g, '')
          .trim();
        if (dishName && dishName.length > 2) {
          window.labelsDishesSet.add(dishName);
        }
      });
      
      html += '</tbody></table>';
      html += '</div>'; // סוגר את ה-div שמגביל את הגובה

      // אם זה חמגשית בלבד (tray only) וכשרות חבד - הוספת שורת מארז 5/7
      // רק במדבקות חמות! לא במדבקות קרות
      const hasTrayItemsOnly = itemsArray.every(item => item.isTray === true);
      if (!isColdLabel && hasTrayItemsOnly && itemsArray.length > 0) {
        // בדיקה אם כשרות הלקוח (SPEC2 של ההזמנה) היא חבד - לא בדץ
        const spec2 = String(order.spec2 || '').trim().toLowerCase();
        const hasChabadKashrut = spec2.includes('חבד') || spec2.includes('חב"ד') || spec2.includes('חב\'ד') ||
                                  spec2.includes('נחלת') || spec2.includes('ירוסלבסקי') || spec2.includes('ביסטריצקי');

        if (hasChabadKashrut) {
          // קיבוץ לפי שם מוצר מקורי - רק פריטים שיש להם PACK5 או PACK7
          // נחזור לפריטים המקוריים מ-trayItemsRaw
          const packsByProduct = {};

          // עוברים על הפריטים המקוריים של החמגשיות (לא המקובצים)
          trayItemsRaw.forEach(item => {
            // שליפת PACK5 ו-PACK7 מהפריט המקורי
            const pack5 = parseFloat(item.pack5 || item.PACK5 || 0) || 0;
            const pack7 = parseFloat(item.pack7 || item.PACK7 || 0) || 0;

            // רק אם יש מארז 5 או מארז 7
            if (pack5 > 0 || pack7 > 0) {
              const productName = String(item.partDes || item.PARTDES || '').trim();

              if (productName) {
                if (!packsByProduct[productName]) {
                  packsByProduct[productName] = { pack5: 0, pack7: 0 };
                }

                packsByProduct[productName].pack5 += pack5;
                packsByProduct[productName].pack7 += pack7;
              }
            }
          });

          // לוג לבדיקה
          console.log('🔍 מארזים - הזמנה:', order.orderName, 'SPEC2:', order.spec2);
          console.log('🔍 מארזים - packsByProduct:', packsByProduct);

          // הוספת שורת מארז לכל מוצר - ללא רווחים
          html += '<div style="margin-top:2px !important;margin-bottom:0 !important;">';
          html += '<table style="width:100% !important;border-collapse:collapse !important;border:1px solid #000 !important;margin:0 !important;">';
          html += '<tbody>';

          Object.entries(packsByProduct).forEach(([productName, packs]) => {
            html += '<tr>';
            html += `<td style="border:1px solid #000 !important;padding:8px !important;text-align:right !important;background:#e0e0e0 !important;font-size:1.2em !important;font-weight:bold !important;min-height:40px !important;vertical-align:middle !important;line-height:1.3 !important;">${productName}</td>`;
            html += `<td style="border:1px solid #000 !important;padding:8px !important;text-align:center !important;background:#c8e6c9 !important;font-size:1.2em !important;font-weight:bold !important;width:25% !important;min-height:40px !important;vertical-align:middle !important;line-height:1.3 !important;">${packs.pack5 > 0 ? packs.pack5.toFixed(0) : ''}</td>`;
            html += `<td style="border:1px solid #000 !important;padding:8px !important;text-align:center !important;background:#d3d3d3 !important;font-size:1.2em !important;font-weight:bold !important;width:25% !important;min-height:40px !important;vertical-align:middle !important;line-height:1.3 !important;">${packs.pack7 > 0 ? packs.pack7.toFixed(0) : ''}</td>`;
            html += '</tr>';
          });

          html += '</tbody></table>';
          html += '</div>';
        }
      }
      } // סוגר את ה-else של מדבקות חם

      // אזור שלישי - מקום להערות - מוקטן מאוד
      html += `<div style="height:${notesHeight}px !important;min-height:${notesHeight}px !important;margin-bottom:0 !important;padding:2px !important;border:1px solid #ccc !important;font-size:1.0em !important;flex-shrink:0 !important;box-sizing:border-box !important;">`;
      // אם יש אלרגנים - להוסיף "ללא שומשום"
      if (hasNoAllergen) {
        html += '<div style="color:#d32f2f !important;font-weight:bold !important;font-size:1.0em !important;">ללא שומשום</div>';
      }
      html += '</div>';

      // אזור רביעי - קונטקט טקסט בתחתית (position absolute) - מוקטן
      html += `<div class="label-footer" style="position:absolute !important;bottom:0 !important;left:0 !important;right:0 !important;width:100% !important;text-align:center !important;font-size:0.8em !important;font-weight:normal !important;padding:2px !important;border-top:1px solid #ccc !important;background:#fff !important;box-sizing:border-box !important;height:${footerHeight}px !important;display:flex !important;flex-direction:column !important;justify-content:center !important;align-items:center !important;">${contactText}</div>`;
      
      html += '</div>';
    };

    // פונקציה עזר לזיהוי אם פריט הוא קר או חם
    // לוגיקה: מוצר ייחשב קר רק אם יש לו במפורש cartonType שמכיל "קר".
    // אחרת (כולל אם אין cartonType בכלל) - ייחשב לחם.
    const isHotItem = (item) => {
      const cartonTypeStr = String(item.cartonType || '').trim().toLowerCase();
      const pspec6Str = String(item.pspec6 || item.PSPEC6 || '').trim().toLowerCase();

      // אם מוגדר במפורש כקר - זה לא חם
      const isCold = cartonTypeStr.includes('קר') || cartonTypeStr.includes('קרים') ||
                     pspec6Str.includes('קר') || pspec6Str.includes('קרים');
      if (isCold) return false;

      // אחרת - חם (ברירת מחדל, כולל אם אין cartonType)
      return true;
    };
    
    // קיבוץ כל הפריטים מאותה הזמנה יחד - הפרדה רק לפי חם/קר
    // חלוקה לפי קר/חם
    const hotTrayItems = [];
    const coldTrayItems = [];
    const hotNonTrayItems = [];
    const coldNonTrayItems = [];
    
    // קיבוץ פריטי חמגשית לפי חם/קר
    trayItemsRaw.forEach(item => {
      if (isHotItem(item)) {
        hotTrayItems.push(item);
      } else {
        coldTrayItems.push(item);
      }
    });
    
    // קיבוץ פריטי תפזורת לפי חם/קר
    Object.entries(nonTrayItemsMap).forEach(([key, item]) => {
      if (isHotItem(item)) {
        hotNonTrayItems.push({
          ...item,
          itemsKey: item.partDes || item.partName || ''
        });
      } else {
        coldNonTrayItems.push({
          ...item,
          itemsKey: item.partDes || item.partName || ''
        });
      }
    });
    
    // יצירת מדבקה אחת לכל הזמנה - עבור חמים
    if ((hotTrayItems.length > 0 || hotNonTrayItems.length > 0) && (labelsMode === 'all' || labelsMode === 'hot')) {
      // קיבוץ כל פריטי החמגשית החמים
      const allHotTrayItems = [];
      if (hotTrayItems.length > 0) {
        // חלוקה לפי גודל חמגשית (קטנה/גדולה)
        const smallTrayItems = [];
        const largeTrayItems = [];
        
        hotTrayItems.forEach(item => {
          const packDes = String(item.packDes || item.PACKDES || '').toLowerCase();
          const packMethodCode = String(item.packMethodCode || item.PACKMETHODCODE || '').toLowerCase();
          const isLarge = packDes.includes('גד') || packDes.includes('גדול') || packDes.includes('גדולה') ||
                          packMethodCode.includes('גד') || packMethodCode.includes('גדול');
          
          if (isLarge) {
            largeTrayItems.push(item);
          } else {
            smallTrayItems.push(item);
          }
        });
        
        // קיבוץ פריטים לפי ארוחה
        if (smallTrayItems.length > 0) {
          const groupedSmallTray = groupTrayItemsByMeal(smallTrayItems, order);
          allHotTrayItems.push(...groupedSmallTray.map(item => ({...item, isTray: true, traySize: 'small'})));
        }
        if (largeTrayItems.length > 0) {
          const groupedLargeTray = groupTrayItemsByMeal(largeTrayItems, order);
          allHotTrayItems.push(...groupedLargeTray.map(item => ({...item, isTray: true, traySize: 'large'})));
        }
      }
      
      // יצירת מדבקה אחת עם כל הפריטים (חמגשית ותפזורת)
      const allHotItems = [...allHotTrayItems, ...hotNonTrayItems.map(item => ({...item, isTray: false}))];

      // סידור הפריטים במדבקה לפי קטגוריה: מנה עיקרית → פחמימה → ירק → אחר
      const getCatPriority = (it) => {
        if (typeof it._catPriority === 'number') return it._catPriority;
        const p = String(it.pspec1 || it.PSPEC1 || '').trim().toLowerCase();
        if (p.includes('עיקר')) return 0;
        if (p.includes('פחמימה')) return 1;
        if (p.includes('ירק')) return 2;
        return 3;
      };
      allHotItems.sort((a, b) => getCatPriority(a) - getCatPriority(b));
      if (allHotItems.length > 0) {
        // חישוב מספר קרטונים נדרש
        const hasTrayOnly = allHotItems.every(item => item.isTray === true);
        let cartonsNeeded = 1;

        if (hasTrayOnly) {
          // חמגשית - לפי מספר חמגשיות
          const smallTrays = allHotItems.filter(item => item.traySize === 'small');
          const largeTrays = allHotItems.filter(item => item.traySize === 'large');
          const totalSmall = smallTrays.reduce((sum, item) => sum + (item.eatQuant || item.totalQuantity || 0), 0);
          const totalLarge = largeTrays.reduce((sum, item) => sum + (item.eatQuant || item.totalQuantity || 0), 0);

          // חישוב קרטונים לפי גודל חמגשית
          const smallCartons = totalSmall > 0 ? Math.ceil(totalSmall / CARTON_CONFIG.hotTray.smallTrayPerCarton) : 0;
          const largeCartons = totalLarge > 0 ? Math.ceil(totalLarge / CARTON_CONFIG.hotTray.largeTrayPerCarton) : 0;
          cartonsNeeded = Math.max(smallCartons, largeCartons, 1);
        } else {
          // תפזורת - לפי מיכלים ומארזים
          const totalContainers = allHotItems.reduce((sum, item) => {
            if (item.isTray) return sum;
            return sum + (item.sumContainers || 0) + (item.sumPack5 || 0) + (item.sumPack7 || 0);
          }, 0);
          cartonsNeeded = Math.ceil(totalContainers / CARTON_CONFIG.hotLoose.containersPerCarton) || 1;
        }

        // הגבלה למקסימום 3 קרטונים
        cartonsNeeded = Math.min(cartonsNeeded, 3);

        if (cartonsNeeded <= 1) {
          // קרטון בודד - כמו קודם
          renderLabelSticker(allHotItems, false, '', 'hot');
        } else {
          // מספר קרטונים - יצירת מדבקה לכל קרטון
          const dividedCartons = divideItemsToCartons(
            allHotItems.map(item => ({
              name: item.itemsKey || item.partDes || item.partName || '',
              quantity: item.eatQuant || item.totalQuantity || item.sumQuant || 0,
              containers: item.sumContainers || 0,
              pack5: item.sumPack5 || 0,
              pack7: item.sumPack7 || 0,
              traySize: item.traySize || '',
              ...item
            })),
            cartonsNeeded,
            hasTrayOnly ? 'hotTray' : 'hotLoose'
          );

          dividedCartons.forEach((carton, index) => {
            // עדכון הפריטים עם הכמויות המחולקות
            const cartonItems = carton.items.map(item => ({
              ...item,
              eatQuant: item.quantity,
              totalQuantity: item.quantity,
              sumContainers: item.containers,
              sumPack5: item.pack5,
              sumPack7: item.pack7
            }));
            renderLabelSticker(cartonItems, false, '', 'hot', index + 1, cartonsNeeded);
          });
        }
      }
    }
    
    // יצירת מדבקה אחת לכל הזמנה - עבור קרים
    // למדבקות קר - תמיד מדבקה אחת בלבד (עם 2 עמודות אם יש הרבה פריטים)
    if (coldRawItems.length > 0 && (labelsMode === 'all' || labelsMode === 'cold')) {
      const allColdItems = coldRawItems.map(item => ({...item, isTray: false}));
      if (allColdItems.length > 0) {
        renderLabelSticker(allColdItems, false, '', 'cold');
      }
    }
  });
  
  html += '</div>';
  container.innerHTML = html;
  
  // שמירה למטרות CSV
  window.labelsGroupedData = ordersArray;
}

function renderLabelsTable(data, container) {
  // קיבוץ לפי קו חלוקה, סדר הפצה והזמנה
  const grouped = {};
  
  data.forEach(row => {
    const distrLine = row.DISTRLINECODE || 'ללא';
    const distrOrder = row.PRIT_DISTRORDER || 0;
    const orderName = row.ORDNAME || 'ללא';
    const key = `${distrLine}|${distrOrder}|${orderName}`;
    
    if (!grouped[key]) {
      // כמות מנות - לקחת רק פעם אחת לכל הזמנה (לא לכפול לפי פריטים)
      const eatQuant = parseFloat(row.EATQUANT) || 0;
      
      grouped[key] = {
        distrLine: distrLine,
        distrLineDes: row.DISTRLINEDES || '',
        distrOrder: distrOrder,
        orderName: orderName,
        codeDes: row.CODEDES || '', // תיאור אתר
        customerName: row.CUSTDES || '',
        address: row.ADDRESS || '',
        city: row.STATE || '',
        phone: row.PHONENUM || '',
        eatQuant: eatQuant, // כמות מנות - רק פעם אחת לכל הזמנה
        eatQuantNoAllergen: 0, // כמות מנות ללא אלרגני
        coldItems: {}, // מנות קר - אובייקט לסכימה לפי מקט
        hotItems: {},   // מנות חם - אובייקט לסכימה לפי מקט
        noAllergenColdItems: {}, // מנות קר ללא אלרגני
        noAllergenHotItems: {}   // מנות חם ללא אלרגני
      };
    }
    
    // זיהוי אם זה קר או חם לפי PSPEC6 או שדה אחר
    const isHot = (row.PSPEC6 && row.PSPEC6.toString().toLowerCase().includes('חם')) || 
                  (row.PSPEC3 && row.PSPEC3.toString().toLowerCase().includes('חם'));
    
    // זיהוי אם זה ללא אלרגני - נבדוק ב-SPEC2 או PSPEC2
    const isNoAllergen = (row.SPEC2 && row.SPEC2.toString().toLowerCase().includes('ללא אלרגני')) ||
                         (row.PSPEC2 && row.PSPEC2.toString().toLowerCase().includes('ללא אלרגני')) ||
                         (row.SPEC2 && row.SPEC2.toString().toLowerCase().includes('לא אלרגני')) ||
                         (row.PSPEC2 && row.PSPEC2.toString().toLowerCase().includes('לא אלרגני'));
    
    const partName = row.PARTNAME || '';
    const partDes = row.PARTDES || '';
    const partKey = `${partName}|${partDes}`;
    
    // אם יש ללא אלרגני, להוסיף לכמות מנות נפרדת
    if (isNoAllergen) {
      const eatQuant = parseFloat(row.EATQUANT) || 0;
      if (eatQuant > 0) {
        // אם זו הפעם הראשונה שמוצאים ללא אלרגני בהזמנה זו, נקח את הכמות
        // אם יש עוד שורות ללא אלרגני, נסכם את הכמויות
        if (grouped[key].eatQuantNoAllergen === 0) {
          // הפעם הראשונה - נקח את הכמות מהשורה הראשונה
          grouped[key].eatQuantNoAllergen = eatQuant;
        } else {
          // כבר יש כמות - נוסיף רק אם הכמות גדולה יותר (כי כל שורה יכולה להיות מנה שונה)
          // או נשתמש בכמות המקסימלית
          grouped[key].eatQuantNoAllergen = Math.max(grouped[key].eatQuantNoAllergen, eatQuant);
        }
      }
      
      // הוספת פריט לרשימת ללא אלרגני
      if (isHot) {
        if (!grouped[key].noAllergenHotItems[partKey]) {
          grouped[key].noAllergenHotItems[partKey] = {
            partName: partName,
            partDes: partDes
          };
        }
      } else {
        if (!grouped[key].noAllergenColdItems[partKey]) {
          grouped[key].noAllergenColdItems[partKey] = {
            partName: partName,
            partDes: partDes
          };
        }
      }
    } else {
      // פריט רגיל
      if (isHot) {
        if (!grouped[key].hotItems[partKey]) {
          grouped[key].hotItems[partKey] = {
            partName: partName,
            partDes: partDes
          };
        }
      } else {
        if (!grouped[key].coldItems[partKey]) {
          grouped[key].coldItems[partKey] = {
            partName: partName,
            partDes: partDes
          };
        }
      }
    }
  });
  
  // המרה למערך ומיון
  const groupedArray = Object.values(grouped).sort((a, b) => {
    if (a.distrLine !== b.distrLine) return a.distrLine.localeCompare(b.distrLine);
    if (a.distrOrder !== b.distrOrder) return a.distrOrder - b.distrOrder;
    return a.orderName.localeCompare(b.orderName);
  });
  
  // יצירת טבלה
  let html = '<table><thead><tr>';
  html += '<th>קו חלוקה</th><th>סדר הפצה</th><th>הזמנה</th><th>תיאור אתר</th><th>לקוח</th>';
  html += '<th>כתובת</th><th>עיר</th><th>טלפון</th>';
  html += '<th>מנות קר</th><th>מנות חם</th><th>סה"כ מנות</th>';
  html += '<th>מנות קר ללא אלרגני</th><th>מנות חם ללא אלרגני</th><th>סה"כ מנות ללא אלרגני</th>';
  html += '</tr></thead><tbody>';
  
  groupedArray.forEach(group => {
    html += '<tr style="background:#f0f0f0;">';
    html += `<td><strong>${group.distrLine}</strong><br>${group.distrLineDes}</td>`;
    html += `<td>${group.distrOrder}</td>`;
    html += `<td><strong>${group.orderName}</strong></td>`;
    html += `<td>${group.codeDes}</td>`; // תיאור אתר
    html += `<td>${group.customerName}</td>`;
    html += `<td>${group.address}</td>`;
    html += `<td>${group.city}</td>`;
    html += `<td>${group.phone}</td>`;
    
    // מנות קר - המרה מאובייקט למערך (רק רשימת פריטים, בלי כמות)
    const coldItemsArray = Object.values(group.coldItems || {});
    let coldText = coldItemsArray.map(item => {
      let label = item.partDes || item.partName || '';
      if (item.isNoAllergen) {
        label = `<span class="label-row-no-allergen">${label} (ללא אלרגנים)</span>`;
      } else if (item.isVegetarian) {
        label = `<span class="label-row-vegetarian">${label} (צמחוני)</span>`;
      }
      return label;
    }).join('<br>');
    const coldCount = coldItemsArray.length;
    html += `<td>${coldText || '-'}${coldCount > 0 ? `<br><small>(${coldCount} פריטים)</small>` : ''}</td>`;
    
    // מנות חם - המרה מאובייקט למערך (רק רשימת פריטים, בלי כמות)
    const hotItemsArray = Object.values(group.hotItems || {});
    let hotText = hotItemsArray.map(item => {
      let label = item.partDes || item.partName || '';
      if (item.isNoAllergen) {
        label = `<span class="label-row-no-allergen">${label} (ללא אלרגנים)</span>`;
      } else if (item.isVegetarian) {
        label = `<span class="label-row-vegetarian">${label} (צמחוני)</span>`;
      }
      return label;
    }).join('<br>');
    const hotCount = hotItemsArray.length;
    html += `<td>${hotText || '-'}${hotCount > 0 ? `<br><small>(${hotCount} פריטים)</small>` : ''}</td>`;
    
    // סה"כ מנות - הכמות מהזמנה (לא מוכפל)
    const totalQty = group.eatQuant.toFixed(0);
    html += `<td style="font-weight:bold;background:#e8f5e9;">${totalQty}</td>`;
    
    // מנות קר ללא אלרגני
    const noAllergenColdArray = Object.values(group.noAllergenColdItems || {});
    let noAllergenColdText = noAllergenColdArray.map(item => item.partDes || item.partName || '').join('<br>');
    const noAllergenColdCount = noAllergenColdArray.length;
    html += `<td style="background:#fff9c4;">${noAllergenColdText || '-'}${noAllergenColdCount > 0 ? `<br><small>(${noAllergenColdCount} פריטים)</small>` : ''}</td>`;
    
    // מנות חם ללא אלרגני
    const noAllergenHotArray = Object.values(group.noAllergenHotItems || {});
    let noAllergenHotText = noAllergenHotArray.map(item => item.partDes || item.partName || '').join('<br>');
    const noAllergenHotCount = noAllergenHotArray.length;
    html += `<td style="background:#fff9c4;">${noAllergenHotText || '-'}${noAllergenHotCount > 0 ? `<br><small>(${noAllergenHotCount} פריטים)</small>` : ''}</td>`;
    
    // סה"כ מנות ללא אלרגני
    const totalNoAllergenQty = (group.eatQuantNoAllergen || 0).toFixed(0);
    html += `<td style="font-weight:bold;background:#fff9c4;">${totalNoAllergenQty > 0 ? totalNoAllergenQty : '-'}</td>`;
    
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
  
  window.labelsGroupedData = groupedArray;
}

// הורדת CSV לדוח סיכום
function downloadSummaryCSV() {
  if (!window.summaryData || window.summaryData.length === 0) {
    alert('אין נתונים להורדה');
    return;
  }
  
  let csv = '\uFEFFלפי קטגוריה,תיאור מוצר,ס"ה מנות,ס"ה לייצור\n';
  
  let grandTotal = 0;
  let grandTotalEatQuant = 0;
  window.summaryData.forEach(item => {
    csv += `"${item.pspec1 || ''}","${item.partDes || ''}",${item.totalEatQuant > 0 ? item.totalEatQuant.toFixed(0) : ''},${item.totalQuantity.toFixed(2)}\n`;
    grandTotal += item.totalQuantity;
    grandTotalEatQuant += (item.totalEatQuant || 0);
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `summary_${document.getElementById('dateInput').value}.csv`;
  link.click();
}

// הורדת CSV לדוח חמגשיות
function downloadTraysCSV() {
  if (!window.traysData || window.traysData.length === 0) {
    alert('אין נתונים להורדה');
    return;
  }
  
  const groupedArray = window.traysData;
  
  // מציאת המספר המקסימלי של פריטים
  let maxItems = 0;
  groupedArray.forEach(group => {
    if (group.items.length > maxItems) {
      maxItems = group.items.length;
    }
  });
  
  // יצירת כותרות CSV
  let csv = '\uFEFFמספר הזמנה';
  for (let i = 1; i <= maxItems; i++) {
    csv += `,פריט ${i}`;
  }
  csv += ',גודל חמגשית,סה"כ מנות\n';
  
  // שורות נתונים
  groupedArray.forEach(group => {
    // מספרי הזמנות
    const orderNameDisplay = group.orderNames.length === 1 
      ? group.orderNames[0] 
      : `${group.orderNames[0]} (${group.orderNames.length} הזמנות)`;
    
    csv += `"${orderNameDisplay}"`;
    
    // לכל פריט (ללא סוגריים)
    for (let i = 0; i < maxItems; i++) {
      if (i < group.items.length) {
        const item = group.items[i];
        const partDes = item.partDes;
        
        csv += `,"${partDes}"`;
      } else {
        csv += ',""';
      }
    }
    
    // גודל חמגשית
    csv += `,"${group.traySize}"`;
    
    // סה"כ מנות
    csv += `,${group.totalQuantity.toFixed(0)}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `trays_${document.getElementById('dateInput').value}.csv`;
  link.click();
}

// הורדת CSV לדוח מיכלים
function downloadContainersCSV() {
  if (!window.containersData || window.containersData.length === 0) {
    alert('אין נתונים להורדה');
    return;
  }
  
  let csv = '\uFEFFתיאור מיכל,תיאור מוצר,כמות מיכלים,סה"כ מארז 5,סה"כ מארז 7\n';
  
  let grandTotalContainers = 0;
  let grandTotalPack5 = 0;
  let grandTotalPack7 = 0;
  window.containersData.forEach(item => {
    csv += `"${item.packDes || ''}","${item.partDes || ''}",${item.totalContainers > 0 ? item.totalContainers.toFixed(0) : ''},${item.totalPack5 > 0 ? item.totalPack5.toFixed(0) : ''},${item.totalPack7 > 0 ? item.totalPack7.toFixed(0) : ''}\n`;
    grandTotalContainers += item.totalContainers;
    grandTotalPack5 += item.totalPack5;
    grandTotalPack7 += item.totalPack7;
  });
  
  csv += `"סה"כ כללי","",${grandTotalContainers > 0 ? grandTotalContainers.toFixed(0) : ''},${grandTotalPack5 > 0 ? grandTotalPack5.toFixed(0) : ''},${grandTotalPack7 > 0 ? grandTotalPack7.toFixed(0) : ''}\n`;
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `containers_${document.getElementById('dateInput').value}.csv`;
  link.click();
}

// הורדת CSV לדוח מדבקות
function downloadLabelsCSV(labelType = 'hot') {
  const dataKey = labelType === 'hot' ? 'labelsDataHot' : 'labelsDataCold';
  const labelsData = window[dataKey] || window.labelsGroupedData;

  if (!labelsData || labelsData.length === 0) {
    alert('אין נתונים להורדה');
    return;
  }
  
  let csv = '\uFEFFקו חלוקה,תיאור קו חלוקה,סדר הפצה,הזמנה,תיאור אתר,לקוח,כתובת,עיר,טלפון,מנות קר,מנות חם,סה"כ מנות,מנות קר ללא אלרגני,מנות חם ללא אלרגני,סה"כ מנות ללא אלרגני\n';

  // בדיקה אם זה מבנה NoSQL (orderName קיים) או מבנה שטוח
  if (labelsData[0] && labelsData[0].orderName) {
    // מבנה NoSQL - כבר מעובד
    labelsData.forEach(order => {
      // הפרדה בין פריטים קר וחם
      const coldItems = [];
      const hotItems = [];
      const noAllergenColdItems = [];
      const noAllergenHotItems = [];
      
      order.items.forEach(item => {
        const isHot = (item.pspec6 && item.pspec6.toString().toLowerCase().includes('חם')) || 
                      (item.pspec3 && item.pspec3.toString().toLowerCase().includes('חם'));
        const isNoAllergen = (order.spec2 && order.spec2.toString().toLowerCase().includes('ללא אלרגני')) ||
                             (item.pspec2 && item.pspec2.toString().toLowerCase().includes('ללא אלרגני'));
        
        const partKey = `${item.partName}|${item.partDes}`;
        
        if (isNoAllergen) {
          if (isHot) {
            if (!noAllergenHotItems.find(i => `${i.partName}|${i.partDes}` === partKey)) {
              noAllergenHotItems.push({ partName: item.partName, partDes: item.partDes });
            }
          } else {
            if (!noAllergenColdItems.find(i => `${i.partName}|${i.partDes}` === partKey)) {
              noAllergenColdItems.push({ partName: item.partName, partDes: item.partDes });
            }
          }
        } else {
          if (isHot) {
            if (!hotItems.find(i => `${i.partName}|${i.partDes}` === partKey)) {
              hotItems.push({ partName: item.partName, partDes: item.partDes });
            }
          } else {
            if (!coldItems.find(i => `${i.partName}|${i.partDes}` === partKey)) {
              coldItems.push({ partName: item.partName, partDes: item.partDes });
            }
          }
        }
      });
      
      const coldText = coldItems.map(item => item.partDes).join('; ');
      const hotText = hotItems.map(item => item.partDes).join('; ');
      const noAllergenColdText = noAllergenColdItems.map(item => item.partDes).join('; ');
      const noAllergenHotText = noAllergenHotItems.map(item => item.partDes).join('; ');
      
      csv += `"${order.distrLineCode || ''}","${order.distrLineDes || ''}",${order.pritDistrOrder || 0},"${order.orderName || ''}","${order.codeDes || ''}","${order.custDes || ''}","${order.address || ''}","${order.state || ''}","${order.phoneNum || ''}","${coldText}","${hotText}","${(order.eatQuant || 0).toFixed(0)}","${noAllergenColdText}","${noAllergenHotText}","${(order.eatQuantNoAllergen || 0).toFixed(0)}"\n`;
    });
  } else {
    // מבנה שטוח (legacy)
    labelsData.forEach(group => {
      const coldItemsArray = Object.values(group.coldItems || {});
      const hotItemsArray = Object.values(group.hotItems || {});
      const coldText = coldItemsArray.map(item => item.partDes).join('; ');
      const hotText = hotItemsArray.map(item => item.partDes).join('; ');
      const totalQty = (group.eatQuant || 0).toFixed(0);
      
      const noAllergenColdArray = Object.values(group.noAllergenColdItems || {});
      const noAllergenHotArray = Object.values(group.noAllergenHotItems || {});
      const noAllergenColdText = noAllergenColdArray.map(item => item.partDes).join('; ');
      const noAllergenHotText = noAllergenHotArray.map(item => item.partDes).join('; ');
      const totalNoAllergenQty = (group.eatQuantNoAllergen || 0).toFixed(0);
      
      csv += `"${group.distrLine}","${group.distrLineDes}",${group.distrOrder},"${group.orderName}","${group.codeDes || ''}","${group.customerName}","${group.address}","${group.city}","${group.phone}","${coldText}","${hotText}","${totalQty}","${noAllergenColdText}","${noAllergenHotText}","${totalNoAllergenQty}"\n`;
    });
  }
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const typeSuffix = labelType === 'hot' ? '_hot' : '_cold';
  link.download = `labels${typeSuffix}_${document.getElementById('dateInput').value}.csv`;
  link.click();
}

// אחסון גלובלי להדגשות מנות
window.highlightedDishes = window.highlightedDishes || {};

// פתיחת modal להדגשת מנות
function openHighlightDishesModal() {
  const modal = document.getElementById('highlightDishesModal');
  const listContainer = document.getElementById('highlightDishesList');

  if (!modal || !listContainer) return;

  // איסוף כל המנות/שילובים הייחודיים מהמדבקות
  const dishes = collectUniqueDishes();

  if (dishes.length === 0) {
    listContainer.innerHTML = '<p style="text-align:center;color:#999;">אין מנות להצגה. יש לטעון נתונים תחילה.</p>';
    modal.style.display = 'flex';
    return;
  }

  // צבעים להדגשה
  const colors = [
    { name: 'ללא', value: '' },
    { name: 'צהוב', value: '#FFFF00' },
    { name: 'ירוק בהיר', value: '#90EE90' },
    { name: 'ורוד', value: '#FFB6C1' },
    { name: 'תכלת', value: '#87CEEB' },
    { name: 'כתום', value: '#FFA500' },
    { name: 'סגול בהיר', value: '#DDA0DD' }
  ];

  // יצירת רשימת המנות
  let html = '';
  dishes.forEach((dish, index) => {
    const currentColor = window.highlightedDishes[dish] || '';
    html += `<div class="highlight-dish-item" style="display:flex;align-items:center;gap:10px;padding:10px;background:#f5f5f5;border-radius:5px;">`;
    html += `<span style="flex:1;font-weight:bold;word-break:break-word;">${dish}</span>`;
    html += `<select id="dishColor_${index}" data-dish="${encodeURIComponent(dish)}" style="padding:5px;border-radius:4px;border:1px solid #ccc;">`;
    colors.forEach(color => {
      const selected = currentColor === color.value ? 'selected' : '';
      const bgStyle = color.value ? `background-color:${color.value}` : '';
      html += `<option value="${color.value}" ${selected} style="${bgStyle}">${color.name}</option>`;
    });
    html += `</select>`;
    html += `</div>`;
  });

  listContainer.innerHTML = html;
  modal.style.display = 'flex';
}

// סגירת modal הדגשות
function closeHighlightDishesModal() {
  const modal = document.getElementById('highlightDishesModal');
  if (modal) modal.style.display = 'none';
}

// איסוף כל המנות/שילובים הייחודיים - מהאוסף שנשמר בזמן הרנדור
function collectUniqueDishes() {
  // קריאה מהאוסף הגלובלי שנשמר בזמן יצירת המדבקות
  if (window.labelsDishesSet && window.labelsDishesSet.size > 0) {
    return Array.from(window.labelsDishesSet).sort();
  }
  return [];
}

// החלת הדגשות
function applyHighlightDishes() {
  const listContainer = document.getElementById('highlightDishesList');
  if (!listContainer) return;

  const selects = listContainer.querySelectorAll('select');
  window.highlightedDishes = {};

  selects.forEach(select => {
    const dish = decodeURIComponent(select.dataset.dish);
    const color = select.value;
    if (color) {
      // נרמול המנה לפני שמירה
      const normalizedDish = normalizeDishText(dish);
      window.highlightedDishes[normalizedDish] = color;
    }
  });

  // שמירה ב-localStorage
  localStorage.setItem('highlightedDishes', JSON.stringify(window.highlightedDishes));

  // רענון המדבקות
  refreshLabelsWithHighlights();

  closeHighlightDishesModal();
}

// ניקוי כל ההדגשות
function clearHighlightDishes() {
  window.highlightedDishes = {};
  localStorage.removeItem('highlightedDishes');

  // עדכון ה-selects
  const listContainer = document.getElementById('highlightDishesList');
  if (listContainer) {
    const selects = listContainer.querySelectorAll('select');
    selects.forEach(select => select.value = '');
  }

  // רענון המדבקות
  refreshLabelsWithHighlights();
}

// רענון המדבקות עם הדגשות
function refreshLabelsWithHighlights() {
  // קריאה מחדש לרינדור המדבקות
  const container = document.getElementById('labelsContainerHot');
  if (!container || !window.labelsDataHot) return;

  // שמירת הסינונים הנוכחיים
  const distrLineSelect = document.getElementById('distrLineFilterHot');
  const packingMethodSelect = document.getElementById('packingMethodFilterHot');
  const sortModeSelect = document.getElementById('labelsSortModeFilterHot');

  // טריגור לרענון - שימוש באירוע change
  if (distrLineSelect) {
    distrLineSelect.dispatchEvent(new Event('change'));
  }
}

// טעינת הדגשות שמורות מ-localStorage
function loadSavedHighlights() {
  const saved = localStorage.getItem('highlightedDishes');
  if (saved) {
    try {
      window.highlightedDishes = JSON.parse(saved);
    } catch (e) {
      window.highlightedDishes = {};
    }
  }
}

// טעינה בעת אתחול
document.addEventListener('DOMContentLoaded', loadSavedHighlights);

// פונקציה לנרמול טקסט מנה - מסיר רווחים מיותרים ומאחד את הפורמט
function normalizeDishText(text) {
  if (!text) return '';
  return text.trim()
    .replace(/\s*\(אלרגני\)\s*/g, '')
    .replace(/\s*\(ללא אלרגנים\)\s*/g, '')
    .replace(/\s*\(צמחוני\)\s*/g, '')
    .replace(/\s*\+\s*/g, '+')  // נרמול + עם רווחים ל-+ בלי רווחים
    .trim();
}

// פונקציה לקבלת צבע הדגשה עבור מנה/שילוב - התאמה מדויקת בלבד
function getHighlightColor(dishText) {
  if (!window.highlightedDishes || !dishText) return '';

  // נרמול הטקסט לפני השוואה
  const cleanDishText = normalizeDishText(dishText);

  // בדיקה ישירה - התאמה מדויקת בלבד
  if (window.highlightedDishes[cleanDishText]) {
    return window.highlightedDishes[cleanDishText];
  }

  // בדיקת התאמה עם המפתחות - התאמה מדויקת בלבד (עם נרמול)
  for (const [highlightedDish, color] of Object.entries(window.highlightedDishes)) {
    if (cleanDishText === normalizeDishText(highlightedDish)) {
      return color;
    }
  }

  return '';
}

// הורדת PDF לדוח מדבקות - באמצעות הדפסה
function downloadLabelsPDF(labelType = 'hot') {
  const containerId = labelType === 'hot' ? 'labelsContainerHot' : 'labelsContainerCold';
  const container = document.getElementById(containerId);

  if (!container || !container.innerHTML || container.innerHTML.trim() === '') {
    alert('אין נתונים להורדה');
    return;
  }

  // יצירת חלון חדש להדפסה
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('לא ניתן לפתוח חלון חדש. אנא אפשר חלונות קופצים בדפדפן.');
    return;
  }

  const dateValue = document.getElementById('dateInput').value || new Date().toISOString().split('T')[0];
  const typeLabel = labelType === 'hot' ? 'חמים' : 'קרים';
  
  // יצירת עותק של התוכן עם ניקוי
  const contentClone = container.cloneNode(true);
  
  // הסרת scripts ואלמנטים לא נחוצים
  const scripts = contentClone.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // ניקוי event handlers
  const elementsWithOnclick = contentClone.querySelectorAll('[onclick]');
  elementsWithOnclick.forEach(el => el.removeAttribute('onclick'));
  
  const containerHTML = contentClone.innerHTML;
  
  // בדיקה שהתוכן לא ריק
  if (!containerHTML || containerHTML.trim() === '') {
    alert('אין תוכן להדפסה. אנא ודא שהדוח נטען כראוי.');
    printWindow.close();
    return;
  }
  
  // יצירת HTML להדפסה - שימוש ב-write מספר פעמים
  printWindow.document.open('text/html', 'replace');
  printWindow.document.write('<!DOCTYPE html>');
  printWindow.document.write('<html lang="he" dir="rtl">');
  printWindow.document.write('<head>');
  printWindow.document.write('<meta charset="UTF-8">');
  printWindow.document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  printWindow.document.write('<title>דוח מדבקות ' + typeLabel + ' - ' + dateValue + '</title>');
  printWindow.document.write('<style>');
  printWindow.document.write('@page { size: A4; margin: 0; }');
  printWindow.document.write('* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }');
  printWindow.document.write('body { font-family: Arial, "DejaVu Sans", sans-serif; direction: rtl; margin: 0; padding: 0; font-size: 11pt; color: #000; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }');
  printWindow.document.write('table { border-collapse: collapse; margin-bottom: 15px; page-break-inside: auto; }');
  printWindow.document.write('tr { page-break-inside: avoid; page-break-after: auto; }');
  printWindow.document.write('thead { display: table-header-group; }');
  printWindow.document.write('tfoot { display: table-footer-group; }');
  printWindow.document.write('th, td { border: 1px solid #000; padding: 8px; text-align: right; font-size: 10pt; word-wrap: break-word; }');
  printWindow.document.write('th { background-color: #4285f4; color: white; font-weight: bold; }');
  printWindow.document.write('tr:nth-child(even) { background-color: #f9f9f9; }');
  printWindow.document.write('.labels-print-wrapper { display: flex; flex-direction: column; gap: 0; margin: 0; padding: 0; }');
  printWindow.document.write('.label-card { border: 2px solid #333; border-radius: 12px; padding: 14px; background: #f9f9f9 !important; page-break-inside: avoid; width: 100%; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; display: flex !important; flex-direction: column !important; overflow: hidden !important; box-sizing: border-box !important; }');
  printWindow.document.write('.label-card-hot { border-color: #ef6c00 !important; }');
  printWindow.document.write('.label-card-cold { border-color: #1976d2 !important; }');
  printWindow.document.write('.label-card-no-allergen { background: #ffd6d6 !important; border-color: #c62828 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }');
  printWindow.document.write('.label-card-vegetarian { background: #bbdefb !important; border-color: #1976d2 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }');
  // טבלת פרטי הלקוח - שמירה על רוחב אוטומטי - גודל קבוע, לא דינמי
  printWindow.document.write('.label-card > table:first-of-type { width: 100% !important; border-collapse: collapse !important; margin-bottom: 15px !important; flex-grow: 0 !important; flex-shrink: 0 !important; }');
  printWindow.document.write('.label-card > table:first-of-type th, .label-card > table:first-of-type td { font-size: 1.3em !important; padding: 8px !important; line-height: 1.5 !important; }');
  // טבלת מוצרים - שמירה על הפרופורציות המקוריות - לא למתוח - הקטנת flex
  printWindow.document.write('.label-card-table { width: 100% !important; max-width: 100% !important; border-collapse: collapse !important; margin-top: 10px !important; table-layout: auto !important; flex: 0.7 !important; }');
  printWindow.document.write('.label-card-table:first-of-type { margin-top: 0; }');
  printWindow.document.write('.label-card-table th, .label-card-table td { border: 1px solid #000 !important; padding: 10px !important; text-align: right !important; font-size: 1.3em !important; word-wrap: break-word !important; white-space: normal !important; min-height: 60px !important; height: 60px !important; vertical-align: middle !important; line-height: 1.5 !important; }');
  printWindow.document.write('.label-card-table thead tr { background: #e3f2fd; }');
  printWindow.document.write('.label-card-table th { font-size: 1.4em !important; padding: 10px !important; }');
  // שמירה על רוחב עמודות פרופורציונלי - עמודת מוצר תהיה רחבה יותר, עמודות מספרים צרות יותר
  // לא נגדיר width ספציפי כדי שהטבלה תשמור על הפרופורציות הטבעיות שלה
  printWindow.document.write('.label-card-table th:first-child, .label-card-table td:first-child { min-width: 50% !important; }');
  printWindow.document.write('.label-card-table th:not(:first-child), .label-card-table td:not(:first-child) { width: auto !important; min-width: 60px !important; }');
  printWindow.document.write('.label-row-no-allergen { background-color: #ff5252 !important; color: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }');
  printWindow.document.write('.label-row-vegetarian { background-color: #64b5f6 !important; color: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }');
  printWindow.document.write('.label-row-soup { background-color: #fff59d !important; color: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }');
  printWindow.document.write('@media print { body { margin: 0; padding: 0; } .labels-print-wrapper { padding: 0 !important; margin: 0 !important; } .no-print { display: none !important; } h1 { display: none !important; } table { page-break-inside: auto; } tr { page-break-inside: avoid; } }');
  printWindow.document.write('@media print { .label-card { height: 148.5mm !important; min-height: 148.5mm !important; max-height: 148.5mm !important; display: flex !important; flex-direction: column !important; position: relative !important; overflow: hidden !important; } .label-card:nth-of-type(even) { page-break-after: always; } .label-card:nth-of-type(odd) { page-break-after: auto; } .label-card:last-of-type { page-break-after: auto; } }');
  // שמירה על פרופורציות טבלאות בהדפסה - לא למתוח יותר מדי - שימוש ב-auto layout
  printWindow.document.write('@media print { .label-card { overflow: hidden !important; box-sizing: border-box !important; } .label-card > table:first-of-type { width: 100% !important; margin-bottom: 15px !important; flex-grow: 0 !important; flex-shrink: 0 !important; height: 140px !important; min-height: 140px !important; } .label-card > table:first-of-type th, .label-card > table:first-of-type td { font-size: 1.3em !important; padding: 8px !important; line-height: 1.5 !important; } .label-card-table { width: 100% !important; max-width: 100% !important; table-layout: auto !important; flex: 1 !important; max-height: 270px !important; overflow: hidden !important; } .label-card-table th, .label-card-table td { font-size: 1.3em !important; padding: 10px !important; vertical-align: middle !important; line-height: 1.5 !important; max-height: 40px !important; } .label-card-table th { font-size: 1.4em !important; } .label-card-table th:first-child, .label-card-table td:first-child { min-width: 50% !important; } .label-card-table th:not(:first-child), .label-card-table td:not(:first-child) { width: auto !important; min-width: 60px !important; } .label-footer { position: absolute !important; bottom: 0 !important; left: 0 !important; right: 0 !important; width: 100% !important; height: 40px !important; font-size: 0.85em !important; } }');
  printWindow.document.write('</style>');
  printWindow.document.write('</head>');
  printWindow.document.write('<body>');
  printWindow.document.write(containerHTML);
  printWindow.document.write('<script>');
  printWindow.document.write('window.onload = function() { setTimeout(function() { window.print(); }, 500); };');
  printWindow.document.write('<\/script>');
  printWindow.document.write('</body>');
  printWindow.document.write('</html>');
  printWindow.document.close();
  
  // המתנה קצרה כדי שהדף יטען
  setTimeout(function() {
    if (printWindow.document.body && printWindow.document.body.innerHTML.trim() === '') {
      console.error('הדף נשאר ריק');
      alert('הדף נשאר ריק. נסה שוב או בדוק את הקונסול לשגיאות.');
    }
  }, 1000);
}

// הורדת PDF לדוח אריזה חמה
function downloadTraysPDF() {
  // בדיקה אם אנחנו בתצוגה טבלאית
  const container = isTabularViewActive
    ? document.getElementById('tabularViewContainer')
    : document.getElementById('traysContainer');

  if (!container || !container.innerHTML || container.innerHTML.trim() === '') {
    alert('אין נתונים להורדה');
    return;
  }
  
  // יצירת חלון חדש להדפסה
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('לא ניתן לפתוח חלון חדש. אנא אפשר חלונות קופצים בדפדפן.');
    return;
  }
  
  const dateValue = document.getElementById('dateInput').value || new Date().toISOString().split('T')[0];
  const branchFilter = document.getElementById('traysBranchFilter');
  const distrLineFilter = document.getElementById('traysDistrLineFilter');
  const branchName = branchFilter && branchFilter.value ? branchFilter.options[branchFilter.selectedIndex].text : 'הכל';
  const distrLineName = distrLineFilter && distrLineFilter.value ? distrLineFilter.options[distrLineFilter.selectedIndex].text : 'הכל';
  
  // יצירת עותק של התוכן עם ניקוי
  const contentClone = container.cloneNode(true);
  
  // הסרת scripts ואלמנטים לא נחוצים
  const scripts = contentClone.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // ניקוי event handlers
  const elementsWithOnclick = contentClone.querySelectorAll('[onclick]');
  elementsWithOnclick.forEach(el => el.removeAttribute('onclick'));
  
  // הסרת class clickable-item (לא נחוץ ב-PDF)
  const clickableItems = contentClone.querySelectorAll('.clickable-item');
  clickableItems.forEach(el => {
    el.classList.remove('clickable-item');
    el.style.cursor = 'default';
  });
  
  const containerHTML = contentClone.innerHTML;
  
  // בדיקה שהתוכן לא ריק
  if (!containerHTML || containerHTML.trim() === '') {
    alert('אין תוכן להדפסה. אנא ודא שהדוח נטען כראוי.');
    printWindow.close();
    return;
  }
  
  // יצירת HTML להדפסה
  printWindow.document.open('text/html', 'replace');
  printWindow.document.write('<!DOCTYPE html>');
  printWindow.document.write('<html lang="he" dir="rtl">');
  printWindow.document.write('<head>');
  printWindow.document.write('<meta charset="UTF-8">');
  printWindow.document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  const reportTitle = isTabularViewActive ? 'דוח אריזה חמה - תצוגה טבלאית' : 'דוח אריזה חמה';
  printWindow.document.write('<title>' + reportTitle + ' - ' + dateValue + '</title>');
  printWindow.document.write('<style>');
  // בתצוגה טבלאית - הדפסה לרוחב (landscape)
  if (isTabularViewActive) {
    printWindow.document.write('@page { size: A4 landscape; margin: 10mm; }');
  } else {
    printWindow.document.write('@page { size: A4; margin: 10mm; }');
  }
  printWindow.document.write('* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }');
  printWindow.document.write('body { font-family: Arial, "DejaVu Sans", sans-serif; direction: rtl; margin: 0; padding: 10px; font-size: 10pt; color: #000; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }');
  printWindow.document.write('h1 { text-align: center; margin: 0 0 15px 0; font-size: 16pt; color: #333; }');
  printWindow.document.write('h2 { text-align: center; margin: 10px 0; font-size: 12pt; color: #666; }');
  // בתצוגה טבלאית - טבלאות אחת מתחת לשנייה ברוחב מלא
  if (isTabularViewActive) {
    // הסרת כל הגבלות הרוחב והגלילה - הכל ברוחב מלא
    printWindow.document.write('div { display: block !important; width: 100% !important; max-width: 100% !important; min-width: 0 !important; margin: 0 0 20px 0 !important; overflow: visible !important; flex: none !important; }');
    printWindow.document.write('div[style*="display:flex"], div[style*="display: flex"] { display: block !important; }');
    printWindow.document.write('div[style*="overflow"] { overflow: visible !important; }');
    printWindow.document.write('table { width: 100% !important; table-layout: auto !important; }');
    printWindow.document.write('th, td { padding: 4px !important; font-size: 8pt !important; white-space: nowrap !important; }');
  } else {
    printWindow.document.write('.tray-category-table { display: inline-block; width: 48%; margin: 1%; vertical-align: top; margin-bottom: 20px; box-sizing: border-box; page-break-inside: avoid; }');
  }
  printWindow.document.write('.tray-category-table h3, h3 { background: #c8e6c9 !important; padding: 10px; margin: 0; text-align: center; border: 1px solid #4caf50; font-size: 1em; -webkit-print-color-adjust: exact; print-color-adjust: exact; }');
  printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-bottom: 15px; page-break-inside: auto; font-size: 9pt; }');
  printWindow.document.write('tr { page-break-inside: avoid; }');
  printWindow.document.write('thead { display: table-header-group; }');
  printWindow.document.write('tfoot { display: table-footer-group; }');
  printWindow.document.write('th, td { border: 1px solid #000; padding: 6px; text-align: right; word-wrap: break-word; }');
  printWindow.document.write('th { background-color: #4FC3F7 !important; color: #000 !important; font-weight: bold; -webkit-print-color-adjust: exact; print-color-adjust: exact; }');
  printWindow.document.write('td { background-color: white; }');
  printWindow.document.write('@media print { body { margin: 0; padding: 5mm; } .no-print { display: none !important; } table { page-break-inside: auto; } tr { page-break-inside: avoid; } .tray-category-table { page-break-inside: avoid; } }');
  printWindow.document.write('</style>');
  printWindow.document.write('</head>');
  printWindow.document.write('<body>');
  printWindow.document.write('<h1>🔥 ' + reportTitle + '</h1>');
  printWindow.document.write('<h2>תאריך: ' + dateValue + ' | סניף: ' + branchName + ' | קו חלוקה: ' + distrLineName + '</h2>');
  printWindow.document.write(containerHTML);
  printWindow.document.write('<script>');
  printWindow.document.write('window.onload = function() { setTimeout(function() { window.print(); }, 500); };');
  printWindow.document.write('<\/script>');
  printWindow.document.write('</body>');
  printWindow.document.write('</html>');
  printWindow.document.close();
  
  // המתנה קצרה כדי שהדף יטען
  setTimeout(function() {
    if (printWindow.document.body && printWindow.document.body.innerHTML.trim() === '') {
      console.error('הדף נשאר ריק');
      alert('הדף נשאר ריק. נסה שוב או בדוק את הקונסול לשגיאות.');
    }
  }, 1000);
}

// משתנה לאחסון טבלת DataTables
let dataTable = null;

// ========== אופטימיזציית אריזה ==========

// טעינת הגדרות מ-localStorage או יצירת ברירת מחדל
function loadPackingSettings() {
  let productsSettings = JSON.parse(localStorage.getItem('packingProductsSettings') || '{}');
  let containersSettings = JSON.parse(localStorage.getItem('packingContainersSettings') || '[]');
  
  // אם אין הגדרות, יצירת ברירת מחדל
  if (containersSettings.length === 0) {
    containersSettings = [
      { name: 'מיכל גדול', volume: 10 },
      { name: 'מיכל בינוני', volume: 5 },
      { name: 'מיכל קטן', volume: 2 }
    ];
    saveContainersSettings(containersSettings);
  }
  
  // טעינת מוצרים מהנתונים הנמשכים - עבודה עם מבנה NoSQL
  if (currentStructuredData && Object.keys(currentStructuredData).length > 0) {
    // עבודה עם מבנה NoSQL
    Object.values(currentStructuredData).forEach(order => {
      order.items.forEach(item => {
        const partName = item.partName || '';
        if (partName && !productsSettings[partName]) {
          productsSettings[partName] = {
            partName: partName,
            partDes: item.partDes || '',
            calcType: 'weight', // 'weight' או 'servings'
            value: 1 // משקל/נפח או משקל למנה
          };
        }
      });
    });
    saveProductsSettings(productsSettings);
  } else if (currentData && currentData.length > 0) {
    // fallback למבנה שטוח
    currentData.forEach(row => {
      const partName = row.PARTNAME || '';
      if (partName && !productsSettings[partName]) {
        productsSettings[partName] = {
          partName: partName,
          partDes: row.PARTDES || '',
          calcType: 'weight', // 'weight' או 'servings'
          value: 1 // משקל/נפח או משקל למנה
        };
      }
    });
    saveProductsSettings(productsSettings);
  }
  
  displayProductsSettings(productsSettings);
  displayContainersSettings(containersSettings);
}

function saveProductsSettings(settings) {
  localStorage.setItem('packingProductsSettings', JSON.stringify(settings));
}

function saveContainersSettings(settings) {
  localStorage.setItem('packingContainersSettings', JSON.stringify(settings));
}

function displayProductsSettings(settings) {
  const tbody = document.getElementById('productsSettingsBody');
  tbody.innerHTML = '';
  
  Object.values(settings).forEach(product => {
    const tr = document.createElement('tr');
    const partNameEscaped = String(product.partName || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const partDesEscaped = String(product.partDes || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    const calcTypeSelected = product.calcType === 'weight' ? 'selected' : '';
    const calcTypeSelected2 = product.calcType === 'servings' ? 'selected' : '';
    const td1 = document.createElement('td');
    td1.innerHTML = partNameEscaped + '<br><small>' + partDesEscaped + '</small>';
    
    const td2 = document.createElement('td');
    const select = document.createElement('select');
    select.setAttribute('onchange', 'updateProductSetting(\'' + partNameEscaped + '\', \'calcType\', this.value)');
    const opt1 = document.createElement('option');
    opt1.value = 'weight';
    opt1.textContent = 'מקל (משקל/נפח)';
    if (product.calcType === 'weight') opt1.selected = true;
    const opt2 = document.createElement('option');
    opt2.value = 'servings';
    opt2.textContent = 'חמשבע';
    if (product.calcType === 'servings') opt2.selected = true;
    select.appendChild(opt1);
    select.appendChild(opt2);
    td2.appendChild(select);
    
    const td3 = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'number';
    input.step = '0.01';
    input.value = product.value || 0;
    input.style.width = '100px';
    input.setAttribute('onchange', 'updateProductSetting(\'' + partNameEscaped + '\', \'value\', this.value)');
    td3.appendChild(input);
    
    const td4 = document.createElement('td');
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'מחק';
    btn.setAttribute('onclick', 'deleteProductSetting(\'' + partNameEscaped + '\')');
    td4.appendChild(btn);
    
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tbody.appendChild(tr);
  });
}

function displayContainersSettings(settings) {
  const tbody = document.getElementById('containersSettingsBody');
  tbody.innerHTML = '';
  
  settings.forEach((container, index) => {
    const tr = document.createElement('tr');
    const containerNameEscaped = String(container.name || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    
    const td1 = document.createElement('td');
    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.value = containerNameEscaped;
    input1.style.width = '150px';
    input1.setAttribute('onchange', 'updateContainerSetting(' + index + ', \'name\', this.value)');
    td1.appendChild(input1);
    
    const td2 = document.createElement('td');
    const input2 = document.createElement('input');
    input2.type = 'number';
    input2.step = '0.1';
    input2.value = container.volume || 0;
    input2.style.width = '100px';
    input2.setAttribute('onchange', 'updateContainerSetting(' + index + ', \'volume\', this.value)');
    td2.appendChild(input2);
    td2.appendChild(document.createTextNode(' ליטר'));
    
    const td3 = document.createElement('td');
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'מחק';
    btn.setAttribute('onclick', 'deleteContainerSetting(' + index + ')');
    td3.appendChild(btn);
    
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tbody.appendChild(tr);
  });
}

function updateProductSetting(partName, field, value) {
  let settings = JSON.parse(localStorage.getItem('packingProductsSettings') || '{}');
  if (settings[partName]) {
    settings[partName][field] = field === 'value' ? parseFloat(value) : value;
    saveProductsSettings(settings);
    displayProductsSettings(settings);
  }
}

function updateContainerSetting(index, field, value) {
  let settings = JSON.parse(localStorage.getItem('packingContainersSettings') || '[]');
  if (settings[index]) {
    settings[index][field] = field === 'volume' ? parseFloat(value) : value;
    saveContainersSettings(settings);
    displayContainersSettings(settings);
  }
}

function deleteProductSetting(partName) {
  if (confirm(`האם למחוק את ההגדרה עבור ${partName}?`)) {
    let settings = JSON.parse(localStorage.getItem('packingProductsSettings') || '{}');
    delete settings[partName];
    saveProductsSettings(settings);
    displayProductsSettings(settings);
  }
}

function deleteContainerSetting(index) {
  if (confirm('האם למחוק את המיכל?')) {
    let settings = JSON.parse(localStorage.getItem('packingContainersSettings') || '[]');
    settings.splice(index, 1);
    saveContainersSettings(settings);
    displayContainersSettings(settings);
  }
}

function addContainer() {
  let settings = JSON.parse(localStorage.getItem('packingContainersSettings') || '[]');
  settings.push({ name: 'מיכל חדש', volume: 1 });
  saveContainersSettings(settings);
  displayContainersSettings(settings);
}

// חישוב אופטימיזציה לפי מקל (משקל/נפח)
function calculatePackingByWeight(totalWeight, weightPerLiter, containers) {
  // מיון מיכלים מהגדול לקטן
  const sortedContainers = [...containers].sort((a, b) => b.volume - a.volume);
  
  // חישוב נפח נדרש
  const requiredVolume = totalWeight / weightPerLiter;
  
  const result = {
    totalWeight: totalWeight,
    requiredVolume: requiredVolume,
    containers: []
  };
  
  let remainingVolume = requiredVolume;
  
  // חלוקה למיכלים מהגדול לקטן
  for (let i = 0; i < sortedContainers.length && remainingVolume > 0.01; i++) {
    const container = sortedContainers[i];
    const count = Math.floor(remainingVolume / container.volume);
    
    if (count > 0 || (i === sortedContainers.length - 1 && remainingVolume > 0)) {
      // אם זה המיכל האחרון, נוסיף גם את השארית
      const finalCount = i === sortedContainers.length - 1 ? 
        Math.ceil(remainingVolume / container.volume) : count;
      
      result.containers.push({
        name: container.name,
        volume: container.volume,
        count: finalCount,
        totalVolume: finalCount * container.volume
      });
      
      remainingVolume -= finalCount * container.volume;
    }
  }
  
  result.waste = Math.max(0, result.containers.reduce((sum, c) => sum + c.totalVolume, 0) - requiredVolume);
  return result;
}

// חישוב אופטימיזציה לפי חמשבע (5 ו-7 מנות)
function optimizeServings(totalServings) {
  // totalServings כבר מגיע מעוגל כלפי מעלה, נשתמש בו ישירות
  const target = Math.round(totalServings);
  
  if (target <= 0) {
    return { five: 0, seven: 0, waste: 0 };
  }
  
  // נסה כל שילוב אפשרי של 5 ו-7 מנות
  let perfectSolution = null; // פתרון מושלם (waste = 0)
  let bestExcessSolution = null; // פתרון עם עודף קטן
  let bestExcess = Infinity;
  let bestShortageSolution = null; // פתרון עם חסר קטן
  let bestShortage = Infinity;
  
  // נסה לכל כמות של 7 מנות (מ-0 עד המקסימום האפשרי)
  const maxSevens = Math.ceil(target / 7);
  
  for (let seven = 0; seven <= maxSevens; seven++) {
    const usedBySevens = seven * 7;
    const remaining = target - usedBySevens;
    
    if (remaining === 0) {
      // פתרון מושלם - בדיוק מה שצריך!
      perfectSolution = { five: 0, seven: seven, waste: 0 };
      break; // זה הפתרון הטוב ביותר, אין צורך להמשיך
    }
    
    if (remaining < 0) {
      // יותר מדי מארזי 7 - נחשב את ההפרש (עודף)
      const excess = Math.abs(remaining);
      if (excess < bestExcess) {
        bestExcessSolution = { five: 0, seven: seven, waste: excess };
        bestExcess = excess;
      }
      continue;
    }
    
    // נסה עם מארזי 5 - פחות ממה שצריך (פחת - חסר)
    const fiveFloor = Math.floor(remaining / 5);
    const leftover = remaining - (fiveFloor * 5);
    
    if (leftover === 0) {
      // פתרון מושלם!
      perfectSolution = { five: fiveFloor, seven: seven, waste: 0 };
      break; // זה הפתרון הטוב ביותר, אין צורך להמשיך
    }
    
    if (leftover < bestShortage) {
      bestShortageSolution = { five: fiveFloor, seven: seven, waste: leftover };
      bestShortage = leftover;
    }
    
    // נסה גם עם מארז 5 נוסף (יותר ממה שצריך - פחת - עודף)
    if (remaining % 5 !== 0) {
      const fiveCeil = Math.ceil(remaining / 5);
      const excess = (fiveCeil * 5) - remaining;
      
      if (excess < bestExcess) {
        bestExcessSolution = { five: fiveCeil, seven: seven, waste: excess };
        bestExcess = excess;
      }
    }
  }
  
  // עדיפות: 1. פתרון מושלם, 2. עודף קטן, 3. חסר קטן
  if (perfectSolution) {
    return perfectSolution;
  }
  
  if (bestExcessSolution) {
    return bestExcessSolution;
  }
  
  return bestShortageSolution || { five: 0, seven: 0, waste: target };
}

// חישוב אופטימיזציה כללי
function calculatePacking() {
  if (!currentStructuredData || Object.keys(currentStructuredData).length === 0) {
    if (!currentData || currentData.length === 0) {
      alert('אין נתונים לחישוב. אנא משוך נתונים קודם.');
      return;
    }
  }
  
  const productsSettings = JSON.parse(localStorage.getItem('packingProductsSettings') || '{}');
  const containersSettings = JSON.parse(localStorage.getItem('packingContainersSettings') || '[]');
  
  if (Object.keys(productsSettings).length === 0) {
    alert('אין הגדרות מוצרים. אנא הגדר מוצרים תחילה.');
    return;
  }
  
  if (containersSettings.length === 0) {
    alert('אין הגדרות מיכלים. אנא הגדר מיכלים תחילה.');
    return;
  }
  
  // קיבוץ נתונים לפי פריט - עבודה עם מבנה NoSQL
  const productsData = {};
  
  if (currentStructuredData && Object.keys(currentStructuredData).length > 0) {
    // עבודה עם מבנה NoSQL
    Object.values(currentStructuredData).forEach(order => {
      order.items.forEach(item => {
        const partName = item.partName || '';
        if (partName && productsSettings[partName]) {
          if (!productsData[partName]) {
            productsData[partName] = {
              partName: partName,
              partDes: item.partDes || '',
              totalQuantity: 0
            };
          }
          productsData[partName].totalQuantity += parseFloat(item.pritGenQuant) || 0;
        }
      });
    });
  } else {
    // fallback למבנה שטוח
    currentData.forEach(row => {
      const partName = row.PARTNAME || '';
      if (partName && productsSettings[partName]) {
        if (!productsData[partName]) {
          productsData[partName] = {
            partName: partName,
            partDes: row.PARTDES || '',
            totalQuantity: 0
          };
        }
        productsData[partName].totalQuantity += parseFloat(row.PRIT_GENQUANT) || 0;
      }
    });
  }
  
  // חישוב לכל מוצר
  const results = [];
  
  Object.values(productsData).forEach(product => {
    const setting = productsSettings[product.partName];
    let result = {
      partName: product.partName,
      partDes: product.partDes,
      totalQuantity: product.totalQuantity,
      calcType: setting.calcType,
      details: null
    };
    
    if (setting.calcType === 'weight') {
      // חישוב לפי מקל
      result.details = calculatePackingByWeight(
        product.totalQuantity,
        setting.value,
        containersSettings
      );
    } else {
      // חישוב לפי חמשבע
      const servingsPerUnit = setting.value;
      const totalServings = product.totalQuantity / servingsPerUnit;
      const optimized = optimizeServings(totalServings);
      
      result.details = {
        totalServings: totalServings,
        fiveCount: optimized.five,
        sevenCount: optimized.seven,
        waste: optimized.waste
      };
    }
    
    results.push(result);
  });
  
  // הצגת תוצאות
  displayPackingResults(results);
  window.packingResults = results;
}

function displayPackingResults(results) {
  const container = document.getElementById('packingResultsContainer');
  
  let html = '<table><thead><tr>';
  html += '<th>מקט</th><th>תיאור</th><th>כמות כוללת</th><th>סוג חישוב</th><th>תוצאות</th>';
  html += '</tr></thead><tbody>';
  
  results.forEach(result => {
    html += '<tr>';
    html += `<td>${result.partName}</td>`;
    html += `<td>${result.partDes}</td>`;
    html += `<td>${result.totalQuantity.toFixed(2)}</td>`;
    html += `<td>${result.calcType === 'weight' ? 'מקל' : 'חמשבע'}</td>`;
    
    if (result.calcType === 'weight') {
      html += '<td>';
      html += `<strong>נפח נדרש:</strong> ${result.details.requiredVolume.toFixed(2)} ליטר<br>`;
      result.details.containers.forEach(c => {
        html += `${c.name} (${c.volume}ל): ${c.count} יחידות<br>`;
      });
      html += `<strong>פחת:</strong> ${result.details.waste.toFixed(2)} ליטר`;
      html += '</td>';
    } else {
      html += '<td>';
      html += `<strong>סה"כ מנות:</strong> ${result.details.totalServings.toFixed(0)}<br>`;
      html += `<strong>מארזי 5 מנות:</strong> ${result.details.fiveCount}<br>`;
      html += `<strong>מארזי 7 מנות:</strong> ${result.details.sevenCount}<br>`;
      html += `<strong>פחת:</strong> ${result.details.waste} מנות`;
      html += '</td>';
    }
    
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
}

function downloadPackingCSV() {
  if (!window.packingResults || window.packingResults.length === 0) {
    alert('אין תוצאות להורדה');
    return;
  }
  
  let csv = '\uFEFFמקט,תיאור,כמות כוללת,סוג חישוב,תוצאות\n';
  
  window.packingResults.forEach(result => {
    let resultText = '';
    if (result.calcType === 'weight') {
      resultText = `נפח: ${result.details.requiredVolume.toFixed(2)}ל; `;
      result.details.containers.forEach(c => {
        resultText += `${c.name}:${c.count}; `;
      });
      resultText += `פחת:${result.details.waste.toFixed(2)}ל`;
    } else {
      resultText = `מנות:${result.details.totalServings.toFixed(0)}; 5:${result.details.fiveCount}; 7:${result.details.sevenCount}; פחת:${result.details.waste}`;
    }
    
    csv += `"${result.partName}","${result.partDes}",${result.totalQuantity.toFixed(2)},${result.calcType === 'weight' ? 'מקל' : 'חמשבע'},"${resultText}"\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `packing_optimization_${document.getElementById('dateInput').value}.csv`;
  link.click();
}

// ========================================
// מדבקות אלרגנים - 32 בעמוד A4
// ========================================

// דוח מדבקות אלרגנים / צמחוני / מרק
function createAllergenLabelsReport(data) {
  const container = document.getElementById('allergenLabelsContainer');
  const distrLineSelect = document.getElementById('allergenLabelsDistrLineFilter');
  const sortSelect = document.getElementById('allergenLabelsSortFilter');
  const typeSelect = document.getElementById('allergenLabelsTypeFilter');

  if (!container) {
    console.error('❌ אלמנט לא נמצא למדבקות אלרגנים');
    return;
  }

  if (!data || (Array.isArray(data) && data.length === 0) || (!Array.isArray(data) && Object.keys(data).length === 0)) {
    console.warn('⚠️ אין נתונים למדבקות אלרגנים');
    container.innerHTML = '<p style="text-align:center;padding:50px;color:#999;">אין נתונים להצגה</p>';
    return;
  }

  // המרה לנתונים שטוחים
  let flatData = Array.isArray(data) ? data : Object.values(data).flatMap(order => {
    if (!order || !order.items || !Array.isArray(order.items)) {
      return [];
    }
    return order.items.map(item => ({
      ...item,
      orderName: order.orderName,
      custDes: order.custDes || '',
      codeDes: order.codeDes || '',
      custName: order.custName || '',
      distrLineCode: order.distrLineCode || '',
      distrLineDes: order.distrLineDes || '',
      pritDistrOrder: order.pritDistrOrder || 0,
      pritClassname: order.pritClassname || '',
      dueDate: order.dueDate || '',
      spec1: order.spec1 || '',
      spec2: order.spec2 || ''
    }));
  });

  // פונקציה לסינון לפי סוג
  const filterByType = (type) => {
    if (type === 'allergen') {
      // אלרגני - לפי PSPEC1
      return flatData.filter(r => {
        const pspec1 = String(r.pspec1 || r.PSPEC1 || '').trim().toLowerCase();
        return pspec1.includes('ללא אלרגני') || pspec1.includes('לא אלרגני') || pspec1.includes('אלרגני');
      });
    } else if (type === 'vegetarian') {
      // צמחוני - לפי Y_36827_0_ESH (שדה בוליאני)
      return flatData.filter(r => r.isVegetarian === true);
    } else if (type === 'soup') {
      // מרק - לפי שם הפריט + רק פריטים חמים
      const soupItems = flatData.filter(r => {
        const partDes = String(r.partDes || r.PARTDES || '').toLowerCase();
        const cartonType = String(r.cartonType || r.Y_37210_5_ESH || '').trim().toLowerCase();
        const isSoup = partDes.includes('מרק');

        // אם אין סוג קרטון, מניחים שזה חם (ברירת מחדל)
        // אם יש סוג קרטון, בודקים שזה לא קר
        const isHot = cartonType === '' || cartonType.includes('חם') || !cartonType.includes('קר');

        if (isSoup) {
          console.log('🍲 מרק נמצא:', partDes, '| סוג קרטון:', cartonType, '| חם:', isHot);
        }
        return isSoup && isHot;
      });
      console.log('🍲 מרק - נמצאו:', soupItems.length, 'פריטים');
      return soupItems;
    }
    return [];
  };

  // סינון ראשוני לפי סוג ברירת מחדל (אלרגני)
  let allergenFreeData = filterByType(typeSelect ? typeSelect.value : 'allergen');
  
  console.log('📊 מדבקות אלרגנים - סה"כ נתונים:', flatData.length, 'פריטים ללא אלרגנים:', allergenFreeData.length);
  
  // איסוף קווי חלוקה ייחודיים
  const distrLines = [...new Set(allergenFreeData.map(r => r.distrLineCode || r.DISTRLINECODE || '').filter(Boolean))].sort();
  distrLineSelect.innerHTML = '<option value="">הכל</option>';
  distrLines.forEach(line => {
    const option = document.createElement('option');
    option.value = line;
    option.textContent = line;
    distrLineSelect.appendChild(option);
  });
  
  // פונקציה לרינדור המדבקות
  const renderAllergenLabels = () => {
    const selectedLine = distrLineSelect.value;
    const sortMode = sortSelect.value;
    const selectedType = typeSelect ? typeSelect.value : 'allergen';

    // סינון מחדש לפי סוג
    let typeFilteredData = filterByType(selectedType);

    // עדכון קווי חלוקה לפי הסוג הנבחר
    const newDistrLines = [...new Set(typeFilteredData.map(r => r.distrLineCode || r.DISTRLINECODE || '').filter(Boolean))].sort();
    distrLineSelect.innerHTML = '<option value="">הכל</option>';
    newDistrLines.forEach(line => {
      const option = document.createElement('option');
      option.value = line;
      option.textContent = line;
      distrLineSelect.appendChild(option);
    });

    let filteredData = typeFilteredData;

    if (selectedLine && newDistrLines.includes(selectedLine)) {
      filteredData = filteredData.filter(r => (r.distrLineCode || r.DISTRLINECODE) === selectedLine);
    }

    // הודעה מתאימה לפי סוג
    const typeMessages = {
      'allergen': 'לא נמצאו פריטים אלרגניים',
      'vegetarian': 'לא נמצאו פריטים צמחוניים',
      'soup': 'לא נמצאו פריטי מרק'
    };

    if (filteredData.length === 0) {
      container.innerHTML = `<p style="text-align:center;padding:50px;color:#999;">${typeMessages[selectedType] || 'לא נמצאו פריטים'}</p>`;
      return;
    }
    
    // קיבוץ לפי הזמנה (לקוח) ומנה
    const groupedLabels = {};
    filteredData.forEach(item => {
      const orderKey = item.orderName || item.ORDNAME || '';
      const partDes = String(item.partDes || item.PARTDES || '').trim();
      const eatQuant = parseInt(item.eatQuant || item.EATQUANT || 0) || 0;
      
      if (eatQuant <= 0) return;
      
      const key = `${orderKey}|${partDes}`;
      
      if (!groupedLabels[key]) {
        groupedLabels[key] = {
          orderName: orderKey,
          custDes: item.custDes || item.CUSTDES || '',
          codeDes: item.codeDes || item.CODEDES || '',
          custName: item.custName || item.CUSTNAME || '',
          distrLineCode: item.distrLineCode || item.DISTRLINECODE || '',
          distrLineDes: item.distrLineDes || item.DISTRLINEDES || '',
          pritDistrOrder: item.pritDistrOrder || item.PRIT_DISTRORDER || 0,
          pritClassname: item.pritClassname || item.PRIT_CLASSNAME || '',
          dueDate: item.dueDate || item.DUEDATE || '',
          address: item.address || item.ADDRESS || item.state || item.STATE || '',
          spec2: item.spec2 || item.SPEC2 || '',
          partDes: partDes,
          quantity: eatQuant
        };
      } else {
        // אם יש כפילות, נוסיף לכמות
        groupedLabels[key].quantity += eatQuant;
      }
    });
    
    // המרה למערך ומיון לפי קו חלוקה וסדר הפצה
    let labelsArray = Object.values(groupedLabels);
    
    labelsArray.sort((a, b) => {
      const lineCompare = (a.distrLineCode || '').localeCompare(b.distrLineCode || '', 'he');
      if (lineCompare !== 0) return lineCompare;
      return (a.pritDistrOrder || 0) - (b.pritDistrOrder || 0);
    });
    
    // קיבוץ לפי קו חלוקה - כל קו חלוקה יקבל דפים נפרדים
    const labelsByDistrLine = {};
    labelsArray.forEach(item => {
      const lineKey = item.distrLineCode || 'ללא קו';
      if (!labelsByDistrLine[lineKey]) {
        labelsByDistrLine[lineKey] = {
          distrLineCode: item.distrLineCode,
          distrLineDes: item.distrLineDes,
          labels: []
        };
      }
      // יצירת מדבקות
      // עבור מרק - מדבקה אחת לכל הזמנה עם הכמות כתובה עליה
      // עבור אלרגני/צמחוני - מדבקה לכל מנה (כמות 2 = 2 מדבקות זהות)
      const selectedType = typeSelect ? typeSelect.value : 'allergen';
      if (selectedType === 'soup') {
        // מרק - מדבקה אחת בלבד עם הכמות
        labelsByDistrLine[lineKey].labels.push({
          ...item,
          labelNumber: item.quantity
        });
      } else {
        // אלרגני/צמחוני - מדבקה לכל מנה
        for (let i = 0; i < item.quantity; i++) {
          labelsByDistrLine[lineKey].labels.push({
            ...item,
            labelNumber: item.quantity
          });
        }
      }
    });
    
    // חלוקה לדפים - 6 מדבקות בכל דף (2 עמודות × 3 שורות), דף נפרד לכל קו חלוקה
    const LABELS_PER_PAGE = 6;
    const allPages = []; // מערך של {distrLine, distrLineDes, labels}
    let totalLabels = 0;
    
    Object.values(labelsByDistrLine).forEach(lineData => {
      // חלוקת המדבקות של קו החלוקה לדפים של 32
      for (let i = 0; i < lineData.labels.length; i += LABELS_PER_PAGE) {
        allPages.push({
          distrLineCode: lineData.distrLineCode,
          distrLineDes: lineData.distrLineDes,
          labels: lineData.labels.slice(i, i + LABELS_PER_PAGE)
        });
      }
      totalLabels += lineData.labels.length;
    });
    
    // פורמט תאריך
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = String(date.getFullYear()).slice(-2);
          return `${day}/${month}/${year}`;
        }
      } catch (e) {}
      return dateStr;
    };
    
    // עיבוד כיתה - תמיד להציג את השם המלא כמו ב-PRIT_CLASSNAME
    // (כולל "גן חובה" / "גן טרום חובה" / "כיתה א" וכו')
    const formatClass = (className) => {
      if (!className) return '';
      return String(className).trim();
    };
    
    // יצירת HTML - דף נפרד לכל קו חלוקה
    let html = '<div class="allergen-labels-container">';
    
    allPages.forEach((pageData, pageIndex) => {
      // כותרת קו חלוקה לפני הדף
      html += `<div class="allergen-page-header" style="width:210mm;padding:5mm 0;text-align:center;font-weight:bold;font-size:14pt;border-bottom:2px solid #333;margin-bottom:5px;page-break-before:${pageIndex > 0 ? 'always' : 'auto'};">
        קו חלוקה: ${pageData.distrLineDes || pageData.distrLineCode || 'ללא קו'}
      </div>`;
      
      html += '<div class="allergen-labels-page">';

      // קביעת צבע רקע וטקסט לפי סוג
      const labelStyles = {
        'allergen': { bgColor: '#ff5252', textColor: '#fff', defaultDish: 'אלרגני' },
        'vegetarian': { bgColor: '#64b5f6', textColor: '#000', defaultDish: 'צמחוני' },
        'soup': { bgColor: '#fff59d', textColor: '#000', defaultDish: 'מרק' }
      };
      const style = labelStyles[selectedType] || labelStyles['allergen'];

      pageData.labels.forEach(label => {
        // עבור מרק - להציג את שם הפריט, עבור אחרים - להציג את הסוג
        const dishText = selectedType === 'soup' ? (label.partDes || 'מרק') :
                         selectedType === 'vegetarian' ? (label.partDes || 'צמחוני') :
                         'אלרגני סיני מוקפץ';

        html += `
          <div class="allergen-label" style="border-color: ${style.bgColor};">
            <div class="allergen-label-header">
              <div class="allergen-label-top-info">
                <div class="allergen-label-route-station">${label.distrLineDes || label.distrLineCode || ''} | ${label.pritDistrOrder || ''}${label.spec2 ? ` | ${label.spec2}` : ''}</div>
              </div>
              <div class="allergen-label-date-info">
                <div>${formatDate(label.dueDate)}</div>
              </div>
            </div>
            <div class="allergen-label-body">
              <div class="allergen-label-customer">${label.codeDes || ''}</div>
              <div class="allergen-label-address">${label.address || ''}</div>
              ${label.pritClassname ? `<div class="allergen-label-class">${formatClass(label.pritClassname)}</div>` : ''}
            </div>
            <div class="allergen-label-footer" style="background: ${style.bgColor}; color: ${style.textColor};">
              <div class="allergen-label-dish">${dishText}</div>
              <div class="allergen-label-quantity">${label.labelNumber}</div>
            </div>
          </div>
        `;
      });
      
      html += '</div>';
    });
    
    html += '</div>';
    
    // סיכום
    html += `<div style="margin-top:20px;padding:15px;background:#f5f5f5;border-radius:8px;text-align:center;">
      <strong>סה"כ:</strong> ${totalLabels} מדבקות | ${allPages.length} דפים | ${Object.keys(labelsByDistrLine).length} קווי חלוקה
    </div>`;
    
    container.innerHTML = html;
    window.allergenLabelsData = labelsArray;
    window.allergenLabelsAllLabels = allPages;
  };
  
  // הוספת event listeners
  distrLineSelect.onchange = renderAllergenLabels;
  sortSelect.onchange = renderAllergenLabels;
  if (typeSelect) {
    typeSelect.onchange = renderAllergenLabels;
  }

  // רינדור ראשוני
  renderAllergenLabels();
}

// הדפסת מדבקות אלרגנים - באמצעות הדפסה כמו דוח מדבקות
function printAllergenLabels() {
  const container = document.getElementById('allergenLabelsContainer');
  
  if (!container || !container.innerHTML || container.innerHTML.trim() === '') {
    alert('אין מדבקות להדפסה');
    return;
  }
  
  // יצירת חלון חדש להדפסה
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('לא ניתן לפתוח חלון חדש. אנא אפשר חלונות קופצים בדפדפן.');
    return;
  }
  
  const dateValue = document.getElementById('dateInput').value || new Date().toISOString().split('T')[0];
  
  // יצירת עותק של התוכן עם ניקוי
  const contentClone = container.cloneNode(true);
  
  // הסרת scripts ואלמנטים לא נחוצים
  const scripts = contentClone.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // הסרת כותרות דפים וסיכום
  const headers = contentClone.querySelectorAll('.allergen-page-header');
  headers.forEach(h => h.remove());
  const summary = contentClone.querySelector('div[style*="background:#f5f5f5"]');
  if (summary) summary.remove();
  
  const containerHTML = contentClone.innerHTML;
  
  if (!containerHTML || containerHTML.trim() === '') {
    alert('אין תוכן להדפסה');
    printWindow.close();
    return;
  }
  
  // יצירת HTML להדפסה
  printWindow.document.open('text/html', 'replace');
  printWindow.document.write('<!DOCTYPE html>');
  printWindow.document.write('<html lang="he" dir="rtl">');
  printWindow.document.write('<head>');
  printWindow.document.write('<meta charset="UTF-8">');
  printWindow.document.write('<title>מדבקות אלרגנים - ' + dateValue + '</title>');
  printWindow.document.write('<style>');
  // הגדרות דף A4 ללא שוליים - מונע headers/footers של הדפדפן
  printWindow.document.write('@page { size: 210mm 297mm; margin: 0 !important; padding: 0 !important; }');
  printWindow.document.write('* { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }');
  printWindow.document.write('html { margin: 0 !important; padding: 0 !important; }');
  printWindow.document.write('body { font-family: Arial, sans-serif; direction: rtl; margin: 0 !important; padding: 0 !important; background: white; width: 210mm; height: 297mm; }');
  printWindow.document.write('.allergen-labels-container { margin: 0; padding: 0; }');
  printWindow.document.write('.allergen-page-header { display: none !important; }');
  // דף מדבקות: 210mm × 297mm, 2 עמודות × 3 שורות, כל מדבקה 105mm × 99mm, ללא שוליים מהצדדים
  printWindow.document.write('.allergen-labels-page { width: 210mm; height: 297mm; margin: 0; padding: 0; box-sizing: border-box; display: grid; grid-template-columns: repeat(2, 105mm); grid-template-rows: repeat(3, 99mm); justify-content: start; align-content: start; background: white; page-break-after: always; page-break-inside: avoid; }');
  printWindow.document.write('.allergen-label { width: 105mm; height: 99mm; border: 1px solid #000; box-sizing: border-box; padding: 4mm; display: flex; flex-direction: column; justify-content: space-between; font-family: Arial, sans-serif; font-size: 10pt; direction: rtl; background: white; overflow: hidden; }');
  printWindow.document.write('.allergen-label-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #000; padding-bottom: 2mm; margin-bottom: 2mm; }');
  printWindow.document.write('.allergen-label-top-info { text-align: right; }');
  printWindow.document.write('.allergen-label-route-station { font-size: 18pt; font-weight: bold; line-height: 1.3; }');
  printWindow.document.write('.allergen-label-date-info { text-align: left; font-size: 14pt; line-height: 1.3; }');
  printWindow.document.write('.allergen-label-body { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 3mm; }');
  printWindow.document.write('.allergen-label-customer { font-size: 22pt; font-weight: bold; text-align: center; line-height: 1.2; }');
  printWindow.document.write('.allergen-label-address { font-size: 16pt; font-weight: bold; text-align: center; line-height: 1.2; }');
  printWindow.document.write('.allergen-label-class { font-size: 18pt; font-weight: bold; text-align: center; }');
  printWindow.document.write('.allergen-label-footer { border-top: 1px solid #000; padding-top: 2mm; text-align: center; display: flex; justify-content: space-between; align-items: center; }');
  printWindow.document.write('.allergen-label-dish { font-size: 16pt; font-weight: bold; line-height: 1.2; flex: 1; text-align: center; }');
  printWindow.document.write('.allergen-label-quantity { font-size: 16pt; font-weight: bold; }');
  printWindow.document.write('@media print { @page { margin: 0 !important; } html, body { margin: 0 !important; padding: 0 !important; width: 210mm !important; height: 297mm !important; } .allergen-labels-page { page-break-after: always; } .allergen-labels-page:last-child { page-break-after: auto; } }');
  printWindow.document.write('</style>');
  printWindow.document.write('</head>');
  printWindow.document.write('<body>');
  printWindow.document.write(containerHTML);
  printWindow.document.write('<script>');
  printWindow.document.write('window.onload = function() { setTimeout(function() { window.print(); }, 500); };');
  printWindow.document.write('<\/script>');
  printWindow.document.write('</body>');
  printWindow.document.write('</html>');
  printWindow.document.close();
}

// הורדת PDF למדבקות אלרגנים - באמצעות הדפסה כמו דוח מדבקות
function downloadAllergenLabelsPDF() {
  // משתמשים באותה פונקציה כי הדפסה ל-PDF זה אותו דבר
  printAllergenLabels();
}

// טעינת הגדרות כשמשנים טאב
const originalShowTab = showTab;
window.showTab = function(tabName, button) {
  // הסתרת כל התוכן
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // הצגת הטאב הנבחר
  document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).classList.add('active');
  if (button) {
    button.classList.add('active');
  }
  
  // טעינת הגדרות אריזה אם צריך
  if (tabName === 'packing') {
    loadPackingSettings();
  }

  // טעינת דוח נהג אם צריך
  if (tabName === 'driver') {
    generateDriverReport();
  }
};

// =====================================
// דוח נהג - כמה קרטונים לכל לקוח
// =====================================

function generateDriverReport() {
  const container = document.getElementById('driverReportContainer');
  const distrLineFilter = document.getElementById('driverDistrLineFilter');

  if (!globalData || Object.keys(globalData).length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">אין נתונים להצגה</p>';
    return;
  }

  // איסוף נתונים מכל ההזמנות
  const customerData = {};

  Object.values(globalData).forEach(order => {
    const custDes = String(order.custDes || '').trim();
    const custName = String(order.custName || '').trim();
    const codeDes = String(order.codeDes || '').trim();
    const distrLine = String(order.distrLine || '').trim();
    const distrOrder = parseInt(order.distrOrder) || 999;

    if (!custDes) return;

    // מפתח ייחודי ללקוח
    const key = `${distrLine}|${custDes}|${codeDes}`;

    if (!customerData[key]) {
      customerData[key] = {
        custDes,
        custName,
        codeDes,
        distrLine,
        distrOrder,
        hotCartons: 0,
        coldCartons: 0
      };
    }

    // ספירת קרטונים - כל מדבקה = קרטון
    // מדבקות חמות
    const items = order.items || [];
    items.forEach(item => {
      const cartonType = String(item.cartonType || item.Y_37210_5_ESH || order.Y_37210_5_ESH || '').trim();
      const pspec6 = String(item.pspec6 || '').trim();
      const pspec3 = String(item.pspec3 || '').trim();

      // בדיקה אם הפריט חם
      const isHot = cartonType.includes('חם') || pspec6.includes('חם') || pspec3.includes('חם');
      // בדיקה אם הפריט קר
      const isCold = cartonType.includes('קר') || pspec6.includes('קר') || pspec3.includes('קר');

      if (isHot) {
        customerData[key].hotCartons++;
      }
      if (isCold) {
        customerData[key].coldCartons++;
      }
    });
  });

  // איסוף קווי חלוקה ייחודיים לסינון
  const distrLines = [...new Set(Object.values(customerData).map(c => c.distrLine).filter(Boolean))].sort();
  distrLineFilter.innerHTML = '<option value="">הכל</option>';
  distrLines.forEach(line => {
    const option = document.createElement('option');
    option.value = line;
    option.textContent = line;
    distrLineFilter.appendChild(option);
  });

  // הוספת מאזין לשינוי סינון
  distrLineFilter.onchange = () => renderDriverReport(customerData);

  // הצגת הדוח
  renderDriverReport(customerData);
}

function renderDriverReport(customerData) {
  const container = document.getElementById('driverReportContainer');
  const selectedLine = document.getElementById('driverDistrLineFilter').value;

  // סינון לפי קו חלוקה
  let filteredData = Object.values(customerData);
  if (selectedLine) {
    filteredData = filteredData.filter(c => c.distrLine === selectedLine);
  }

  // מיון לפי קו חלוקה ואז סדר הפצה
  filteredData.sort((a, b) => {
    if (a.distrLine !== b.distrLine) {
      return a.distrLine.localeCompare(b.distrLine);
    }
    return a.distrOrder - b.distrOrder;
  });

  if (filteredData.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">אין נתונים להצגה</p>';
    return;
  }

  // קיבוץ לפי קו חלוקה
  const byDistrLine = {};
  filteredData.forEach(customer => {
    const line = customer.distrLine || 'לא מוגדר';
    if (!byDistrLine[line]) {
      byDistrLine[line] = [];
    }
    byDistrLine[line].push(customer);
  });

  // בניית ה-HTML
  let html = '<div class="driver-report" id="driverReportContent">';

  Object.entries(byDistrLine).forEach(([distrLine, customers]) => {
    html += `<div class="driver-section">`;
    html += `<h3 style="background:#2196F3;color:white;padding:10px;margin:20px 0 0 0;border-radius:5px 5px 0 0;">🚚 קו חלוקה: ${distrLine}</h3>`;
    html += '<table style="width:100%;border-collapse:collapse;border:1px solid #ccc;margin-bottom:20px;">';
    html += '<thead><tr style="background:#e3f2fd;">';
    html += '<th style="border:1px solid #ccc;padding:10px;text-align:center;width:60px;">#</th>';
    html += '<th style="border:1px solid #ccc;padding:10px;text-align:right;">שם מוסד</th>';
    html += '<th style="border:1px solid #ccc;padding:10px;text-align:center;">מס׳ לקוח</th>';
    html += '<th style="border:1px solid #ccc;padding:10px;text-align:center;background:#ffcdd2;">🔥 קרטונים חמים</th>';
    html += '<th style="border:1px solid #ccc;padding:10px;text-align:center;background:#bbdefb;">❄️ קרטונים קרים</th>';
    html += '<th style="border:1px solid #ccc;padding:10px;text-align:center;background:#c8e6c9;font-weight:bold;">סה"כ</th>';
    html += '</tr></thead><tbody>';

    let totalHot = 0;
    let totalCold = 0;

    customers.forEach((customer, idx) => {
      const bgColor = idx % 2 === 0 ? '#fff' : '#f5f5f5';
      const total = customer.hotCartons + customer.coldCartons;
      totalHot += customer.hotCartons;
      totalCold += customer.coldCartons;

      html += `<tr style="background:${bgColor};">`;
      html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;">${idx + 1}</td>`;
      html += `<td style="border:1px solid #ccc;padding:8px;text-align:right;font-weight:bold;">${customer.custDes}</td>`;
      html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;">${customer.codeDes}</td>`;
      html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;background:#ffebee;font-size:1.1em;">${customer.hotCartons || '-'}</td>`;
      html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;background:#e3f2fd;font-size:1.1em;">${customer.coldCartons || '-'}</td>`;
      html += `<td style="border:1px solid #ccc;padding:8px;text-align:center;background:#e8f5e9;font-weight:bold;font-size:1.1em;">${total}</td>`;
      html += '</tr>';
    });

    // שורת סיכום לקו החלוקה
    html += `<tr style="background:#1976D2;color:white;font-weight:bold;">`;
    html += `<td style="border:1px solid #ccc;padding:10px;text-align:right;" colspan="3">סה"כ קו ${distrLine}</td>`;
    html += `<td style="border:1px solid #ccc;padding:10px;text-align:center;font-size:1.2em;">${totalHot}</td>`;
    html += `<td style="border:1px solid #ccc;padding:10px;text-align:center;font-size:1.2em;">${totalCold}</td>`;
    html += `<td style="border:1px solid #ccc;padding:10px;text-align:center;font-size:1.2em;">${totalHot + totalCold}</td>`;
    html += '</tr>';

    html += '</tbody></table>';
    html += '</div>';
  });

  html += '</div>';
  container.innerHTML = html;
}

function printDriverReport() {
  const content = document.getElementById('driverReportContent');
  if (!content) {
    alert('אין דוח להדפסה');
    return;
  }

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <title>דוח נהג</title>
      <style>
        body { font-family: Arial, sans-serif; direction: rtl; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
        th { background: #e3f2fd; }
        h3 { background: #2196F3; color: white; padding: 10px; margin: 20px 0 0 0; }
        @media print {
          .driver-section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      ${content.innerHTML}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

function downloadDriverPDF() {
  const content = document.getElementById('driverReportContent');
  if (!content) {
    alert('אין דוח להורדה');
    return;
  }

  const opt = {
    margin: 10,
    filename: 'driver-report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(content).save();
}
