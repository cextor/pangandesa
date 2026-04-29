/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import ProductManagement from './pages/seller/ProductManagement';
import SalesAnalytics from './pages/seller/SalesAnalytics';
import ProductDetail from './components/UI/ProductDetail';
import Cart from './components/UI/Cart';
import Tracking from './components/UI/Tracking';
import AIChatPage from './pages/AIChatPage';
import ChatBot from './components/Chat/ChatBot';
import { AppRole, Product } from './types';
import { Settings } from 'lucide-react';

import AllProducts from './pages/buyer/AllProducts';
import VillagesPage from './pages/buyer/VillagesPage';
import CategoriesPage from './pages/buyer/CategoriesPage';
import FavoritesPage from './pages/buyer/FavoritesPage';
import OrderHistory from './pages/buyer/OrderHistory';
import PaymentMethods from './pages/buyer/PaymentMethods';
import SettingsPage from './pages/buyer/SettingsPage';
import AddressPage from './pages/buyer/AddressPage';
import PreOrderPage from './pages/buyer/PreOrderPage';
import PromoPage from './pages/buyer/PromoPage';
import HelpPage from './pages/buyer/HelpPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeRole, setActiveRole] = useState<AppRole>('buyer');
  const [activeItem, setActiveItem] = useState('beranda');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const handleLogin = (role: AppRole) => {
    setActiveRole(role);
    setIsLoggedIn(true);
    setActiveItem(role === 'buyer' ? 'beranda' : 'dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveItem('beranda');
    setSelectedProduct(null);
    setSelectedCategory(null);
  };

  // Handle role change - reset active item to the default for that role
  const handleRoleChange = (role: AppRole) => {
    setActiveRole(role);
    setActiveItem(role === 'buyer' ? 'beranda' : 'dashboard');
    setSelectedProduct(null);
    setSelectedCategory(null);
    setIsCartOpen(false);
    setIsTrackingOpen(false);
    setIsAIChatOpen(false);
  };

  const renderContent = () => {
    if (activeRole === 'buyer') {
      // Full screen overlays/pages take precedence
      if (isAIChatOpen) {
        return <AIChatPage role="buyer" onBack={() => {
          setIsAIChatOpen(false);
          setActiveItem('beranda');
        }} />;
      }
      if (isTrackingOpen) {
        return <Tracking onBack={() => {
          setIsTrackingOpen(false);
          setActiveItem('beranda');
        }} />;
      }

      if (isCartOpen) {
        return (
          <Cart 
            onBack={() => {
              setIsCartOpen(false);
              setActiveItem('beranda');
            }} 
            onCheckout={() => {
              alert('Terima kasih! Pesanan Anda telah diterima dan akan segera diproses.');
              setIsCartOpen(false);
              setActiveItem('lacak');
              setIsTrackingOpen(true);
            }} 
          />
        );
      }
      
      if (selectedProduct) {
        return (
          <ProductDetail 
            product={selectedProduct} 
            onBack={() => setSelectedProduct(null)}
            onPreOrder={(product, qty) => {
              console.log('Pre-ordering', product.name, qty);
              setSelectedProduct(null);
              setIsCartOpen(true);
              setActiveItem('pesanan');
            }}
          />
        );
      }

      // Sidebar menu navigation content
      switch (activeItem) {
        case 'beranda':
          return <BuyerDashboard 
            onProductSelect={setSelectedProduct} 
            onCategorySelect={(cat) => {
              setSelectedCategory(cat);
              setActiveItem('produk');
            }}
            onTrackingSelect={() => {
              setIsTrackingOpen(true);
              setActiveItem('lacak');
            }}
            onMenuSelect={setActiveItem}
          />;
        case 'produk':
          return <AllProducts 
            onProductSelect={setSelectedProduct} 
            initialCategory={selectedCategory} 
          />;
        case 'preorder':
          return <PreOrderPage onProductSelect={setSelectedProduct} />;
        case 'desa':
          return <VillagesPage />;
        case 'kategori':
          return <CategoriesPage onCategorySelect={(cat) => {
            setSelectedCategory(cat);
            setActiveItem('produk');
          }} />;
        case 'promo':
          return <PromoPage />;
        case 'bantuan':
          return <HelpPage />;
        case 'untuk-petani':
          return <AIChatPage role="buyer" onBack={() => setActiveItem('beranda')} />;
        case 'favorit':
          return <FavoritesPage onProductSelect={setSelectedProduct} />;
        case 'riwayat':
          return <OrderHistory />;
        case 'alamat':
          return <AddressPage />;
        case 'metode-pembayaran':
          return <PaymentMethods />;
        case 'pengaturan':
          return <SettingsPage />;
        default:
          return <BuyerDashboard 
            onProductSelect={setSelectedProduct} 
            onCategorySelect={(cat) => {
              setSelectedCategory(cat);
              setActiveItem('produk');
            }}
            onTrackingSelect={() => {
              setIsTrackingOpen(true);
              setActiveItem('lacak');
            }}
            onMenuSelect={setActiveItem}
          />;
      }
    } else {
      if (isAIChatOpen) {
        return <AIChatPage role="seller" onBack={() => {
          setIsAIChatOpen(false);
          setActiveItem('dashboard');
        }} />;
      }
      
      switch (activeItem) {
        case 'dashboard':
          return <SellerDashboard onNavigate={setActiveItem} />;
        case 'produk-saya':
          return <ProductManagement />;
        case 'sales-analytics':
          return <SalesAnalytics onBack={() => setActiveItem('dashboard')} />;
        default:
          return (
            <div className="flex-1 flex items-center justify-center bg-white p-12">
               <div className="text-center">
                  <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-600">
                     <Settings size={48} className="animate-spin-slow" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Halaman {activeItem} sedang dikembangkan</h3>
                  <p className="text-slate-400 mt-2 font-medium">Fitur ini akan segera hadir untuk membantu operasional Anda.</p>
                  <button 
                    onClick={() => setActiveItem('dashboard')}
                    className="mt-8 bg-brand-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-700 transition-all"
                  >
                    Kembali ke Dashboard
                  </button>
               </div>
            </div>
          );
      }
    }
  };

  return (
    !isLoggedIn ? (
      <LoginPage onLogin={handleLogin} />
    ) : (
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar 
          activeRole={activeRole} 
          onRoleChange={handleRoleChange} 
          activeItem={activeItem}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onItemChange={(item) => {
            setActiveItem(item);
            // Reset special states when moving between main menu items
            setIsAIChatOpen(false);
            setIsCartOpen(false);
            setIsTrackingOpen(false);
            setSelectedProduct(null);
            setSelectedCategory(null);

            // Handle specific items that act as triggers
            if (item === 'chat' && activeRole === 'buyer') {
              setIsAIChatOpen(true);
            } else if (item === 'ai-assistant' && activeRole === 'seller') {
              setIsAIChatOpen(true);
            } else if (item === 'pesanan' && activeRole === 'buyer') {
              setIsCartOpen(true);
            } else if (item === 'lacak' && activeRole === 'buyer') {
              setIsTrackingOpen(true);
            }
          }}
        />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header 
            onMenuClick={() => setIsSidebarOpen(true)}
            onCartClick={() => {
              if (activeRole === 'buyer') {
                setIsCartOpen(true);
                setSelectedProduct(null);
                setActiveItem('pesanan');
              }
            }} 
            onLogout={handleLogout}
          />
          <main className="flex-1 overflow-hidden flex flex-col">
            {renderContent()}
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
    )
  );
}

