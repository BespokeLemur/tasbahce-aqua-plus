import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Coffee, Utensils, Moon, CheckCircle2, Play, 
  Trash2, Plus, Edit2, TrendingUp, DollarSign, ShoppingBag, 
  ChevronRight, Lock, Printer, Bell, Check, AlertTriangle, RefreshCw
} from 'lucide-react';

// Web Audio API Sound Synthesizer Helper
const playSynthSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'bell') {
      // Waiter notification chime (High-low bell)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc1.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(554, ctx.currentTime + 0.15); // C#5
      osc2.frequency.exponentialRampToValueAtTime(277, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc1.stop(ctx.currentTime + 0.15);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.5);
    } else if (type === 'printer') {
      // Dot matrix printer screech simulator
      const playScreech = (time, duration, freq1, freq2) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq1, time);
        osc.frequency.linearRampToValueAtTime(freq2, time + duration);
        gain.gain.setValueAtTime(0.02, time);
        gain.gain.linearRampToValueAtTime(0.001, time + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + duration);
      };

      // Play a sequence of short printer lines
      let startTime = ctx.currentTime;
      for (let i = 0; i < 6; i++) {
        playScreech(startTime, 0.08, 1200 + (i * 100), 800);
        startTime += 0.12;
      }
    }
  } catch (error) {
    console.error('AudioContext synth error:', error);
  }
};

export default function Admin({ 
  menuItems, setMenuItems, 
  orders, setOrders, 
  users, setUsers, 
  currentUser, setCurrentUser 
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Local UI States
  const [adminTab, setAdminTab] = useState('siparisler');
  const [selectedTable, setSelectedTable] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  
  // Kitchen / Nargile local order printer states
  const [activePrintSlip, setActivePrintSlip] = useState(null);

  // Custom Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Monitor orders to trigger notification for waiter
  const prevOrdersRef = useRef(orders);

  useEffect(() => {
    // Check if any order transition to 'hazirlandi' occurred (for Waiter notification)
    if (currentUser && currentUser.role === 'garson') {
      const prevOrders = prevOrdersRef.current;
      const currentOrders = orders;

      currentOrders.forEach(order => {
        const prevOrder = prevOrders.find(o => o.id === order.id);
        
        // If order was preparing/pending and now is prepared
        if (order.status === 'hazirlandi' && (!prevOrder || prevOrder.status !== 'hazirlandi')) {
          setToastMessage(`Bildirim: ${order.tableName} siparişi hazırlandı!`);
          playSynthSound('bell');
          setTimeout(() => setToastMessage(null), 6000);
        }
      });
    }

    // Check if new order arrived for Kitchen/Nargile to play printer sound
    if (currentUser && (currentUser.role === 'mutfak' || currentUser.role === 'nargile')) {
      const prevOrders = prevOrdersRef.current;
      const currentOrders = orders;

      // Detect newly created orders
      const newOrders = currentOrders.filter(co => !prevOrders.find(po => po.id === co.id));
      
      // Filter based on role category
      const isRelevantRole = (itemCat) => {
        if (currentUser.role === 'nargile') return itemCat === 'nargile';
        return itemCat !== 'nargile'; // Kitchen sees food, drinks, desserts
      };

      const hasRelevantNewOrder = newOrders.some(order => 
        order.items.some(item => isRelevantRole(item.category))
      );

      if (hasRelevantNewOrder) {
        const latestOrder = newOrders[newOrders.length - 1];
        setActivePrintSlip(latestOrder);
        playSynthSound('printer');
        setTimeout(() => setActivePrintSlip(null), 8000);
      }
    }

    prevOrdersRef.current = orders;
  }, [orders, currentUser]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      sessionStorage.setItem('active_user', JSON.stringify(user));
      setLoginError('');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Hatalı kullanıcı adı veya şifre!');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('active_user');
  };

  // Helper: Get active orders count
  const activeOrdersCount = orders.filter(o => o.status !== 'tamamlandi').length;

  return (
    <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '24px' }}>
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="glass-card animate-scale-in" style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          background: 'var(--primary-dark)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          borderLeft: '5px solid var(--accent)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Bell className="animate-spin-slow" style={{ animationDuration: '3s', color: 'var(--accent)' }} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>Sipariş Durumu</strong>
            <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* LOGIN SCREEN */}
      {!currentUser ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          padding: '20px'
        }}>
          <div className="glass-card animate-scale-in" style={{
            width: '100%',
            maxWidth: '400px',
            padding: '40px 30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'var(--accent-light)',
                color: 'var(--primary)',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Lock size={28} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Personel Giriş Paneli</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Taşbahçe Aqua Plus sipariş otomasyon sistemine erişim için giriş yapın.
              </p>
            </div>

            {loginError && (
              <div style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertTriangle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Kullanıcı Adı</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-glass)',
                    background: 'white',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Kullanıcı adı girin"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Şifre</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-glass)',
                    background: 'white',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                  placeholder="••••••"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '10px' }}>
                Giriş Yap
              </button>
            </form>

            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              lineHeight: '1.5',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-glass)'
            }}>
              <strong>Demo Giriş Bilgileri:</strong><br />
              Yönetici: admin / 123<br />
              Garson: garson / 123<br />
              Kafe Mutfak: mutfak / 123<br />
              Nargile: nargile / 123
            </div>
          </div>
        </div>
      ) : (
        /* LOGGED IN USER INTERFACE */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top Info Bar */}
          <div className="glass-card" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Sistem Yetkisi: {currentUser.role === 'admin' ? 'Yönetici' : currentUser.role === 'garson' ? 'Garson' : currentUser.role === 'mutfak' ? 'Kafe / Mutfak' : 'Nargile Kafe'}
              </span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', fontWeight: 700 }}>
                {currentUser.name}
              </h3>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                onClick={() => {
                  setOrders([...orders]); // Trigger local force state sync
                  setToastMessage("Siparişler başarıyla güncellendi.");
                  setTimeout(() => setToastMessage(null), 2000);
                }}
                className="btn btn-secondary" 
                style={{ padding: '8px 16px', borderRadius: '30px', display: 'flex', gap: '6px', fontSize: '0.85rem' }}
                title="Tüm ekranları yenile"
              >
                <RefreshCw size={14} /> Senkronize Et
              </button>
              <button onClick={handleLogout} className="btn btn-primary" style={{ padding: '8px 20px', borderRadius: '30px', fontSize: '0.85rem' }}>
                Oturumu Kapat
              </button>
            </div>
          </div>

          {/* Virtual Printer Alert Area */}
          {activePrintSlip && (
            <div className="animate-scale-in" style={{
              background: '#fff9c4',
              border: '2px dashed #fbc02d',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxWidth: '360px',
              margin: '0 auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f57f17' }}>
                <Printer size={20} className="animate-spin-slow" style={{ animationDuration: '5s' }} />
                <strong style={{ fontSize: '0.9rem' }}>YAZICI ÇIKTISI (Simüle Ediliyor...)</strong>
              </div>
              
              <div className="receipt-container animate-fade-in">
                <div className="receipt-header">
                  <div className="receipt-title">TAŞBAHÇE AQUA PLUS</div>
                  <span style={{ fontSize: '0.65rem' }}>Sipariş Fişi</span>
                </div>
                <div className="receipt-body">
                  <div className="receipt-row">
                    <strong>Masa:</strong> <span>{activePrintSlip.tableName}</span>
                  </div>
                  <div className="receipt-row">
                    <strong>Tarih:</strong> <span>{new Date(activePrintSlip.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div style={{ margin: '8px 0', borderBottom: '1px dashed #000' }} />
                  {activePrintSlip.items.map((item, idx) => (
                    <div key={idx} className="receipt-row">
                      <span>{item.quantity}x {item.name}</span>
                      <span>{item.price * item.quantity} TL</span>
                    </div>
                  ))}
                  <div style={{ margin: '8px 0', borderBottom: '1px dashed #000' }} />
                  <div className="receipt-row" style={{ fontWeight: 'bold' }}>
                    <span>TOPLAM:</span>
                    <span>{activePrintSlip.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)} TL</span>
                  </div>
                </div>
                <div className="receipt-footer">
                  --- Mutfak & Nargile Kopyası ---
                </div>
              </div>
            </div>
          )}

          {/* RENDER SPECIFIC DASHBOARDS BASED ON ROLES */}
          {currentUser.role === 'admin' && (
            <AdminDashboard 
              menuItems={menuItems} setMenuItems={setMenuItems}
              orders={orders} setOrders={setOrders}
              users={users} setUsers={setUsers}
              adminTab={adminTab} setAdminTab={setAdminTab}
              setConfirmModal={setConfirmModal}
            />
          )}

          {currentUser.role === 'garson' && (
            <WaiterDashboard 
              menuItems={menuItems}
              orders={orders} setOrders={setOrders}
              selectedTable={selectedTable} setSelectedTable={setSelectedTable}
            />
          )}

          {(currentUser.role === 'mutfak' || currentUser.role === 'nargile') && (
            <KitchenDashboard 
              role={currentUser.role}
              menuItems={menuItems}
              orders={orders} setOrders={setOrders}
              setConfirmModal={setConfirmModal}
            />
          )}

        </div>
      )}

      {/* Embedded CSS for lists */}
      <style dangerouslySetInnerHTML={{__html: `
        .admin-nav-btn {
          padding: 10px 20px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          border: none;
          background: transparent;
          color: var(--text-muted);
          transition: var(--transition);
        }
        .admin-nav-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: var(--shadow-sm);
        }
        .table-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 16px;
        }
        .table-card {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          background: white;
          border: 1px solid var(--border-glass);
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          transition: var(--transition);
          position: relative;
        }
        .table-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        .table-card.active-orders {
          border-color: var(--primary-light);
          background: var(--accent-light);
        }
        .table-card.selected {
          border-color: var(--primary-dark);
          box-shadow: 0 0 0 2px var(--primary-dark);
        }
      `}} />

      {/* Custom Confirm Modal */}
      {confirmModal.isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 76, 129, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '20px'
        }} className="animate-fade-in">
          <div className="glass-card animate-scale-in" style={{
            width: '100%',
            maxWidth: '400px',
            padding: '30px',
            backgroundColor: '#ffffff',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            border: '1px solid rgba(15, 76, 129, 0.15)'
          }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{
                background: '#ffebee',
                color: '#c62828',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertTriangle size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h4 style={{ fontSize: '1.15rem', color: '#c62828', fontWeight: 700, margin: 0 }}>
                  {confirmModal.title || 'Onay Gerekiyor'}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {confirmModal.message}
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} 
                className="btn btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                İptal
              </button>
              <button 
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm();
                  setConfirmModal({ ...confirmModal, isOpen: false });
                }} 
                className="btn" 
                style={{
                  background: 'linear-gradient(135deg, #e53935, #c62828)',
                  color: 'white',
                  padding: '8px 18px',
                  fontSize: '0.85rem',
                  boxShadow: '0 4px 10px rgba(198, 40, 40, 0.2)',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer'
                }}
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   ROLE 1: YÖNETİCİ (ADMIN) DASHBOARD
   ========================================== */
function AdminDashboard({ menuItems, setMenuItems, orders, setOrders, users, setUsers, adminTab, setAdminTab, setConfirmModal }) {
  // Menu form local states
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'yemek', description: '', image: '/images/cafe_interior.png' });
  const [editItemId, setEditItemId] = useState(null);

  // Staff form local states
  const [newStaff, setNewStaff] = useState({ name: '', username: '', password: '', role: 'garson' });

  // Calculate Metrics
  const totalRevenue = orders
    .filter(o => o.status === 'tamamlandi')
    .reduce((total, order) => total + order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0), 0);

  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status !== 'tamamlandi').length;

  const handleAddMenu = (e) => {
    e.preventDefault();
    if (editItemId) {
      // Edit mode
      const updatedMenu = menuItems.map(item => {
        if (item.id === editItemId) {
          return { ...item, ...newItem, price: parseFloat(newItem.price) };
        }
        return item;
      });
      setMenuItems(updatedMenu);
      localStorage.setItem('menu', JSON.stringify(updatedMenu));
      setEditItemId(null);
    } else {
      // Add mode
      const item = {
        ...newItem,
        id: `m_${Date.now()}`,
        price: parseFloat(newItem.price),
        image: newItem.category === 'nargile' ? '/images/shisha_lounge.png' : '/images/cafe_interior.png'
      };
      const updatedMenu = [...menuItems, item];
      setMenuItems(updatedMenu);
      localStorage.setItem('menu', JSON.stringify(updatedMenu));
    }
    setNewItem({ name: '', price: '', category: 'yemek', description: '', image: '/images/cafe_interior.png' });
  };

  const handleEditMenu = (item) => {
    setNewItem({ name: item.name, price: item.price.toString(), category: item.category, description: item.description, image: item.image });
    setEditItemId(item.id);
  };

  const handleDeleteMenu = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Menü Öğesini Sil',
      message: 'Bu menü öğesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      onConfirm: () => {
        const updatedMenu = menuItems.filter(item => item.id !== id);
        setMenuItems(updatedMenu);
        localStorage.setItem('menu', JSON.stringify(updatedMenu));
      }
    });
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    const staff = {
      ...newStaff,
      id: `u_${Date.now()}`
    };
    const updatedUsers = [...users, staff];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setNewStaff({ name: '', username: '', password: '', role: 'garson' });
  };

  const handleDeleteStaff = (id) => {
    if (id === 'u1') {
      alert('Ana yönetici silinemez!');
      return;
    }
    setConfirmModal({
      isOpen: true,
      title: 'Personeli Çıkar',
      message: 'Bu personeli kadrodan silmek istediğinizden emin misiniz? Sistem erişimi sonlandırılacaktır.',
      onConfirm: () => {
        const updatedUsers = users.filter(user => user.id !== id);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Navigation tabs */}
      <div className="glass-card" style={{ display: 'flex', gap: '8px', padding: '10px 16px', overflowX: 'auto' }}>
        <button className={`admin-nav-btn ${adminTab === 'siparisler' ? 'active' : ''}`} onClick={() => setAdminTab('siparisler')}>Siparişler</button>
        <button className={`admin-nav-btn ${adminTab === 'menu' ? 'active' : ''}`} onClick={() => setAdminTab('menu')}>Menü Yönetimi</button>
        <button className={`admin-nav-btn ${adminTab === 'ekip' ? 'active' : ''}`} onClick={() => setAdminTab('ekip')}>Ekip Yönetimi</button>
        <button className={`admin-nav-btn ${adminTab === 'istatistik' ? 'active' : ''}`} onClick={() => setAdminTab('istatistik')}>Analiz & İstatistik</button>
      </div>

      {/* TAB 1: ORDERS */}
      {adminTab === 'siparisler' && (
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Tüm Aktif & Geçmiş Siparişler</h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-glass)', paddingBottom: '10px' }}>
                  <th style={{ padding: '12px 8px' }}>Masa</th>
                  <th style={{ padding: '12px 8px' }}>Sipariş Detayı</th>
                  <th style={{ padding: '12px 8px' }}>Tutar</th>
                  <th style={{ padding: '12px 8px' }}>Tarih / Saat</th>
                  <th style={{ padding: '12px 8px' }}>Durum</th>
                  <th style={{ padding: '12px 8px' }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    return (
                      <tr key={order.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{order.tableName}</td>
                        <td style={{ padding: '12px 8px', fontSize: '0.85rem' }}>
                          {order.items.map((item, idx) => (
                            <div key={idx}>
                              {item.quantity}x {item.name} {item.note && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({item.note})</span>}
                            </div>
                          ))}
                        </td>
                        <td style={{ padding: '12px 8px', fontWeight: 'bold', color: 'var(--primary)' }}>{total} ₺</td>
                        <td style={{ padding: '12px 8px', fontSize: '0.8rem' }}>{new Date(order.timestamp).toLocaleString()}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span className={`badge ${
                            order.status === 'beklemede' ? 'badge-warning' : 
                            order.status === 'hazirlaniyor' ? 'badge-primary' : 
                            order.status === 'hazirlandi' ? 'badge-success' : 'badge-primary'
                          }`} style={{ fontSize: '0.7rem' }}>
                            {order.status === 'beklemede' ? 'Beklemede' : 
                             order.status === 'hazirlaniyor' ? 'Hazırlanıyor' : 
                             order.status === 'hazirlandi' ? 'Hazırlandı' : 'Tamamlandı'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <button 
                            onClick={() => {
                              setConfirmModal({
                                isOpen: true,
                                title: 'Siparişi İptal Et',
                                message: `Masa ${order.tableName} için açılan bu siparişi silmek istediğinizden emin misiniz?`,
                                onConfirm: () => {
                                  const updated = orders.filter(o => o.id !== order.id);
                                  setOrders(updated);
                                  localStorage.setItem('orders', JSON.stringify(updated));
                                }
                              });
                            }}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '15px', color: '#c62828' }}
                          >
                            <Trash2 size={12} /> Sil
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Sipariş bulunmuyor.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MENU MANAGEMENT */}
      {adminTab === 'menu' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', flexWrap: 'wrap' }} className="grid-2">
          {/* Add / Edit Form */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>{editItemId ? 'Menü Düzenle' : 'Yeni Menü Ekle'}</h3>
            <form onSubmit={handleAddMenu} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Ürün Adı</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)', outline: 'none' }}
                  placeholder="Hamburger vb."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Fiyat (TL)</label>
                  <input
                    type="number"
                    required
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)', outline: 'none' }}
                    placeholder="320"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Kategori</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)', outline: 'none' }}
                  >
                    <option value="yemek">Yemek / Kafe</option>
                    <option value="icecek">İçecek</option>
                    <option value="tatli">Tatlı</option>
                    <option value="nargile">Nargile</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Açıklama</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)', outline: 'none', minHeight: '80px', resize: 'vertical' }}
                  placeholder="Ürün malzemeleri ve sunum detayları..."
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>
                  {editItemId ? 'Değişiklikleri Kaydet' : 'Menüye Ekle'}
                </button>
                {editItemId && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditItemId(null);
                      setNewItem({ name: '', price: '', category: 'yemek', description: '', image: '/images/cafe_interior.png' });
                    }} 
                    className="btn btn-secondary"
                  >
                    İptal
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Menü list */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Mevcut Menü Listesi</h3>
            <div style={{ overflowY: 'auto', maxHeight: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {menuItems.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'white',
                  border: '1px solid var(--border-glass)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/images/cafe_interior.png'; }}
                    />
                    <div>
                      <strong style={{ fontSize: '0.9rem', display: 'block' }}>{item.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.category === 'yemek' ? 'Yemek' : item.category === 'icecek' ? 'İçecek' : item.category === 'tatli' ? 'Tatlı' : 'Nargile'} • {item.price} TL
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleEditMenu(item)}
                      className="btn btn-secondary" 
                      style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px' }}
                    >
                      <Edit2 size={12} />
                    </button>
                    <button 
                      onClick={() => handleDeleteMenu(item.id)}
                      className="btn btn-secondary" 
                      style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px', color: '#c62828' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STAFF MANAGEMENT */}
      {adminTab === 'ekip' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }} className="grid-2">
          {/* Add Staff form */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Yeni Personel Ekle</h3>
            <form onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Personel Adı Soyadı</label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)', outline: 'none' }}
                  placeholder="Ali Yılmaz"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Kullanıcı Adı</label>
                <input
                  type="text"
                  required
                  value={newStaff.username}
                  onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value.toLowerCase() })}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)', outline: 'none' }}
                  placeholder="ali123"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Giriş Şifresi</label>
                  <input
                    type="password"
                    required
                    value={newStaff.password}
                    onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)', outline: 'none' }}
                    placeholder="1234"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Yetki Rolü</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)', outline: 'none' }}
                  >
                    <option value="admin">Yönetici (Tam Yetki)</option>
                    <option value="garson">Garson</option>
                    <option value="mutfak">Kafe Mutfak</option>
                    <option value="nargile">Nargile Kafe</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
                Personel Ekle
              </button>
            </form>
          </div>

          {/* Staff List */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Aktif Personel Kadrosu</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {users.map(user => (
                <div key={user.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'white',
                  border: '1px solid var(--border-glass)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Users size={18} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.9rem', display: 'block' }}>{user.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Kullanıcı: <strong>{user.username}</strong> • Şifre: {user.password}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`badge ${
                      user.role === 'admin' ? 'badge-danger' : 
                      user.role === 'garson' ? 'badge-primary' : 
                      user.role === 'mutfak' ? 'badge-success' : 'badge-warning'
                    }`} style={{ fontSize: '0.65rem' }}>
                      {user.role === 'admin' ? 'Yönetici' : user.role === 'garson' ? 'Garson' : user.role === 'mutfak' ? 'Mutfak' : 'Nargile'}
                    </span>
                    <button 
                      onClick={() => handleDeleteStaff(user.id)}
                      className="btn btn-secondary" 
                      style={{ padding: '6px', borderRadius: '50%', minWidth: '32px', height: '32px', color: '#c62828' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STATISTICS */}
      {adminTab === 'istatistik' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e8f5e9', color: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Toplam Ciro</span>
                <strong style={{ fontSize: '1.4rem', color: 'var(--primary-dark)' }}>{totalRevenue} ₺</strong>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Toplam Sipariş</span>
                <strong style={{ fontSize: '1.4rem', color: 'var(--primary-dark)' }}>{totalOrders} Adet</strong>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff8e1', color: '#f57f17', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Aktif Sipariş</span>
                <strong style={{ fontSize: '1.4rem', color: 'var(--primary-dark)' }}>{activeOrders} Adet</strong>
              </div>
            </div>
          </div>

          {/* Simple Chart simulation */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Kategorilere Göre Sipariş Dağılımı</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
              {['yemek', 'icecek', 'tatli', 'nargile'].map((cat) => {
                const count = orders.filter(o => o.items.some(i => i.category === cat)).length;
                const totalCats = orders.reduce((sum, o) => sum + o.items.length, 0) || 1;
                const percent = Math.round((count / totalCats) * 100);
                
                return (
                  <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                        {cat === 'yemek' ? 'Kafe Mutfak' : cat === 'icecek' ? 'İçecek' : cat === 'tatli' ? 'Tatlı' : 'Nargile'}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>{count} Sipariş ({percent}%)</span>
                    </div>
                    {/* Bar */}
                    <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percent}%`,
                        height: '100%',
                        background: 'linear-gradient(to right, var(--primary), var(--primary-light))',
                        borderRadius: '6px'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   ROLE 2: GARSON (WAITER) DASHBOARD
   ========================================== */
function WaiterDashboard({ menuItems, orders, setOrders, selectedTable, setSelectedTable }) {
  const [basket, setBasket] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('menu'); // 'menu' or 'aktif'
  const [orderNote, setOrderNote] = useState('');

  // 20 Tables list
  const tables = Array.from({ length: 20 }, (_, i) => ({ id: `masa-${i + 1}`, name: `Masa ${i + 1}` }));

  // Get orders active for selected table
  const tableActiveOrders = orders.filter(o => o.tableName === selectedTable && o.status !== 'tamamlandi');

  const handleAddToBasket = (item) => {
    const existing = basket.find(b => b.id === item.id);
    if (existing) {
      setBasket(basket.map(b => b.id === item.id ? { ...b, quantity: b.quantity + 1 } : b));
    } else {
      setBasket([...basket, { ...item, quantity: 1, note: '' }]);
    }
  };

  const handleRemoveFromBasket = (id) => {
    const existing = basket.find(b => b.id === id);
    if (existing.quantity > 1) {
      setBasket(basket.map(b => b.id === id ? { ...b, quantity: b.quantity - 1 } : b));
    } else {
      setBasket(basket.filter(b => b.id !== id));
    }
  };

  const handleUpdateItemNote = (id, noteText) => {
    setBasket(basket.map(b => b.id === id ? { ...b, note: noteText } : b));
  };

  const handleSendOrder = () => {
    if (basket.length === 0) return;
    
    // Create new order object
    const newOrder = {
      id: `ord_${Date.now()}`,
      tableName: selectedTable,
      items: basket.map(b => ({
        id: b.id,
        name: b.name,
        price: b.price,
        quantity: b.quantity,
        category: b.category,
        note: b.note
      })),
      status: 'beklemede',
      timestamp: Date.now()
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // Reset UI state
    setBasket([]);
    setOrderNote('');
    setActiveSubTab('aktif');
    playSynthSound('bell');
  };

  const handleCompleteTableOrder = (orderId) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'tamamlandi' };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Table grid selector */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.1rem' }}>Masa Seçimi yapın:</h3>
        <div className="table-grid">
          {tables.map(table => {
            // Check if table has active orders
            const hasActive = orders.some(o => o.tableName === table.name && o.status !== 'tamamlandi');
            const hasPrepared = orders.some(o => o.tableName === table.name && o.status === 'hazirlandi');
            const isSelected = selectedTable === table.name;

            return (
              <div 
                key={table.id}
                onClick={() => setSelectedTable(table.name)}
                className={`table-card ${hasActive ? 'active-orders' : ''} ${isSelected ? 'selected' : ''}`}
                style={{
                  backgroundColor: hasPrepared ? '#e8f5e9' : isSelected ? '#e0f7fa' : 'white',
                  borderColor: hasPrepared ? '#81c784' : isSelected ? 'var(--primary)' : 'var(--border-glass)'
                }}
              >
                <strong style={{ fontSize: '1rem', color: 'var(--primary-dark)' }}>{table.name}</strong>
                {hasPrepared && (
                  <span className="badge badge-success" style={{ fontSize: '0.6rem', padding: '2px 6px', marginTop: '6px', animation: 'fadeIn 0.5s infinite alternate' }}>
                    HAZIR
                  </span>
                )}
                {hasActive && !hasPrepared && (
                  <span className="badge badge-primary" style={{ fontSize: '0.6rem', padding: '2px 6px', marginTop: '6px' }}>
                    Aktif
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SELECTED TABLE DASHBOARD */}
      {selectedTable && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }} className="grid-2">
          {/* Main order panel */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)' }}>{selectedTable} Sipariş Paneli</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => setActiveSubTab('menu')}
                  className={`btn ${activeSubTab === 'menu' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '20px' }}
                >
                  Menüden Ekle
                </button>
                <button 
                  onClick={() => setActiveSubTab('aktif')}
                  className={`btn ${activeSubTab === 'aktif' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '20px' }}
                >
                  Aktif Siparişler ({tableActiveOrders.length})
                </button>
              </div>
            </div>

            {/* Menu List SUB-TAB */}
            {activeSubTab === 'menu' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Ürünler listesinden seçin:</h4>
                <div style={{ overflowY: 'auto', maxHeight: '350px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {menuItems.map(item => (
                    <div key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'white',
                      borderRadius: '8px',
                      border: '1px solid var(--border-glass)'
                    }}>
                      <div>
                        <strong style={{ fontSize: '0.85rem', display: 'block' }}>{item.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.price} TL • {item.category}</span>
                      </div>
                      <button 
                        onClick={() => handleAddToBasket(item)}
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '20px', display: 'flex', gap: '4px' }}
                      >
                        <Plus size={14} /> Ekle
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Orders SUB-TAB */}
            {activeSubTab === 'aktif' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {tableActiveOrders.length > 0 ? (
                  tableActiveOrders.map(order => {
                    const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    return (
                      <div key={order.id} style={{
                        padding: '16px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid var(--border-glass)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Saat: {new Date(order.timestamp).toLocaleTimeString()}
                          </span>
                          <span className={`badge ${
                            order.status === 'beklemede' ? 'badge-warning' : 
                            order.status === 'hazirlaniyor' ? 'badge-primary' : 'badge-success'
                          }`} style={{ fontSize: '0.65rem' }}>
                            {order.status === 'beklemede' ? 'Beklemede' : 
                             order.status === 'hazirlaniyor' ? 'Hazırlanıyor' : 'Hazırlandı'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <span>{item.quantity}x {item.name} {item.note && <small style={{ color: 'var(--text-muted)' }}>({item.note})</small>}</span>
                              <span>{item.price * item.quantity} TL</span>
                            </div>
                          ))}
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong>Toplam: {total} TL</strong>
                          
                          {/* Waiter can complete order if ready */}
                          <button 
                            onClick={() => handleCompleteTableOrder(order.id)}
                            className="btn btn-primary"
                            style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px', background: 'linear-gradient(135deg, #4caf50, #2e7d32)' }}
                          >
                            <Check size={14} /> Sipariş Tamamlandı
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    Masaya ait aktif sipariş bulunmamaktadır.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Waiter Basket Drawer */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'var(--bg-glass)' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={18} /> Sipariş Sepeti
            </h3>

            {basket.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                <div style={{ overflowY: 'auto', maxHeight: '300px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {basket.map(item => (
                    <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '0.85rem' }}>{item.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', display: 'block' }}>{item.price * item.quantity} TL</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button 
                            onClick={() => handleRemoveFromBasket(item.id)} 
                            className="btn btn-secondary" 
                            style={{ width: '24px', height: '24px', padding: 0, borderRadius: '50%' }}
                          >-</button>
                          <strong style={{ fontSize: '0.9rem' }}>{item.quantity}</strong>
                          <button 
                            onClick={() => handleAddToBasket(item)} 
                            className="btn btn-secondary" 
                            style={{ width: '24px', height: '24px', padding: 0, borderRadius: '50%' }}
                          >+</button>
                        </div>
                      </div>
                      
                      {/* Note for kitchen/nargile */}
                      <input 
                        type="text" 
                        placeholder="Özel istek / Not (örn: az buzlu)"
                        value={item.note}
                        onChange={(e) => handleUpdateItemNote(item.id, e.target.value)}
                        style={{
                          width: '100%',
                          fontSize: '0.75rem',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          border: '1px solid var(--border-glass)',
                          outline: 'none',
                          background: 'white'
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'auto', borderTop: '2px solid var(--border-glass)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem' }}>
                    <span>Toplam Tutar:</span>
                    <span>{basket.reduce((sum, item) => sum + (item.price * item.quantity), 0)} TL</span>
                  </div>
                  
                  <button onClick={handleSendOrder} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                    Siparişi Gönder (Mutfak/Nargile)
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Sepet boş. Menüden ekleme yapın.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   ROLE 3: KAFE/MUTFAK & NARGİLE DASHBOARDS
   ========================================== */
function KitchenDashboard({ role, menuItems, orders, setOrders, setConfirmModal }) {
  const [basket, setBasket] = useState([]);
  const [extraOrderTable, setExtraOrderTable] = useState('Masa 1');

  // Filter orders according to category relevance
  const isRelevantItem = (itemCat) => {
    if (role === 'nargile') return itemCat === 'nargile';
    return itemCat !== 'nargile'; // Food, drink, desserts
  };

  // Extract list of items currently pending/preparing for this specific role
  const activeOrders = orders.filter(o => 
    o.status !== 'tamamlandi' && 
    o.items.some(item => isRelevantItem(item.category))
  );

  const handleUpdateStatus = (orderId, newStatus) => {
    const updated = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    setOrders(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
    if (newStatus === 'hazirlandi') {
      playSynthSound('bell');
    }
  };

  const handleDeleteOrder = (orderId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Siparişi Sil / İptal Et',
      message: 'Bu siparişi tamamen silmek istediğinizden emin misiniz? Fiş listeden çıkarılacaktır.',
      onConfirm: () => {
        const updated = orders.filter(o => o.id !== orderId);
        setOrders(updated);
        localStorage.setItem('orders', JSON.stringify(updated));
      }
    });
  };

  // Direct Extra Order actions
  const handleAddToBasket = (item) => {
    const existing = basket.find(b => b.id === item.id);
    if (existing) {
      setBasket(basket.map(b => b.id === item.id ? { ...b, quantity: b.quantity + 1 } : b));
    } else {
      setBasket([...basket, { ...item, quantity: 1, note: '' }]);
    }
  };

  const handleRemoveFromBasket = (id) => {
    const existing = basket.find(b => b.id === id);
    if (existing.quantity > 1) {
      setBasket(basket.map(b => b.id === id ? { ...b, quantity: b.quantity - 1 } : b));
    } else {
      setBasket(basket.filter(b => b.id !== id));
    }
  };

  const handleSendExtraOrder = () => {
    if (basket.length === 0) return;
    const newOrder = {
      id: `ord_${Date.now()}`,
      tableName: extraOrderTable,
      items: basket.map(b => ({
        id: b.id,
        name: b.name,
        price: b.price,
        quantity: b.quantity,
        category: b.category,
        note: b.note
      })),
      status: 'beklemede',
      timestamp: Date.now()
    };
    const updated = [...orders, newOrder];
    setOrders(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
    setBasket([]);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }} className="grid-2">
      {/* Active Orders column */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)' }}>
          {role === 'nargile' ? 'Nargile Kafe Aktif Siparişler' : 'Kafe & Mutfak Aktif Siparişler'} ({activeOrders.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeOrders.length > 0 ? (
            activeOrders.map(order => {
              // Filter out items not relevant to this screen
              const relevantItems = order.items.filter(i => isRelevantItem(i.category));
              const total = relevantItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              
              return (
                <div key={order.id} style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'white',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--primary-dark)' }}>{order.tableName}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Saat: {new Date(order.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {relevantItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px dashed rgba(0,0,0,0.05)', paddingBottom: '4px' }}>
                        <span>
                          <strong>{item.quantity}x</strong> {item.name}
                          {item.note && <span style={{ color: '#e65100', fontSize: '0.75rem', marginLeft: '6px', fontWeight: 'bold' }}>({item.note})</span>}
                        </span>
                        <span>{item.price * item.quantity} TL</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Masa Sipariş Durumu:</span><br />
                      <span className={`badge ${
                        order.status === 'beklemede' ? 'badge-warning' : 
                        order.status === 'hazirlaniyor' ? 'badge-primary' : 'badge-success'
                      }`} style={{ fontSize: '0.65rem' }}>
                        {order.status === 'beklemede' ? 'Beklemede' : 
                         order.status === 'hazirlaniyor' ? 'Hazırlanıyor' : 'Hazırlandı'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {order.status === 'beklemede' && (
                        <button 
                          onClick={() => handleUpdateStatus(order.id, 'hazirlaniyor')}
                          className="btn btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '20px', display: 'flex', gap: '4px', color: 'var(--primary)' }}
                        >
                          <Play size={14} /> Hazırla
                        </button>
                      )}
                      {order.status === 'hazirlaniyor' && (
                        <button 
                          onClick={() => handleUpdateStatus(order.id, 'hazirlandi')}
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '20px', display: 'flex', gap: '4px', background: 'linear-gradient(135deg, #4caf50, #2e7d32)' }}
                        >
                          <CheckCircle2 size={14} /> Hazırlandı
                        </button>
                      )}

                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        className="btn btn-secondary" 
                        style={{ padding: '8px', borderRadius: '50%', color: '#c62828' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              Şu anda aktif hazırlanacak sipariş bulunmuyor.
            </div>
          )}
        </div>
      </div>

      {/* Extra Direct Order panel */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1.1rem' }}>Mutfak/Kasadan Ekstra Sipariş Gir</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Masa Seçimi</label>
            <select
              value={extraOrderTable}
              onChange={(e) => setExtraOrderTable(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)', outline: 'none' }}
            >
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i} value={`Masa ${i + 1}`}>Masa {i + 1}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Menüden Ürün Seçin</label>
            <div style={{ overflowY: 'auto', maxHeight: '200px', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid var(--border-glass)', padding: '6px', borderRadius: '8px', background: 'white' }}>
              {menuItems.filter(item => isRelevantItem(item.category)).map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '4px' }}>
                  <span>{item.name} ({item.price} TL)</span>
                  <button onClick={() => handleAddToBasket(item)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}>+ Ekle</button>
                </div>
              ))}
            </div>
          </div>

          {basket.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <strong>Sipariş Listesi:</strong>
              {basket.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span>{item.quantity}x {item.name}</span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button onClick={() => handleRemoveFromBasket(item.id)} style={{ width: '20px', height: '20px', padding: 0 }}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleAddToBasket(item)} style={{ width: '20px', height: '20px', padding: 0 }}>+</button>
                  </div>
                </div>
              ))}
              <button onClick={handleSendExtraOrder} className="btn btn-primary" style={{ padding: '10px', fontSize: '0.8rem', marginTop: '8px' }}>
                Ekstra Siparişi Gir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
