import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Admin from './pages/Admin';
import { initialMenu, initialUsers } from './data/initialData';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  
  // Database States
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Load initial data
  useEffect(() => {
    // Menu items
    const savedMenu = localStorage.getItem('menu');
    if (savedMenu) {
      setMenuItems(JSON.parse(savedMenu));
    } else {
      setMenuItems(initialMenu);
      localStorage.setItem('menu', JSON.stringify(initialMenu));
    }

    // Orders
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders([]);
      localStorage.setItem('orders', JSON.stringify([]));
    }

    // Users (Staff)
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }

    // Active session
    const activeSession = sessionStorage.getItem('active_user');
    if (activeSession) {
      setCurrentUser(JSON.parse(activeSession));
    }

    // Handle deep-link redirection for QR table query parameter (e.g. ?table=5)
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    if (table) {
      setActivePage('menu');
    }
  }, []);

  // Multi-tab real-time sync via Storage Events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'orders') {
        setOrders(JSON.parse(e.newValue || '[]'));
      }
      if (e.key === 'menu') {
        setMenuItems(JSON.parse(e.newValue || '[]'));
      }
      if (e.key === 'users') {
        setUsers(JSON.parse(e.newValue || '[]'));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Wrapper for updating orders state and writing to storage (to trigger storage event on other tabs)
  const handleSetOrders = (newOrders) => {
    setOrders(newOrders);
    localStorage.setItem('orders', JSON.stringify(newOrders));
    // Dispatch local storage event so current tab also knows if needed (manually triggered)
    window.dispatchEvent(new Event('storage_local'));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('active_user');
    setActivePage('home');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-secondary)' }}>
      {/* Navigation */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        currentUser={currentUser} 
        handleLogout={handleLogout} 
      />

      {/* Main Page Content */}
      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {activePage === 'home' && (
          <Home setActivePage={setActivePage} />
        )}
        
        {activePage === 'menu' && (
          <Menu menuItems={menuItems} />
        )}
        
        {activePage === 'admin' && (
          <Admin 
            menuItems={menuItems} 
            setMenuItems={setMenuItems}
            orders={orders} 
            setOrders={handleSetOrders}
            users={users} 
            setUsers={setUsers}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        )}
      </main>
    </div>
  );
}
