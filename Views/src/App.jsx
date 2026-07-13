import { useState, useEffect } from 'react';

function App() {
  // ================= 1. AUTH & NAVIGATION STATES =================
  const [auth, setAuth] = useState({ isAuthenticated: false, role: '', email: '' });
  const [authMode, setAuthMode] = useState('signin'); 
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [forgotForm, setForgotForm] = useState({ email: '' });

  const [activeTab, setActiveTab] = useState('customers'); 
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // ================= 2. DATA STATES =================
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0); 

  const [customerPage, setCustomerPage] = useState(1);
  const [customerSearch, setCustomerSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [customerTotalPages, setCustomerTotalPages] = useState(1);
  const [orderSearchInput, setOrderSearchInput] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // ⚠️ التعديل هنا: ضفنا حقل balance في الفورمة عشان الأدمن يقدر يشحن للعملاء
  const [customerForm, setCustomerForm] = useState({ id: null, fullName: '', phoneNumber: '', nationalId: '', email: '', address: '', type: 0, balance: 0 });
  const [productForm, setProductForm] = useState({ id: null, name: '', description: '', price: '', category: 'Internet' });
  const [orderForm, setOrderForm] = useState({ customerId: '', productId: '' });

  // ================= 3. FETCH DATA =================
  const fetchCustomers = () => {
    return fetch(`http://localhost:5000/api/Customers?page=${customerPage}&search=${encodeURIComponent(customerSearch)}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(result => {
        setCustomers(result.data || []);
        setCustomerTotalPages(result.totalPages || 1);
        return result.data || [];
      })
      .catch(console.error);
  };

  const fetchProducts = () => {
    fetch('http://localhost:5000/api/Products', { cache: 'no-store' }).then(res => res.json()).then(setProducts).catch(console.error);
  };

  const fetchOrders = () => {
    fetch('http://localhost:5000/api/Orders', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchOrders();
  }, [customerPage, customerSearch]);

  // ⚠️ التعديل هنا: مزامنة الرصيد مع الداتا بيز أول ما العميل يسجل دخول
  useEffect(() => {
    if (auth.isAuthenticated && auth.role === 'customer') {
      const current = customers.find(c => c.email.toLowerCase() === auth.email.toLowerCase());
      if (current) {
        // لو الحقل اسمه balance في الداتا بيز هياخده، لو مفيش هيعتبره 0
        setWalletBalance(current.balance ?? current.walletBalance ?? 0);
      }
    }
  }, [auth.isAuthenticated, customers, auth.email]);

  // ================= 4. AUTHENTICATION =================
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = loginForm.email.toLowerCase().trim();
    
    if (email.includes('admin')) {
      setAuth({ isAuthenticated: true, role: 'admin', email: email });
      return;
    }

    const existingCustomer = customers.find(c => c.email.toLowerCase() === email);
    
    if (!existingCustomer) {
      alert("❌ Account not found! Please Create an Account first.");
      return;
    }

    setAuth({ isAuthenticated: true, role: 'customer', email: email });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const email = signupForm.email.toLowerCase().trim();

    if (customers.find(c => c.email.toLowerCase() === email)) {
      alert("⚠️ This email is already registered. Please Sign In.");
      setAuthMode('signin');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/Customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: signupForm.fullName,
          email: email,
          phoneNumber: signupForm.phone || '0000000000',
          nationalId: 'New User',
          type: 0,
          balance: 5000 // ⚠️ هدية تسجيل الدخول في الداتا بيز عشان يشتري براحته
        })
      });

      if (!response.ok) throw new Error("Failed to create account in database.");

      await fetchCustomers();
      
      alert(`🎉 Welcome ${signupForm.fullName}! Your account has been created successfully with 5000 EGP bonus.`);
      setAuth({ isAuthenticated: true, role: 'customer', email: email });
      setSignupForm({ fullName: '', email: '', phone: '', password: '' });

    } catch (err) {
      alert("Error signing up: " + err.message);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(`📩 A password reset link has been sent to ${forgotForm.email}. Please check your inbox.`);
    setAuthMode('signin');
    setForgotForm({ email: '' });
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, role: '', email: '' });
    setLoginForm({ email: '', password: '' });
    setAuthMode('signin');
    setShowProfileMenu(false);
  };

  // ================= 5. CRUD HANDLERS =================
  const handleSaveCustomer = (e) => {
    e.preventDefault();
    const isEdit = customerForm.id !== null;
    const url = isEdit ? `http://localhost:5000/api/Customers/${customerForm.id}` : 'http://localhost:5000/api/Customers';
    const method = isEdit ? 'PUT' : 'POST';
    const payload = { ...customerForm, type: parseInt(customerForm.type), balance: parseFloat(customerForm.balance) || 0 };

    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(() => {
        fetchCustomers();
        setCustomerForm({ id: null, fullName: '', phoneNumber: '', nationalId: '', email: '', address: '', type: 0, balance: 0 });
      });
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Delete this customer?')) {
      fetch(`http://localhost:5000/api/Customers/${id}`, { method: 'DELETE' }).then(() => fetchCustomers());
    }
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
        setProductForm({ id: null, name: '', description: '', price: '', category: 'Internet' });
      });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Delete this package?')) {
      fetch(`http://localhost:5000/api/Products/${id}`, { method: 'DELETE' }).then(() => fetchProducts());
    }
  };

  const handleCreateOrder = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/Orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId: parseInt(orderForm.customerId), productId: parseInt(orderForm.productId) })
    }).then(() => {
      fetchOrders();
      setOrderForm({ customerId: '', productId: '' });
    });
  };

  const handleUpdateOrderStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/Orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).then(() => fetchOrders());
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm('Delete this order?')) {
      fetch(`http://localhost:5000/api/Orders/${id}`, { method: 'DELETE' }).then(() => fetchOrders());
    }
  };

  // ================= UI COMPONENTS =================
  const StatusBadge = ({ status }) => {
    let color = "bg-gray-100 text-gray-800 border-gray-300";
    let dot = "bg-gray-600";
    if (status === 'Active') { color = "bg-emerald-50 text-emerald-800 border-emerald-300"; dot = "bg-emerald-600"; }
    else if (status === 'Pending') { color = "bg-amber-50 text-amber-800 border-amber-300"; dot = "bg-amber-600"; }
    else if (status === 'Cancelled') { color = "bg-red-50 text-red-800 border-red-300"; dot = "bg-red-600"; }
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-bold border flex items-center gap-2 w-max ${color}`}>
        <span className={`w-2 h-2 rounded-full ${dot}`} aria-hidden="true"></span> {status || 'Active'}
      </span>
    );
  };

  const Navbar = () => {
    const currentCustomer = customers.find(c => c.email.toLowerCase() === auth.email.toLowerCase());
    const myCustomerId = currentCustomer ? currentCustomer.id : 0;

    return (
      <nav className="relative z-50 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex justify-between items-center shadow-sm text-left w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">M</div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight m-0">Masar Telecom</h1>
            <p className="text-xs text-gray-600 font-bold tracking-wider m-0">SAAS PLATFORM</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold border ${auth.role === 'admin' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
            {auth.role === 'admin' ? 'Admin' : 'Customer'}
          </span>
          <div className="text-right hidden md:block">
            <p className="text-xs text-gray-600 font-medium m-0">Signed in as</p>
            <p className="text-sm font-bold text-gray-900 m-0">{auth.email}</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-9 h-9 bg-indigo-700 rounded-full flex items-center justify-center text-white font-bold shadow-sm shrink-0 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition"
            >
              {auth.email.charAt(0).toUpperCase()}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-5 border-b border-gray-100 bg-gray-50">
                  <h4 className="font-bold text-gray-900 capitalize text-lg m-0">{currentCustomer ? currentCustomer.fullName : auth.email.split('@')[0]}</h4>
                  <p className="text-sm text-gray-500 m-0 truncate">{auth.email}</p>
                </div>
                
                {auth.role === 'customer' && (
                  <div className="p-5 space-y-4 text-sm font-medium">
                    <div className="flex justify-between border-b border-gray-100 pb-3">
                      <span className="text-gray-500">Customer ID</span>
                      <span className="font-bold text-gray-900">MSR-{myCustomerId.toString().padStart(4, '0')}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-3">
                      <span className="text-gray-500">Plan tier</span>
                      <span className="font-bold text-indigo-700">Premium</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Member since</span>
                      <span className="font-bold text-gray-900">Active</span>
                    </div>
                  </div>
                )}
                
                <div className="p-3 bg-gray-50 border-t border-gray-100">
                  <button onClick={handleLogout} className="w-full bg-white border border-gray-300 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-50 focus:outline-none transition">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  };

  // ---------------- VIEW A: LOGIN / SIGNUP / FORGOT PASSWORD ----------------
  if (!auth.isAuthenticated) {
    return (
      <div className="absolute inset-0 w-screen min-h-screen flex bg-gray-50 font-sans text-left overflow-x-hidden m-0 p-0">
        <div className="hidden md:flex w-1/2 flex-col justify-center px-12 lg:px-20 text-left bg-white h-full relative">
          <div className="flex items-center gap-3 mb-10 relative z-10">
            <div className="w-12 h-12 bg-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">M</div>
            <div>
              <h1 className="font-bold text-2xl text-gray-900 leading-tight m-0">Masar Telecom</h1>
              <p className="text-sm text-gray-600 font-bold tracking-wider m-0">SAAS PLATFORM</p>
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight text-left leading-tight relative z-10">Telecom, <span className="text-indigo-700">simplified.</span></h2>
          <p className="text-gray-700 text-lg mb-12 max-w-md text-left font-medium relative z-10">Manage customers, packages and orders from one calm, modern workspace. Built for teams who value clarity.</p>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 text-left bg-gray-50 h-full">
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg w-full max-w-md border border-gray-200 transition-all duration-300">
            
            {authMode === 'signin' && (
              <>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Welcome back</h3>
                <p className="text-gray-600 font-medium mb-8 text-sm">Sign in to your Masar Telecom workspace.</p>
                <form onSubmit={handleLogin} className="space-y-5 text-left">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">Email</label>
                    <input required type="email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none transition text-gray-900 font-medium" placeholder="admin@masar.eg" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">Password</label>
                    <input required type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none transition text-gray-900 font-medium" placeholder="••••••••" />
                  </div>
                  <div className="flex justify-end">
                    <button type="button" onClick={() => setAuthMode('forgot')} className="text-sm font-bold text-indigo-700 hover:text-indigo-900 focus:outline-none focus:underline">Forgot password?</button>
                  </div>
                  <button type="submit" className="w-full bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md hover:bg-indigo-800 focus:outline-none transition">Sign In</button>
                </form>
                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                  <p className="text-sm font-medium text-gray-600">Don't have an account? <button onClick={() => setAuthMode('signup')} className="font-bold text-indigo-700 hover:text-indigo-900 focus:outline-none focus:underline">Create Account</button></p>
                </div>
              </>
            )}

            {authMode === 'signup' && (
              <>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Create Account</h3>
                <p className="text-gray-600 font-medium mb-8 text-sm">Join Masar Telecom to manage your plans.</p>
                <form onSubmit={handleSignup} className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">Full Name</label>
                    <input required type="text" value={signupForm.fullName} onChange={e => setSignupForm({...signupForm, fullName: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none transition text-gray-900 font-medium" placeholder="Gamal Hossam" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">Email</label>
                    <input required type="email" value={signupForm.email} onChange={e => setSignupForm({...signupForm, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none transition text-gray-900 font-medium" placeholder="gamal@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">Phone Number</label>
                    <input required type="text" value={signupForm.phone} onChange={e => setSignupForm({...signupForm, phone: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none transition text-gray-900 font-medium" placeholder="01000000000" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">Password</label>
                    <input required type="password" value={signupForm.password} onChange={e => setSignupForm({...signupForm, password: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none transition text-gray-900 font-medium" placeholder="••••••••" />
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-emerald-700 focus:outline-none transition mt-2">Sign Up</button>
                </form>
                <div className="mt-6 text-center border-t border-gray-100 pt-6">
                  <p className="text-sm font-medium text-gray-600">Already have an account? <button onClick={() => setAuthMode('signin')} className="font-bold text-indigo-700 hover:text-indigo-900 focus:outline-none focus:underline">Sign In</button></p>
                </div>
              </>
            )}

            {authMode === 'forgot' && (
              <>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Reset Password</h3>
                <p className="text-gray-600 font-medium mb-8 text-sm">Enter your email and we'll send you a link to reset your password.</p>
                <form onSubmit={handleForgotPassword} className="space-y-5 text-left">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-1">Email</label>
                    <input required type="email" value={forgotForm.email} onChange={e => setForgotForm({ email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none transition text-gray-900 font-medium" placeholder="your@email.com" />
                  </div>
                  <button type="submit" className="w-full bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md hover:bg-indigo-800 focus:outline-none transition">Send Reset Link</button>
                </form>
                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                  <button onClick={() => setAuthMode('signin')} className="text-sm font-bold text-gray-600 hover:text-indigo-900 focus:outline-none focus:underline">← Back to Sign In</button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    );
  }

  // ---------------- VIEW B: CUSTOMER PORTAL ----------------
  if (auth.role === 'customer') {
    const currentCustomer = customers.find(c => c.email.trim().toLowerCase() === auth.email.trim().toLowerCase());
    const myCustomerId = currentCustomer ? currentCustomer.id : 0;

    const handleCustomerSubscribe = async (productId) => {
      if (myCustomerId === 0) {
        alert("System syncing... Please wait a second and try again.");
        return;
      }
      
      const selectedProduct = products.find(p => p.id === productId);
      if (!selectedProduct) return;

      if (walletBalance < selectedProduct.price) {
        alert(`⚠️ رصيدك مش كفاية يا هندسة!\nرصيدك: ${walletBalance.toFixed(2)} EGP\nسعر الباقة: ${selectedProduct.price} EGP.`);
        return;
      }

      try {
        // 1. نكريت الأوردر
        const orderResponse = await fetch('http://localhost:5000/api/Orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerId: parseInt(myCustomerId), productId: parseInt(productId) })
        });

        if (!orderResponse.ok) {
          const errText = await orderResponse.text();
          throw new Error(errText || "Backend rejected the order.");
        }

        // 2. ⚠️ التحديث السحري للداتا بيز: نخصم الرصيد من جدول العميل بـ PUT
        const newBalance = walletBalance - selectedProduct.price;
        await fetch(`http://localhost:5000/api/Customers/${myCustomerId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...currentCustomer,
            balance: newBalance // تحديث الرصيد الدائم
          })
        });

        setWalletBalance(newBalance);
        
        // الأوردر يظهر فوراً للمستخدم عشان الـ UX
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
        
        // ونكلم الداتا بيز تجيب كل حاجة صح في الخلفية
        fetchCustomers();
        fetch('http://localhost:5000/api/Orders', { cache: 'no-store' })
          .then(res => res.json())
          .then(data => setOrders(data))
          .catch(console.error);

        alert(`✅ تم الاشتراك بنجاح في ${selectedProduct.name}!\nاتخصم ${selectedProduct.price} جنيه من رصيدك.`);
      } catch (err) {
        alert("Error subscribing: " + err.message);
      }
    };

    const displayOrders = orders.filter(o => {
      if (String(o.status || '').toLowerCase() === 'cancelled') return false;
      
      const matchesId = Number(o.customerId) === Number(myCustomerId);
      const matchesName = currentCustomer && String(o.customerName || '').toLowerCase().trim() === String(currentCustomer.fullName).toLowerCase().trim();
      const matchesEmail = String(o.customer?.email || '').toLowerCase().trim() === String(auth.email).toLowerCase().trim();
      const matchesAuthName = String(o.customerName || '').toLowerCase().trim() === String(auth.email.split('@')[0]).toLowerCase().trim();
      
      return matchesId || matchesName || matchesEmail || matchesAuthName;
    });

    return (
      <div className="absolute inset-0 w-screen min-h-screen bg-gray-50 font-sans text-left flex flex-col overflow-x-hidden m-0 p-0">
        <Navbar />
        
        <div className="bg-indigo-900 text-indigo-50 px-4 sm:px-8 py-3 flex justify-between items-center text-sm w-full relative z-10 shadow-md">
           <span className="font-medium">Welcome back, <span className="font-bold capitalize text-white">{currentCustomer ? currentCustomer.fullName.split(' ')[0] : auth.email.split('@')[0]}</span>!</span>
           <span className="font-medium text-indigo-200">Wallet Balance: <span className="text-emerald-400 font-extrabold ml-1 tracking-wide">{walletBalance.toFixed(2)} EGP</span></span>
        </div>
        
        <div className="relative w-full flex-1" onClick={() => setShowProfileMenu(false)}>
          <div className="bg-indigo-700 h-40 w-full absolute top-0 left-0 z-0"></div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col lg:flex-row gap-6 pb-12">
            
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-md border border-gray-200 h-max">
              <h3 className="font-extrabold text-gray-900 mb-6 m-0 text-xl">Usage Overview</h3>
              
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-gray-700">Internet Quota</span>
                  <span className="text-xs font-bold text-indigo-600">45 / 100 GB</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-indigo-600 h-3 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-gray-700">Voice Minutes</span>
                  <span className="text-xs font-bold text-emerald-600">800 / 1000 Min</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-2/3 flex flex-col gap-8">
              
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 w-full text-left overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                  <h3 className="font-extrabold text-gray-900 m-0 text-xl">Explore Packages</h3>
                  <span className="text-xs text-indigo-800 bg-indigo-100 px-3 py-1.5 rounded-md font-bold border border-indigo-200">Available to add</span>
                </div>
                
                <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory hide-scrollbar">
                  {products.map(p => (
                    <div key={p.id} className="min-w-[260px] sm:min-w-[280px] border border-gray-200 rounded-xl p-5 shrink-0 snap-start bg-gradient-to-b from-white to-gray-50 flex flex-col hover:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-600 transition shadow-sm">
                      <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase mb-1">{p.category}</span>
                      <h4 className="font-extrabold text-gray-900 mb-1 truncate text-lg">{p.name}</h4>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10 font-medium">{p.description}</p>
                      <div className="text-3xl font-extrabold text-gray-900 mb-6">{p.price} <span className="text-sm text-gray-600 font-medium">EGP/mo</span></div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleCustomerSubscribe(p.id); }} 
                        className="mt-auto w-full bg-white text-indigo-700 hover:bg-indigo-700 hover:text-white transition py-2.5 rounded-lg text-sm font-bold border border-indigo-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                      >
                        Subscribe Now
                      </button>
                    </div>
                  ))}
                  {products.length === 0 && <p className="text-sm text-gray-500 font-medium">No packages available right now.</p>}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 w-full text-left">
                <h3 className="font-extrabold text-gray-900 mb-6 m-0 text-xl">My Subscriptions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayOrders.length > 0 ? displayOrders.map(o => {
                    const packageDetails = o.product || products.find(p => p.id === o.productId) || products.find(p => p.name === o.productName) || {};
                    
                    return (
                      <div key={o.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-gray-50 flex flex-col text-left">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase">Package</span>
                          <StatusBadge status={o.status} />
                        </div>
                        <div className="text-left mb-6">
                          <h4 className="font-extrabold text-gray-900 text-xl m-0">{packageDetails.name || o.productName || 'New Package'}</h4>
                          <p className="text-sm text-gray-600 font-medium m-0 mt-1">Order #{o.id}</p>
                        </div>
                        <div className="flex justify-between items-end pt-4 border-t border-gray-200 mt-auto">
                          <div>
                            <span className="text-2xl font-extrabold text-gray-900">{packageDetails.price || '--'}</span>
                            <span className="text-sm text-gray-600 font-medium ml-1">EGP / mo</span>
                          </div>
                          <div className="text-right">
                            <span className="block text-xs text-gray-500 font-medium m-0">Renews</span>
                            <span className="text-sm font-bold text-gray-800 m-0">Next Month</span>
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="col-span-full p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                      <p className="text-gray-600 font-medium text-lg">You haven't subscribed to any packages yet.</p>
                      <p className="text-sm text-gray-500 mt-1">Pick a package from above to get started!</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- VIEW C: ADMIN DASHBOARD ----------------
  const StatsCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-center h-28 text-left w-full">
      <span className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-2">{title}</span>
      <span className="text-4xl font-extrabold text-gray-900">{value}</span>
    </div>
  );

  const filteredOrders = orders.filter(o => {
    if (!orderSearch) return true;
    const searchLower = orderSearch.trim().toLowerCase();
    const cName = (o.customer?.fullName || o.customerName || '').toLowerCase();
    const pName = (o.product?.name || o.productName || '').toLowerCase();
    return cName.includes(searchLower) || pName.includes(searchLower) || (o.status || '').toLowerCase().includes(searchLower);
  });

  return (
    <div className="absolute inset-0 w-screen min-h-screen bg-gray-50 font-sans pb-10 text-left overflow-x-hidden m-0 p-0" onClick={() => setShowProfileMenu(false)}>
      <Navbar />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <h2 className="text-3xl font-extrabold text-gray-900 m-0">Operations Dashboard</h2>
        <p className="text-gray-600 font-medium mb-8 mt-2 text-sm sm:text-base">Manage customers, packages, and telecom orders.</p>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full">
          <StatsCard title="Customers" value={customers.length} />
          <StatsCard title="Packages" value={products.length} />
          <StatsCard title="Orders" value={orders.length} />
          <StatsCard title="Active" value={orders.filter(o=>o.status==='Active').length} />
        </div>

        <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-xl w-max shadow-sm border border-gray-200 overflow-x-auto max-w-full">
          {['customers', 'products', 'orders'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 sm:px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-600 ${activeTab === tab ? 'bg-indigo-700 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 w-full">
          
          {/* ================= CUSTOMERS TAB ================= */}
          {activeTab === 'customers' && (
            <>
              <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-max text-left">
                <h3 className="font-extrabold text-gray-900 mb-5 text-xl">{customerForm.id ? 'Edit Customer' : 'Add Customer'}</h3>
                <form onSubmit={handleSaveCustomer} className="space-y-4">
                  <div>
                    <label htmlFor="cFullName" className="block text-sm font-bold text-gray-800 mb-1">Full name</label>
                    <input id="cFullName" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium" value={customerForm.fullName} onChange={e => setCustomerForm({...customerForm, fullName: e.target.value})} />
                  </div>
                  <div>
                    <label htmlFor="cEmail" className="block text-sm font-bold text-gray-800 mb-1">Email</label>
                    <input id="cEmail" required type="email" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cPhone" className="block text-sm font-bold text-gray-800 mb-1">Phone</label>
                      <input id="cPhone" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium" value={customerForm.phoneNumber} onChange={e => setCustomerForm({...customerForm, phoneNumber: e.target.value})} />
                    </div>
                    {/* ⚠️ التعديل هنا: ضفنا حقل الـ Balance في شاشة الأدمن */}
                    <div>
                      <label htmlFor="cBalance" className="block text-sm font-bold text-gray-800 mb-1">Balance (EGP)</label>
                      <input id="cBalance" required type="number" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium" value={customerForm.balance || 0} onChange={e => setCustomerForm({...customerForm, balance: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {!customerForm.id && (
                      <div>
                        <label htmlFor="cNatId" className="block text-sm font-bold text-gray-800 mb-1">National ID</label>
                        <input id="cNatId" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium" value={customerForm.nationalId} onChange={e => setCustomerForm({...customerForm, nationalId: e.target.value})} />
                      </div>
                    )}
                    <div>
                      <label htmlFor="cType" className="block text-sm font-bold text-gray-800 mb-1">Type</label>
                      <select id="cType" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm bg-white font-medium cursor-pointer" value={customerForm.type} onChange={e => setCustomerForm({...customerForm, type: e.target.value})}>
                        <option value={0}>Individual</option>
                        <option value={1}>VIP</option>
                        <option value={2}>Business</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-3 rounded-lg text-sm font-bold shadow-md transition mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                    {customerForm.id ? 'Update Customer' : 'Add customer'}
                  </button>
                  {customerForm.id && <button type="button" onClick={() => setCustomerForm({ id: null, fullName: '', phoneNumber: '', nationalId: '', email: '', address: '', type: 0, balance: 0 })} className="w-full text-gray-600 py-3 text-sm font-bold hover:bg-gray-100 rounded-lg focus:outline-none mt-2 transition">Cancel</button>}
                </form>
              </div>

              <div className="w-full lg:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-left overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h3 className="font-extrabold text-gray-900 m-0 text-xl">Customers</h3>
                  <form onSubmit={e => { e.preventDefault(); setCustomerPage(1); setCustomerSearch(searchInput); }} className="flex gap-2 w-full sm:w-auto">
                    <label htmlFor="searchCust" className="sr-only">Search customers</label>
                    <input id="searchCust" placeholder="Search customers..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="w-full sm:w-auto px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-600 sm:min-w-[250px]" />
                  </form>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs text-gray-600 uppercase tracking-wider">
                        <th className="pb-3 font-extrabold">Name</th>
                        <th className="pb-3 font-extrabold">Email</th>
                        <th className="pb-3 font-extrabold">Balance</th>
                        <th className="pb-3 font-extrabold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                      {customers.map(c => (
                        <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-4 font-bold text-gray-900 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-extrabold text-sm shrink-0">{c.fullName.charAt(0)}</div>
                            <span className="truncate max-w-[120px] sm:max-w-none">{c.fullName}</span>
                          </td>
                          <td className="py-4 truncate max-w-[150px] sm:max-w-none font-medium">{c.email}</td>
                          <td className="py-4 font-bold text-emerald-600">
                            {c.balance ?? c.walletBalance ?? 0} EGP
                          </td>
                          <td className="py-4 text-right whitespace-nowrap">
                            <button onClick={() => setCustomerForm(c)} aria-label={`Edit ${c.fullName}`} className="text-indigo-700 hover:text-indigo-900 font-bold mr-4 focus:outline-none focus:underline">Edit / Recharge</button>
                            <button onClick={() => handleDeleteCustomer(c.id)} aria-label={`Delete ${c.fullName}`} className="text-red-700 hover:text-red-900 font-bold focus:outline-none focus:underline">Del</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center mt-6 border-t pt-5 border-gray-200">
                  <button disabled={customerPage === 1} onClick={() => setCustomerPage(p => p - 1)} className="text-sm font-bold text-gray-600 hover:text-indigo-700 disabled:opacity-40 focus:outline-none focus:underline">Previous</button>
                  <span className="text-sm font-bold text-gray-900">Page {customerPage} of {customerTotalPages}</span>
                  <button disabled={customerPage === customerTotalPages || customerTotalPages === 0} onClick={() => setCustomerPage(p => p + 1)} className="text-sm font-bold text-gray-600 hover:text-indigo-700 disabled:opacity-40 focus:outline-none focus:underline">Next</button>
                </div>
              </div>
            </>
          )}

          {/* ================= PRODUCTS TAB ================= */}
          {activeTab === 'products' && (
            <>
              <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-max text-left">
                <h3 className="font-extrabold text-gray-900 mb-5 text-xl">{productForm.id ? 'Edit Package' : 'Add Package'}</h3>
                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div>
                    <label htmlFor="pName" className="block text-sm font-bold text-gray-800 mb-1">Package name</label>
                    <input id="pName" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                  </div>
                  <div>
                    <label htmlFor="pDesc" className="block text-sm font-bold text-gray-800 mb-1">Description</label>
                    <input id="pDesc" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pPrice" className="block text-sm font-bold text-gray-800 mb-1">Price (EGP)</label>
                      <input id="pPrice" required type="number" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} />
                    </div>
                    <div>
                      <label htmlFor="pCat" className="block text-sm font-bold text-gray-800 mb-1">Category</label>
                      <select id="pCat" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm bg-white font-medium cursor-pointer" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                        <option value="Internet">Internet</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Bundle">Bundle</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-3 rounded-lg text-sm font-bold shadow-md transition mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                    {productForm.id ? 'Update Package' : 'Add package'}
                  </button>
                  {productForm.id && <button type="button" onClick={() => setProductForm({ id: null, name: '', description: '', price: '', category: 'Internet' })} className="w-full text-gray-600 py-3 text-sm font-bold hover:bg-gray-100 rounded-lg focus:outline-none mt-2 transition">Cancel</button>}
                </form>
              </div>

              <div className="w-full lg:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-left">
                <h3 className="font-extrabold text-gray-900 mb-6 m-0 text-xl">Packages</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  {products.map(p => (
                    <div key={p.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition text-left flex flex-col bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase">{p.category}</span>
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-extrabold border border-emerald-200">Available</span>
                      </div>
                      <h4 className="font-extrabold text-gray-900 text-xl m-0">{p.name}</h4>
                      <p className="text-sm text-gray-600 mb-6 mt-2 font-medium leading-relaxed">{p.description}</p>
                      <div className="flex justify-between items-end mt-auto">
                        <div>
                           <span className="text-3xl font-extrabold text-gray-900">{p.price}</span>
                           <span className="text-sm font-bold text-gray-600 ml-1">EGP / mo</span>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => setProductForm(p)} aria-label={`Edit ${p.name}`} className="text-gray-500 hover:text-indigo-700 font-bold transition p-1 focus:outline-none focus:text-indigo-700">Edit</button>
                          <button onClick={() => handleDeleteProduct(p.id)} aria-label={`Delete ${p.name}`} className="text-gray-500 hover:text-red-700 font-bold transition p-1 focus:outline-none focus:text-red-700">Del</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ================= ORDERS TAB ================= */}
          {activeTab === 'orders' && (
            <>
              <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-max text-left">
                <h3 className="font-extrabold text-gray-900 mb-5 text-xl">Create Order</h3>
                <form onSubmit={handleCreateOrder} className="space-y-4">
                  <div>
                    <label htmlFor="oCustomer" className="block text-sm font-bold text-gray-800 mb-1">Customer</label>
                    <select id="oCustomer" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm bg-white font-medium cursor-pointer" value={orderForm.customerId} onChange={e => setOrderForm({...orderForm, customerId: e.target.value})}>
                      <option value="">-- Select Customer --</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="oProduct" className="block text-sm font-bold text-gray-800 mb-1">Package</label>
                    <select id="oProduct" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm bg-white font-medium cursor-pointer" value={orderForm.productId} onChange={e => setOrderForm({...orderForm, productId: e.target.value})}>
                      <option value="">-- Select Package --</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-3 rounded-lg text-sm font-bold shadow-md transition mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                    Create order
                  </button>
                </form>
              </div>

              <div className="w-full lg:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-left overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h3 className="font-extrabold text-gray-900 m-0 text-xl">Orders</h3>
                  <form onSubmit={e => { e.preventDefault(); setOrderSearch(orderSearchInput); }} className="flex gap-2 w-full sm:w-auto">
                    <label htmlFor="searchOrders" className="sr-only">Search orders</label>
                    <input id="searchOrders" placeholder="Search orders..." value={orderSearchInput} onChange={e => setOrderSearchInput(e.target.value)} className="w-full sm:w-auto px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-600 sm:min-w-[250px]" />
                  </form>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs text-gray-600 uppercase tracking-wider">
                        <th className="pb-3 font-extrabold">Customer</th>
                        <th className="pb-3 font-extrabold">Package</th>
                        <th className="pb-3 font-extrabold">Status</th>
                        <th className="pb-3 font-extrabold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                      {filteredOrders.map(o => (
                        <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-4 font-bold text-gray-900">
                            {o.customer?.fullName || o.customerName || 'Unknown'}
                          </td>
                          <td className="py-4 text-gray-700 font-medium">{o.product?.name || o.productName || 'Unknown'}</td>
                          <td className="py-4"><StatusBadge status={o.status} /></td>
                          <td className="py-4 text-right flex gap-2 justify-end items-center">
                            {o.status !== 'Active' && <button onClick={() => handleUpdateOrderStatus(o.id, 'Active')} className="text-emerald-700 hover:text-emerald-900 font-bold text-xs border border-emerald-300 bg-emerald-50 px-2 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-emerald-600">Activate</button>}
                            {o.status !== 'Cancelled' && <button onClick={() => handleUpdateOrderStatus(o.id, 'Cancelled')} className="text-amber-800 hover:text-amber-900 font-bold text-xs border border-amber-300 bg-amber-50 px-2 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-amber-600">Cancel</button>}
                            <button onClick={() => handleDeleteOrder(o.id)} aria-label="Delete Order" className="text-gray-400 hover:text-red-700 font-extrabold ml-2 text-lg focus:outline-none px-2 focus:text-red-700">&times;</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;