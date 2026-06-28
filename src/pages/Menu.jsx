import React, { useState, useEffect } from 'react';
import { Search, Utensils, Coffee, Moon, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';

export default function Menu({ menuItems }) {
  const [activeCategory, setActiveCategory] = useState('hepsi');
  const [searchQuery, setSearchQuery] = useState('');
  const [tableNum, setTableNum] = useState(null);

  // Parse table number from URL query params (e.g., /menu?table=5 or index.html?table=5)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let table = params.get('table');
    
    // Also try to check hash query params if using hash routing
    if (!table && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1];
      const hashParams = new URLSearchParams(hashQuery);
      table = hashParams.get('table');
    }

    if (table) {
      setTableNum(table);
    }
  }, []);

  const categories = [
    { id: 'hepsi', label: 'Tüm Menü', icon: Sparkles },
    { id: 'yemek', label: 'Kafe & Restoran', icon: Utensils },
    { id: 'icecek', label: 'Soğuk & Sıcak İçecekler', icon: Coffee },
    { id: 'tatli', label: 'Enfes Tatlılar', icon: Sparkles },
    { id: 'nargile', label: 'Premium Nargileler', icon: Moon },
  ];

  const filteredMenu = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'hepsi' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* QR Code Welcome Header */}
      {tableNum && (
        <div className="glass-card animate-scale-in" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(79, 195, 247, 0.15), rgba(15, 76, 129, 0.05))',
          border: '1px solid rgba(15, 76, 129, 0.15)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            background: 'var(--primary)',
            color: 'white',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: 800,
            boxShadow: 'var(--shadow-sm)'
          }}>
            {tableNum}
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', margin: 0, fontWeight: 700 }}>
              Hoş Geldiniz! Masa {tableNum} Menüsü Aktif
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Aşağıdaki menüden seçiminizi yapıp siparişinizi garsona iletebilirsiniz. Afiyet olsun!
            </span>
          </div>
        </div>
      )}

      {/* Banner / Title */}
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h2 className="serif-title" style={{ fontSize: '2.2rem', color: 'var(--primary-dark)' }}>Taşbahçe Gurme Menü</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Mutfak ekibimiz ve nargile ustalarımız tarafından özenle hazırlanan zengin içerikleri inceleyin.
        </p>
      </div>

      {/* Filters & Search Control Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        marginTop: '10px'
      }}>
        {/* Category filters */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          maxWidth: '100%',
          scrollbarWidth: 'none'
        }} className="category-scroll">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="btn"
                style={{
                  background: isSelected ? 'var(--primary)' : 'var(--bg-glass)',
                  color: isSelected ? 'white' : 'var(--text-main)',
                  border: isSelected ? 'none' : '1px solid var(--border-glass)',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                  padding: '10px 20px',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  gap: '6px'
                }}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div style={{
          position: 'relative',
          flex: '1 1 300px',
          maxWidth: '400px'
        }}>
          <input
            type="text"
            placeholder="Menüde ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              borderRadius: '30px',
              border: '1px solid var(--border-glass)',
              background: 'var(--bg-glass)',
              outline: 'none',
              fontSize: '0.9rem',
              boxShadow: 'var(--shadow-sm)',
              color: 'var(--text-main)',
              transition: 'var(--transition)'
            }}
            className="search-input"
          />
          <Search size={18} style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
        </div>
      </div>

      {/* Menu Grid */}
      {filteredMenu.length > 0 ? (
        <div className="grid-3 animate-fade-in">
          {filteredMenu.map((item) => (
            <div key={item.id} className="glass-card" style={{
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'var(--transition)',
              height: '100%'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Product Image */}
              <div style={{ width: '100%', height: '220px', position: 'relative', backgroundColor: '#e2e8f0' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = '/images/cafe_interior.png'; }}
                />
                <span className="badge badge-primary" style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(4px)',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {item.category === 'yemek' ? 'Yemek' : item.category === 'icecek' ? 'İçecek' : item.category === 'tatli' ? 'Tatlı' : 'Nargile'}
                </span>
              </div>

              {/* Product Info */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: '1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--primary-dark)' }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-light)', whiteSpace: 'nowrap' }}>
                    {item.price} ₺
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', flex: '1' }}>
                  {item.description}
                </p>
                
                {tableNum && (
                  <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(15, 76, 129, 0.08)'
                  }}>
                    <AlertCircle size={12} /> Garsona sipariş ederken kodunu iletebilirsiniz: <strong style={{ color: 'var(--primary)' }}>#{item.id}</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{
          textAlign: 'center',
          padding: '60px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertCircle size={40} style={{ color: 'var(--text-muted)' }} />
          <h4 style={{ fontSize: '1.2rem' }}>Arama Sonucu Bulunamadı</h4>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px' }}>
            Aramanıza veya seçtiğiniz kategoriye uygun menü içeriği bulunmamaktadır. Lütfen farklı kelimelerle arama yapmayı deneyin.
          </p>
        </div>
      )}

      {/* Embedded CSS for scroll hides */}
      <style dangerouslySetInnerHTML={{__html: `
        .category-scroll::-webkit-scrollbar { display: none; }
        .search-input:focus {
          border-color: var(--primary-light) !important;
          box-shadow: 0 4px 15px rgba(29, 112, 184, 0.15) !important;
        }
      `}} />
    </div>
  );
}
