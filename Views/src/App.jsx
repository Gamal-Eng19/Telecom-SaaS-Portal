import { useState, useEffect } from 'react';

function App() {
  // ================= 1. AUTH & NAVIGATION STATES =================
  const [auth, setAuth] = useState({ isAuthenticated: false, role: '', email: '' });
  const [authMode, setAuthMode] = useState('signin'); 
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [forgotForm, setForgotForm] = useState({ email: '' });

  const [activeTab, setActiveTab] = useState('overview'); 
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [customerView, setCustomerView] = useState('dashboard'); 
  const [settingsForm, setSettingsForm] = useState({ fullName: '', phoneNumber: '', address: '', newPassword: '' });
  
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });
  const [openFaq, setOpenFaq] = useState(null); 

  const [packageSearch, setPackageSearch] = useState('');
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'alert', message: '', status: 'success', onConfirm: null });

  // ⚠️ State للتحكم في نافذة الرد على التذاكر للأدمن
  const [respondModal, setRespondModal] = useState({ isOpen: false, ticket: null, responseText: '' });

  // ================= 2. DATA STATES =================
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0); 
  const [auditLogs, setAuditLogs] = useState([]);
  
  // ⚠️ State للتذاكر
  const [supportTickets, setSupportTickets] = useState([]);

  const [auditFilter, setAuditFilter] = useState('All');
  const [showAuditFilterMenu, setShowAuditFilterMenu] = useState(false);

  const [customerPage, setCustomerPage] = useState(1);
  const [customerSearch, setCustomerSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [customerTotalPages, setCustomerTotalPages] = useState(1);
  const [orderSearchInput, setOrderSearchInput] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const [customerForm, setCustomerForm] = useState({ id: null, fullName: '', phoneNumber: '', nationalId: '', email: '', address: '', type: 0, balance: 0 });
  const [productForm, setProductForm] = useState({ id: null, name: '', description: '', price: '', category: 'Internet' });
  const [orderForm, setOrderForm] = useState({ customerId: '', productId: '' });

  // ================= HELPER: CUSTOM MODALS =================
  const showAlert = (message, status = 'success') => setModalConfig({ isOpen: true, type: 'alert', message, status, onConfirm: null });
  const showConfirm = (message, onConfirm) => setModalConfig({ isOpen: true, type: 'confirm', message, status: 'info', onConfirm });
  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

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
    fetch('http://localhost:5000/api/Orders', { cache: 'no-store' }).then(res => res.json()).then(setOrders).catch(console.error);
  };

  const fetchAuditLogs = () => {
    fetch('http://localhost:5000/api/AuditLogs', { cache: 'no-store' }).then(res => res.json()).then(setAuditLogs).catch(console.error);
  };

  const fetchSupportTickets = () => {
    fetch('http://localhost:5000/api/SupportTickets', { cache: 'no-store' }).then(res => res.json()).then(setSupportTickets).catch(console.error);
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
      const current = customers.find(c => c.email.toLowerCase() === auth.email.toLowerCase());
      if (current) {
        setWalletBalance(current.balance ?? current.walletBalance ?? 0);
      }
    }
  }, [auth.isAuthenticated, customers, auth.email]);

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
    
    if (email.includes('admin')) {
      setAuth({ isAuthenticated: true, role: 'admin', email: email });
      setActiveTab('overview'); 
      logAction('Login', 'Administrator accessed the dashboard', email, 'admin');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/Customers?search=${encodeURIComponent(email)}`);
      const result = await response.json();
      const existingCustomer = (result.data || []).find(c => c.email.toLowerCase() === email);
      
      if (!existingCustomer) {
        showAlert("❌ Account not found! Please check your email or contact support.", 'error');
        logAction('Failed Login', `Attempted login for unregistered email: ${email}`, email, 'guest');
        return;
      }

      setAuth({ isAuthenticated: true, role: 'customer', email: email });
      setCustomerView('dashboard'); 
      logAction('Login', 'Customer signed in to portal', email, 'customer');

    } catch (err) {
      showAlert("Error connecting to server. Please try again.", 'error');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    showAlert(`📩 A password reset link has been sent to ${forgotForm.email}. Please check your inbox.`, 'success');
    logAction('Password Reset', `Password reset requested for: ${forgotForm.email}`, forgotForm.email, 'guest');
    setAuthMode('signin');
    setForgotForm({ email: '' });
  };

  const handleLogout = () => {
    logAction('Logout', 'User signed out', auth.email, auth.role);
    setAuth({ isAuthenticated: false, role: '', email: '' });
    setLoginForm({ email: '', password: '' });
    setAuthMode('signin');
    setShowProfileMenu(false);
    setShowAuditFilterMenu(false);
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
        logAction(isEdit ? 'Update Customer' : 'Add Customer', `Processed customer: ${payload.fullName} (Balance: ${payload.balance})`);
        setCustomerForm({ id: null, fullName: '', phoneNumber: '', nationalId: '', email: '', address: '', type: 0, balance: 0 });
      });
  };

  const handleDeleteCustomer = (id) => {
    const cust = customers.find(c => c.id === id);
    showConfirm('Are you sure you want to delete this customer?', () => {
      fetch(`http://localhost:5000/api/Customers/${id}`, { method: 'DELETE' }).then(() => {
        fetchCustomers();
        logAction('Delete Customer', `Removed customer: ${cust ? cust.fullName : id}`);
      });
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
      });
  };

  const handleDeleteProduct = (id) => {
    const prod = products.find(p => p.id === id);
    showConfirm('Are you sure you want to delete this package?', () => {
      fetch(`http://localhost:5000/api/Products/${id}`, { method: 'DELETE' }).then(() => {
        fetchProducts();
        logAction('Delete Package', `Removed package: ${prod ? prod.name : id}`);
      });
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
      showAlert('Order created successfully!', 'success');
    });
  };

  const handleUpdateOrderStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/Orders/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus })
    }).then(() => {
      fetchOrders();
      logAction('Update Order', `Changed order #${id} status to ${newStatus}`);
    });
  };

  const handleDeleteOrder = (id) => {
    showConfirm('Are you sure you want to delete this order?', () => {
      fetch(`http://localhost:5000/api/Orders/${id}`, { method: 'DELETE' }).then(() => {
        fetchOrders();
        logAction('Delete Order', `Removed order #${id}`);
      });
    });
  };

  const handleAdminRespondToTicket = (e) => {
    e.preventDefault();
    const ticketId = respondModal.ticket.id;
    
    fetch(`http://localhost:5000/api/SupportTickets/${ticketId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: respondModal.responseText })
    }).then(() => {
      fetchSupportTickets();
      logAction('Resolved Ticket', `Admin replied to ticket #${ticketId}`);
      setRespondModal({ isOpen: false, ticket: null, responseText: '' });
      showAlert('✅ Response sent successfully. An email has been dispatched to the customer.', 'success');
    }).catch(err => showAlert("Error sending response: " + err.message, 'error'));
  };

  // ================= UI COMPONENTS =================
  const StatusBadge = ({ status }) => {
    let color = "bg-gray-100 text-gray-800 border-gray-300";
    let dot = "bg-gray-600";
    if (status === 'Active' || status === 'Resolved') { color = "bg-emerald-50 text-emerald-800 border-emerald-300"; dot = "bg-emerald-600"; }
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
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { if(auth.role === 'customer') setCustomerView('dashboard'); }}>
          <div className="w-10 h-10 bg-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">M</div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight m-0 hover:text-indigo-700 transition">Masar Telecom</h1>
            <p className="text-xs text-gray-600 font-bold tracking-wider m-0">CRM PORTAL</p>
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
              onClick={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); setShowAuditFilterMenu(false); }}
              className="w-9 h-9 bg-indigo-700 rounded-full flex items-center justify-center text-white font-bold shadow-sm shrink-0 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition cursor-pointer"
            >
              {auth.email.charAt(0).toUpperCase()}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-5 border-b border-gray-100 bg-gray-50">
                  <h4 className="font-bold text-gray-900 capitalize text-lg m-0">
                    {auth.role === 'admin' ? 'Administrator' : (currentCustomer ? currentCustomer.fullName : auth.email.split('@')[0])}
                  </h4>
                  <p className="text-sm text-gray-500 m-0 truncate">{auth.email}</p>
                </div>
                
                {auth.role === 'customer' ? (
                  <div className="p-5 space-y-4 text-sm font-medium">
                    <div className="flex justify-between border-b border-gray-100 pb-3">
                      <span className="text-gray-500">Customer ID</span>
                      <span className="font-bold text-gray-900">MSR-{myCustomerId.toString().padStart(4, '0')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Member since</span>
                      <span className="font-bold text-gray-900">Active</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 text-sm font-medium text-gray-600 text-center">
                    <p>System Super Admin Access</p>
                  </div>
                )}
                
                {auth.role === 'customer' && (
                  <div className="p-2 border-t border-gray-100">
                    <button 
                      onClick={() => { 
                        setSettingsForm({ fullName: currentCustomer.fullName, phoneNumber: currentCustomer.phoneNumber || '', address: currentCustomer.address || '', newPassword: '' });
                        setCustomerView('profile'); 
                        setShowProfileMenu(false); 
                      }} 
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      My Profile
                    </button>
                    <button 
                      onClick={() => { setCustomerView('support'); setShowProfileMenu(false); }} 
                      className="w-full flex items-center gap-3 px-3 py-2 mt-1 text-sm font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      Help & Support
                    </button>
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

  // ---------------- VIEW A: LOGIN / FORGOT PASSWORD ----------------
  if (!auth.isAuthenticated) {
    return (
      <div className="absolute inset-0 w-screen min-h-screen flex bg-gray-50 font-sans text-left overflow-x-hidden m-0 p-0">
        <div className="hidden md:flex w-1/2 flex-col justify-center px-12 lg:px-20 text-left bg-white h-full relative">
          <div className="flex items-center gap-3 mb-10 relative z-10">
            <div className="w-12 h-12 bg-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">M</div>
            <div>
              <h1 className="font-bold text-2xl text-gray-900 leading-tight m-0">Masar Telecom</h1>
              <p className="text-sm text-gray-600 font-bold tracking-wider m-0">CRM SYSTEM</p>
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
                  <p className="text-sm font-medium text-gray-600">If you don't have an account, please contact your administrator.</p>
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

    const handleCustomerSubscribe = (productId) => {
      if (myCustomerId === 0) {
        showAlert("System syncing... Please wait a second and try again.", 'error');
        return;
      }
      
      const selectedProduct = products.find(p => p.id === productId);
      if (!selectedProduct) return;

      if (walletBalance < selectedProduct.price) {
        showAlert(`⚠️ رصيدك مش كفاية يا هندسة!\nرصيدك: ${walletBalance.toFixed(2)} EGP\nسعر الباقة: ${selectedProduct.price} EGP.`, 'error');
        logAction('Subscription Failed', `Failed to subscribe to ${selectedProduct.name} due to insufficient balance.`);
        return;
      }

      showConfirm(`Are you sure you want to subscribe to ${selectedProduct.name} for ${selectedProduct.price} EGP?`, async () => {
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
            .then(data => setOrders(data))
            .catch(console.error);

          logAction('Subscribe', `Subscribed to ${selectedProduct.name}. Deducted: ${selectedProduct.price} EGP`);
          showAlert(`✅ تم الاشتراك بنجاح في ${selectedProduct.name}!\nاتخصم ${selectedProduct.price} جنيه من رصيدك.`, 'success');
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
        email: currentCustomer.email, 
        type: currentCustomer.type || 0,
        balance: currentCustomer.balance || 0
      };

      fetch(`http://localhost:5000/api/Customers/${myCustomerId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      }).then(() => {
        fetchCustomers();
        logAction('Update Profile', `Customer updated their profile settings.`);
        if(settingsForm.newPassword) {
          showAlert('✅ Profile info updated successfully!\n\n⚠️ ملحوظة: عشان الباسورد يتحدث بجد محتاجين نضيف مسار خاص بيه في الباك إند.', 'success');
        } else {
          showAlert('✅ Profile info updated successfully!', 'success');
        }
      }).catch(err => showAlert("Error updating profile: " + err.message, 'error'));
    };

    // ✅ التعديل الجذري: إرسال التذكرة للباك إند بجد بدل مجرد تسجيلها في اللوج
    const handleSupportSubmit = (e) => {
      e.preventDefault();
      
      const payload = {
        customerId: myCustomerId,
        customerName: currentCustomer.fullName,
        customerEmail: currentCustomer.email,
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
        fetchSupportTickets(); // بنعمل ريفريش للتذاكر عشان تظهر للأدمن فوراً
        logAction('Support Ticket', `Submitted support ticket: ${supportForm.subject}`);
        showAlert('✅ Your support ticket has been submitted successfully.\nOur technical team will review it and contact you soon!', 'success');
        setSupportForm({ subject: '', message: '' });
      })
      .catch(err => showAlert("Error sending ticket: " + err.message, 'error'));
    };

    const displayOrders = orders.filter(o => {
      if (String(o.status || '').toLowerCase() === 'cancelled') return false;
      const matchesId = Number(o.customerId) === Number(myCustomerId);
      const matchesName = currentCustomer && String(o.customerName || '').toLowerCase().trim() === String(currentCustomer.fullName).toLowerCase().trim();
      const matchesEmail = String(o.customer?.email || '').toLowerCase().trim() === String(auth.email).toLowerCase().trim();
      const matchesAuthName = String(o.customerName || '').toLowerCase().trim() === String(auth.email.split('@')[0]).toLowerCase().trim();
      return matchesId || matchesName || matchesEmail || matchesAuthName;
    });

    const filteredPackages = products.filter(p => {
      if (!packageSearch) return true;
      const term = packageSearch.toLowerCase();
      return p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term);
    });

    const faqs = [
      { id: 1, question: "How can I recharge my wallet balance?", answer: "You can recharge your balance through our mobile app, using your credit/debit card, or by visiting any of our authorized retail branches across the country." },
      { id: 2, question: "Can I subscribe to multiple packages at once?", answer: "Yes! You can mix and match any Internet and Voice packages according to your needs. The cost will be deducted from your total wallet balance." },
      { id: 3, question: "What happens when my package quota runs out?", answer: "Once your quota is fully consumed, your service will pause to prevent extra charges. You can easily renew your package early from the 'All Packages' page." },
      { id: 4, question: "How do I update my account password?", answer: "You can update your password by navigating to the 'My Profile' section from the top right menu, entering your new password, and saving the changes." }
    ];

    return (
      <div className="absolute inset-0 w-screen min-h-screen bg-gray-50 font-sans text-left flex flex-col overflow-x-hidden m-0 p-0">
        <Navbar />
        
        <div className="bg-indigo-900 text-indigo-50 px-4 sm:px-8 py-3 flex justify-between items-center text-sm w-full relative z-10 shadow-md">
           <span className="font-medium">Welcome back, <span className="font-bold capitalize text-white">{currentCustomer ? currentCustomer.fullName.split(' ')[0] : auth.email.split('@')[0]}</span>!</span>
           <span className="font-medium text-indigo-200">Wallet Balance: <span className="text-emerald-400 font-extrabold ml-1 tracking-wide">{walletBalance.toFixed(2)} EGP</span></span>
        </div>
        
        <div className="relative w-full flex-1" onClick={() => setShowProfileMenu(false)}>
          <div className="bg-indigo-700 h-40 w-full absolute top-0 left-0 z-0"></div>
          
          {/* ================= الداش بورد الأساسية ================= */}
          {customerView === 'dashboard' && (
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col lg:flex-row gap-6 pb-12 animate-fade-in">
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
                    <button onClick={() => setCustomerView('packages')} className="text-sm font-bold text-indigo-700 hover:text-indigo-900 hover:underline cursor-pointer focus:outline-none transition">
                      See All Packages →
                    </button>
                  </div>
                  
                  <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory hide-scrollbar">
                    {products.slice(0, 4).map(p => (
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
          )}

          {/* ================= صفحة البروفايل ================= */}
          {customerView === 'profile' && (
            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 animate-fade-in">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-extrabold text-white m-0">My Profile</h2>
                <button onClick={() => setCustomerView('dashboard')} className="text-sm font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-transparent px-4 py-2.5 rounded-lg shadow-sm transition">
                  ← Back to Dashboard
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-widest mb-2">Current Wallet Balance</h3>
                    <div className="text-5xl font-extrabold text-gray-900">{walletBalance.toFixed(2)} <span className="text-xl text-gray-500 font-medium">EGP</span></div>
                  </div>
                  <div className="hidden sm:flex w-20 h-20 bg-emerald-50 rounded-full items-center justify-center text-emerald-600 border border-emerald-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 text-left">
                  <div className="mb-6 border-b border-gray-100 pb-4">
                     <h3 className="text-xl font-extrabold text-gray-900">Personal Information</h3>
                     <p className="text-sm text-gray-500 font-medium mt-1">Update your contact details and account security.</p>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1">Full Name</label>
                        <input required type="text" value={settingsForm.fullName} onChange={e => setSettingsForm({...settingsForm, fullName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1">Email <span className="text-gray-400 font-normal">(Read Only)</span></label>
                        <input type="text" value={currentCustomer?.email || ''} disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium cursor-not-allowed" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1">Phone Number</label>
                        <input required type="text" value={settingsForm.phoneNumber} onChange={e => setSettingsForm({...settingsForm, phoneNumber: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium transition" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1">Address</label>
                        <input type="text" value={settingsForm.address} onChange={e => setSettingsForm({...settingsForm, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium transition" placeholder="City, Street" />
                      </div>
                    </div>

                    <div className="pt-8 mt-4 border-t border-gray-100">
                      <h4 className="text-sm font-extrabold text-indigo-700 mb-4 uppercase tracking-wider">Security Settings</h4>
                      <div className="w-full sm:w-1/2">
                        <label className="block text-sm font-bold text-gray-800 mb-1">New Password</label>
                        <input type="password" value={settingsForm.newPassword} onChange={e => setSettingsForm({...settingsForm, newPassword: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium transition" placeholder="Leave blank to keep current" />
                        <p className="text-xs text-gray-500 mt-2 font-medium">To change your password, simply type a new one above.</p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100 mt-8">
                      <button type="submit" className="px-8 py-3.5 text-sm font-bold text-white bg-indigo-700 rounded-xl hover:bg-indigo-800 transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ================= صفحة كل الباقات ================= */}
          {customerView === 'packages' && (
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 animate-fade-in">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-white m-0">All Packages</h2>
                  <p className="text-indigo-100 font-medium mt-1">Browse and find the best plan for your needs.</p>
                </div>
                <button onClick={() => setCustomerView('dashboard')} className="text-sm font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-transparent px-4 py-2.5 rounded-lg shadow-sm transition">
                  ← Back to Dashboard
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 mb-8 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search packages by name or category (e.g. Internet, Mobile)..." 
                  className="w-full border-none outline-none text-gray-900 font-medium text-lg placeholder-gray-400 bg-transparent"
                  value={packageSearch}
                  onChange={(e) => setPackageSearch(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPackages.map(p => (
                  <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all flex flex-col h-full">
                    <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase mb-2 inline-block bg-indigo-50 w-max px-2 py-1 rounded">{p.category}</span>
                    <h4 className="font-extrabold text-gray-900 mb-2 text-xl">{p.name}</h4>
                    <p className="text-sm text-gray-600 mb-6 flex-1 font-medium">{p.description}</p>
                    <div className="text-3xl font-extrabold text-gray-900 mb-6 border-t border-gray-100 pt-4">{p.price} <span className="text-sm text-gray-500 font-medium">EGP/mo</span></div>
                    
                    <button 
                      onClick={() => handleCustomerSubscribe(p.id)} 
                      className="mt-auto w-full bg-indigo-50 text-indigo-700 hover:bg-indigo-700 hover:text-white transition py-3 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 cursor-pointer"
                    >
                      Subscribe Now
                    </button>
                  </div>
                ))}
              </div>

              {filteredPackages.length === 0 && (
                <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-dashed border-gray-300">
                  <p className="text-gray-500 text-lg font-bold">No packages found matching your search.</p>
                  <button onClick={() => setPackageSearch('')} className="mt-4 text-indigo-600 font-bold hover:underline">Clear Search</button>
                </div>
              )}
            </div>
          )}

          {/* ================= صفحة الدعم الفني ================= */}
          {customerView === 'support' && (
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 animate-fade-in">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-extrabold text-white m-0">Help & Support</h2>
                  <p className="text-indigo-100 font-medium mt-1">We're here to help you with any issues or questions.</p>
                </div>
                <button onClick={() => setCustomerView('dashboard')} className="text-sm font-bold text-indigo-700 bg-white hover:bg-indigo-50 border border-transparent px-4 py-2.5 rounded-lg shadow-sm transition">
                  ← Back to Dashboard
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                  <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Frequently Asked Questions
                    </h3>
                    
                    <div className="space-y-4">
                      {faqs.map((faq) => (
                        <div key={faq.id} className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50 hover:bg-gray-100 transition">
                          <button 
                            onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)} 
                            className="w-full text-left px-5 py-4 font-bold text-gray-800 flex justify-between items-center focus:outline-none cursor-pointer"
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

                  <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-center flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <h4 className="font-extrabold text-indigo-900 mb-1">Need immediate assistance?</h4>
                    <p className="text-sm text-indigo-700 mb-3">Our customer service team is available 24/7.</p>
                    <span className="text-2xl font-extrabold text-indigo-800 tracking-wider">16000</span>
                  </div>
                </div>

                <div className="w-full lg:w-1/2">
                  <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      Submit a Support Ticket
                    </h3>
                    <p className="text-sm text-gray-500 mb-6 font-medium">Describe your issue below and our team will get back to you directly.</p>

                    <form onSubmit={handleSupportSubmit} className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1">Issue Subject</label>
                        <select 
                          required 
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm bg-white font-medium cursor-pointer transition"
                          value={supportForm.subject}
                          onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                        >
                          <option value="">-- Select a Category --</option>
                          <option value="Billing & Payments">Billing & Payments</option>
                          <option value="Package Subscription Issue">Package Subscription Issue</option>
                          <option value="Internet Connectivity">Internet Connectivity</option>
                          <option value="Account Settings">Account Settings</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-1">Message Details</label>
                        <textarea 
                          required 
                          rows="5"
                          placeholder="Please provide as much detail as possible so we can help you faster..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium transition resize-none"
                          value={supportForm.message}
                          onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                        ></textarea>
                      </div>

                      <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 mt-2">
                        Send Ticket
                      </button>
                    </form>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Custom Modal للعميل */}
        {modalConfig.isOpen && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in" onClick={closeModal}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col text-center p-6 border border-gray-100" onClick={e => e.stopPropagation()}>
              <h3 className="font-extrabold text-gray-900 text-xl mb-3">
                {modalConfig.type === 'confirm' ? 'Confirm Action' : (modalConfig.status === 'success' ? 'Success' : 'Notice')}
              </h3>
              <p className="text-gray-600 font-medium mb-8 whitespace-pre-line leading-relaxed">{modalConfig.message}</p>
              
              <div className="flex justify-center gap-3">
                {modalConfig.type === 'confirm' && (
                  <button onClick={closeModal} className="w-full py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition focus:outline-none">
                    Cancel
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (modalConfig.onConfirm) modalConfig.onConfirm();
                    closeModal();
                  }} 
                  className={`w-full py-2.5 text-sm font-bold text-white rounded-xl transition shadow-md focus:outline-none ${modalConfig.status === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-700 hover:bg-indigo-800'}`}
                >
                  {modalConfig.type === 'confirm' ? 'Yes, Proceed' : 'OK'}
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
    const colorMap = { indigo: 'bg-indigo-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500', blue: 'bg-blue-500' };
    const lightColorMap = { indigo: 'bg-indigo-100', emerald: 'bg-emerald-100', amber: 'bg-amber-100', blue: 'bg-blue-100' };
    
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-40 text-left w-full relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start mb-2 z-10">
          <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">{title}</span>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">{trend}</span>
        </div>
        <span className="text-4xl font-extrabold text-gray-900 z-10">{value}</span>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end gap-1 px-6 pb-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          {dataPoints.map((height, i) => (
            <div key={i} className={`flex-1 rounded-t-sm ${i === dataPoints.length - 1 ? colorMap[color] : lightColorMap[color]}`} style={{ height: `${height}%` }}></div>
          ))}
        </div>
      </div>
    );
  };

  const filteredOrders = orders.filter(o => {
    if (!orderSearch) return true;
    const searchLower = orderSearch.trim().toLowerCase();
    const cName = (o.customer?.fullName || o.customerName || '').toLowerCase();
    const pName = (o.product?.name || o.productName || '').toLowerCase();
    return cName.includes(searchLower) || pName.includes(searchLower) || (o.status || '').toLowerCase().includes(searchLower);
  });

  const displayLogs = auditLogs.filter(log => {
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
    <div className="absolute inset-0 w-screen min-h-screen bg-gray-50 font-sans pb-10 text-left overflow-x-hidden m-0 p-0" onClick={() => { setShowProfileMenu(false); setShowAuditFilterMenu(false); }}>
      <Navbar />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 m-0">Operations Dashboard</h2>
          <p className="text-gray-600 font-medium mt-2 text-sm sm:text-base">Manage customers, packages, and telecom orders.</p>
        </div>

        {/* ⚠️ تحديث تابات الأدمن لإضافة Support Tickets */}
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-xl w-max shadow-sm border border-gray-200 overflow-x-auto max-w-full">
          {['overview', 'customers', 'packages', 'orders', 'tickets', 'audit'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-600 ${activeTab === tab ? 'bg-indigo-700 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              {tab === 'audit' ? 'Audit Logs' : tab === 'tickets' ? 'Support Tickets' : tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full animate-fade-in">
            <StatsCardWithGraph title="Customers" value={customers.length} color="indigo" trend="+12%" dataPoints={[30, 45, 40, 60, 55, 75, 100]} />
            <StatsCardWithGraph title="Packages" value={products.length} color="emerald" trend="+3%" dataPoints={[80, 80, 80, 80, 80, 100, 100]} />
            <StatsCardWithGraph title="Total Orders" value={orders.length} color="amber" trend="+18%" dataPoints={[20, 30, 45, 60, 50, 80, 95]} />
            <StatsCardWithGraph title="Active Subs" value={orders.filter(o=>o.status==='Active').length} color="blue" trend="+7%" dataPoints={[30, 40, 55, 50, 70, 85, 90]} />
          </div>
        )}

        {/* ... بقية التابات (customers, packages, orders) زي ما هي من غير تغيير ... */}
        {activeTab === 'customers' && (
          <div className="flex flex-col lg:flex-row gap-6 w-full animate-fade-in">
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
                <h3 className="font-extrabold text-gray-900 m-0 text-xl">Customers List</h3>
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
                          <button onClick={() => setCustomerForm(c)} aria-label={`Edit ${c.fullName}`} className="text-indigo-700 hover:text-indigo-900 font-bold mr-4 focus:outline-none focus:underline">Edit</button>
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
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="flex flex-col lg:flex-row gap-6 w-full animate-fade-in">
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
              <h3 className="font-extrabold text-gray-900 mb-6 m-0 text-xl">Packages Setup</h3>
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
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="flex flex-col lg:flex-row gap-6 w-full animate-fade-in">
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-max text-left">
              <h3 className="font-extrabold text-gray-900 mb-5 text-xl">Create Manual Order</h3>
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
                  Submit Order
                </button>
              </form>
            </div>

            <div className="w-full lg:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-left overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="font-extrabold text-gray-900 m-0 text-xl">Order Management</h3>
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
          </div>
        )}

        {/* ⚠️ ================= TAB 5: SUPPORT TICKETS (NEW) ================= ⚠️ */}
        {activeTab === 'tickets' && (
          <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-left overflow-visible animate-fade-in relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-extrabold text-gray-900 m-0 text-xl">Support Tickets</h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">Manage customer issues and send responses via email.</p>
              </div>
              <button onClick={fetchSupportTickets} className="text-sm font-bold text-indigo-700 hover:bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-600">
                Refresh Tickets
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200 text-xs text-gray-600 uppercase tracking-wider">
                    <th className="pb-3 font-extrabold w-32">Date</th>
                    <th className="pb-3 font-extrabold w-48">Customer</th>
                    <th className="pb-3 font-extrabold w-64">Subject</th>
                    <th className="pb-3 font-extrabold w-32">Status</th>
                    <th className="pb-3 font-extrabold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-800">
                  {supportTickets.length > 0 ? supportTickets.map(t => (
                    <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 text-gray-500 font-medium text-xs whitespace-nowrap">{t.createdAt}</td>
                      <td className="py-4">
                        <div className="font-bold text-gray-900">{t.customerName}</div>
                        <div className="text-xs text-gray-500">{t.customerEmail}</div>
                      </td>
                      <td className="py-4 font-bold text-gray-800 truncate max-w-[200px]">{t.subject}</td>
                      <td className="py-4"><StatusBadge status={t.status} /></td>
                      <td className="py-4 text-right">
                        {t.status === 'Pending' ? (
                          <button 
                            onClick={() => setRespondModal({ isOpen: true, ticket: t, responseText: '' })} 
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                          >
                            Respond
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-bold text-xs flex items-center justify-end gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Resolved
                          </span>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No support tickets found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 6: AUDIT LOGS ================= */}
        {activeTab === 'audit' && (
          <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-left overflow-visible animate-fade-in relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-extrabold text-gray-900 m-0 text-xl">System Audit Logs</h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">Track real-time activities and system events during this session.</p>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowAuditFilterMenu(!showAuditFilterMenu); }} 
                    className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      <span>Filter: <span className="text-indigo-700">{auditFilter}</span></span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform ${showAuditFilterMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showAuditFilterMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-60 overflow-y-auto">
                      <div className="p-2 flex flex-col gap-1">
                        {['All', 'Admin', 'Customer', 'Auth', 'Customers', 'Packages', 'Orders'].map(f => (
                          <button 
                            key={f} 
                            onClick={() => { setAuditFilter(f); setShowAuditFilterMenu(false); }} 
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-bold transition cursor-pointer ${auditFilter === f ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={() => {
                  fetch('http://localhost:5000/api/AuditLogs/clear', { method: 'DELETE' })
                    .then(() => setAuditLogs([]))
                    .catch(console.error);
                }} className="text-sm font-bold text-red-600 hover:text-red-800 bg-red-50 border border-red-100 px-4 py-2.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-600 whitespace-nowrap cursor-pointer">
                  Clear Logs
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200 text-xs text-gray-600 uppercase tracking-wider">
                    <th className="pb-3 font-extrabold w-48">Timestamp</th>
                    <th className="pb-3 font-extrabold w-32">User</th>
                    <th className="pb-3 font-extrabold w-24">Role</th>
                    <th className="pb-3 font-extrabold w-40">Action</th>
                    <th className="pb-3 font-extrabold">Details</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-800">
                  {displayLogs.length > 0 ? displayLogs.map(log => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 text-gray-500 font-medium text-xs whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-4 font-bold text-gray-900 truncate max-w-[150px]">{log.user.split('@')[0]}</td>
                      <td className="py-4">
                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${log.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : log.role === 'guest' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                           {log.role}
                         </span>
                      </td>
                      <td className="py-4 font-bold text-gray-800">{log.action}</td>
                      <td className="py-4 text-gray-600 font-medium truncate max-w-[300px]" title={log.details}>{log.details}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No activity matching this filter.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ⚠️ نافذة رد الأدمن على التذاكر ⚠️ */}
      {respondModal.isOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in" onClick={() => setRespondModal({ isOpen: false, ticket: null, responseText: '' })}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col text-left border border-gray-100" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-extrabold text-gray-900 text-xl m-0">Respond to Ticket</h3>
              <button onClick={() => setRespondModal({ isOpen: false, ticket: null, responseText: '' })} className="text-gray-400 hover:text-red-600 transition focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="text-xs font-bold text-indigo-700 mb-1 uppercase tracking-wider">From: {respondModal.ticket.customerName}</div>
                <h4 className="font-extrabold text-gray-900 mb-2">{respondModal.ticket.subject}</h4>
                <p className="text-sm text-gray-700 italic border-l-4 border-indigo-300 pl-3">"{respondModal.ticket.message}"</p>
              </div>

              <form onSubmit={handleAdminRespondToTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1">Your Reply (Sent via Email)</label>
                  <textarea 
                    required 
                    rows="5"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium transition resize-none"
                    placeholder="Type your response here..."
                    value={respondModal.responseText}
                    onChange={(e) => setRespondModal({...respondModal, responseText: e.target.value})}
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setRespondModal({ isOpen: false, ticket: null, responseText: '' })} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition focus:outline-none">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Send Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* الـ Custom Modal العام */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col text-center p-6 border border-gray-100" onClick={e => e.stopPropagation()}>
            <h3 className="font-extrabold text-gray-900 text-xl mb-3">
              {modalConfig.type === 'confirm' ? 'Confirm Action' : (modalConfig.status === 'success' ? 'Success' : 'Notice')}
            </h3>
            <p className="text-gray-600 font-medium mb-8 whitespace-pre-line leading-relaxed">{modalConfig.message}</p>
            
            <div className="flex justify-center gap-3">
              {modalConfig.type === 'confirm' && (
                <button onClick={closeModal} className="w-full py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition focus:outline-none">
                  Cancel
                </button>
              )}
              <button 
                onClick={() => {
                  if (modalConfig.onConfirm) modalConfig.onConfirm();
                  closeModal();
                }} 
                className={`w-full py-2.5 text-sm font-bold text-white rounded-xl transition shadow-md focus:outline-none ${modalConfig.status === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-700 hover:bg-indigo-800'}`}
              >
                {modalConfig.type === 'confirm' ? 'Yes, Proceed' : 'OK'}
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

export default App;