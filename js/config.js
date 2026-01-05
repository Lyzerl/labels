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
