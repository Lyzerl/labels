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

/**
 * ========== מילון הגדרות מרכזי ==========
 * כל ההגדרות החוזרות במערכת - לשימוש אחיד בכל הקוד
 */
const DEFINITIONS = {

    // ========== זיהוי סוג פריט (חם/קר) ==========
    hotKeywords: ['חם', 'חמים'],
    coldKeywords: ['קר', 'קרים'],

    /**
     * בדיקה אם פריט הוא חם
     * @param {Object} item - פריט עם שדות cartonType, pspec6, pspec3
     * @returns {boolean}
     */
    isHotItem: function(item) {
        const cartonType = String(item.cartonType || item.CARTON_TYPE || item.Y_37210_5_ESH || '').toLowerCase();
        const pspec6 = String(item.pspec6 || item.PSPEC6 || '').toLowerCase();
        const pspec3 = String(item.pspec3 || item.PSPEC3 || '').toLowerCase();

        return this.hotKeywords.some(kw =>
            cartonType.includes(kw) || pspec6.includes(kw) || pspec3.includes(kw)
        );
    },

    /**
     * בדיקה אם פריט הוא קר
     * @param {Object} item - פריט עם שדות cartonType, pspec6, pspec3
     * @returns {boolean}
     */
    isColdItem: function(item) {
        const cartonType = String(item.cartonType || item.CARTON_TYPE || item.Y_37210_5_ESH || '').toLowerCase();
        const pspec6 = String(item.pspec6 || item.PSPEC6 || '').toLowerCase();
        const pspec3 = String(item.pspec3 || item.PSPEC3 || '').toLowerCase();

        return this.coldKeywords.some(kw =>
            cartonType.includes(kw) || pspec6.includes(kw) || pspec3.includes(kw)
        );
    },

    // ========== זיהוי שיטת אריזה ==========
    trayKeywords: ['חמגשית'],
    gastronormKeywords: ['גסטרונום', 'גסטרו'],

    /**
     * בדיקה אם פריט הוא חמגשית
     * @param {Object} item - פריט עם שדות packMethodCode, packDes, pspec1
     * @returns {boolean}
     */
    isTrayItem: function(item) {
        const packMethodCode = String(item.packMethodCode || item.PACKMETHODCODE || '').toLowerCase();
        const packDes = String(item.packDes || item.PACKDES || '').toLowerCase();
        const pspec1 = String(item.pspec1 || item.PSPEC1 || '').toLowerCase();

        return this.trayKeywords.some(kw =>
            packMethodCode.includes(kw) || packDes.includes(kw) || pspec1.includes(kw)
        );
    },

    /**
     * בדיקה אם פריט הוא גסטרונום
     * @param {Object} item - פריט עם שדות packDes, pspec1
     * @returns {boolean}
     */
    isGastronormItem: function(item) {
        const packDes = String(item.packDes || item.PACKDES || '').toLowerCase();
        const pspec1 = String(item.pspec1 || item.PSPEC1 || '').toLowerCase();

        // ירק שאריזתו גסטרונום - מתייחסים אליו כתפזורת (לא כגסטרונום)
        if (pspec1.includes('ירק')) return false;

        return this.gastronormKeywords.some(kw =>
            packDes.includes(kw) || pspec1.includes(kw)
        );
    },

    // ========== זיהוי גודל חמגשית ==========
    smallTrayKeywords: ['קט', 'קטן', 'קטנה'],
    largeTrayKeywords: ['גד', 'גדול', 'גדולה'],

    /**
     * בדיקה אם חמגשית קטנה
     * @param {Object} item - פריט עם שדה packDes
     * @returns {boolean}
     */
    isSmallTray: function(item) {
        const packDes = String(item.packDes || item.PACKDES || '').toLowerCase();
        return this.smallTrayKeywords.some(kw => packDes.includes(kw));
    },

    /**
     * בדיקה אם חמגשית גדולה
     * @param {Object} item - פריט עם שדה packDes
     * @returns {boolean}
     */
    isLargeTray: function(item) {
        const packDes = String(item.packDes || item.PACKDES || '').toLowerCase();
        return this.largeTrayKeywords.some(kw => packDes.includes(kw));
    },

    // ========== זיהוי אלרגנים ==========
    noAllergenKeywords: ['ללא אלרגני', 'לא אלרגני', 'ללא אלרגנים'],

    /**
     * בדיקה אם פריט ללא אלרגנים
     * @param {Object} item - פריט עם שדות spec2, pspec2, pspec1
     * @returns {boolean}
     */
    isNoAllergen: function(item) {
        const spec2 = String(item.spec2 || item.SPEC2 || '').toLowerCase();
        const pspec2 = String(item.pspec2 || item.PSPEC2 || '').toLowerCase();
        const pspec1 = String(item.pspec1 || item.PSPEC1 || '').toLowerCase();

        return this.noAllergenKeywords.some(kw =>
            spec2.includes(kw) || pspec2.includes(kw) || pspec1.includes(kw)
        );
    },

    // ========== זיהוי צמחוני ==========
    /**
     * בדיקה אם פריט צמחוני
     * @param {Object} item - פריט עם שדה Y_36827_0_ESH או isVegetarian
     * @returns {boolean}
     */
    isVegetarian: function(item) {
        const vegField = item.Y_36827_0_ESH || item.isVegetarian;
        return vegField === 'Y' || vegField === true || vegField === 1 || vegField === '1';
    },

    // ========== זיהוי מרק ==========
    soupKeywords: ['מרק'],

    /**
     * בדיקה אם פריט הוא מרק
     * @param {Object} item - פריט עם שדה partDes
     * @returns {boolean}
     */
    isSoup: function(item) {
        const partDes = String(item.partDes || item.PARTDES || '').toLowerCase();
        return this.soupKeywords.some(kw => partDes.includes(kw));
    },

    // ========== זיהוי כשרות ==========
    chabadKeywords: ['חב"ד', 'חבד'],
    badatzKeywords: ['בד"ץ', 'בדץ'],

    /**
     * בדיקה אם כשרות חב"ד
     * @param {Object} item - פריט עם שדה spec2
     * @returns {boolean}
     */
    isChabad: function(item) {
        const spec2 = String(item.spec2 || item.SPEC2 || '').toLowerCase();
        return this.chabadKeywords.some(kw => spec2.includes(kw));
    },

    /**
     * בדיקה אם כשרות בד"ץ
     * @param {Object} item - פריט עם שדה spec2
     * @returns {boolean}
     */
    isBadatz: function(item) {
        const spec2 = String(item.spec2 || item.SPEC2 || '').toLowerCase();
        return this.badatzKeywords.some(kw => spec2.includes(kw));
    },

    // ========== זיהוי מילגם ==========
    milgamKeywords: ['מילגם'],

    /**
     * בדיקה אם לקוח מילגם
     * @param {Object} order - הזמנה עם שדות custDes, spec1
     * @returns {boolean}
     */
    isMilgam: function(order) {
        const custDes = String(order.custDes || order.CUSTDES || '').toLowerCase();
        const spec1 = String(order.spec1 || order.SPEC1 || '').toLowerCase();
        return this.milgamKeywords.some(kw => custDes.includes(kw) || spec1.includes(kw));
    },

    // ========== חישוב מארזים ==========
    /**
     * חישוב אופטימלי של מארז 5 ומארז 7
     * מטרה: להגיע למספר מנות עם כמה שפחות מארזים
     * @param {number} target - מספר המנות הרצוי
     * @returns {Object} - { five: מספר מארזי 5, seven: מספר מארזי 7 }
     */
    calculateOptimalPacks: function(target) {
        if (!target || target <= 0) return { five: 0, seven: 0 };

        let bestFive = 0;
        let bestSeven = 0;
        let minPacks = Infinity;

        // נסה כל צירוף אפשרי
        const maxSeven = Math.ceil(target / 7);
        for (let seven = 0; seven <= maxSeven; seven++) {
            const remaining = target - (seven * 7);
            if (remaining >= 0 && remaining % 5 === 0) {
                const five = remaining / 5;
                const totalPacks = five + seven;
                if (totalPacks < minPacks) {
                    minPacks = totalPacks;
                    bestFive = five;
                    bestSeven = seven;
                }
            }
        }

        // אם לא נמצא צירוף מדויק, חפש את הקרוב ביותר
        if (minPacks === Infinity) {
            for (let seven = maxSeven; seven >= 0; seven--) {
                for (let five = 0; five <= Math.ceil(target / 5); five++) {
                    const total = (five * 5) + (seven * 7);
                    if (total >= target) {
                        bestFive = five;
                        bestSeven = seven;
                        return { five: bestFive, seven: bestSeven };
                    }
                }
            }
        }

        return { five: bestFive, seven: bestSeven };
    },

    // ========== קבלת ערכי מיכלים ==========
    /**
     * קבלת כמות מיכלים מפריט
     * @param {Object} item - פריט
     * @returns {number}
     */
    getContainers: function(item) {
        return parseFloat(item.containers || item.CONTAINERS || 0) || 0;
    },

    /**
     * קבלת כמות מארז 5 מפריט
     * @param {Object} item - פריט
     * @returns {number}
     */
    getPack5: function(item) {
        return parseFloat(item.pack5 || item.PACK5 || 0) || 0;
    },

    /**
     * קבלת כמות מארז 7 מפריט
     * @param {Object} item - פריט
     * @returns {number}
     */
    getPack7: function(item) {
        return parseFloat(item.pack7 || item.PACK7 || 0) || 0;
    }
};

// ============================================================
// ========== עזרי משיכת נתונים (Priority Fetch Helpers) ==========
// ============================================================
// מטרה: למרכז את לוגיקת המשיכה כדי להבטיח עקביות בין כל הדפים
// (index, production-report, search-labels) ולמנוע פספוס הזמנות.
//
// תיקונים שכלולים כאן:
//   1. סינון סניף מפורש (eq) במקום השוואת מחרוזות le/ge
//   2. $orderby קבוע ל-pagination יציב (חיוני לעקביות OData)
//   3. retry אוטומטי לשגיאות רשת זמניות
//   4. אימות פוסט-משיכה: סניפים שהתקבלו, NULLים, ספירת הזמנות

/**
 * בונה ביטוי OData לסינון סניף.
 * משתמש ב-eq מפורש (לא le/ge) כדי לא לפספס סניפים לא צפויים
 * ולא לכלול בטעות סניפים חדשים שיתווספו בעתיד.
 *
 * סניף דרום = '0' או '1'
 * סניף צפון = '3' או '4'
 *
 * @param {string} branchSelect - 'south' | 'north' | 'all' | undefined
 * @returns {string|null} - ביטוי OData או null אם 'all'/לא מוגדר
 */
function buildBranchFilter(branchSelect) {
  if (branchSelect === 'south') {
    return `(BRANCHNAME eq '0' or BRANCHNAME eq '1')`;
  }
  if (branchSelect === 'north') {
    return `(BRANCHNAME eq '3' or BRANCHNAME eq '4')`;
  }
  return null;
}

/**
 * בונה URL מלא לבקשת Priority עם $orderby ל-pagination יציב.
 * חשוב: ללא $orderby, OData עלול להחזיר אותן שורות בכמה דפים
 * או לפספס שורות בין דפים.
 *
 * @param {string[]} filterParts - מערך ביטויי OData שיחוברו ב-and
 * @param {Object} opts - { orderby?, fetchAll? }
 * @returns {string} URL מוכן לקריאה
 */
function buildPriorityFetchUrl(filterParts, opts = {}) {
  const validParts = filterParts.filter(Boolean);
  const filter = `$filter=${validParts.join(' and ')}`;
  // $orderby ברירת מחדל: ORDNAME,PARTNAME - חיוני לעקביות
  const orderby = opts.orderby !== undefined ? opts.orderby : '$orderby=ORDNAME,PARTNAME';
  const queryParts = [filter];
  if (orderby) queryParts.push(orderby);
  const query = queryParts.join('&');
  const fetchAll = opts.fetchAll !== false ? '&fetchAll=true' : '';
  return `${PROXY_URL}?filter=${encodeURIComponent(query)}${fetchAll}`;
}

/**
 * מאמת נתונים שנמשכו מ-Priority ומחזיר סטטיסטיקות + רשימת בעיות.
 *
 * @param {Array} data - מערך השורות שהתקבלו
 * @param {Object} opts - { branchSelect? } - לאימות מול הפילטר שביקשנו
 * @returns {{stats: Object, issues: string[]}}
 */
function validatePriorityData(data, opts = {}) {
  const issues = [];
  const uniqueOrders = new Set();
  const branchesFound = new Set();
  let nullOrdname = 0;
  let nullBranchname = 0;
  let nullDuedate = 0;

  data.forEach(row => {
    const ord = String(row.ORDNAME || '').trim();
    const branch = String(row.BRANCHNAME || '').trim();
    const due = String(row.DUEDATE || '').trim();

    if (!ord) nullOrdname++;
    if (!branch) nullBranchname++;
    if (!due) nullDuedate++;

    if (ord) uniqueOrders.add(ord);
    if (branch) branchesFound.add(branch);
  });

  const stats = {
    totalRows: data.length,
    uniqueOrders: uniqueOrders.size,
    branchesFound: [...branchesFound].sort(),
    nullOrdname,
    nullBranchname,
    nullDuedate
  };

  // אימות התאמה לסינון הסניף שביקשנו
  if (opts.branchSelect === 'south') {
    const unexpected = stats.branchesFound.filter(b => b !== '0' && b !== '1');
    if (unexpected.length > 0) {
      issues.push(`סניפים לא צפויים בתוצאות "דרום": [${unexpected.join(', ')}]`);
    }
  } else if (opts.branchSelect === 'north') {
    const unexpected = stats.branchesFound.filter(b => b !== '3' && b !== '4');
    if (unexpected.length > 0) {
      issues.push(`סניפים לא צפויים בתוצאות "צפון": [${unexpected.join(', ')}]`);
    }
  }

  if (stats.nullOrdname > 0) issues.push(`${stats.nullOrdname} שורות ללא ORDNAME`);
  if (stats.nullBranchname > 0 && opts.branchSelect && opts.branchSelect !== 'all') {
    issues.push(`${stats.nullBranchname} שורות ללא BRANCHNAME (לא נכללות בסינון סניף)`);
  }
  if (stats.nullDuedate > 0) issues.push(`${stats.nullDuedate} שורות ללא DUEDATE`);

  return { stats, issues };
}

/**
 * Probe קל לקבלת ספירת רשומות צפויה מ-Priority (ללא משיכת השורות עצמן).
 *
 * שולח בקשה עם $top=0&$count=true ומחפש את הספירה בתשובה
 * תחת אחד מהשמות הסטנדרטיים של OData (v3/v4) או מטא של הפרוקסי.
 *
 * חשוב: עמיד לכישלונות. אם ה-Worker לא תומך / Priority לא מחזיר ספירה,
 * הפונקציה מחזירה null במקום לזרוק שגיאה — כך שהמשיכה הראשית לא תיחסם.
 *
 * @param {string[]} filterParts - רכיבי OData ($filter)
 * @returns {Promise<{count: number|null, raw: Object|null, error: string|null}>}
 */
async function fetchPriorityCount(filterParts) {
  try {
    const validParts = filterParts.filter(Boolean);
    if (validParts.length === 0) return { count: null, raw: null, error: 'no filter' };

    // בקשת OData מינימלית: רק ספירה, ללא רשומות
    const filter = `$filter=${validParts.join(' and ')}`;
    const query = `${filter}&$top=0&$count=true&$inlinecount=allpages`;
    // חשוב: בלי fetchAll - זו בקשה אחת קצרה
    const url = `${PROXY_URL}?filter=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    if (!response.ok) {
      return { count: null, raw: null, error: `HTTP ${response.status}` };
    }
    const json = await response.json();

    // OData החזיר את הספירה באחד מהשדות הבאים, לפי גרסה:
    //   v4: @odata.count
    //   v3: odata.count / __count
    //   פרוקסי מותאם: count / total / meta.totalCount
    const count =
      (typeof json['@odata.count'] === 'number' ? json['@odata.count'] : null) ??
      (typeof json['odata.count'] === 'number' ? json['odata.count'] : null) ??
      (typeof json['__count'] === 'string' ? parseInt(json['__count'], 10) : null) ??
      (typeof json['count'] === 'number' ? json['count'] : null) ??
      (typeof json['total'] === 'number' ? json['total'] : null) ??
      (json.meta && typeof json.meta.totalCount === 'number' ? json.meta.totalCount : null) ??
      (json.meta && typeof json.meta.count === 'number' ? json.meta.count : null) ??
      null;

    return { count: typeof count === 'number' && !isNaN(count) ? count : null, raw: json, error: null };
  } catch (err) {
    return { count: null, raw: null, error: err.message || String(err) };
  }
}

/**
 * משיכת נתונים מאומתת מ-Priority — נקודת כניסה אחת לכל המערכת.
 *
 * - בונה פילטר עם $orderby קבוע (pagination יציב)
 * - סינון סניף מפורש (eq)
 * - **probe ספירה לפני המשיכה** (מאומת מול השרת)
 * - retry אוטומטי לשגיאות רשת
 * - אימות פוסט-משיכה
 *
 * @param {Object} opts - {
 *   date, branchSelect, extraFilters[], retries, orderby, verifyCount
 * }
 * @returns {Promise<{data, meta, stats, issues, url, durationMs, expectedCount, countVerified}>}
 */
async function fetchPriorityData(opts = {}) {
  const {
    date,
    branchSelect = 'all',
    extraFilters = [],
    retries = 2,
    orderby,
    verifyCount = true   // ברירת מחדל: לאמת ספירה
  } = opts;

  // בניית הפילטר
  const filterParts = [];
  if (date) {
    const dateStr = date.includes('T') ? date : (date + 'T00:00:00Z');
    filterParts.push(`DUEDATE eq ${dateStr}`);
  }
  const branchFilter = buildBranchFilter(branchSelect);
  if (branchFilter) filterParts.push(branchFilter);
  if (Array.isArray(extraFilters)) filterParts.push(...extraFilters);

  if (filterParts.length === 0) {
    throw new Error('חובה להעביר לפחות פילטר אחד (date או extraFilters)');
  }

  const url = buildPriorityFetchUrl(filterParts, orderby !== undefined ? { orderby } : {});
  const startTime = Date.now();

  // ========== שלב 1: Probe ספירה (במקביל - לא חוסם) ==========
  // שולחים את ה-probe במקביל למשיכה הראשית כדי לחסוך זמן.
  // אם ה-probe נכשל / הספירה לא הוחזרה - לא נחסום, רק נסמן שלא אומת.
  const countPromise = verifyCount ? fetchPriorityCount(filterParts) : Promise.resolve({ count: null, error: 'disabled' });

  // ========== שלב 2: משיכת הנתונים הראשית עם retry ==========
  let lastError = null;
  let dataResult = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        // 502/503 — שגיאה זמנית, ננסה שוב
        if ((response.status === 502 || response.status === 503) && attempt < retries) {
          throw new Error(`HTTP ${response.status} (זמני)`);
        }
        throw new Error(`שגיאת שרת ${response.status}: ${errText.substring(0, 200)}`);
      }
      const json = await response.json();
      const data = Array.isArray(json) ? json : (json.value || []);
      dataResult = { data, meta: json.meta || null };
      break;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
        continue;
      }
    }
  }

  if (!dataResult) {
    throw lastError || new Error('שגיאה לא ידועה במשיכת נתונים');
  }

  const { data, meta } = dataResult;
  const { stats, issues } = validatePriorityData(data, { branchSelect });
  const durationMs = Date.now() - startTime;

  // ========== שלב 3: השוואת ספירה עם תוצאת ה-probe ==========
  let expectedCount = null;
  let countVerified = false;
  let countError = null;

  try {
    const countResult = await countPromise;
    expectedCount = countResult.count;
    countError = countResult.error;

    if (expectedCount !== null && typeof expectedCount === 'number') {
      if (data.length === expectedCount) {
        countVerified = true;
      } else {
        countVerified = false;
        const diff = expectedCount - data.length;
        if (diff > 0) {
          issues.unshift(`🚨 חסרות ${diff} שורות: נמשכו ${data.length} מתוך ${expectedCount} צפויות`);
        } else {
          issues.unshift(`⚠️ נמשכו ${Math.abs(diff)} שורות מעבר לצפוי: ${data.length} מתוך ${expectedCount}`);
        }
      }
    }
  } catch (e) {
    countError = e.message || String(e);
  }

  return {
    data,
    meta,
    stats,
    issues,
    url,
    durationMs,
    expectedCount,
    countVerified,
    countError
  };
}

// ייצוא לשימוש גלובלי
window.DEFINITIONS = DEFINITIONS;
window.CARTON_CONFIG = CARTON_CONFIG;
window.calculateCartons = calculateCartons;
window.divideItemsToCartons = divideItemsToCartons;
window.buildBranchFilter = buildBranchFilter;
window.buildPriorityFetchUrl = buildPriorityFetchUrl;
window.validatePriorityData = validatePriorityData;
window.fetchPriorityCount = fetchPriorityCount;
window.fetchPriorityData = fetchPriorityData;
