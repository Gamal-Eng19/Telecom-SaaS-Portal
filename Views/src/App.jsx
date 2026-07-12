import { useState, useEffect } from 'react';

function App() {
  // ================= 1. AUTH & NAVIGATION STATES =================
  const [auth, setAuth] = useState({ isAuthenticated: false, role: '', email: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [activeTab, setActiveTab] = useState('customers'); 

  // ================= 2. DATA STATES =================
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [customerPage, setCustomerPage] = useState(1);
  const [customerSearch, setCustomerSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [customerTotalPages, setCustomerTotalPages] = useState(1);
  const [orderSearchInput, setOrderSearchInput] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const [customerForm, setCustomerForm] = useState({ id: null, fullName: '', phoneNumber: '', nationalId: '', email: '', address: '', type: 0 });
  const [productForm, setProductForm] = useState({ id: null, name: '', description: '', price: '', category: 'Internet' });
  const [orderForm, setOrderForm] = useState({ customerId: '', productId: '' });

  // ================= 3. FETCH DATA =================
  const fetchCustomers = () => {
    fetch(`http://localhost:5000/api/Customers?page=${customerPage}&search=${encodeURIComponent(customerSearch)}`)
      .then(res => res.json())
      .then(result => {
        setCustomers(result.data || []);
        setCustomerTotalPages(result.totalPages || 1);
      })
      .catch(console.error);
  };

  const fetchProducts = () => {
    fetch('http://localhost:5000/api/Products').then(res => res.json()).then(setProducts).catch(console.error);
  };

  const fetchOrders = () => {
    fetch('http://localhost:5000/api/Orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchOrders();
  }, [customerPage, customerSearch]);

  // ================= 4. AUTHENTICATION =================
  const handleLogin = (e) => {
    e.preventDefault();
    const email = loginForm.email.toLowerCase().trim();
    if (email.includes('admin')) {
      setAuth({ isAuthenticated: true, role: 'admin', email: email });
    } else {
      setAuth({ isAuthenticated: true, role: 'customer', email: email });
    }
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, role: '', email: '' });
    setLoginForm({ email: '', password: '' });
  };

  // ================= 5. CRUD HANDLERS =================
  const handleSaveCustomer = (e) => {
    e.preventDefault();
    const isEdit = customerForm.id !== null;
    const url = isEdit ? `http://localhost:5000/api/Customers/${customerForm.id}` : 'http://localhost:5000/api/Customers';
    const method = isEdit ? 'PUT' : 'POST';
    const payload = { ...customerForm, type: parseInt(customerForm.type) };

    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(() => {
        fetchCustomers();
        setCustomerForm({ id: null, fullName: '', phoneNumber: '', nationalId: '', email: '', address: '', type: 0 });
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
        <span className={`w-2 h-2 rounded-full ${dot}`} aria-hidden="true"></span> {status}
      </span>
    );
  };

  const Navbar = () => (
    <nav className="relative z-20 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex justify-between items-center shadow-sm text-left w-full">
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
        <div className="w-9 h-9 bg-indigo-700 rounded-full flex items-center justify-center text-white font-bold shadow-sm shrink-0">
          {auth.email.charAt(0).toUpperCase()}
        </div>
        <button onClick={handleLogout} aria-label="Logout" className="border border-gray-300 text-gray-700 px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition">
          Logout
        </button>
      </div>
    </nav>
  );

  // ---------------- VIEW A: LOGIN ----------------
  if (!auth.isAuthenticated) {
    return (
      // ⚠️ إضافة w-screen و absolute عشان نكسر أي قيود من ملفات الـ CSS القديمة وتظبط مع الزووم
      <div className="absolute inset-0 w-screen min-h-screen flex bg-gray-50 font-sans text-left overflow-x-hidden m-0 p-0">
        <div className="hidden md:flex w-1/2 flex-col justify-center px-12 lg:px-20 text-left bg-white h-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">M</div>
            <div>
              <h1 className="font-bold text-2xl text-gray-900 leading-tight m-0">Masar Telecom</h1>
              <p className="text-sm text-gray-600 font-bold tracking-wider m-0">SAAS PLATFORM</p>
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight text-left leading-tight">Telecom, <span className="text-indigo-700">simplified.</span></h2>
          <p className="text-gray-700 text-lg mb-12 max-w-md text-left font-medium">Manage customers, packages and orders from one calm, modern workspace. Built for teams who value clarity.</p>
          <div className="flex gap-8 lg:gap-12 text-left">
            <div><p className="text-2xl font-extrabold text-gray-900 m-0">12k+</p><p className="text-sm text-gray-600 font-medium m-0">Subscribers</p></div>
            <div><p className="text-2xl font-extrabold text-gray-900 m-0">99.9%</p><p className="text-sm text-gray-600 font-medium m-0">Uptime</p></div>
            <div><p className="text-2xl font-extrabold text-gray-900 m-0">24/7</p><p className="text-sm text-gray-600 font-medium m-0">Support</p></div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 text-left bg-gray-50 h-full">
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg w-full max-w-md border border-gray-200">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Welcome back</h3>
            <p className="text-gray-600 font-medium mb-8 text-sm">Sign in to your Masar Telecom workspace.</p>
            
            <form onSubmit={handleLogin} className="space-y-5 text-left">
              <div>
                <label htmlFor="loginEmail" className="block text-sm font-bold text-gray-800 mb-1">Email</label>
                <input id="loginEmail" required type="email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition text-gray-900 font-medium" placeholder="admin@masar.eg" />
              </div>
              <div>
                <label htmlFor="loginPass" className="block text-sm font-bold text-gray-800 mb-1">Password</label>
                <input id="loginPass" required type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition text-gray-900 font-medium" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 transition">Sign in</button>
            </form>
            
            <div className="mt-6 bg-indigo-50 p-4 rounded-xl text-sm text-indigo-900 font-medium leading-relaxed border border-indigo-100">
              <span className="font-bold">Tip:</span> Use an email containing <code className="bg-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded border border-indigo-300">admin</code> for the Admin Dashboard, anything else for the Customer Portal.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- VIEW B: CUSTOMER PORTAL ----------------
  if (auth.role === 'customer') {
    const currentCustomer = customers.find(c => c.email.toLowerCase() === auth.email.toLowerCase());
    const myCustomerId = currentCustomer ? currentCustomer.id : (customers.length > 0 ? customers[0].id : 0);

    const handleCustomerSubscribe = (productId) => {
      if (myCustomerId === 0) {
        alert("Customer not found in database. Please register from Admin Dashboard first.");
        return;
      }
      fetch('http://localhost:5000/api/Orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: myCustomerId, productId: parseInt(productId) })
      }).then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        fetchOrders();
      }).catch(err => alert("Error subscribing: " + err));
    };

    const displayOrders = orders.filter(o => 
      (o.status === 'Active' || o.status === 'Pending') && 
      o.customerId === myCustomerId
    );

    return (
      // ⚠️ التعديل هنا لضمان تجاوب الشاشة بالكامل
      <div className="absolute inset-0 w-screen min-h-screen bg-gray-50 font-sans text-left flex flex-col overflow-x-hidden m-0 p-0">
        <Navbar />
        
        <div className="bg-indigo-900 text-indigo-50 px-4 sm:px-8 py-3 flex justify-between items-center text-sm w-full relative z-20 shadow-md">
           <span className="font-medium">Welcome back, <span className="font-bold capitalize text-white">{auth.email.split('@')[0]}</span>!</span>
           <span className="font-medium text-indigo-200">Wallet Balance: <span className="text-emerald-400 font-extrabold ml-1 tracking-wide">1,250.00 EGP</span></span>
        </div>
        
        <div className="relative w-full flex-1">
          <div className="bg-indigo-700 h-40 w-full absolute top-0 left-0 z-0"></div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col lg:flex-row gap-6 pb-12">
            
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl shadow-md border border-gray-200 h-max">
              <h3 className="font-extrabold text-gray-900 mb-6 m-0 text-xl">My Profile</h3>
              <div className="flex items-center gap-4 mb-8 text-left">
                <div className="w-16 h-16 bg-indigo-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-sm">
                  {auth.email.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-gray-900 capitalize m-0 truncate text-lg">{auth.email.split('@')[0]}</h4>
                  <p className="text-sm text-gray-600 font-medium m-0 truncate">{auth.email}</p>
                </div>
              </div>
              <div className="space-y-4 text-sm text-left font-medium">
                <div className="flex justify-between border-b border-gray-100 pb-3"><span className="text-gray-600">Customer ID</span><span className="font-bold text-gray-900">MSR-{myCustomerId.toString().padStart(4, '0')}</span></div>
                <div className="flex justify-between border-b border-gray-100 pb-3"><span className="text-gray-600">Plan tier</span><span className="font-bold text-indigo-700">Premium</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Member since</span><span className="font-bold text-gray-900">Jan 2024</span></div>
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
                      <button onClick={() => handleCustomerSubscribe(p.id)} className="mt-auto w-full bg-white text-indigo-700 hover:bg-indigo-700 hover:text-white transition py-2.5 rounded-lg text-sm font-bold border border-indigo-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
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
                  {displayOrders.length > 0 ? displayOrders.map(o => (
                    <div key={o.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-gray-50 flex flex-col text-left">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase">Package</span>
                        <StatusBadge status={o.status} />
                      </div>
                      <div className="text-left mb-6">
                        <h4 className="font-extrabold text-gray-900 text-xl m-0">{o.product?.name || o.productName || 'Unknown Package'}</h4>
                        <p className="text-sm text-gray-600 font-medium m-0 mt-1">Order #{o.id}</p>
                      </div>
                      <div className="flex justify-between items-end pt-4 border-t border-gray-200 mt-auto">
                        <div>
                           <span className="text-2xl font-extrabold text-gray-900">{o.product?.price || '--'}</span>
                           <span className="text-sm text-gray-600 font-medium ml-1">EGP / mo</span>
                        </div>
                        <div className="text-right">
                           <span className="block text-xs text-gray-500 font-medium m-0">Renews</span>
                           <span className="text-sm font-bold text-gray-800 m-0">Next Month</span>
                        </div>
                      </div>
                    </div>
                  )) : (
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
    // ⚠️ التعديل هنا لضمان تجاوب الشاشة بالكامل
    <div className="absolute inset-0 w-screen min-h-screen bg-gray-50 font-sans pb-10 text-left overflow-x-hidden m-0 p-0">
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
                    {!customerForm.id && (
                      <div>
                        <label htmlFor="cNatId" className="block text-sm font-bold text-gray-800 mb-1">National ID</label>
                        <input id="cNatId" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-medium" value={customerForm.nationalId} onChange={e => setCustomerForm({...customerForm, nationalId: e.target.value})} />
                      </div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="cType" className="block text-sm font-bold text-gray-800 mb-1">Type</label>
                    <select id="cType" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-600 text-sm bg-white font-medium cursor-pointer" value={customerForm.type} onChange={e => setCustomerForm({...customerForm, type: e.target.value})}>
                      <option value={0}>Individual</option>
                      <option value={1}>VIP</option>
                      <option value={2}>Business</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-3 rounded-lg text-sm font-bold shadow-md transition mt-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                    {customerForm.id ? 'Update Customer' : 'Add customer'}
                  </button>
                  {customerForm.id && <button type="button" onClick={() => setCustomerForm({ id: null, fullName: '', phoneNumber: '', nationalId: '', email: '', address: '', type: 0 })} className="w-full text-gray-600 py-3 text-sm font-bold hover:bg-gray-100 rounded-lg focus:outline-none mt-2 transition">Cancel</button>}
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
                        <th className="pb-3 font-extrabold">Type</th>
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
                          <td className="py-4">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs font-bold whitespace-nowrap">
                              {c.type === 1 ? 'VIP' : c.type === 2 ? 'Business' : 'Individual'}
                            </span>
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