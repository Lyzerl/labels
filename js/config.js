// ביטול console.log לשיפור ביצועים (Production mode)
console.log = function() {};
console.warn = function() {};

// ***** שים כאן את ה-URL של ה-Cloudflare Worker שלך! *****
const PROXY_URL = 'https://priority-proxy.lyzer-64d.workers.dev';


// רשימת השדות המדויקת שביקשת
const SELECTED_FIELDS = [
  'ORDNAME',
  'DUEDATE',
  'BRANCHNAME',
  'CUSTNAME',
  'SPEC1',
  'CUSTDES',
  'CODEDES',
  'PRIT_CLASSNAME',
  'ADDRESS',
  'PHONENUM',
  'DISTRLINECODE',
  'DISTRLINEDES',
  'PRIT_DISTRORDER',
  'STATE',
  'SPEC2',
  'PARTNAME',
  'PARTDES',
  'PSPEC1',
  'PSPEC6',
  'PSPEC3',
  'PSPEC2',
  'PACKMETHODCODE',
  'EATQUANT',
  'TQUANT',
  'TUNITNAME',
  'PRIT_GENQUANT',
  'PRIT_VEGQUANT',
  'Y_9964_5_ESH',
  'Y_9965_5_ESH',
  'Y_37210_5_ESH',
  'CONTAINERS',
  'PACK5',
  'PACK7',
  'PACKDES',
  'MEALNAME',
  'Y_36827_0_ESH'
];

// מיפוי שדות לעברית
const FIELD_NAMES_HEBREW = {
  'ORDNAME': 'הזמנה',
  'DUEDATE': 'תאריך אספקה',
  'BRANCHNAME': 'סניף',
  'CUSTNAME': 'מס לקוח',
  'SPEC1': 'סוג לקוח',
  'CUSTDES': 'שם לקוח',
  'CODEDES': 'תיאור אתר',
  'PRIT_CLASSNAME': 'סוג לקוח',
  'ADDRESS': 'כתובת',
  'PHONENUM': 'טלפון',
  'DISTRLINECODE': 'קו חלוקה',
  'DISTRLINEDES': 'תיאור קו חלוקה',
  'PRIT_DISTRORDER': 'סדר הפצה',
  'STATE': 'עיר',
  'SPEC2': 'כשרות',
  'PARTNAME': 'מקט',
  'PARTDES': 'תיאור מוצר',
  'PSPEC1': 'פרמטר 1 למוצר',
  'PSPEC6': 'פרמטר 6 למוצר',
  'PSPEC3': 'פרמטר 3 למוצר',
  'PSPEC2': 'כשרות',
  'PACKMETHODCODE': 'שיטת אריזה',
  'EATQUANT': 'מספר מנות',
  'TQUANT': 'כמות',
  'TUNITNAME': 'יחידה',
  'PRIT_GENQUANT': 'כמות מעוגל',
  'PRIT_VEGQUANT': 'כמות צמחונית',
  'Y_9964_5_ESH': 'פרמטר 7 למוצר',
  'Y_9965_5_ESH': 'פרמטר 8 למוצר',
  'Y_37210_5_ESH': 'סוג קרטון',
  'CONTAINERS': 'מיכלים',
  'PACK5': 'מארז 5',
  'PACK7': 'מארז 7',
  'PACKDES': 'תיאור מיכל',
  'MEALNAME': 'ארוחה',
  'Y_36827_0_ESH': 'צמחוני'
};

let currentData = []; // נתונים גולמיים (שורות)
let currentStructuredData = {}; // נתונים מובנים (NoSQL - לפי הזמנה)

/**
 * הגדרות קרטונים וחלוקה
 * ניתן לעדכן את הערכים כאן והשינויים יחולו אוטומטית
 */

const CARTON_CONFIG = {
    // הגדרות חם - חמגשית
    hotTray: {
        // כמה חמגשיות גדולות נכנסות לקרטון
        largeTrayPerCarton: 28,
        // כמה חמגשיות קטנות נכנסות לקרטון
        smallTrayPerCarton: 32
    },

    // הגדרות חם - תפזורת
    hotLoose: {
        // קיבולת הקרטון ביחידות בסיס
        cartonCapacity: 10,
        // גודל יחסי של כל סוג מיכל (ביחידות בסיס)
        containerSizes: {
            container: 1,      // מיכל רגיל = 1 יחידה
            gastronorm: 4,     // גסטרונום = 4 יחידות
            pack5: 0.5,        // מארז 5 = 0.5 יחידה
            pack7: 0.7         // מארז 7 = 0.7 יחידה
        }
    },

    // הגדרות קר
    cold: {
        // סף פריטים - עד כמה פריטים נחשב "מעט פריטים"
        fewItemsThreshold: 5,
        // כמה מנות לקרטון כשיש מעט פריטים (עד 5)
        portionsPerCartonFewItems: 20,
        // כמה מנות לקרטון כשיש הרבה פריטים (מעל 5)
        portionsPerCartonManyItems: 15
    }
};

/**
 * פונקציה לחישוב מספר קרטונים נדרש
 * @param {Object} orderData - נתוני ההזמנה
 * @returns {Object} - מספר קרטונים ופרטי החלוקה
 */
function calculateCartons(orderData) {
    const { type, items, totalPortions, traySize } = orderData;

    let cartonsNeeded = 1;
    let reason = '';

    if (type === 'hotTray') {
        // חם חמגשית - לפי מספר מנות (חמגשיות)
        const perCarton = traySize === 'small'
            ? CARTON_CONFIG.hotTray.smallTrayPerCarton
            : CARTON_CONFIG.hotTray.largeTrayPerCarton;
        cartonsNeeded = Math.ceil(totalPortions / perCarton);
        reason = totalPortions + ' חמגשיות / ' + perCarton + ' לקרטון';

    } else if (type === 'hotLoose') {
        // חם תפזורת - לפי נפח יחסי של מיכלים
        const sizes = CARTON_CONFIG.hotLoose.containerSizes;
        const totalVolume = items.reduce(function(sum, item) {
            var containerVol = (item.containers || 0) * sizes.container;
            var gastronormVol = (item.gastronorm || 0) * sizes.gastronorm;
            var pack5Vol = (item.pack5 || 0) * sizes.pack5;
            var pack7Vol = (item.pack7 || 0) * sizes.pack7;
            return sum + containerVol + gastronormVol + pack5Vol + pack7Vol;
        }, 0);
        cartonsNeeded = Math.ceil(totalVolume / CARTON_CONFIG.hotLoose.cartonCapacity);
        reason = totalVolume.toFixed(1) + ' יחידות נפח / ' + CARTON_CONFIG.hotLoose.cartonCapacity + ' לקרטון';

    } else if (type === 'cold') {
        // קר - לפי מספר פריטים ומנות
        const itemCount = items.length;
        const portionsPerCarton = itemCount <= CARTON_CONFIG.cold.fewItemsThreshold
            ? CARTON_CONFIG.cold.portionsPerCartonFewItems
            : CARTON_CONFIG.cold.portionsPerCartonManyItems;
        cartonsNeeded = Math.ceil(totalPortions / portionsPerCarton);
        reason = totalPortions + ' מנות / ' + portionsPerCarton + ' לקרטון (' + itemCount + ' פריטים)';
    }

    return {
        cartonsNeeded: cartonsNeeded,
        reason: reason
    };
}

/**
 * פונקציה לחלוקת פריטים בין קרטונים
 * ב-2 קרטונים: חלוקה שווה (חצי חצי)
 * ביותר מ-2 קרטונים: מילוי רציף - ממלא קרטון עד שהוא מלא ואז עובר לבא
 * @param {Array} items - רשימת הפריטים
 * @param {number} cartonsNeeded - מספר קרטונים
 * @param {string} type - סוג ההזמנה (hotTray, hotLoose, cold)
 * @param {Object} orderData - נתוני ההזמנה (לחישוב קיבולת)
 * @returns {Array} - מערך של קרטונים עם הפריטים שלהם
 */
function divideItemsToCartons(items, cartonsNeeded, type, orderData) {
    if (cartonsNeeded <= 1) {
        return [{ cartonNumber: 1, items: items }];
    }

    var cartons = [];
    for (var i = 0; i < cartonsNeeded; i++) {
        cartons.push({ cartonNumber: i + 1, items: [], usedCapacity: 0 });
    }

    // ב-2 קרטונים: חלוקה שווה (חצי חצי)
    if (cartonsNeeded === 2) {
        return divideItemsEvenlyToTwoCartons(items, type);
    }

    // יותר מ-2 קרטונים: מילוי רציף
    if (type === 'hotTray') {
        // חמגשית - מילוי רציף לפי מנות
        var traySize = orderData && orderData.traySize;
        var perCarton = traySize === 'small'
            ? CARTON_CONFIG.hotTray.smallTrayPerCarton
            : CARTON_CONFIG.hotTray.largeTrayPerCarton;

        var currentCartonIndex = 0;

        items.forEach(function(item) {
            var remainingQty = item.quantity;

            while (remainingQty > 0 && currentCartonIndex < cartonsNeeded) {
                var currentCarton = cartons[currentCartonIndex];
                var availableSpace = perCarton - currentCarton.usedCapacity;

                if (availableSpace <= 0) {
                    // קרטון מלא, עבור לבא
                    currentCartonIndex++;
                    continue;
                }

                // כמה מהפריט הנוכחי נכנס לקרטון
                var qtyToAdd = Math.min(remainingQty, availableSpace);

                // שומרים את כל המידע המקורי ורק מעדכנים את הכמות
                var newItem = Object.assign({}, item);
                newItem.quantity = qtyToAdd;
                currentCarton.items.push(newItem);
                currentCarton.usedCapacity += qtyToAdd;
                remainingQty -= qtyToAdd;

                // אם הקרטון התמלא, עבור לבא
                if (currentCarton.usedCapacity >= perCarton) {
                    currentCartonIndex++;
                }
            }
        });

    } else if (type === 'hotLoose') {
        // תפזורת - מילוי רציף לפי נפח יחסי
        var cartonCapacity = CARTON_CONFIG.hotLoose.cartonCapacity;
        var sizes = CARTON_CONFIG.hotLoose.containerSizes;
        var currentCartonIndex = 0;

        items.forEach(function(item) {
            var remainingContainers = item.containers || 0;
            var remainingGastronorm = item.gastronorm || 0;
            var remainingPack5 = item.pack5 || 0;
            var remainingPack7 = item.pack7 || 0;

            // חישוב נפח כולל שנותר
            function calcRemainingVolume() {
                return remainingContainers * sizes.container +
                       remainingGastronorm * sizes.gastronorm +
                       remainingPack5 * sizes.pack5 +
                       remainingPack7 * sizes.pack7;
            }

            while (calcRemainingVolume() > 0 && currentCartonIndex < cartonsNeeded) {
                var currentCarton = cartons[currentCartonIndex];
                var availableSpace = cartonCapacity - currentCarton.usedCapacity;

                if (availableSpace <= 0.01) { // סף קטן למניעת שגיאות עיגול
                    currentCartonIndex++;
                    continue;
                }

                // שומרים את כל המידע המקורי
                var cartonItem = Object.assign({}, item);
                var volumeAdded = 0;

                // מחלקים לפי נפח פנוי - קודם גסטרונום, אח"כ מיכלים, אח"כ מארזים
                var gastronormToAdd = Math.min(remainingGastronorm, Math.floor(availableSpace / sizes.gastronorm));
                volumeAdded += gastronormToAdd * sizes.gastronorm;
                availableSpace -= gastronormToAdd * sizes.gastronorm;

                var containersToAdd = Math.min(remainingContainers, Math.floor(availableSpace / sizes.container));
                volumeAdded += containersToAdd * sizes.container;
                availableSpace -= containersToAdd * sizes.container;

                var pack5ToAdd = Math.min(remainingPack5, Math.floor(availableSpace / sizes.pack5));
                volumeAdded += pack5ToAdd * sizes.pack5;
                availableSpace -= pack5ToAdd * sizes.pack5;

                var pack7ToAdd = Math.min(remainingPack7, Math.floor(availableSpace / sizes.pack7));
                volumeAdded += pack7ToAdd * sizes.pack7;

                cartonItem.containers = containersToAdd;
                cartonItem.gastronorm = gastronormToAdd;
                cartonItem.pack5 = pack5ToAdd;
                cartonItem.pack7 = pack7ToAdd;

                if (volumeAdded > 0) {
                    currentCarton.items.push(cartonItem);
                    currentCarton.usedCapacity += volumeAdded;
                }

                remainingContainers -= containersToAdd;
                remainingGastronorm -= gastronormToAdd;
                remainingPack5 -= pack5ToAdd;
                remainingPack7 -= pack7ToAdd;

                if (currentCarton.usedCapacity >= cartonCapacity - 0.01) {
                    currentCartonIndex++;
                }
            }
        });

    } else if (type === 'cold') {
        // קר - מילוי רציף לפי מנות
        var itemCount = items.length;
        var portionsPerCarton = itemCount <= CARTON_CONFIG.cold.fewItemsThreshold
            ? CARTON_CONFIG.cold.portionsPerCartonFewItems
            : CARTON_CONFIG.cold.portionsPerCartonManyItems;

        var currentCartonIndex = 0;

        items.forEach(function(item) {
            var remainingQty = item.quantity;

            while (remainingQty > 0 && currentCartonIndex < cartonsNeeded) {
                var currentCarton = cartons[currentCartonIndex];
                var availableSpace = portionsPerCarton - currentCarton.usedCapacity;

                if (availableSpace <= 0) {
                    currentCartonIndex++;
                    continue;
                }

                var qtyToAdd = Math.min(remainingQty, availableSpace);

                var newItem = Object.assign({}, item);
                newItem.quantity = qtyToAdd;
                currentCarton.items.push(newItem);
                currentCarton.usedCapacity += qtyToAdd;
                remainingQty -= qtyToAdd;

                if (currentCarton.usedCapacity >= portionsPerCarton) {
                    currentCartonIndex++;
                }
            }
        });
    }

    // הסר את שדה usedCapacity מהתוצאה הסופית
    cartons.forEach(function(carton) {
        delete carton.usedCapacity;
    });

    // סנן קרטונים ריקים
    return cartons.filter(function(carton) {
        return carton.items.length > 0;
    });
}

/**
 * פונקציה לחלוקה שווה ל-2 קרטונים (חצי חצי)
 * @param {Array} items - רשימת הפריטים
 * @param {string} type - סוג ההזמנה
 * @returns {Array} - מערך של 2 קרטונים עם הפריטים שלהם
 */
function divideItemsEvenlyToTwoCartons(items, type) {
    var cartons = [
        { cartonNumber: 1, items: [] },
        { cartonNumber: 2, items: [] }
    ];

    if (type === 'hotTray' || type === 'cold') {
        // חלוקה שווה של כמויות
        items.forEach(function(item) {
            var quantityPerCarton = Math.floor(item.quantity / 2);
            var remainder = item.quantity % 2;

            for (var i = 0; i < 2; i++) {
                var qty = quantityPerCarton + (i < remainder ? 1 : 0);
                if (qty > 0) {
                    var newItem = Object.assign({}, item);
                    newItem.quantity = qty;
                    cartons[i].items.push(newItem);
                }
            }
        });

    } else if (type === 'hotLoose') {
        // תפזורת - חלוקה שווה לפי מיכלים
        items.forEach(function(item) {
            var containersPerCarton = Math.floor((item.containers || 0) / 2);
            var containersRemainder = (item.containers || 0) % 2;
            var gastronormPerCarton = Math.floor((item.gastronorm || 0) / 2);
            var gastronormRemainder = (item.gastronorm || 0) % 2;
            var pack5PerCarton = Math.floor((item.pack5 || 0) / 2);
            var pack5Remainder = (item.pack5 || 0) % 2;
            var pack7PerCarton = Math.floor((item.pack7 || 0) / 2);
            var pack7Remainder = (item.pack7 || 0) % 2;

            for (var i = 0; i < 2; i++) {
                var cartonItem = Object.assign({}, item);
                cartonItem.containers = containersPerCarton + (i < containersRemainder ? 1 : 0);
                cartonItem.gastronorm = gastronormPerCarton + (i < gastronormRemainder ? 1 : 0);
                cartonItem.pack5 = pack5PerCarton + (i < pack5Remainder ? 1 : 0);
                cartonItem.pack7 = pack7PerCarton + (i < pack7Remainder ? 1 : 0);

                if (cartonItem.containers > 0 || cartonItem.gastronorm > 0 || cartonItem.pack5 > 0 || cartonItem.pack7 > 0) {
                    cartons[i].items.push(cartonItem);
                }
            }
        });
    }

    return cartons;
}

// ייצוא לשימוש גלובלי
window.CARTON_CONFIG = CARTON_CONFIG;
window.calculateCartons = calculateCartons;
window.divideItemsToCartons = divideItemsToCartons;
