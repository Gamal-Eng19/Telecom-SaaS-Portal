import { useState, useEffect } from 'react';

function App() {
  // ================= STATES =================
  // --- Data States ---
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // --- Customers Pagination & Search ---
  const [customerPage, setCustomerPage] = useState(1);
  const [customerSearch, setCustomerSearch] = useState('');
  const [searchInput, setSearchInput] = useState(''); 
  const [customerTotalPages, setCustomerTotalPages] = useState(1);

  // --- Form States ---
  const [customerForm, setCustomerForm] = useState({ id: null, fullName: '', phoneNumber: '', nationalId: '', email: '', address: '', type: 0 });
  const [productForm, setProductForm] = useState({ id: null, name: '', description: '', price: '', category: '' });
  const [orderForm, setOrderForm] = useState({ customerId: '', productId: '' });

  // ================= FETCH DATA =================
  const fetchCustomers = () => {
    // ⚠️ التعديل هنا: استخدام encodeURIComponent ⚠️
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
    fetch('http://localhost:5000/api/Orders').then(res => res.json()).then(setOrders).catch(console.error);
  };

  useEffect(() => {
    fetchCustomers();
  }, [customerPage, customerSearch]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // ================= CUSTOMERS CRUD =================
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCustomerPage(1); 
    setCustomerSearch(searchInput);
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    const isEdit = customerForm.id !== null;
    const url = isEdit ? `http://localhost:5000/api/Customers/${customerForm.id}` : 'http://localhost:5000/api/Customers';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = { 
      fullName: customerForm.fullName, 
      phoneNumber: customerForm.phoneNumber, 
      nationalId: customerForm.nationalId, 
      email: customerForm.email,
      address: customerForm.address,
      type: parseInt(customerForm.type) 
    };

    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        fetchCustomers();
        setCustomerForm({ id: null, fullName: '', phoneNumber: '', nationalId: '', email: '', address: '', type: 0 });
      }).catch(err => alert("Error saving customer: " + err.message));
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('هل أنت متأكد من مسح هذا العميل؟ (Soft Delete)')) {
      fetch(`http://localhost:5000/api/Customers/${id}`, { method: 'DELETE' })
        .then(() => fetchCustomers()).catch(err => alert("Error deleting: " + err));
    }
  };

  // ================= PRODUCTS CRUD =================
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const isEdit = productForm.id !== null;
    const url = isEdit ? `http://localhost:5000/api/Products/${productForm.id}` : 'http://localhost:5000/api/Products';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = { name: productForm.name, description: productForm.description, price: parseFloat(productForm.price) || 0, category: productForm.category };

    fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        fetchProducts();
        setProductForm({ id: null, name: '', description: '', price: '', category: '' });
      }).catch(err => alert("Error saving product: " + err.message));
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('هل أنت متأكد من مسح هذه الباقة؟')) {
      fetch(`http://localhost:5000/api/Products/${id}`, { method: 'DELETE' })
        .then(() => fetchProducts()).catch(err => alert("Error deleting: " + err));
    }
  };

  // ================= ORDERS CRUD =================
  const handleCreateOrder = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/Orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId: parseInt(orderForm.customerId), productId: parseInt(orderForm.productId) })
    }).then(() => {
      fetchOrders();
      setOrderForm({ customerId: '', productId: '' });
    }).catch(err => alert("Error creating order: " + err));
  };

  const handleUpdateOrderStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/Orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).then(() => fetchOrders()).catch(err => alert("Error updating status: " + err));
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm('هل أنت متأكد من مسح هذا الطلب؟')) {
      fetch(`http://localhost:5000/api/Orders/${id}`, { method: 'DELETE' })
        .then(() => fetchOrders()).catch(err => alert("Error deleting: " + err));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>Telecom SaaS - Admin Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '20px' }}>
        
        {/* ================= CUSTOMERS SECTION ================= */}
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h3>👥 Customers</h3>
          
          {/* فورمة البحث */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
            <input 
              placeholder="Search by name, email, phone..." 
              value={searchInput} 
              onChange={e => setSearchInput(e.target.value)} 
              style={{ flex: 1, padding: '5px' }}
            />
            <button type="submit" style={{ padding: '5px 10px', cursor: 'pointer' }}>Search</button>
            {customerSearch && (
              <button type="button" onClick={() => { setSearchInput(''); setCustomerSearch(''); setCustomerPage(1); }} style={{ padding: '5px', cursor: 'pointer' }}>Clear</button>
            )}
          </form>

          {/* فورمة الإضافة / التعديل */}
          <form onSubmit={handleSaveCustomer} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input required placeholder="Full Name" value={customerForm.fullName} onChange={e => setCustomerForm({ ...customerForm, fullName: e.target.value })} />
            <input required placeholder="Phone Number" value={customerForm.phoneNumber} onChange={e => setCustomerForm({ ...customerForm, phoneNumber: e.target.value })} />
            {!customerForm.id && <input required placeholder="National ID" value={customerForm.nationalId} onChange={e => setCustomerForm({ ...customerForm, nationalId: e.target.value })} />}
            <input required type="email" placeholder="Email Address" value={customerForm.email} onChange={e => setCustomerForm({ ...customerForm, email: e.target.value })} />
            <input placeholder="Address (Optional)" value={customerForm.address} onChange={e => setCustomerForm({ ...customerForm, address: e.target.value })} />
            
            <select value={customerForm.type} onChange={e => setCustomerForm({ ...customerForm, type: e.target.value })}>
              <option value={0}>Regular</option>
              <option value={1}>VIP</option>
              <option value={2}>Corporate</option>
            </select>

            <button type="submit" style={{ backgroundColor: customerForm.id ? '#ffc107' : '#007bff', color: customerForm.id ? 'black' : 'white', padding: '8px', cursor: 'pointer' }}>
              {customerForm.id ? 'Update Customer' : 'Add Customer'}
            </button>
            {customerForm.id && <button type="button" onClick={() => setCustomerForm({ id: null, fullName: '', phoneNumber: '', nationalId: '', email: '', address: '', type: 0 })} style={{ padding: '5px' }}>Cancel Edit</button>}
          </form>

          <hr />
          
          {/* عرض العملاء */}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {customers.map(c => (
              <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                <div>
                  <strong>{c.id} - {c.fullName}</strong>
                  <div style={{ fontSize: '12px', color: '#555' }}>
                    {c.email} | {c.type === 1 ? '🌟 VIP' : c.type === 2 ? '🏢 Corp' : '👤 Regular'}
                  </div>
                </div>
                <div>
                  <button onClick={() => setCustomerForm({ ...c, type: c.type || 0 })} style={{ marginRight: '5px', backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '3px 8px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeleteCustomer(c.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '3px 8px', cursor: 'pointer' }}>X</button>
                </div>
              </li>
            ))}
            {customers.length === 0 && <p style={{ textAlign: 'center', fontSize: '14px' }}>No customers found.</p>}
          </ul>

          {/* أزرار الصفحات */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <button disabled={customerPage === 1} onClick={() => setCustomerPage(p => p - 1)} style={{ cursor: 'pointer', padding: '5px' }}>Previous</button>
            <span style={{ fontSize: '14px' }}>Page {customerPage} of {customerTotalPages}</span>
            <button disabled={customerPage === customerTotalPages || customerTotalPages === 0} onClick={() => setCustomerPage(p => p + 1)} style={{ cursor: 'pointer', padding: '5px' }}>Next</button>
          </div>
        </div>

        {/* ================= PRODUCTS SECTION ================= */}
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h3>📦 Products & Packages</h3>
          <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input required placeholder="Package Name" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} />
            <input required placeholder="Description" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
            <input required type="number" placeholder="Price" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
            <input required placeholder="Category" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} />
            <button type="submit" style={{ backgroundColor: productForm.id ? '#ffc107' : '#28a745', color: productForm.id ? 'black' : 'white', padding: '8px', cursor: 'pointer' }}>
              {productForm.id ? 'Update Product' : 'Add Product'}
            </button>
            {productForm.id && <button type="button" onClick={() => setProductForm({ id: null, name: '', description: '', price: '', category: '' })} style={{ padding: '5px' }}>Cancel Edit</button>}
          </form>

          <hr />
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {products.map(p => (
              <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                <span>{p.name} (${p.price})</span>
                <div>
                  <button onClick={() => setProductForm(p)} style={{ marginRight: '5px', backgroundColor: '#17a2b8', color: 'white', border: 'none', padding: '3px 8px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDeleteProduct(p.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '3px 8px', cursor: 'pointer' }}>X</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ================= ORDERS SECTION ================= */}
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h3>🛒 Orders</h3>
          <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <select required value={orderForm.customerId} onChange={e => setOrderForm({ ...orderForm, customerId: e.target.value })}>
              <option value="">-- Select Customer --</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
            </select>
            <select required value={orderForm.productId} onChange={e => setOrderForm({ ...orderForm, productId: e.target.value })}>
              <option value="">-- Select Package --</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <button type="submit" style={{ backgroundColor: '#ffc107', color: 'black', padding: '8px', cursor: 'pointer' }}>Create Order</button>
          </form>

          <hr />
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {orders.map(o => (
              <li key={o.id} style={{ marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Order #{o.id} | {o.status}</span>
                  <button onClick={() => handleDeleteOrder(o.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '3px 8px', cursor: 'pointer' }}>X</button>
                </div>
                <div>
                  <button onClick={() => handleUpdateOrderStatus(o.id, 'Active')} style={{ marginRight: '5px', fontSize: '12px' }}>Mark Active</button>
                  <button onClick={() => handleUpdateOrderStatus(o.id, 'Cancelled')} style={{ fontSize: '12px' }}>Cancel Order</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default App;