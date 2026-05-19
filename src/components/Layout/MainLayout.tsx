import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../../contexts/AuthContext';
import { AppRole } from '../../types';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { activeRole, setActiveRole, logout } = useAuth();

  // Helper to extract active item from URL
  const pathParts = location.pathname.split('/');
  const activeItem = pathParts.length > 2 ? pathParts[2] : (activeRole === 'buyer' ? 'beranda' : 'dashboard');

  const handleItemChange = (item: string) => {
    setIsSidebarOpen(false);
    if (item === 'chat' && activeRole === 'buyer') {
      navigate('/buyer/chat');
      return;
    }
    if (item === 'ai-assistant' && activeRole === 'seller') {
      navigate('/seller/ai-assistant');
      return;
    }
    
    // Map 'beranda' to base buyer route
    if (item === 'beranda') {
      navigate('/buyer');
    } else if (item === 'dashboard' && activeRole === 'seller') {
      navigate('/seller');
    } else if (item === 'dashboard' && activeRole === 'admin') {
      navigate('/admin');
    } else {
      navigate(`/${activeRole}/${item}`);
    }
  };

  const handleRoleSwitch = (newRole: AppRole) => {
    setActiveRole(newRole);
    navigate(`/${newRole}`);
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar 
        activeRole={activeRole} 
        onRoleChange={handleRoleSwitch} 
        activeItem={activeItem}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onItemChange={handleItemChange}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)}
          onCartClick={() => navigate('/buyer/cart')} 
          onLogout={logout}
          onNavigate={handleItemChange}
          activeRole={activeRole}
        />
        <main className="flex-1 overflow-hidden flex flex-col">
          <Outlet />
        </main>
      </div>
      
      {/* Scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

