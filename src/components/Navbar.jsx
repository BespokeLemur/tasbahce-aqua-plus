import React, { useState } from 'react';
import { Menu as MenuIcon, X, Waves, Coffee, Compass, Anchor, UserCheck } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, currentUser, handleLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Ana Sayfa', icon: Compass },
    { id: 'menu', label: 'Dijital Menü', icon: Coffee },
  ];

  const handleLogoDoubleClick = () => {
    setActivePage('admin');
  };

  return (
    <nav className="glass-card" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: '0 0 var(--radius-md) var(--radius-md)',
      borderTop: 'none',
      margin: '0 auto',
      width: '100%',
      maxWidth: '1200px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
      }}>
        {/* Logo / Brand */}
        <div 
          onDoubleClick={handleLogoDoubleClick}
          title="Yönetim Paneline gitmek için çift tıklayın"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          onClick={() => setActivePage('home')}
        >
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
            color: 'white',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(15, 76, 129, 0.2)'
          }}>
            <Waves size={24} className="animate-spin-slow" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.5px', color: 'var(--primary-dark)', margin: 0, lineHeight: 1.1 }}>
              TAŞBAHÇE
            </h1>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-light)', letterSpacing: '2px', display: 'block' }}>
              AQUA PLUS
            </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActivePage(item.id); setIsOpen(false); }}
                className="btn"
                style={{
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  color: isActive ? 'var(--primary-dark)' : 'var(--text-muted)',
                  padding: '8px 18px',
                  borderRadius: '30px',
                  boxShadow: 'none',
                  fontSize: '0.9rem'
                }}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '12px' }}>
              <div 
                onClick={() => setActivePage('admin')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  backgroundColor: 'rgba(79, 195, 247, 0.1)', 
                  border: '1px solid rgba(79, 195, 247, 0.2)',
                  cursor: 'pointer'
                }}
              >
                <UserCheck size={14} style={{ color: 'var(--primary-light)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
                  {currentUser.name}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary" 
                style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '20px' }}
              >
                Çıkış
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActivePage('admin')}
              className="btn"
              style={{
                background: 'transparent',
                color: 'transparent', // Make it invisible but clickable for easter egg
                border: 'none',
                width: '1px',
                height: '1px',
                padding: 0,
                cursor: 'default'
              }}
            >
              Admin
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-secondary mobile-menu-btn"
          style={{
            display: 'none',
            padding: '8px',
            borderRadius: '50%',
            boxShadow: 'none'
          }}
        >
          {isOpen ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="animate-scale-in" style={{
          padding: '12px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderTop: '1px solid var(--border-glass)'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActivePage(item.id); setIsOpen(false); }}
                className="btn"
                style={{
                  background: isActive ? 'var(--accent-light)' : 'transparent',
                  color: isActive ? 'var(--primary-dark)' : 'var(--text-muted)',
                  justifyContent: 'flex-start',
                  width: '100%',
                  boxShadow: 'none'
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}

          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
                <UserCheck size={16} style={{ color: 'var(--primary-light)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{currentUser.name} ({currentUser.role})</span>
              </div>
              <button 
                onClick={() => { setActivePage('admin'); setIsOpen(false); }}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Panele Git
              </button>
              <button 
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="btn btn-secondary" 
                style={{ width: '100%' }}
              >
                Çıkış Yap
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-glass)', paddingTop: '12px', textAlign: 'center' }}>
              <span 
                onClick={() => { setActivePage('admin'); setIsOpen(false); }}
                style={{ fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Personel Girişi
              </span>
            </div>
          )}
        </div>
      )}

      {/* Embedded style overrides for navbar mobile responsiveness */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
        }
      `}} />
    </nav>
  );
}
