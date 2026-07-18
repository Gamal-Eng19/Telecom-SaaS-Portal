import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

// ================= TRANSLATIONS DICTIONARY =================
const locales = {
  en: {
    brandTagline: "Connecting • Empowering • Growing",
    sysAdmin: "System Admin",
    customer: "Customer",
    signedInAs: "Signed in as",
    myProfile: "My Profile",
    helpSupport: "Help & Support",
    logout: "Logout",
    customerID: "Customer ID",
    memberSince: "Member since",
    Active: "Active",
    Pending: "Pending",
    Cancelled: "Cancelled",
    Resolved: "Resolved",
    welcomeBack: "Welcome back",
    signInDesc: "Sign in to your Masar Telecom workspace.",
    email: "Email",
    password: "Password",
    forgotPwd: "Forgot password?",
    signInBtn: "Sign In",
    noAccountDesc: "If you don't have an account, please contact your administrator.",
    resetPwdTitle: "Reset Password",
    resetPwdDesc: "Enter your email and we'll send you a link to reset your password.",
    sendResetLink: "Send Reset Link",
    backToSignIn: "← Back to Sign In",
    createPwdTitle: "Create New Password",
    createPwdDesc: "Enter your new secure password below.",
    newPwd: "New Password",
    saveNewPwd: "Save New Password",
    walletBalance: "Wallet Balance",
    usageOverview: "Usage Overview",
    internetQuota: "Internet Quota",
    voiceMinutes: "Voice Minutes",
    explorePackages: "Explore Packages",
    seeAllPackages: "See All Packages →",
    subscribeNow: "Subscribe Now",
    noPackagesAvail: "No packages available right now.",
    mySubscriptions: "My Subscriptions",
    packageText: "Package",
    orderText: "Order",
    egpMo: "EGP / mo",
    renewsText: "Renews",
    nextMonth: "Next Month",
    noSubsTitle: "You haven't subscribed to any packages yet.",
    noSubsDesc: "Pick a package from above to get started!",
    backToDashboard: "← Back to Dashboard",
    currentWalletBal: "Current Wallet Balance",
    egp: "EGP",
    personalInfo: "Personal Information",
    personalInfoDesc: "Update your contact details and account security.",
    fullName: "Full Name",
    readOnly: "(Read Only)",
    phoneNum: "Phone Number",
    addressText: "Address",
    cityStreet: "City, Street",
    secSettings: "Security Settings",
    leaveBlank: "Leave blank to keep current",
    changePwdHint: "To change your password, simply type a new one above.",
    saveChanges: "Save Changes",
    allPackages: "All Packages",
    browsePlan: "Browse and find the best plan for your needs.",
    searchPkgHint: "Search packages by name or category (e.g. Internet, Mobile)...",
    noPkgFound: "No packages found matching your search.",
    clearSearch: "Clear Search",
    helpDesc: "We're here to help you with any issues or questions.",
    faq: "Frequently Asked Questions",
    needHelp: "Need immediate assistance?",
    support247: "Our customer service team is available 24/7.",
    submitTicket: "Submit a Support Ticket",
    ticketDesc: "Describe your issue below and our team will get back to you directly.",
    issueSubject: "Issue Subject",
    selectCat: "-- Select a Category --",
    msgDetails: "Message Details",
    ticketPlaceholder: "Please provide as much detail as possible so we can help you faster...",
    sendTicket: "Send Ticket",
    opsDashboard: "Operations Dashboard",
    opsDesc: "Manage customers, packages, and telecom orders.",
    exportFull: "Export Full Report",
    overviewTab: "Overview",
    customersTab: "Customers",
    packagesTab: "Packages",
    ordersTab: "Orders",
    ticketsTab: "Support Tickets",
    auditTab: "Audit Logs",
    totalOrders: "Total Orders",
    activeSubs: "Active Subs",
    addCustomer: "Add Customer",
    editCustomer: "Edit Customer",
    natId: "National ID",
    balanceText: "Balance",
    typeText: "Type",
    individual: "Individual",
    vip: "VIP",
    business: "Business",
    updateCustomer: "Update Customer",
    cancelText: "Cancel",
    custList: "Customers List",
    searchCust: "Search customers...",
    exportBtn: "Export",
    nameCol: "Name",
    emailCol: "Email",
    verifiedCol: "Verified?",
    balanceCol: "Balance",
    actionsCol: "Actions",
    editBtn: "Edit",
    delBtn: "Del",
    prevBtn: "Previous",
    nextBtn: "Next",
    pageText: "Page",
    ofText: "of",
    addPkg: "Add Package",
    editPkg: "Edit Package",
    pkgName: "Package name",
    desc: "Description",
    priceEgp: "Price (EGP)",
    categoryText: "Category",
    updatePkg: "Update Package",
    pkgSetup: "Packages Setup",
    availableTxt: "Available",
    createOrder: "Create Manual Order",
    selectCust: "-- Select Customer --",
    selectPkg: "-- Select Package --",
    submitOrder: "Submit Order",
    orderMgmt: "Order Management",
    searchOrd: "Search orders...",
    statusCol: "Status",
    activateBtn: "Activate",
    manageIssues: "Manage customer issues and send responses via email.",
    refreshBtn: "Refresh",
    dateCol: "Date",
    subjectCol: "Subject",
    actionCol: "Action",
    respondBtn: "Respond",
    noTicketsFound: "No support tickets found.",
    sysAudit: "System Audit Logs",
    auditDesc2: "Track real-time activities and system events during this session.",
    filterTxt: "Filter",
    clearLogsBtn: "Clear Logs",
    timestampCol: "Timestamp",
    userCol: "User",
    roleCol: "Role",
    detailsCol: "Details",
    noActivityFound: "No activity matching this filter.",
    confirmAction: "Confirm Action",
    successMod: "Success",
    noticeMod: "Notice",
    yesProceed: "Yes, Proceed",
    okBtn: "OK",
    respondTicketTitle: "Respond to Ticket",
    fromTxt: "From",
    yourReply: "Your Reply (Sent via Email)",
    typeReply: "Type your response here...",
    sendReply: "Send Reply",
    leaveEmptyToKeep: "Leave empty to keep",
    setPwd: "Set password",
    unknown: "Unknown",
    na: "N/A",
    Internet: "Internet",
    Mobile: "Mobile",
    Bundle: "Bundle",
    billingCategory: "Billing & Payments",
    subIssueCategory: "Package Subscription Issue",
    connCategory: "Internet Connectivity",
    accCategory: "Account Settings",
    otherCategory: "Other"
  },
  ar: {
    brandTagline: "تواصل • تمكين • نمو",
    sysAdmin: "مدير النظام",
    customer: "العميل",
    signedInAs: "مسجل الدخول كـ",
    myProfile: "ملفي الشخصي",
    helpSupport: "المساعدة والدعم",
    logout: "تسجيل الخروج",
    customerID: "رقم العميل",
    memberSince: "عضو منذ",
    Active: "نشط",
    Pending: "قيد الانتظار",
    Cancelled: "ملغى",
    Resolved: "تم الحل",
    welcomeBack: "مرحباً بعودتك",
    signInDesc: "سجل الدخول إلى مساحة عمل مسار تيليكوم.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    forgotPwd: "هل نسيت كلمة المرور؟",
    signInBtn: "تسجيل الدخول",
    noAccountDesc: "إذا لم يكن لديك حساب، يرجى التواصل مع مسؤول النظام.",
    resetPwdTitle: "إعادة تعيين كلمة المرور",
    resetPwdDesc: "أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.",
    sendResetLink: "إرسال رابط الاستعادة",
    backToSignIn: "العودة لتسجيل الدخول →",
    createPwdTitle: "إنشاء كلمة مرور جديدة",
    createPwdDesc: "أدخل كلمة المرور الجديدة الآمنة بالأسفل.",
    newPwd: "كلمة المرور الجديدة",
    saveNewPwd: "حفظ كلمة المرور",
    walletBalance: "رصيد المحفظة",
    usageOverview: "نظرة عامة على الاستهلاك",
    internetQuota: "سعة الإنترنت",
    voiceMinutes: "دقائق المكالمات",
    explorePackages: "استكشف الباقات",
    seeAllPackages: "عرض كافة الباقات ←",
    subscribeNow: "اشترك الآن",
    noPackagesAvail: "لا توجد باقات متاحة في الوقت الحالي.",
    mySubscriptions: "اشتراكاتي",
    packageText: "الباقة",
    orderText: "الطلب",
    egpMo: "جنيه / شهر",
    renewsText: "تتجدد",
    nextMonth: "الشهر القادم",
    noSubsTitle: "لم تقم بالاشتراك في أي باقة حتى الآن.",
    noSubsDesc: "اختر باقة من الأعلى للبدء!",
    backToDashboard: "العودة للوحة التحكم →",
    currentWalletBal: "الرصيد الحالي للمحفظة",
    egp: "جنيه",
    personalInfo: "المعلومات الشخصية",
    personalInfoDesc: "قم بتحديث بيانات الاتصال وإعدادات الأمان الخاصة بك.",
    fullName: "الاسم الكامل",
    readOnly: "(للقراءة فقط)",
    phoneNum: "رقم الهاتف",
    addressText: "العنوان",
    cityStreet: "المدينة، الشارع",
    secSettings: "إعدادات الأمان",
    leaveBlank: "اتركه فارغاً للاحتفاظ بكلمة المرور الحالية",
    changePwdHint: "لتغيير كلمة المرور، ببساطة اكتب كلمة جديدة بالأعلى.",
    saveChanges: "حفظ التغييرات",
    allPackages: "كافة الباقات",
    browsePlan: "تصفح واعثر على أفضل خطة تناسب احتياجاتك.",
    searchPkgHint: "ابحث عن الباقات بالاسم أو الفئة...",
    noPkgFound: "لم يتم العثور على باقات تطابق بحثك.",
    clearSearch: "مسح البحث",
    helpDesc: "نحن هنا لمساعدتك في أي استفسارات أو مشكلات.",
    faq: "الأسئلة الشائعة",
    needHelp: "هل تحتاج إلى مساعدة فورية؟",
    support247: "فريق خدمة العملاء متاح على مدار الساعة.",
    submitTicket: "تقديم تذكرة دعم",
    ticketDesc: "يرجى وصف المشكلة بالأسفل وسيقوم فريقنا بالتواصل معك مباشرة.",
    issueSubject: "موضوع المشكلة",
    selectCat: "-- اختر الفئة --",
    msgDetails: "تفاصيل الرسالة",
    ticketPlaceholder: "يرجى تقديم تفاصيل كافية لنتمكن من مساعدتك في أسرع وقت...",
    sendTicket: "إرسال التذكرة",
    opsDashboard: "لوحة التحكم والعمليات",
    opsDesc: "إدارة العملاء، الباقات، وطلبات الاتصالات.",
    exportFull: "تصدير التقرير الشامل",
    overviewTab: "نظرة عامة",
    customersTab: "العملاء",
    packagesTab: "الباقات",
    ordersTab: "الطلبات",
    ticketsTab: "تذاكر الدعم",
    auditTab: "سجلات النظام",
    totalOrders: "إجمالي الطلبات",
    activeSubs: "الاشتراكات النشطة",
    addCustomer: "إضافة عميل",
    editCustomer: "تعديل بيانات العميل",
    natId: "الرقم القومي",
    balanceText: "الرصيد",
    typeText: "النوع",
    individual: "أفراد",
    vip: "كبار العملاء",
    business: "أعمال",
    updateCustomer: "تحديث العميل",
    cancelText: "إلغاء",
    custList: "قائمة العملاء",
    searchCust: "البحث عن عملاء...",
    exportBtn: "تصدير",
    nameCol: "الاسم",
    emailCol: "البريد الإلكتروني",
    verifiedCol: "مُوثق؟",
    balanceCol: "الرصيد",
    actionsCol: "الإجراءات",
    editBtn: "تعديل",
    delBtn: "حذف",
    prevBtn: "السابق",
    nextBtn: "التالي",
    pageText: "صفحة",
    ofText: "من",
    addPkg: "إضافة باقة",
    editPkg: "تعديل الباقة",
    pkgName: "اسم الباقة",
    desc: "الوصف",
    priceEgp: "السعر (جنيه)",
    categoryText: "الفئة",
    updatePkg: "تحديث الباقة",
    pkgSetup: "إعداد الباقات",
    availableTxt: "متاح",
    createOrder: "إنشاء طلب يدوي",
    selectCust: "-- اختر العميل --",
    selectPkg: "-- اختر الباقة --",
    submitOrder: "تأكيد الطلب",
    orderMgmt: "إدارة الطلبات",
    searchOrd: "البحث عن طلبات...",
    statusCol: "الحالة",
    activateBtn: "تفعيل",
    manageIssues: "إدارة مشكلات العملاء وإرسال الردود عبر البريد.",
    refreshBtn: "تحديث",
    dateCol: "التاريخ",
    subjectCol: "الموضوع",
    actionCol: "الإجراء",
    respondBtn: "الرد",
    noTicketsFound: "لا توجد تذاكر دعم في الوقت الحالي.",
    sysAudit: "سجلات نظام التدقيق",
    auditDesc2: "تتبع الأنشطة اللحظية وأحداث النظام خلال هذه الجلسة.",
    filterTxt: "تصفية",
    clearLogsBtn: "مسح السجلات",
    timestampCol: "الوقت",
    userCol: "المستخدم",
    roleCol: "الدور",
    detailsCol: "التفاصيل",
    noActivityFound: "لا توجد أنشطة تطابق هذه التصفية.",
    confirmAction: "تأكيد الإجراء",
    successMod: "نجاح",
    noticeMod: "ملاحظة",
    yesProceed: "نعم، استمر",
    okBtn: "حسناً",
    respondTicketTitle: "الرد على التذكرة",
    fromTxt: "من",
    yourReply: "ردك (سيتم إرساله عبر البريد الإلكتروني)",
    typeReply: "اكتب ردك هنا...",
    sendReply: "إرسال الرد",
    leaveEmptyToKeep: "اتركه فارغاً للاحتفاظ به",
    setPwd: "تعيين كلمة المرور",
    unknown: "غير معروف",
    na: "غير متوفر",
    Internet: "إنترنت",
    Mobile: "محمول",
    Bundle: "باقة مجمعة",
    billingCategory: "الفواتير والمدفوعات",
    subIssueCategory: "مشكلة في اشتراك الباقة",
    connCategory: "اتصال الإنترنت",
    accCategory: "إعدادات الحساب",
    otherCategory: "أخرى"
  }
};

// ================= BRAND LOGO COMPONENT =================
const BrandLogo = ({ showText = true, size = "md", tagline = false, layout = "row", t }) => {
  const svgClasses = size === 'lg' ? 'w-20 h-20' : size === 'sm' ? 'w-8 h-8' : 'w-12 h-12';
  const masarClass = size === 'lg' ? 'text-[42px]' : size === 'sm' ? 'text-xl' : 'text-[28px]';
  const telecomClass = size === 'lg' ? 'text-[28px]' : size === 'sm' ? 'text-sm' : 'text-lg';
  const gapClass = size === 'lg' ? 'gap-5' : 'gap-3';
  const dividerClass = size === 'lg' ? 'h-16' : size === 'sm' ? 'h-7' : 'h-10';

  return (
    <div className={`flex ${layout === 'col' ? 'flex-col items-center gap-4' : `items-center ${gapClass}`}`}>
       <svg className={svgClasses} viewBox="0 0 125 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A3FF" />
              <stop offset="100%" stopColor="#0055FF" />
            </linearGradient>
            <linearGradient id="gradRight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0B2052" />
              <stop offset="100%" stopColor="#004ba0" />
            </linearGradient>
          </defs>
          <path d="M55 55 L85 25 V85" stroke="url(#gradRight)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 85 V25 L55 55" stroke="url(#gradLeft)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M88 12 A 16 16 0 0 1 106 30" stroke="#0062D1" strokeWidth="4" strokeLinecap="round" />
          <path d="M96 2 A 28 28 0 0 1 122 30" stroke="#0062D1" strokeWidth="4" strokeLinecap="round" />
       </svg>
       {showText && (
         <div className={`flex ${layout === 'col' ? 'flex-col items-center' : 'items-center gap-4'}`}>
           {layout === 'row' && <div className={`w-[2px] bg-gray-200 rounded-full ${dividerClass}`}></div>}
           <div className={`flex flex-col justify-center ${layout === 'col' ? 'text-center' : 'text-left'}`}>
             <span className={`text-[#0B2052] font-black leading-none tracking-wide ${masarClass}`}>Masar</span>
             <span className={`text-[#0062D1] font-medium leading-tight tracking-wider ${telecomClass}`}>Telecom</span>
           </div>
         </div>
       )}
       {tagline && (
          <div className="w-full text-center mt-4">
            <span className="text-[10px] sm:text-xs font-black text-[#0B2052] tracking-[0.3em] uppercase opacity-90">
              {t.brandTagline}
            </span>
          </div>
       )}
    </div>
  );
};


function App() {
  // ================= 1. AUTH & NAVIGATION STATES =================
  const [auth, setAuth] = useState({ isAuthenticated: false, role: '', email: '' });
  const [authMode, setAuthMode] = useState('signin'); 
  const [language, setLanguage] = useState('en'); 
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [forgotForm, setForgotForm] = useState({ email: '' });
  const [resetForm, setResetForm] = useState({ email: '', token: '', newPassword: '' }); 

  const [activeTab, setActiveTab] = useState('overview'); 
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAdminNavMenu, setShowAdminNavMenu] = useState(false); 
  
  const [customerView, setCustomerView] = useState('dashboard'); 
  const [settingsForm, setSettingsForm] = useState({ fullName: '', phoneNumber: '', address: '', newPassword: '' });
  
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });
  const [openFaq, setOpenFaq] = useState(null); 

  const [packageSearch, setPackageSearch] = useState('');
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'alert', message: '', status: 'success', onConfirm: null });

  const [respondModal, setRespondModal] = useState({ isOpen: false, ticket: null, responseText: '' });

  // ================= 2. DATA STATES =================
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0); 
  const [auditLogs, setAuditLogs] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);

  const [auditFilter, setAuditFilter] = useState('All');
  const [showAuditFilterMenu, setShowAuditFilterMenu] = useState(false);

  const [customerPage, setCustomerPage] = useState(1);
  const [customerSearch, setCustomerSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [customerTotalPages, setCustomerTotalPages] = useState(1);
  const [orderSearchInput, setOrderSearchInput] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const [customerForm, setCustomerForm] = useState({ id: null, fullName: '', phoneNumber: '', nationalId: '', email: '', address: '', type: 0, balance: 0, password: '' });
  const [productForm, setProductForm] = useState({ id: null, name: '', description: '', price: '', category: 'Internet' });
  const [orderForm, setOrderForm] = useState({ customerId: '', productId: '' });

  const t = locales[language]; // Dictionary Reference

  // ================= HELPER: CUSTOM MODALS =================
  const showAlert = (message, status = 'success') => setModalConfig({ isOpen: true, type: 'alert', message, status, onConfirm: null });
  const showConfirm = (message, onConfirm) => setModalConfig({ isOpen: true, type: 'confirm', message, status: 'info', onConfirm });
  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  // ================= 3. SAFE FETCH DATA =================
  const fetchCustomers = () => {
    fetch(`http://localhost:5000/api/Customers?page=${customerPage}&search=${encodeURIComponent(customerSearch)}`, { cache: 'no-store' })
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch customers'))
      .then(result => {
        setCustomers(Array.isArray(result) ? result : (result?.data || []));
        setCustomerTotalPages(result?.totalPages || 1);
      })
      .catch(err => console.error("Customers API Error:", err));
  };

  const fetchProducts = () => {
    fetch('http://localhost:5000/api/Products', { cache: 'no-store' })
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch products'))
      .then(result => setProducts(Array.isArray(result) ? result : (result?.data || [])))
      .catch(err => console.error("Products API Error:", err));
  };

  const fetchOrders = () => {
    fetch('http://localhost:5000/api/Orders', { cache: 'no-store' })
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch orders'))
      .then(result => setOrders(Array.isArray(result) ? result : (result?.data || [])))
      .catch(err => console.error("Orders API Error:", err));
  };

  const fetchAuditLogs = () => {
    fetch('http://localhost:5000/api/AuditLogs', { cache: 'no-store' })
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch logs'))
      .then(result => setAuditLogs(Array.isArray(result) ? result : (result?.data || [])))
      .catch(err => console.error("Audit API Error:", err));
  };

  const fetchSupportTickets = () => {
    fetch('http://localhost:5000/api/SupportTickets', { cache: 'no-store' })
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch tickets'))
      .then(result => setSupportTickets(Array.isArray(result) ? result : (result?.data || [])))
      .catch(err => console.error("Tickets API Error:", err));
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchOrders();
    fetchAuditLogs(); 
    fetchSupportTickets(); 
  }, [customerPage, customerSearch]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.role === 'customer') {
      const current = customers.find(c => c?.email?.trim().toLowerCase() === auth?.email?.trim().toLowerCase());
      if (current) {
        setWalletBalance(current.balance ?? current.walletBalance ?? 0);
      }
    }
  }, [auth.isAuthenticated, customers, auth.email]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'reset') {
        setAuthMode('reset');
        setResetForm({ email: params.get('email') || '', token: params.get('token') || '', newPassword: '' });
    }
  }, []);

  const logAction = (action, details, overrideEmail = null, overrideRole = null) => {
    const payload = {
      user: overrideEmail || auth.email || 'System',
      role: overrideRole || auth.role || 'system',
      action: action,
      details: details
    };
    fetch('http://localhost:5000/api/AuditLogs', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    }).then(() => fetchAuditLogs()).catch(console.error);
  };

  // ================= 4. AUTHENTICATION =================
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = loginForm.email.toLowerCase().trim();
    const password = loginForm.password;

    // 1. Strict Admin Login Check
    const ADMIN_EMAIL = "admin@masar.eg"; // 👈 غير الإيميل من هنا لو حابب
    const ADMIN_PASSWORD = "admin123";    // 👈 غير الباسورد من هنا لو حابب

    if (email === ADMIN_EMAIL) {
      if (password === ADMIN_PASSWORD) {
        setAuth({ isAuthenticated: true, role: 'admin', email: email });
        setActiveTab('overview'); 
        logAction('Login', 'Administrator accessed the dashboard', email, 'admin');
        return;
      } else {
        showAlert(language === 'ar' ? 'كلمة المرور الخاصة بمدير النظام غير صحيحة.' : 'Incorrect admin password.', 'error');
        logAction('Failed Login', `Invalid admin password attempt`, email, 'guest');
        return;
      }
    }

    try {
      // 2. Send API Request for Customers
      const response = await fetch('http://localhost:5000/api/Customers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      });

      // 3. قراءة الرد من السيرفر وتحليله
      const textResponse = await response.text();
      let isError = !response.ok;
      let displayMessage = textResponse;

      // محاولة فهم الرد لو كان JSON
      try {
        const jsonResponse = JSON.parse(textResponse);
        if (jsonResponse && jsonResponse.message) {
          displayMessage = jsonResponse.message;
        }
        if (jsonResponse && jsonResponse.success === false) {
          isError = true;
        }
      } catch (parseErr) {
        // لو الرد كان Text عادي، نتأكد إنه مش بيحتوي على كلمات خطأ
        const lowerText = textResponse.toLowerCase();
        if (lowerText.includes('invalid') || lowerText.includes('wrong') || lowerText.includes('incorrect') || lowerText.includes('not verified')) {
          isError = true;
        }
      }

      // 4. الحماية: لو في أي خطأ، امنع الدخول وطلع الـ Popup برة
      if (isError) {
        const fallbackMsg = language === 'ar' ? 'بيانات الدخول غير صحيحة.' : 'Invalid email or password.';
        showAlert(`❌ ${displayMessage || fallbackMsg}`, 'error');
        logAction('Failed Login', `Invalid login attempt for: ${email}`, email, 'guest');
        return;
      }

      // 5. السماح بالدخول لو كل البيانات صحيحة 100%
      setAuth({ isAuthenticated: true, role: 'customer', email: email });
      setCustomerView('dashboard'); 
      logAction('Login', 'Customer signed in to portal', email, 'customer');

    } catch (err) {
      showAlert(language === 'ar' ? "خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى." : "Error connecting to server. Please try again.", 'error');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/Customers/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotForm.email })
      });
      showAlert(language === 'ar' ? `📩 تم إرسال رابط إعادة تعيين كلمة المرور إلى ${forgotForm.email}. يرجى التحقق من صندوق الوارد الخاص بك.` : `📩 A password reset link has been sent to ${forgotForm.email}. Please check your inbox.`, 'success');
      logAction('Password Reset', `Password reset requested for: ${forgotForm.email}`, forgotForm.email, 'guest');
      setAuthMode('signin');
      setForgotForm({ email: '' });
    } catch(err) {
      showAlert(language === 'ar' ? "خطأ في الاتصال بالخادم." : "Error connecting to server.", 'error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/Customers/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resetForm)
      });

      if (response.ok) {
          showAlert(language === 'ar' ? "✅ تم إعادة تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول." : "✅ Password reset successfully! You can now login.", 'success');
          setAuthMode('signin');
          window.history.pushState({}, document.title, "/"); 
      } else {
          showAlert(language === 'ar' ? "❌ رابط غير صالح أو منتهي الصلاحية." : "❌ Invalid or expired reset link.", 'error');
      }
    } catch(err) {
      showAlert(language === 'ar' ? "خطأ في الاتصال بالخادم." : "Error connecting to server.", 'error');
    }
  };

  const handleLogout = () => {
    logAction('Logout', 'User signed out', auth.email, auth.role);
    setAuth({ isAuthenticated: false, role: '', email: '' });
    setLoginForm({ email: '', password: '' });
    setAuthMode('signin');
    setShowProfileMenu(false);
    setShowAuditFilterMenu(false);
    setShowAdminNavMenu(false);
  };

  // ================= 5. EXPORT TO EXCEL HANDLERS =================
  const getFormattedOrders = () => {
    return orders.map(o => ({
      'Order ID': o.id,
      'Customer Name': o.customer?.fullName || o.customerName || t.unknown,
      'Package Name': o.product?.name || o.productName || t.unknown,
      'Status': o.status
    }));
  };

  const getFormattedCustomers = () => {
    return customers.map(c => {
      const { password, ...safeCustomerData } = c; 
      return safeCustomerData;
    });
  };

  const exportSingleSheetToExcel = (data, filename, sheetName = "Data") => {
    if(!data || data.length === 0) {
      showAlert(language === 'ar' ? "لا توجد بيانات متاحة للتصدير." : "No data available to export.", "info");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    logAction('Export Data', `Exported ${sheetName} data to Excel`);
  };

  const exportFullOverviewToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    if (customers.length > 0) {
      const customerSummary = customers.map(c => {
        const cOrders = orders.filter(o => Number(o.customerId) === Number(c.id));
        const activeSubs = cOrders.filter(o => o.status === 'Active').length;
        
        const cTickets = supportTickets.filter(t => 
          t.customerEmail?.toLowerCase() === c.email?.toLowerCase() || 
          Number(t.customerId) === Number(c.id)
        );

        return {
          'Customer Name': c.fullName || t.unknown,
          'Phone Number': c.phoneNumber || t.na,
          'Email': c.email,
          'Wallet Balance (EGP)': c.balance ?? c.walletBalance ?? 0,
          'Total Orders Made': cOrders.length,
          'Active Subscriptions': activeSubs,
          'Support Tickets Issued': cTickets.length
        };
      });

      const wsSummary = XLSX.utils.json_to_sheet(customerSummary);
      XLSX.utils.book_append_sheet(workbook, wsSummary, "Customer Summary");
    }

    if (customers.length > 0) {
      const wsCustomers = XLSX.utils.json_to_sheet(getFormattedCustomers());
      XLSX.utils.book_append_sheet(workbook, wsCustomers, "Raw Customers");
    }
    
    if (products.length > 0) {
      const wsProducts = XLSX.utils.json_to_sheet(products);
      XLSX.utils.book_append_sheet(workbook, wsProducts, "Packages");
    }

    if (orders.length > 0) {
      const wsOrders = XLSX.utils.json_to_sheet(getFormattedOrders());
      XLSX.utils.book_append_sheet(workbook, wsOrders, "Raw Orders");
    }

    if (supportTickets.length > 0) {
      const wsTickets = XLSX.utils.json_to_sheet(supportTickets);
      XLSX.utils.book_append_sheet(workbook, wsTickets, "Support Tickets");
    }

    if (auditLogs.length > 0) {
      const wsAudit = XLSX.utils.json_to_sheet(auditLogs);
      XLSX.utils.book_append_sheet(workbook, wsAudit, "Audit Logs");
    }

    XLSX.writeFile(workbook, "Masar_Telecom_Full_Report.xlsx");
    logAction('Export Full Report', `Admin exported full system overview to Excel`);
  };

  // ================= 6. CRUD HANDLERS =================
  const handleSaveCustomer = (e) => {
    e.preventDefault();
    const isEdit = customerForm.id !== null;
    const url = isEdit ? `http://localhost:5000/api/Customers/${customerForm.id}` : 'http://localhost:5000/api/Customers';
    const method = isEdit ? 'PUT' : 'POST';
    const payload = { ...customerForm, type: parseInt(customerForm.type) || 0, balance: parseFloat(customerForm.balance) || 0 };

    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(async (res) => {
        if (!res.ok) {
           const errText = await res.text();
           showAlert(`Error saving customer: ${errText}`, 'error');
           return;
        }
        fetchCustomers();
        logAction(isEdit ? 'Update Customer' : 'Add Customer', `Processed customer: ${payload.fullName} (Balance: ${payload.balance})`);
        setCustomerForm({ id: null, fullName: '', phoneNumber: '', nationalId: '', email: '', address: '', type: 0, balance: 0, password: '' });
        if(!isEdit) showAlert(language === 'ar' ? '✅ تم إضافة العميل! تم إرسال بريد التوثيق.' : "✅ Customer added! A verification email has been sent.", "success");
      }).catch(err => showAlert("Connection error", "error"));
  };

  const handleDeleteCustomer = (id) => {
    const cust = customers.find(c => c.id === id);
    showConfirm(language === 'ar' ? 'هل أنت متأكد من رغبتك في حذف هذا العميل؟' : 'Are you sure you want to delete this customer?', () => {
      fetch(`http://localhost:5000/api/Customers/${id}`, { method: 'DELETE' }).then(() => {
        fetchCustomers();
        logAction('Delete Customer', `Removed customer: ${cust ? cust.fullName : id}`);
      }).catch(console.error);
    });
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const isEdit = productForm.id !== null;
    const url = isEdit ? `http://localhost:5000/api/Products/${productForm.id}` : 'http://localhost:5000/api/Products';
    const method = isEdit ? 'PUT' : 'POST';
    const payload = { ...productForm, price: parseFloat(productForm.price) || 0 };

    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(() => {
        fetchProducts();
        logAction(isEdit ? 'Update Package' : 'Add Package', `Processed package: ${payload.name} (${payload.price} EGP)`);
        setProductForm({ id: null, name: '', description: '', price: '', category: 'Internet' });
      }).catch(err => showAlert("Connection error", "error"));
  };

  const handleDeleteProduct = (id) => {
    const prod = products.find(p => p.id === id);
    showConfirm(language === 'ar' ? 'هل أنت متأكد من رغبتك في حذف هذه الباقة؟' : 'Are you sure you want to delete this package?', () => {
      fetch(`http://localhost:5000/api/Products/${id}`, { method: 'DELETE' }).then(() => {
        fetchProducts();
        logAction('Delete Package', `Removed package: ${prod ? prod.name : id}`);
      }).catch(console.error);
    });
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/Orders', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerId: parseInt(orderForm.customerId), productId: parseInt(orderForm.productId) })
    }).then(() => {
      fetchOrders();
      const cust = customers.find(c => c.id == orderForm.customerId);
      const prod = products.find(p => p.id == orderForm.productId);
      logAction('Create Order', `Manual order assigned: ${prod?.name} to ${cust?.fullName}`);
      setOrderForm({ customerId: '', productId: '' });
      showAlert(language === 'ar' ? '✅ تم إنشاء الطلب بنجاح!' : '✅ Order created successfully!', 'success');
    }).catch(err => showAlert("Connection error", "error"));
  };

  const handleUpdateOrderStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/Orders/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus })
    }).then(() => {
      fetchOrders();
      logAction('Update Order', `Changed order #${id} status to ${newStatus}`);
    }).catch(console.error);
  };

  const handleDeleteOrder = (id) => {
    showConfirm(language === 'ar' ? 'هل أنت متأكد من رغبتك في حذف هذا الطلب؟' : 'Are you sure you want to delete this order?', () => {
      fetch(`http://localhost:5000/api/Orders/${id}`, { method: 'DELETE' }).then(() => {
        fetchOrders();
        logAction('Delete Order', `Removed order #${id}`);
      }).catch(console.error);
    });
  };

  const handleAdminRespondToTicket = (e) => {
    e.preventDefault();
    if (!respondModal?.ticket?.id) return;
    const ticketId = respondModal.ticket.id;
    
    fetch(`http://localhost:5000/api/SupportTickets/${ticketId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: respondModal.responseText })
    }).then(() => {
      fetchSupportTickets();
      logAction('Resolved Ticket', `Admin replied to ticket #${ticketId}`);
      setRespondModal({ isOpen: false, ticket: null, responseText: '' });
      showAlert(language === 'ar' ? '✅ تم إرسال الرد بنجاح. تم إرسال بريد إلكتروني للعميل.' : '✅ Response sent successfully. An email has been dispatched to the customer.', 'success');
    }).catch(err => showAlert("Error sending response: " + err.message, 'error'));
  };

  // ================= UI COMPONENTS =================
  const StatusBadge = ({ status }) => {
    let color = "bg-gray-100 text-gray-800 border-gray-300";
    let dot = "bg-gray-600";
    if (status === 'Active' || status === 'Resolved') { color = "bg-emerald-50 text-emerald-800 border-emerald-300"; dot = "bg-emerald-600"; }
    else if (status === 'Pending') { color = "bg-amber-50 text-amber-800 border-amber-300"; dot = "bg-amber-600"; }
    else if (status === 'Cancelled') { color = "bg-red-50 text-red-800 border-red-300"; dot = "bg-red-600"; }
    
    const displayStatus = t[status] || status || t.Active;

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-bold border flex items-center gap-2 w-max ${color}`}>
        <span className={`w-2 h-2 rounded-full ${dot}`} aria-hidden="true"></span> {displayStatus}
      </span>
    );
  };

  const ExcelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const Navbar = () => {
    const currentCustomer = customers.find(c => c?.email?.toLowerCase() === auth?.email?.toLowerCase());
    const myCustomerId = currentCustomer ? currentCustomer.id : 0;

    return (
      <nav className="relative z-50 bg-white border-b border-gray-200 px-4 sm:px-6 py-2 flex justify-between items-center shadow-sm text-left w-full" style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>
        <div className="flex items-center cursor-pointer" onClick={() => { if(auth.role === 'customer') setCustomerView('dashboard'); }}>
          <BrandLogo size="md" showText={true} t={t} />
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setLanguage(language === 'en' ? 'ar' : 'en');
            }}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#f0f7ff] text-[#0062D1] font-extrabold text-xs hover:bg-[#d6e8ff] transition focus:outline-none border border-[#b3d4ff]"
            title="Toggle Language"
          >
            {language === 'en' ? 'AR' : 'EN'}
          </button>

          <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold border ${auth.role === 'admin' ? 'bg-[#f0f7ff] text-[#0062D1] border-[#d6e8ff]' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
            {auth.role === 'admin' ? t.sysAdmin : t.customer}
          </span>
          <div className={`hidden md:block ${language === 'ar' ? 'text-left' : 'text-right'}`}>
            <p className="text-xs text-gray-500 font-medium m-0">{t.signedInAs}</p>
            <p className="text-sm font-bold text-[#0B2052] m-0">{auth?.email}</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); setShowAuditFilterMenu(false); setShowAdminNavMenu(false); }}
              className="w-10 h-10 bg-[#0B2052] rounded-full flex items-center justify-center text-white font-bold shadow-sm shrink-0 hover:bg-[#061436] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0062D1] transition cursor-pointer border-2 border-white ring-1 ring-gray-200"
            >
              {auth?.email?.charAt(0)?.toUpperCase() || 'U'}
            </button>

            {showProfileMenu && (
              <div className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50`}>
                <div className="p-5 border-b border-gray-100 bg-[#f8fbff]">
                  <h4 className="font-bold text-[#0B2052] capitalize text-lg m-0">
                    {auth.role === 'admin' ? t.sysAdmin : (currentCustomer ? currentCustomer?.fullName || t.customer : auth?.email?.split('@')[0])}
                  </h4>
                  <p className="text-sm text-[#0062D1] m-0 truncate font-medium">{auth?.email}</p>
                </div>
                
                {auth.role === 'customer' ? (
                  <div className="p-5 space-y-4 text-sm font-medium">
                    <div className="flex justify-between border-b border-gray-100 pb-3">
                      <span className="text-gray-500">{t.customerID}</span>
                      <span className="font-bold text-[#0B2052]">MSR-{myCustomerId?.toString()?.padStart(4, '0') || '0000'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t.memberSince}</span>
                      <span className="font-bold text-emerald-600">{t.Active}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 text-sm font-medium text-gray-600 text-center">
                    <p>{t.sysAdmin} Access</p>
                  </div>
                )}
                
                {auth.role === 'customer' && (
                  <div className="p-2 border-t border-gray-100">
                    <button 
                      onClick={() => { 
                        setSettingsForm({ fullName: currentCustomer?.fullName || '', phoneNumber: currentCustomer?.phoneNumber || '', address: currentCustomer?.address || '', newPassword: '' });
                        setCustomerView('profile'); 
                        setShowProfileMenu(false); 
                      }} 
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-[#f0f7ff] hover:text-[#0062D1] rounded-lg transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      {t.myProfile}
                    </button>
                    <button 
                      onClick={() => { setCustomerView('support'); setShowProfileMenu(false); }} 
                      className="w-full flex items-center gap-3 px-3 py-2 mt-1 text-sm font-bold text-gray-700 hover:bg-[#f0f7ff] hover:text-[#0062D1] rounded-lg transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      {t.helpSupport}
                    </button>
                  </div>
                )}

                <div className="p-3 bg-gray-50 border-t border-gray-100">
                  <button onClick={handleLogout} className="w-full bg-white border border-gray-300 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-50 focus:outline-none transition">
                    {t.logout}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  };

  if (!auth.isAuthenticated) {
    return (
      <div className="absolute inset-0 w-screen min-h-screen flex bg-gray-50 font-sans text-left overflow-x-hidden m-0 p-0" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="hidden md:flex w-1/2 flex-col justify-center items-center px-12 lg:px-20 text-center bg-white h-full relative border-r border-gray-100 shadow-[2px_0_15px_rgba(0,0,0,0.03)]">
          <div className="relative z-10 scale-110 mb-8">
             <BrandLogo layout="col" size="lg" tagline={true} t={t} />
          </div>
          <p className="text-gray-500 text-lg max-w-sm font-medium relative z-10 mt-6">
            The next generation CRM for modern telecommunication management.
          </p>
        </div>

        <div className={`w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-[#f8fbff] h-full relative ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md border border-gray-100 transition-all duration-300 relative z-10">
            
            <div className="md:hidden flex justify-center mb-8">
               <BrandLogo size="md" showText={true} t={t} />
            </div>

            {authMode === 'signin' && (
              <>
                <h3 className="text-2xl font-extrabold text-[#0B2052] mb-2">{t.welcomeBack}</h3>
                <p className="text-gray-500 font-medium mb-8 text-sm">{t.signInDesc}</p>
                <form onSubmit={handleLogin} className={`space-y-5 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div>
                    <label className="block text-sm font-bold text-[#0B2052] mb-1">{t.email}</label>
                    <input required type="email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0062D1] outline-none transition text-gray-900 font-medium" placeholder="admin@masar.eg" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0B2052] mb-1">{t.password}</label>
                    <input required type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0062D1] outline-none transition text-gray-900 font-medium" placeholder="••••••••" dir="ltr" />
                  </div>
                  <div className={`flex ${language === 'ar' ? 'justify-start' : 'justify-end'}`}>
                    <button type="button" onClick={() => setAuthMode('forgot')} className="text-sm font-bold text-[#0062D1] hover:text-[#0B2052] focus:outline-none transition">{t.forgotPwd}</button>
                  </div>
                  <button type="submit" className="w-full bg-[#0062D1] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-[#004ba0] focus:outline-none transition">{t.signInBtn}</button>
                </form>
                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                  <p className="text-xs font-medium text-gray-500">{t.noAccountDesc}</p>
                </div>
              </>
            )}

            {authMode === 'forgot' && (
              <>
                <h3 className="text-2xl font-extrabold text-[#0B2052] mb-2">{t.resetPwdTitle}</h3>
                <p className="text-gray-500 font-medium mb-8 text-sm">{t.resetPwdDesc}</p>
                <form onSubmit={handleForgotPassword} className={`space-y-5 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div>
                    <label className="block text-sm font-bold text-[#0B2052] mb-1">{t.email}</label>
                    <input required type="email" value={forgotForm.email} onChange={e => setForgotForm({ email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0062D1] outline-none transition text-gray-900 font-medium" placeholder="your@email.com" dir="ltr" />
                  </div>
                  <button type="submit" className="w-full bg-[#0062D1] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-[#004ba0] focus:outline-none transition">{t.sendResetLink}</button>
                </form>
                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                  <button onClick={() => setAuthMode('signin')} className="text-sm font-bold text-[#0B2052] hover:text-[#0062D1] focus:outline-none transition">{t.backToSignIn}</button>
                </div>
              </>
            )}

            {authMode === 'reset' && (
              <>
                <h3 className="text-2xl font-extrabold text-[#0B2052] mb-2">{t.createPwdTitle}</h3>
                <p className="text-gray-500 font-medium mb-8 text-sm">{t.createPwdDesc}</p>
                <form onSubmit={handleResetPassword} className={`space-y-5 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div>
                    <label className="block text-sm font-bold text-[#0B2052] mb-1">{t.newPwd}</label>
                    <input required type="password" value={resetForm.newPassword} onChange={e => setResetForm({ ...resetForm, newPassword: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0062D1] outline-none transition text-gray-900 font-medium" placeholder="••••••••" dir="ltr" />
                  </div>
                  <button type="submit" className="w-full bg-[#0062D1] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-[#004ba0] focus:outline-none transition">{t.saveNewPwd}</button>
                </form>
              </>
            )}

          </div>
        </div>
      </div>
    );
  }

  if (auth.role === 'customer') {
    const currentCustomer = customers.find(c => c?.email?.trim().toLowerCase() === auth?.email?.trim().toLowerCase());
    const myCustomerId = currentCustomer ? currentCustomer.id : 0;

    const handleCustomerSubscribe = (productId) => {
      if (myCustomerId === 0) {
        showAlert("System syncing... Please wait a second and try again.", 'error');
        return;
      }
      
      const selectedProduct = products.find(p => p.id === productId);
      if (!selectedProduct) return;

      if (walletBalance < selectedProduct.price) {
        const msg = language === 'ar' 
          ? `⚠️ رصيد غير كافٍ\nرصيدك الحالي هو ${walletBalance.toFixed(2)} جنيه، لكن باقة ${selectedProduct.name} تتطلب ${selectedProduct.price} جنيه. يرجى شحن محفظتك للمتابعة.` 
          : `⚠️ Insufficient Funds\nYour current balance is ${walletBalance.toFixed(2)} EGP, but the ${selectedProduct.name} package requires ${selectedProduct.price} EGP. Please top up your wallet to proceed.`;
        showAlert(msg, 'error');
        logAction('Subscription Failed', `Failed to subscribe to ${selectedProduct.name} due to insufficient balance.`);
        return;
      }

      const confirmMsg = language === 'ar'
        ? `هل أنت متأكد من رغبتك في الاشتراك في باقة ${selectedProduct.name} مقابل ${selectedProduct.price} جنيه؟`
        : `Are you sure you want to subscribe to ${selectedProduct.name} for ${selectedProduct.price} EGP?`;

      showConfirm(confirmMsg, async () => {
        try {
          const orderResponse = await fetch('http://localhost:5000/api/Orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customerId: parseInt(myCustomerId), productId: parseInt(productId) })
          });

          if (!orderResponse.ok) {
            const errText = await orderResponse.text();
            throw new Error(errText || "Backend rejected the order.");
          }

          const newBalance = walletBalance - selectedProduct.price;
          await fetch(`http://localhost:5000/api/Customers/${myCustomerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...currentCustomer,
              balance: newBalance 
            })
          });

          setWalletBalance(newBalance);
          
          const newOrder = {
            id: Date.now(),
            customerId: myCustomerId,
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            customerName: currentCustomer.fullName,
            status: 'Active',
            product: selectedProduct,
            customer: currentCustomer
          };
          setOrders(prev => [newOrder, ...prev]); 
          
          fetchCustomers();
          fetch('http://localhost:5000/api/Orders', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => setOrders(Array.isArray(data) ? data : []))
            .catch(console.error);

          logAction('Subscribe', `Subscribed to ${selectedProduct.name}. Deducted: ${selectedProduct.price} EGP`);
          
          const successMsg = language === 'ar'
            ? `✅ تم الاشتراك بنجاح!\nلقد اشتركت بنجاح في باقة ${selectedProduct.name}. تم خصم مبلغ ${selectedProduct.price} جنيه من محفظتك.`
            : `✅ Subscription Successful!\nYou have successfully subscribed to ${selectedProduct.name}. An amount of ${selectedProduct.price} EGP has been deducted from your wallet.`;
          
          showAlert(successMsg, 'success');
        } catch (err) {
          logAction('Subscription Error', `Error: ${err.message}`);
          showAlert("Error subscribing: " + err.message, 'error');
        }
      });
    };

    const handleUpdateProfile = (e) => {
      e.preventDefault();
      const payload = {
        fullName: settingsForm.fullName,
        phoneNumber: settingsForm.phoneNumber,
        address: settingsForm.address,
        email: currentCustomer?.email || '', 
        type: currentCustomer?.type || 0,
        balance: currentCustomer?.balance || 0,
        password: settingsForm.newPassword 
      };

      fetch(`http://localhost:5000/api/Customers/${myCustomerId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      }).then(() => {
        fetchCustomers();
        logAction('Update Profile', `Customer updated their profile settings.`);
        showAlert(language === 'ar' ? '✅ تم تحديث بيانات الحساب بنجاح!' : '✅ Profile info updated successfully!', 'success');
        setSettingsForm({ ...settingsForm, newPassword: '' }); 
      }).catch(err => showAlert("Error updating profile: " + err.message, 'error'));
    };

    const handleSupportSubmit = (e) => {
      e.preventDefault();
      
      const payload = {
        customerId: myCustomerId,
        customerName: currentCustomer?.fullName || 'Customer',
        customerEmail: currentCustomer?.email || auth?.email || '',
        subject: supportForm.subject,
        message: supportForm.message
      };

      fetch('http://localhost:5000/api/SupportTickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText);
        }
        fetchSupportTickets(); 
        logAction('Support Ticket', `Submitted support ticket: ${supportForm.subject}`);
        showAlert(language === 'ar' ? '✅ تم إرسال تذكرة الدعم بنجاح.\nسيقوم فريقنا التقني بمراجعتها والتواصل معك قريباً!' : '✅ Your support ticket has been submitted successfully.\nOur technical team will review it and contact you soon!', 'success');
        setSupportForm({ subject: '', message: '' });
      })
      .catch(err => showAlert("Error sending ticket: " + err.message, 'error'));
    };

    const displayOrders = orders.filter(o => {
      if (!o || String(o?.status || '').toLowerCase() === 'cancelled') return false;
      const matchesId = Number(o.customerId) === Number(myCustomerId);
      const matchesName = currentCustomer && String(o.customerName || '').toLowerCase().trim() === String(currentCustomer.fullName || '').toLowerCase().trim();
      const matchesEmail = String(o.customer?.email || '').toLowerCase().trim() === String(auth?.email || '').toLowerCase().trim();
      const matchesAuthName = String(o.customerName || '').toLowerCase().trim() === String(auth?.email?.split('@')[0] || '').toLowerCase().trim();
      return matchesId || matchesName || matchesEmail || matchesAuthName;
    });

    const filteredPackages = products.filter(p => {
      if (!p || !packageSearch) return true;
      const term = packageSearch.toLowerCase();
      return p?.name?.toLowerCase().includes(term) || p?.category?.toLowerCase().includes(term) || (t[p?.category] && t[p?.category].toLowerCase().includes(term));
    });

    const faqs = language === 'en' ? [
      { id: 1, question: "How can I recharge my wallet balance?", answer: "You can recharge your balance through our mobile app, using your credit/debit card, or by visiting any of our authorized retail branches across the country." },
      { id: 2, question: "Can I subscribe to multiple packages at once?", answer: "Yes! You can mix and match any Internet and Voice packages according to your needs. The cost will be deducted from your total wallet balance." },
      { id: 3, question: "What happens when my package quota runs out?", answer: "Once your quota is fully consumed, your service will pause to prevent extra charges. You can easily renew your package early from the 'All Packages' page." },
      { id: 4, question: "How do I update my account password?", answer: "You can update your password by navigating to the 'My Profile' section from the top right menu, entering your new password, and saving the changes." }
    ] : [
      { id: 1, question: "كيف يمكنني شحن رصيد محفظتي؟", answer: "يمكنك شحن رصيدك من خلال تطبيق الهاتف الخاص بنا باستخدام بطاقتك الائتمانية، أو بزيارة أي من فروع التجزئة المعتمدة لدينا في جميع أنحاء البلاد." },
      { id: 2, question: "هل يمكنني الاشتراك في باقات متعددة في نفس الوقت؟", answer: "نعم! يمكنك المزج بين أي من باقات الإنترنت والمكالمات وفقاً لاحتياجاتك. سيتم خصم التكلفة من إجمالي رصيد محفظتك." },
      { id: 3, question: "ماذا يحدث عند نفاد سعة الباقة الخاصة بي؟", answer: "بمجرد استهلاك سعتك بالكامل، سيتم إيقاف الخدمة مؤقتاً لتجنب أي رسوم إضافية. يمكنك بسهولة تجديد باقتك مبكراً من صفحة 'كافة الباقات'." },
      { id: 4, question: "كيف يمكنني تحديث كلمة مرور حسابي؟", answer: "يمكنك تحديث كلمة المرور بالانتقال إلى قسم 'ملفي الشخصي' من القائمة العلوية، ثم إدخال كلمة المرور الجديدة وحفظ التغييرات." }
    ];

    return (
      <div className="absolute inset-0 w-screen min-h-screen bg-[#f8fbff] font-sans flex flex-col overflow-x-hidden m-0 p-0" dir={language === 'ar' ? 'rtl' : 'ltr'} style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>
        <Navbar />
        
        <div className="bg-[#0B2052] text-white px-4 sm:px-8 py-3 flex justify-between items-center text-sm w-full relative z-10 shadow-md border-t border-[#004ba0]">
           <span className="font-medium text-[#b3d4ff]">{t.welcomeBack}, <span className="font-bold capitalize text-white">{currentCustomer?.fullName ? currentCustomer.fullName.split(' ')[0] : auth?.email?.split('@')[0] || 'User'}</span>!</span>
           <span className="font-medium text-[#b3d4ff]">{t.walletBalance}: <span className="text-emerald-400 font-extrabold mx-1 tracking-wide">{walletBalance.toFixed(2)} {t.egp}</span></span>
        </div>
        
        <div className="relative w-full flex-1" onClick={() => setShowProfileMenu(false)}>
          <div className="bg-gradient-to-r from-[#0B2052] to-[#004ba0] h-40 w-full absolute top-0 left-0 z-0"></div>
          
          {customerView === 'dashboard' && (
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col lg:flex-row gap-6 pb-12 animate-fade-in">
              <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-max">
                <h3 className="font-extrabold text-[#0B2052] mb-6 m-0 text-xl">{t.usageOverview}</h3>
                
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-gray-700">{t.internetQuota}</span>
                    <span className="text-xs font-bold text-[#0062D1]">45 / 100 GB</span>
                  </div>
                  <div className="w-full bg-[#f0f7ff] rounded-full h-3">
                    <div className="bg-[#0062D1] h-3 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-gray-700">{t.voiceMinutes}</span>
                    <span className="text-xs font-bold text-emerald-600">800 / 1000 Min</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-2/3 flex flex-col gap-8">
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 w-full overflow-hidden">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                    <h3 className="font-extrabold text-[#0B2052] m-0 text-xl">{t.explorePackages}</h3>
                    <button onClick={() => setCustomerView('packages')} className="text-sm font-bold text-[#0062D1] hover:text-[#0B2052] hover:underline cursor-pointer focus:outline-none transition">
                      {t.seeAllPackages}
                    </button>
                  </div>
                  
                  <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory hide-scrollbar">
                    {products.slice(0, 4).map(p => (
                      <div key={p.id} className="min-w-[260px] sm:min-w-[280px] border border-gray-200 rounded-xl p-5 shrink-0 snap-start bg-gradient-to-b from-white to-[#f8fbff] flex flex-col hover:border-[#80b9ff] focus-within:ring-2 focus-within:ring-[#0062D1] transition shadow-sm">
                        <span className="text-xs font-bold text-[#0062D1] tracking-wider uppercase mb-1">{t[p?.category] || p?.category || t.packageText}</span>
                        <h4 className="font-extrabold text-[#0B2052] mb-1 truncate text-lg">{p?.name || t.unknown}</h4>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10 font-medium">{p?.description || ''}</p>
                        <div className="text-3xl font-extrabold text-[#0B2052] mb-6">{p?.price || 0} <span className="text-sm text-gray-500 font-medium">{t.egpMo}</span></div>
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleCustomerSubscribe(p.id); }} 
                          className="mt-auto w-full bg-white text-[#0062D1] hover:bg-[#0062D1] hover:text-white transition py-2.5 rounded-lg text-sm font-bold border border-[#80b9ff] shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0062D1]"
                        >
                          {t.subscribeNow}
                        </button>
                      </div>
                    ))}
                    {products.length === 0 && <p className="text-sm text-gray-500 font-medium">{t.noPackagesAvail}</p>}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 w-full">
                  <h3 className="font-extrabold text-[#0B2052] mb-6 m-0 text-xl">{t.mySubscriptions}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {displayOrders.length > 0 ? displayOrders.map(o => {
                      const packageDetails = o.product || products.find(p => p.id === o.productId) || products.find(p => p.name === o.productName) || {};
                      
                      return (
                        <div key={o.id} className="border border-[#e6f0ff] rounded-xl p-5 hover:shadow-md transition bg-[#f8fbff] flex flex-col">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-xs font-bold text-[#0062D1] tracking-wider uppercase">{t.packageText}</span>
                            <StatusBadge status={o.status} />
                          </div>
                          <div className="mb-6">
                            <h4 className="font-extrabold text-[#0B2052] text-xl m-0">{packageDetails?.name || o?.productName || t.unknown}</h4>
                            <p className="text-sm text-[#0062D1] font-medium m-0 mt-1">{t.orderText} #{o.id}</p>
                          </div>
                          <div className="flex justify-between items-end pt-4 border-t border-[#d6e8ff] mt-auto">
                            <div>
                              <span className="text-2xl font-extrabold text-[#0B2052]">{packageDetails?.price || '--'}</span>
                              <span className="text-sm text-gray-500 font-medium mx-1">{t.egpMo}</span>
                            </div>
                            <div className={`text-${language === 'ar' ? 'left' : 'right'}`}>
                              <span className="block text-xs text-gray-500 font-medium m-0">{t.renewsText}</span>
                              <span className="text-sm font-bold text-[#0B2052] m-0">{t.nextMonth}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="col-span-full p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-600 font-medium text-lg">{t.noSubsTitle}</p>
                        <p className="text-sm text-gray-500 mt-1">{t.noSubsDesc}</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {customerView === 'profile' && (
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 animate-fade-in">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-extrabold text-white m-0">{t.myProfile}</h2>
                <button onClick={() => setCustomerView('dashboard')} className="text-sm font-bold text-[#0062D1] bg-white hover:bg-[#f0f7ff] border border-transparent px-4 py-2.5 rounded-lg shadow-sm transition">
                  {t.backToDashboard}
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-widest mb-2">{t.currentWalletBal}</h3>
                    <div className="text-5xl font-extrabold text-[#0B2052]">{walletBalance.toFixed(2)} <span className="text-xl text-gray-500 font-medium">{t.egp}</span></div>
                  </div>
                  <div className="hidden sm:flex w-20 h-20 bg-emerald-50 rounded-full items-center justify-center text-emerald-600 border border-emerald-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                  <div className="mb-6 border-b border-gray-100 pb-4">
                     <h3 className="text-xl font-extrabold text-[#0B2052]">{t.personalInfo}</h3>
                     <p className="text-sm text-gray-500 font-medium mt-1">{t.personalInfoDesc}</p>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[#0B2052] mb-1">{t.fullName}</label>
                        <input required type="text" value={settingsForm.fullName} onChange={e => setSettingsForm({...settingsForm, fullName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm font-medium transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#0B2052] mb-1">{t.email} <span className="text-gray-400 font-normal">{t.readOnly}</span></label>
                        <input type="text" value={currentCustomer?.email || ''} disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium cursor-not-allowed" dir="ltr" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#0B2052] mb-1">{t.phoneNum}</label>
                        <input required type="text" value={settingsForm.phoneNumber} onChange={e => setSettingsForm({...settingsForm, phoneNumber: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm font-medium transition" dir="ltr" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[#0B2052] mb-1">{t.addressText}</label>
                        <input type="text" value={settingsForm.address} onChange={e => setSettingsForm({...settingsForm, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm font-medium transition" placeholder={t.cityStreet} />
                      </div>
                    </div>

                    <div className="pt-8 mt-4 border-t border-gray-100">
                      <h4 className="text-sm font-extrabold text-[#0062D1] mb-4 uppercase tracking-wider">{t.secSettings}</h4>
                      <div className="w-full sm:w-1/2">
                        <label className="block text-sm font-bold text-[#0B2052] mb-1">{t.newPwd}</label>
                        <input type="password" value={settingsForm.newPassword} onChange={e => setSettingsForm({...settingsForm, newPassword: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm font-medium transition" placeholder={t.leaveBlank} dir="ltr" />
                        <p className="text-xs text-gray-500 mt-2 font-medium">{t.changePwdHint}</p>
                      </div>
                    </div>

                    <div className={`flex ${language === 'ar' ? 'justify-start' : 'justify-end'} pt-6 border-t border-gray-100 mt-8`}>
                      <button type="submit" className="px-8 py-3.5 text-sm font-bold text-white bg-[#0062D1] rounded-xl hover:bg-[#004ba0] transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0062D1]">
                        {t.saveChanges}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {customerView === 'packages' && (
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 animate-fade-in">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-white m-0">{t.allPackages}</h2>
                  <p className="text-[#b3d4ff] font-medium mt-1">{t.browsePlan}</p>
                </div>
                <button onClick={() => setCustomerView('dashboard')} className="text-sm font-bold text-[#0062D1] bg-white hover:bg-[#f0f7ff] border border-transparent px-4 py-2.5 rounded-lg shadow-sm transition">
                  {t.backToDashboard}
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder={t.searchPkgHint} 
                  className="w-full border-none outline-none text-gray-900 font-medium text-lg placeholder-gray-400 bg-transparent"
                  value={packageSearch}
                  onChange={(e) => setPackageSearch(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPackages.map(p => (
                  <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#80b9ff] transition-all flex flex-col h-full">
                    <span className="text-xs font-bold text-[#0062D1] tracking-wider uppercase mb-2 inline-block bg-[#f0f7ff] w-max px-2 py-1 rounded">{t[p?.category] || p?.category || t.packageText}</span>
                    <h4 className="font-extrabold text-[#0B2052] mb-2 text-xl">{p?.name || t.unknown}</h4>
                    <p className="text-sm text-gray-600 mb-6 flex-1 font-medium">{p?.description || ''}</p>
                    <div className="text-3xl font-extrabold text-[#0B2052] mb-6 border-t border-gray-100 pt-4">{p?.price || 0} <span className="text-sm text-gray-500 font-medium">{t.egpMo}</span></div>
                    
                    <button 
                      onClick={() => handleCustomerSubscribe(p.id)} 
                      className="mt-auto w-full bg-[#f0f7ff] text-[#0062D1] hover:bg-[#0062D1] hover:text-white transition py-3 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0062D1] cursor-pointer"
                    >
                      {t.subscribeNow}
                    </button>
                  </div>
                ))}
              </div>

              {filteredPackages.length === 0 && (
                <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-dashed border-gray-300">
                  <p className="text-gray-500 text-lg font-bold">{t.noPkgFound}</p>
                  <button onClick={() => setPackageSearch('')} className="mt-4 text-[#0062D1] font-bold hover:underline">{t.clearSearch}</button>
                </div>
              )}
            </div>
          )}

          {customerView === 'support' && (
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 animate-fade-in">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-white m-0">{t.helpSupport}</h2>
                  <p className="text-[#b3d4ff] font-medium mt-1">{t.helpDesc}</p>
                </div>
                <button onClick={() => setCustomerView('dashboard')} className="text-sm font-bold text-[#0062D1] bg-white hover:bg-[#f0f7ff] border border-transparent px-4 py-2.5 rounded-lg shadow-sm transition">
                  {t.backToDashboard}
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-extrabold text-[#0B2052] mb-6 flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0062D1]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {t.faq}
                    </h3>
                    
                    <div className="space-y-4">
                      {faqs.map((faq) => (
                        <div key={faq.id} className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50 hover:bg-gray-100 transition">
                          <button 
                            onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)} 
                            className="w-full text-left px-5 py-4 font-bold text-gray-800 flex justify-between items-center focus:outline-none cursor-pointer"
                            style={{ textAlign: language === 'ar' ? 'right' : 'left' }}
                          >
                            <span>{faq.question}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 transition-transform ${openFaq === faq.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                          {openFaq === faq.id && (
                            <div className="px-5 pb-4 text-sm text-gray-600 font-medium leading-relaxed border-t border-gray-200/60 pt-3">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#f0f7ff] p-6 rounded-2xl border border-[#d6e8ff] text-center flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#4d9aff] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <h4 className="font-extrabold text-[#0B2052] mb-1">{t.needHelp}</h4>
                    <p className="text-sm text-[#0062D1] mb-3">{t.support247}</p>
                    <span className="text-2xl font-extrabold text-[#0062D1] tracking-wider" dir="ltr">16000</span>
                  </div>
                </div>

                <div className="w-full lg:w-1/2">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-extrabold text-[#0B2052] mb-2 flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {t.submitTicket}
                    </h3>
                    <p className="text-sm text-gray-500 mb-6 font-medium">{t.ticketDesc}</p>

                    <form onSubmit={handleSupportSubmit} className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-[#0B2052] mb-1">{t.issueSubject}</label>
                        <select 
                          required 
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm bg-white font-medium cursor-pointer transition"
                          value={supportForm.subject}
                          onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                        >
                          <option value="">{t.selectCat}</option>
                          <option value="Billing & Payments">{t.billingCategory}</option>
                          <option value="Package Subscription Issue">{t.subIssueCategory}</option>
                          <option value="Internet Connectivity">{t.connCategory}</option>
                          <option value="Account Settings">{t.accCategory}</option>
                          <option value="Other">{t.otherCategory}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-[#0B2052] mb-1">{t.msgDetails}</label>
                        <textarea 
                          required 
                          rows="5"
                          placeholder={t.ticketPlaceholder}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm font-medium transition resize-none"
                          value={supportForm.message}
                          onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                        ></textarea>
                      </div>

                      <button type="submit" className="w-full bg-[#0B2052] hover:bg-[#061436] text-white font-bold py-3.5 rounded-xl shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B2052] mt-2">
                        {t.sendTicket}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {modalConfig.isOpen && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in" onClick={closeModal}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col text-center p-6 border border-gray-100" onClick={e => e.stopPropagation()}>
              <h3 className="font-extrabold text-[#0B2052] text-xl mb-3">
                {modalConfig.type === 'confirm' ? t.confirmAction : (modalConfig.status === 'success' ? t.successMod : t.noticeMod)}
              </h3>
              <p className="text-gray-600 font-medium mb-8 whitespace-pre-line leading-relaxed">{modalConfig.message}</p>
              
              <div className="flex justify-center gap-3">
                {modalConfig.type === 'confirm' && (
                  <button onClick={closeModal} className="w-full py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition focus:outline-none">
                    {t.cancelText}
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (modalConfig.onConfirm) modalConfig.onConfirm();
                    closeModal();
                  }} 
                  className={`w-full py-2.5 text-sm font-bold text-white rounded-xl transition shadow-md focus:outline-none ${modalConfig.status === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#0062D1] hover:bg-[#004ba0]'}`}
                >
                  {modalConfig.type === 'confirm' ? t.yesProceed : t.okBtn}
                </button>
              </div>
            </div>
          </div>
        )}
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />
      </div>
    );
  }

  // ---------------- VIEW C: ADMIN DASHBOARD ----------------
  const StatsCardWithGraph = ({ title, value, color, trend, dataPoints }) => {
    const colorMap = { indigo: 'bg-[#0062D1]', emerald: 'bg-emerald-500', amber: 'bg-amber-500', blue: 'bg-[#4d9aff]' };
    const lightColorMap = { indigo: 'bg-[#d6e8ff]', emerald: 'bg-emerald-100', amber: 'bg-amber-100', blue: 'bg-[#e6f0ff]' };
    
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-40 text-left w-full relative overflow-hidden group hover:shadow-md transition-all duration-300" style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>
        <div className="flex justify-between items-start mb-2 z-10">
          <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">{title}</span>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100" dir="ltr">{trend}</span>
        </div>
        <span className="text-4xl font-extrabold text-[#0B2052] z-10">{value}</span>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end gap-1 px-6 pb-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          {dataPoints.map((height, i) => (
            <div key={i} className={`flex-1 rounded-t-sm ${i === dataPoints.length - 1 ? colorMap[color] : lightColorMap[color]}`} style={{ height: `${height}%` }}></div>
          ))}
        </div>
      </div>
    );
  };

  const filteredOrders = orders.filter(o => {
    if (!o || !orderSearch) return true;
    const searchLower = orderSearch.trim().toLowerCase();
    const cName = String(o.customer?.fullName || o.customerName || '').toLowerCase();
    const pName = String(o.product?.name || o.productName || '').toLowerCase();
    return cName.includes(searchLower) || pName.includes(searchLower) || String(o.status || '').toLowerCase().includes(searchLower);
  });

  const displayLogs = auditLogs.filter(log => {
    if (!log || !log.action) return false;
    if (auditFilter === 'All') return true;
    if (auditFilter === 'Admin') return log.role === 'admin';
    if (auditFilter === 'Customer') return log.role === 'customer';

    const actionLower = log.action.toLowerCase();
    if (auditFilter === 'Auth') return ['login', 'logout', 'sign up', 'password'].some(kw => actionLower.includes(kw));
    if (auditFilter === 'Customers') return actionLower.includes('customer');
    if (auditFilter === 'Packages') return actionLower.includes('package');
    if (auditFilter === 'Orders') return actionLower.includes('order') || actionLower.includes('subscrib');
    return true;
  });

  return (
    <div className="absolute inset-0 w-screen min-h-screen bg-[#f8fbff] font-sans pb-10 flex flex-col overflow-x-hidden m-0 p-0" dir={language === 'ar' ? 'rtl' : 'ltr'} onClick={() => { setShowProfileMenu(false); setShowAuditFilterMenu(false); setShowAdminNavMenu(false); }} style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>
      <Navbar />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0B2052] m-0">{t.opsDashboard}</h2>
            <p className="text-[#0062D1] font-medium mt-2 text-sm sm:text-base">{t.opsDesc}</p>
          </div>
          {/* Overview Export Button */}
          {activeTab === 'overview' && (
            <button 
              onClick={exportFullOverviewToExcel} 
              className="hidden sm:flex items-center gap-2 bg-[#f0f7ff] text-[#0062D1] hover:bg-[#0062D1] hover:text-white border border-[#d6e8ff] px-4 py-2.5 rounded-lg text-sm font-bold transition shadow-sm focus:outline-none"
            >
              <ExcelIcon />
              {t.exportFull}
            </button>
          )}
        </div>

        <div className="mb-8 z-20 flex items-stretch h-[48px] w-max max-w-full overflow-hidden">
          <button
            onClick={(e) => { e.stopPropagation(); setShowAdminNavMenu(!showAdminNavMenu); }}
            className={`shrink-0 flex items-center justify-between gap-2 bg-[#0B2052] text-white px-6 text-sm font-bold shadow-md hover:bg-[#061436] transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B2052] ${showAdminNavMenu ? (language === 'ar' ? 'rounded-r-xl rounded-l-none' : 'rounded-l-xl rounded-r-none') : 'rounded-xl'}`}
          >
            {activeTab === 'audit' ? t.auditTab : activeTab === 'tickets' ? t.ticketsTab : activeTab === 'overview' ? t.overviewTab : activeTab === 'customers' ? t.customersTab : activeTab === 'packages' ? t.packagesTab : activeTab === 'orders' ? t.ordersTab : activeTab}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mx-2 transition-transform duration-200 ${showAdminNavMenu ? '-rotate-90' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAdminNavMenu && (
            <div 
              className={`bg-white shadow-md border border-gray-100 flex items-center gap-1 animate-slide-right overflow-x-auto hide-scrollbar ${language === 'ar' ? 'rounded-l-xl border-r-0 pr-2 pl-3' : 'rounded-r-xl border-l-0 pl-2 pr-3'}`} 
              onClick={(e) => e.stopPropagation()}
            >
              {['overview', 'customers', 'packages', 'orders', 'tickets', 'audit'].map(tab => {
                if (tab === activeTab) return null; 
                const tabName = tab === 'overview' ? t.overviewTab : tab === 'customers' ? t.customersTab : tab === 'packages' ? t.packagesTab : tab === 'orders' ? t.ordersTab : tab === 'tickets' ? t.ticketsTab : t.auditTab;
                return (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setShowAdminNavMenu(false); }}
                    className="px-4 py-2 h-[36px] rounded-lg text-sm font-bold bg-transparent text-[#0062D1] hover:bg-[#f0f7ff] hover:text-[#0B2052] transition whitespace-nowrap cursor-pointer"
                  >
                    {tabName}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="sm:hidden mb-4 flex justify-end animate-fade-in">
              <button 
                onClick={exportFullOverviewToExcel} 
                className="w-full flex justify-center items-center gap-2 bg-[#f0f7ff] text-[#0062D1] hover:bg-[#0062D1] hover:text-white border border-[#d6e8ff] px-4 py-2.5 rounded-lg text-sm font-bold transition shadow-sm focus:outline-none"
              >
                <ExcelIcon />
                {t.exportFull}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full animate-fade-in">
              <StatsCardWithGraph title={t.customersTab} value={customers.length} color="indigo" trend="+12%" dataPoints={[30, 45, 40, 60, 55, 75, 100]} />
              <StatsCardWithGraph title={t.packagesTab} value={products.length} color="emerald" trend="+3%" dataPoints={[80, 80, 80, 80, 80, 100, 100]} />
              <StatsCardWithGraph title={t.totalOrders} value={orders.length} color="amber" trend="+18%" dataPoints={[20, 30, 45, 60, 50, 80, 95]} />
              <StatsCardWithGraph title={t.activeSubs} value={orders.filter(o=>o?.status==='Active').length} color="blue" trend="+7%" dataPoints={[30, 40, 55, 50, 70, 85, 90]} />
            </div>
          </>
        )}

        {activeTab === 'customers' && (
          <div className="flex flex-col lg:flex-row gap-6 w-full animate-fade-in">
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-max">
              <h3 className="font-extrabold text-[#0B2052] mb-5 text-xl">{customerForm.id ? t.editCustomer : t.addCustomer}</h3>
              <form onSubmit={handleSaveCustomer} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cFullName" className="block text-sm font-bold text-[#0B2052] mb-1">{t.fullName}</label>
                    <input id="cFullName" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm font-medium" value={customerForm.fullName} onChange={e => setCustomerForm({...customerForm, fullName: e.target.value})} />
                  </div>
                  <div>
                    <label htmlFor="cEmail" className="block text-sm font-bold text-[#0B2052] mb-1">{t.email}</label>
                    <input id="cEmail" required type="email" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm font-medium" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} dir="ltr" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cPhone" className="block text-sm font-bold text-[#0B2052] mb-1">{t.phoneNum}</label>
                    <input id="cPhone" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm font-medium" value={customerForm.phoneNumber} onChange={e => setCustomerForm({...customerForm, phoneNumber: e.target.value})} dir="ltr" />
                  </div>
                  <div>
                    <label htmlFor="cPassword" className="block text-sm font-bold text-[#0B2052] mb-1">{t.password}</label>
                    <input id="cPassword" type="text" required={!customerForm.id} placeholder={customerForm.id ? t.leaveEmptyToKeep : t.setPwd} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm font-medium" value={customerForm.password} onChange={e => setCustomerForm({...customerForm, password: e.target.value})} dir="ltr" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {!customerForm.id && (
                    <div>
                      <label htmlFor="cNatId" className="block text-sm font-bold text-[#0B2052] mb-1">{t.natId}</label>
                      <input 
                        id="cNatId" 
                        required 
                        maxLength={14}
                        placeholder="14 digits"
                        dir="ltr"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm font-medium" 
                        value={customerForm.nationalId} 
                        onChange={e => {
                          const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                          setCustomerForm({...customerForm, nationalId: onlyNums});
                        }} 
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="cBalance" className="block text-sm font-bold text-[#0B2052] mb-1">{t.balanceText}</label>
                    <input id="cBalance" required type="number" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm font-medium" value={customerForm.balance || 0} onChange={e => setCustomerForm({...customerForm, balance: e.target.value})} dir="ltr" />
                  </div>
                  <div>
                    <label htmlFor="cType" className="block text-sm font-bold text-[#0B2052] mb-1">{t.typeText}</label>
                    <select id="cType" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm bg-white font-medium cursor-pointer" value={customerForm.type} onChange={e => setCustomerForm({...customerForm, type: e.target.value})}>
                      <option value={0}>{t.individual}</option>
                      <option value={1}>{t.vip}</option>
                      <option value={2}>{t.business}</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#0062D1] hover:bg-[#004ba0] text-white py-3 rounded-lg text-sm font-bold shadow-md transition mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0062D1]">
                  {customerForm.id ? t.updateCustomer : t.addCustomer}
                </button>
                {customerForm.id && <button type="button" onClick={() => setCustomerForm({ id: null, fullName: '', phoneNumber: '', nationalId: '', email: '', address: '', type: 0, balance: 0, password: '' })} className="w-full text-[#0B2052] py-3 text-sm font-bold hover:bg-gray-100 rounded-lg focus:outline-none mt-2 transition">{t.cancelText}</button>}
              </form>
            </div>

            <div className="w-full lg:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="font-extrabold text-[#0B2052] m-0 text-xl">{t.custList}</h3>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <form onSubmit={e => { e.preventDefault(); setCustomerPage(1); setCustomerSearch(searchInput); }} className="flex-1 sm:flex-none">
                    <input placeholder={t.searchCust} value={searchInput} onChange={e => setSearchInput(e.target.value)} className="w-full sm:w-auto px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-[#0062D1] sm:min-w-[250px]" />
                  </form>
                  {/* Export Customers Button */}
                  <button 
                    onClick={() => exportSingleSheetToExcel(getFormattedCustomers(), "Masar_Customers_List", "Customers")} 
                    className="flex items-center gap-2 bg-[#f0f7ff] text-[#0062D1] hover:bg-[#0062D1] hover:text-white border border-[#d6e8ff] px-3 py-2 rounded-lg text-sm font-bold transition focus:outline-none"
                    title={t.exportBtn}
                  >
                    <ExcelIcon />
                    <span className="hidden sm:inline">{t.exportBtn}</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className={`w-full border-collapse min-w-[600px] ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <thead>
                    <tr className="border-b border-gray-200 text-xs text-gray-600 uppercase tracking-wider">
                      <th className="pb-3 font-extrabold">{t.nameCol}</th>
                      <th className="pb-3 font-extrabold">{t.emailCol}</th>
                      <th className="pb-3 font-extrabold text-center">{t.verifiedCol}</th>
                      <th className="pb-3 font-extrabold">{t.balanceCol}</th>
                      <th className={`pb-3 font-extrabold ${language === 'ar' ? 'text-left' : 'text-right'}`}>{t.actionsCol}</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-[#0B2052]">
                    {customers.map(c => (
                      <tr key={c.id} className="border-b border-gray-100 hover:bg-[#f8fbff] transition">
                        <td className="py-4 font-bold text-[#0B2052] flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#f0f7ff] text-[#0062D1] flex items-center justify-center font-extrabold text-sm shrink-0 border border-[#d6e8ff]">{c?.fullName ? c.fullName.charAt(0) : 'U'}</div>
                          <span className="truncate max-w-[120px] sm:max-w-none">{c?.fullName || t.unknown}</span>
                        </td>
                        <td className="py-4 truncate max-w-[150px] sm:max-w-none font-medium" dir="ltr">{c?.email || t.na}</td>
                        <td className="py-4 text-center">
                          {c?.isEmailVerified ? <span className="text-emerald-600 font-bold">✅</span> : <span className="text-red-500 font-bold">❌</span>}
                        </td>
                        <td className="py-4 font-bold text-emerald-600">
                          {c?.balance ?? c?.walletBalance ?? 0} {t.egp}
                        </td>
                        <td className={`py-4 whitespace-nowrap ${language === 'ar' ? 'text-left' : 'text-right'}`}>
                          <button onClick={() => setCustomerForm({...c, password: ''})} className="text-[#0062D1] hover:text-[#0B2052] font-bold mx-2 focus:outline-none focus:underline">{t.editBtn}</button>
                          <button onClick={() => handleDeleteCustomer(c.id)} className="text-red-700 hover:text-red-900 font-bold mx-2 focus:outline-none focus:underline">{t.delBtn}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-6 border-t pt-5 border-gray-200">
                <button disabled={customerPage === 1} onClick={() => setCustomerPage(p => p - 1)} className="text-sm font-bold text-gray-600 hover:text-[#0062D1] disabled:opacity-40 focus:outline-none focus:underline">{t.prevBtn}</button>
                <span className="text-sm font-bold text-[#0B2052]">{t.pageText} {customerPage} {t.ofText} {customerTotalPages || 1}</span>
                <button disabled={customerPage === customerTotalPages || !customerTotalPages} onClick={() => setCustomerPage(p => p + 1)} className="text-sm font-bold text-gray-600 hover:text-[#0062D1] disabled:opacity-40 focus:outline-none focus:underline">{t.nextBtn}</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="flex flex-col lg:flex-row gap-6 w-full animate-fade-in">
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-max">
              <h3 className="font-extrabold text-[#0B2052] mb-5 text-xl">{productForm.id ? t.editPkg : t.addPkg}</h3>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label htmlFor="pName" className="block text-sm font-bold text-[#0B2052] mb-1">{t.pkgName}</label>
                  <input id="pName" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm font-medium" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                </div>
                <div>
                  <label htmlFor="pDesc" className="block text-sm font-bold text-[#0B2052] mb-1">{t.desc}</label>
                  <input id="pDesc" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm font-medium" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pPrice" className="block text-sm font-bold text-[#0B2052] mb-1">{t.priceEgp}</label>
                    <input id="pPrice" required type="number" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm font-medium" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} dir="ltr" />
                  </div>
                  <div>
                    <label htmlFor="pCat" className="block text-sm font-bold text-[#0B2052] mb-1">{t.categoryText}</label>
                    <select id="pCat" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm bg-white font-medium cursor-pointer" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                      <option value="Internet">{t.Internet}</option>
                      <option value="Mobile">{t.Mobile}</option>
                      <option value="Bundle">{t.Bundle}</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#0062D1] hover:bg-[#004ba0] text-white py-3 rounded-lg text-sm font-bold shadow-md transition mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0062D1]">
                  {productForm.id ? t.updatePkg : t.addPkg}
                </button>
                {productForm.id && <button type="button" onClick={() => setProductForm({ id: null, name: '', description: '', price: '', category: 'Internet' })} className="w-full text-gray-600 py-3 text-sm font-bold hover:bg-gray-100 rounded-lg focus:outline-none mt-2 transition">{t.cancelText}</button>}
              </form>
            </div>

            <div className="w-full lg:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-[#0B2052] m-0 text-xl">{t.pkgSetup}</h3>
                {/* Export Packages Button */}
                <button 
                  onClick={() => exportSingleSheetToExcel(products, "Masar_Packages", "Packages")} 
                  className="flex items-center gap-2 bg-[#f0f7ff] text-[#0062D1] hover:bg-[#0062D1] hover:text-white border border-[#d6e8ff] px-3 py-2 rounded-lg text-sm font-bold transition focus:outline-none"
                >
                  <ExcelIcon />
                  <span className="hidden sm:inline">{t.exportBtn}</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                {products.map(p => (
                  <div key={p.id} className="border border-[#e6f0ff] rounded-xl p-5 hover:shadow-md hover:border-[#80b9ff] transition flex flex-col bg-[#f8fbff]">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-[#0062D1] tracking-wider uppercase">{t[p?.category] || p?.category || t.packageText}</span>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-extrabold border border-emerald-200">{t.availableTxt}</span>
                    </div>
                    <h4 className="font-extrabold text-[#0B2052] text-xl m-0">{p?.name || t.unknown}</h4>
                    <p className="text-sm text-[#0062D1] mb-6 mt-2 font-medium leading-relaxed">{p?.description || ''}</p>
                    <div className="flex justify-between items-end mt-auto">
                      <div>
                         <span className="text-3xl font-extrabold text-[#0B2052]">{p?.price || 0}</span>
                         <span className="text-sm font-bold text-gray-600 mx-1">{t.egpMo}</span>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setProductForm(p)} className="text-gray-400 hover:text-[#0062D1] font-bold transition p-1 focus:outline-none">{t.editBtn}</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-gray-400 hover:text-red-700 font-bold transition p-1 focus:outline-none">{t.delBtn}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="flex flex-col lg:flex-row gap-6 w-full animate-fade-in">
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-max">
              <h3 className="font-extrabold text-[#0B2052] mb-5 text-xl">{t.createOrder}</h3>
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label htmlFor="oCustomer" className="block text-sm font-bold text-[#0B2052] mb-1">{t.customerLbl || t.customer}</label>
                  <select id="oCustomer" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm bg-white font-medium cursor-pointer" value={orderForm.customerId} onChange={e => setOrderForm({...orderForm, customerId: e.target.value})}>
                    <option value="">{t.selectCust}</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c?.fullName || t.unknown}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="oProduct" className="block text-sm font-bold text-[#0B2052] mb-1">{t.packageLbl || t.packageText}</label>
                  <select id="oProduct" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm bg-white font-medium cursor-pointer" value={orderForm.productId} onChange={e => setOrderForm({...orderForm, productId: e.target.value})}>
                    <option value="">{t.selectPkg}</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p?.name || t.unknown}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full bg-[#0062D1] hover:bg-[#004ba0] text-white py-3 rounded-lg text-sm font-bold shadow-md transition mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0062D1]">
                  {t.submitOrder}
                </button>
              </form>
            </div>

            <div className="w-full lg:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="font-extrabold text-[#0B2052] m-0 text-xl">{t.orderMgmt}</h3>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <form onSubmit={e => { e.preventDefault(); setOrderSearch(orderSearchInput); }} className="flex-1 sm:flex-none">
                    <input placeholder={t.searchOrd} value={orderSearchInput} onChange={e => setOrderSearchInput(e.target.value)} className="w-full sm:w-auto px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-[#0062D1] sm:min-w-[250px]" />
                  </form>
                  {/* Export Orders Button */}
                  <button 
                    onClick={() => exportSingleSheetToExcel(getFormattedOrders(), "Masar_Orders", "Orders")} 
                    className="flex items-center gap-2 bg-[#f0f7ff] text-[#0062D1] hover:bg-[#0062D1] hover:text-white border border-[#d6e8ff] px-3 py-2 rounded-lg text-sm font-bold transition focus:outline-none"
                  >
                    <ExcelIcon />
                    <span className="hidden sm:inline">{t.exportBtn}</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className={`w-full border-collapse min-w-[600px] ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <thead>
                    <tr className="border-b border-gray-200 text-xs text-gray-600 uppercase tracking-wider">
                      <th className="pb-3 font-extrabold">{t.customerLbl || t.customer}</th>
                      <th className="pb-3 font-extrabold">{t.packageLbl || t.packageText}</th>
                      <th className="pb-3 font-extrabold">{t.statusCol}</th>
                      <th className={`pb-3 font-extrabold ${language === 'ar' ? 'text-left' : 'text-right'}`}>{t.actionsCol}</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-[#0B2052]">
                    {filteredOrders.map(o => (
                      <tr key={o.id} className="border-b border-gray-100 hover:bg-[#f8fbff] transition">
                        <td className="py-4 font-bold text-[#0B2052]">
                          {o?.customer?.fullName || o?.customerName || t.unknown}
                        </td>
                        <td className="py-4 text-[#0062D1] font-medium">{o?.product?.name || o?.productName || t.unknown}</td>
                        <td className="py-4"><StatusBadge status={o?.status} /></td>
                        <td className={`py-4 flex gap-2 items-center ${language === 'ar' ? 'justify-start' : 'justify-end'}`}>
                          {o?.status !== 'Active' && <button onClick={() => handleUpdateOrderStatus(o.id, 'Active')} className="text-emerald-700 hover:text-emerald-900 font-bold text-xs border border-emerald-300 bg-emerald-50 px-2 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-emerald-600">{t.activateBtn}</button>}
                          {o?.status !== 'Cancelled' && <button onClick={() => handleUpdateOrderStatus(o.id, 'Cancelled')} className="text-amber-800 hover:text-amber-900 font-bold text-xs border border-amber-300 bg-amber-50 px-2 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-amber-600">{t.cancelText}</button>}
                          <button onClick={() => handleDeleteOrder(o.id)} aria-label="Delete Order" className="text-gray-400 hover:text-red-700 font-extrabold mx-2 text-lg focus:outline-none px-2">&times;</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-200 overflow-visible animate-fade-in relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-extrabold text-[#0B2052] m-0 text-xl">{t.ticketsTab}</h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">{t.manageIssues}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={fetchSupportTickets} className="text-sm font-bold text-[#0062D1] hover:bg-[#f0f7ff] border border-[#d6e8ff] px-4 py-2.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#0062D1]">
                  {t.refreshBtn}
                </button>
                {/* Export Tickets Button */}
                <button 
                  onClick={() => exportSingleSheetToExcel(supportTickets, "Masar_Support_Tickets", "Tickets")} 
                  className="flex items-center gap-2 bg-[#f0f7ff] text-[#0062D1] hover:bg-[#0062D1] hover:text-white border border-[#d6e8ff] px-3 py-2 rounded-lg text-sm font-bold transition focus:outline-none"
                >
                  <ExcelIcon />
                  <span className="hidden sm:inline">{t.exportBtn}</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className={`w-full border-collapse min-w-[800px] ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <thead>
                  <tr className="border-b border-gray-200 text-xs text-gray-600 uppercase tracking-wider">
                    <th className="pb-3 font-extrabold w-32">{t.dateCol}</th>
                    <th className="pb-3 font-extrabold w-48">{t.customerLbl || t.customer}</th>
                    <th className="pb-3 font-extrabold w-64">{t.subjectCol}</th>
                    <th className="pb-3 font-extrabold w-32">{t.statusCol}</th>
                    <th className={`pb-3 font-extrabold ${language === 'ar' ? 'text-left' : 'text-right'}`}>{t.actionCol}</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-[#0B2052]">
                  {supportTickets.length > 0 ? supportTickets.map(tk => (
                    <tr key={tk.id} className="border-b border-gray-100 hover:bg-[#f8fbff] transition">
                      <td className="py-4 text-gray-500 font-medium text-xs whitespace-nowrap" dir="ltr">{tk?.createdAt || t.na}</td>
                      <td className="py-4">
                        <div className="font-bold text-[#0B2052]">{tk?.customerName || t.unknown}</div>
                        <div className="text-xs text-[#0062D1]" dir="ltr">{tk?.customerEmail || ''}</div>
                      </td>
                      <td className="py-4 font-bold text-gray-800 truncate max-w-[200px]">{tk?.subject || t.na}</td>
                      <td className="py-4"><StatusBadge status={tk?.status} /></td>
                      <td className={`py-4 ${language === 'ar' ? 'text-left' : 'text-right'}`}>
                        {tk?.status === 'Pending' ? (
                          <button 
                            onClick={() => setRespondModal({ isOpen: true, ticket: tk, responseText: '' })} 
                            className="bg-[#f0f7ff] text-[#0062D1] hover:bg-[#d6e8ff] font-bold px-3 py-1.5 rounded-lg text-xs transition border border-[#b3d4ff]"
                          >
                            {t.respondBtn}
                          </button>
                        ) : (
                          <span className={`text-emerald-600 font-bold text-xs flex items-center gap-1 ${language === 'ar' ? 'justify-start' : 'justify-end'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            {t.Resolved}
                          </span>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">{t.noTicketsFound}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-200 overflow-visible animate-fade-in relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-extrabold text-[#0B2052] m-0 text-xl">{t.sysAudit}</h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">{t.auditDesc2}</p>
              </div>
              
              <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowAuditFilterMenu(!showAuditFilterMenu); }} 
                    className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-[#f8fbff] transition focus:outline-none focus:ring-2 focus:ring-[#0062D1] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      <span>{t.filterTxt}: <span className="text-[#0062D1]">{auditFilter}</span></span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform ${showAuditFilterMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showAuditFilterMenu && (
                    <div className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-60 overflow-y-auto`}>
                      <div className="p-2 flex flex-col gap-1">
                        {['All', 'Admin', 'Customer', 'Auth', 'Customers', 'Packages', 'Orders'].map(f => (
                          <button 
                            key={f} 
                            onClick={() => { setAuditFilter(f); setShowAuditFilterMenu(false); }} 
                            className={`w-full ${language === 'ar' ? 'text-right' : 'text-left'} px-4 py-2 rounded-lg text-sm font-bold transition cursor-pointer ${auditFilter === f ? 'bg-[#f0f7ff] text-[#0062D1]' : 'text-[#0B2052] hover:bg-[#f8fbff]'}`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Export Audit Logs Button */}
                <button 
                  onClick={() => exportSingleSheetToExcel(displayLogs, "Masar_Audit_Logs", "Audit Logs")} 
                  className="flex items-center gap-2 bg-[#f0f7ff] text-[#0062D1] hover:bg-[#0062D1] hover:text-white border border-[#d6e8ff] px-3 py-2 rounded-lg text-sm font-bold transition focus:outline-none"
                >
                  <ExcelIcon />
                </button>

                <button onClick={() => {
                  fetch('http://localhost:5000/api/AuditLogs/clear', { method: 'DELETE' })
                    .then(() => setAuditLogs([]))
                    .catch(console.error);
                }} className="text-sm font-bold text-red-600 hover:text-red-800 bg-red-50 border border-red-100 px-4 py-2.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-600 whitespace-nowrap cursor-pointer">
                  {t.clearLogsBtn}
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className={`w-full border-collapse min-w-[800px] ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                <thead>
                  <tr className="border-b border-gray-200 text-xs text-gray-600 uppercase tracking-wider">
                    <th className="pb-3 font-extrabold w-48">{t.timestampCol}</th>
                    <th className="pb-3 font-extrabold w-32">{t.userCol}</th>
                    <th className="pb-3 font-extrabold w-24">{t.roleCol}</th>
                    <th className="pb-3 font-extrabold w-40">{t.actionCol}</th>
                    <th className="pb-3 font-extrabold">{t.detailsCol}</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-[#0B2052]">
                  {displayLogs.length > 0 ? displayLogs.map(log => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-[#f8fbff] transition">
                      <td className="py-4 text-gray-500 font-medium text-xs whitespace-nowrap" dir="ltr">{log?.timestamp || t.na}</td>
                      <td className="py-4 font-bold text-[#0B2052] truncate max-w-[150px]">{log?.user ? log.user.split('@')[0] : 'System'}</td>
                      <td className="py-4">
                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${log?.role === 'admin' ? 'bg-[#f0f7ff] text-[#0062D1] border-[#d6e8ff]' : log?.role === 'guest' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                           {log?.role || 'User'}
                         </span>
                      </td>
                      <td className="py-4 font-bold text-[#0B2052]">{log?.action || 'Event'}</td>
                      <td className="py-4 text-[#0062D1] font-medium truncate max-w-[300px]" title={log?.details}>{log?.details || ''}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">{t.noActivityFound}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {respondModal.isOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in" onClick={() => setRespondModal({ isOpen: false, ticket: null, responseText: '' })}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-gray-100" onClick={e => e.stopPropagation()} style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#f8fbff]">
              <h3 className="font-extrabold text-[#0B2052] text-xl m-0">{t.respondTicketTitle}</h3>
              <button onClick={() => setRespondModal({ isOpen: false, ticket: null, responseText: '' })} className="text-[#0062D1] hover:text-red-600 transition focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 bg-[#f0f7ff] p-4 rounded-xl border border-[#d6e8ff]">
                <div className="text-xs font-bold text-[#0062D1] mb-1 uppercase tracking-wider">{t.fromTxt}: {respondModal?.ticket?.customerName || t.unknown}</div>
                <h4 className="font-extrabold text-[#0B2052] mb-2">{respondModal?.ticket?.subject || t.na}</h4>
                <p className={`text-sm text-[#0062D1] italic border-4 border-transparent pl-3 ${language === 'ar' ? 'border-r-[#80b9ff] pr-3' : 'border-l-[#80b9ff] pl-3'}`}>"{respondModal?.ticket?.message || ''}"</p>
              </div>

              <form onSubmit={handleAdminRespondToTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#0B2052] mb-1">{t.yourReply}</label>
                  <textarea 
                    required 
                    rows="5"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#0062D1] text-sm font-medium transition resize-none"
                    placeholder={t.typeReply}
                    value={respondModal.responseText}
                    onChange={(e) => setRespondModal({...respondModal, responseText: e.target.value})}
                  ></textarea>
                </div>
                <div className={`flex ${language === 'ar' ? 'justify-start' : 'justify-end'} gap-3 pt-4 border-t border-gray-100`}>
                  <button type="button" onClick={() => setRespondModal({ isOpen: false, ticket: null, responseText: '' })} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition focus:outline-none">
                    {t.cancelText}
                  </button>
                  <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-[#0062D1] rounded-lg hover:bg-[#004ba0] transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0062D1] flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {t.sendReply}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in" onClick={closeModal} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col text-center p-6 border border-gray-100" onClick={e => e.stopPropagation()}>
            <h3 className="font-extrabold text-[#0B2052] text-xl mb-3">
              {modalConfig.type === 'confirm' ? t.confirmAction : (modalConfig.status === 'success' ? t.successMod : t.noticeMod)}
            </h3>
            <p className="text-gray-600 font-medium mb-8 whitespace-pre-line leading-relaxed">{modalConfig.message}</p>
            
            <div className="flex justify-center gap-3">
              {modalConfig.type === 'confirm' && (
                <button onClick={closeModal} className="w-full py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition focus:outline-none">
                  {t.cancelText}
                </button>
              )}
              <button 
                onClick={() => {
                  if (modalConfig.onConfirm) modalConfig.onConfirm();
                  closeModal();
                }} 
                className={`w-full py-2.5 text-sm font-bold text-white rounded-xl transition shadow-md focus:outline-none ${modalConfig.status === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#0062D1] hover:bg-[#004ba0]'}`}
              >
                {modalConfig.type === 'confirm' ? t.yesProceed : t.okBtn}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        
        @keyframes slideRight { 
          from { opacity: 0; transform: translateX(-15px); } 
          to { opacity: 1; transform: translateX(0); } 
        }
        .animate-slide-right { animation: slideRight 0.2s ease-out forwards; }
        
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

export default App;