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
import PreOrderManagement from './pages/seller/PreOrderManagement';
import HarvestProduction from './pages/seller/HarvestProduction';
import Customers from './pages/seller/Customers';
import ProductDetail from './components/UI/ProductDetail';
import Cart from './components/UI/Cart';
import Tracking from './components/UI/Tracking';
import AIChatPage from './pages/AIChatPage';
import ChatBot from './components/Chat/ChatBot';
import { AppRole, Product, Order, ChatMessage, CartItem } from './types';
import { Settings, Clock } from 'lucide-react';

import AdminDashboard from './pages/AdminDashboard';
import Invoice from './components/Transaction/Invoice';
import OrderForum from './components/Transaction/OrderForum';
import OrderShipping from './components/Transaction/OrderShipping';

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
import ActiveOrders from './pages/buyer/ActiveOrders';
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

  // New States for Workflow
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [currentOrderId, setCurrentOrderId] = React.useState<string | null>(null);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);

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

  const handleAdminConfirmPayment = (orderId: string, type: 'DP' | 'FINAL') => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        if (type === 'DP') {
          return { ...o, status: 'WAITING_HARVEST' as const };
        } else {
          return { ...o, status: 'SHIPPING' as const, trackingNumber: 'PROS-' + Math.floor(Math.random()*1000000) };
        }
      }
      return o;
    }));
  };

  const handleSendMessage = (orderId: string, content: string, role: string, attachmentType?: 'image' | 'file') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      orderId,
      senderId: role,
      senderRole: role as any,
      senderName: role === 'buyer' ? 'Pembeli' : role === 'seller' ? 'Petani' : 'Admin',
      content,
      text: content,
      role: role === 'buyer' ? 'user' : 'assistant',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      attachmentType,
      attachmentUrl: attachmentType === 'image' ? 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600' : 
                     attachmentType === 'file' ? 'https://example.com/harvest_report.pdf' : undefined
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const renderContent = () => {
    if (activeRole === 'admin') {
      return <AdminDashboard orders={orders} onConfirmPayment={handleAdminConfirmPayment} />;
    }

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
              const total = cartItems.reduce((acc: number, item: CartItem) => acc + (item.price * item.quantity), 0);
              const newOrder: Order = {
                id: Math.random().toString(36).substr(2, 9),
                buyerId: 'user-1',
                sellerId: 'farmer-1',
                items: cartItems.map(item => ({
                  productId: item.id,
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                  image: item.image,
                  unit: item.unit
                })),
                totalAmount: total,
                dpAmount: total * 0.3,
                remainingAmount: total * 0.7,
                status: 'WAITING_PAYMENT_DP',
                createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                harvestConfirmedBySeller: false,
                purchaseConfirmedByBuyer: false
              };
              setOrders([newOrder, ...orders]);
              setCurrentOrderId(newOrder.id);
              setCartItems([]);
              setIsCartOpen(false);
              setActiveItem('transaksi-invoice');
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
        case 'pesanan':
          return <ActiveOrders 
            orders={orders} 
            onTrack={(order) => {
              setIsTrackingOpen(true);
              setActiveItem('lacak');
            }} 
          />;
        case 'riwayat':
          return <OrderHistory />;
        case 'alamat':
          return <AddressPage />;
        case 'metode-pembayaran':
          return <PaymentMethods />;
        case 'pengaturan':
          return <SettingsPage />;
        case 'transaksi-invoice': {
          const currentOrder = orders.find(o => o.id === currentOrderId);
          if (!currentOrder) return <BuyerDashboard 
            onProductSelect={setSelectedProduct} 
            onCategorySelect={(cat) => { setSelectedCategory(cat); setActiveItem('produk'); }}
            onTrackingSelect={() => { setIsTrackingOpen(true); setActiveItem('lacak'); }}
            onMenuSelect={setActiveItem}
          />;
          
          if (currentOrder.status === 'WAITING_PAYMENT_DP' || currentOrder.status === 'WAITING_FINAL_PAYMENT') {
            return (
              <Invoice 
                order={currentOrder} 
                onConfirm={() => {
                  const newStatus = currentOrder.status === 'WAITING_PAYMENT_DP' ? 'WAITING_ADMIN_DP' : 'WAITING_ADMIN_FINAL';
                  setOrders(prev => prev.map(o => o.id === currentOrder.id ? { ...o, status: newStatus as any } : o));
                  setActiveItem('transaksi-waiting');
                }} 
              />
            );
          }
          return null;
        }
        case 'transaksi-waiting':
          return (
            <div className="flex-1 flex items-center justify-center bg-white p-12 text-center">
              <div className="max-w-md space-y-6">
                <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto text-brand-600 animate-pulse border-4 border-brand-100">
                  <Clock size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Menunggu Verifikasi</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Pembayaran Anda sedang diverifikasi oleh admin kami (biasanya 5-10 menit). Anda akan dialihkan ke forum panen setelah disetujui.
                </p>
                <div className="pt-4 flex gap-4">
                   <button onClick={() => { setActiveRole('admin' as any); setActiveItem('dashboard'); }} className="flex-1 bg-brand-900 text-white py-4 rounded-2xl font-bold text-xs uppercase">Demo: Buka Admin</button>
                   <button onClick={() => setActiveItem('beranda')} className="flex-1 border border-slate-200 py-4 rounded-2xl font-bold text-xs uppercase">Kembali Beranda</button>
                </div>
              </div>
            </div>
          );
        case 'transaksi-panen': {
          const harvestOrderBuyer = orders.find(o => 
            o.status === 'WAITING_HARVEST' || 
            o.status === 'HARVEST_CONFIRMED_SELLER' ||
            o.status === 'WAITING_FINAL_PAYMENT'
          );
          if (!harvestOrderBuyer) return <BuyerDashboard 
            onProductSelect={setSelectedProduct} 
            onCategorySelect={(cat) => { setSelectedCategory(cat); setActiveItem('produk'); }}
            onTrackingSelect={() => { setIsTrackingOpen(true); setActiveItem('lacak'); }}
            onMenuSelect={setActiveItem}
          />;
          
          if (harvestOrderBuyer.purchaseConfirmedByBuyer && harvestOrderBuyer.harvestConfirmedBySeller && harvestOrderBuyer.status === 'WAITING_HARVEST') {
             // In a real app this would be a transition triggered by state change
             // Here we just allow navigation to invoice
          }

          return (
            <OrderForum 
              order={harvestOrderBuyer} 
              role="buyer" 
              messages={messages.filter(m => m.orderId === harvestOrderBuyer.id)}
              onSendMessage={(c, a) => handleSendMessage(harvestOrderBuyer.id, c, 'buyer', a)}
              onConfirmPurchase={() => {
                setOrders(prev => prev.map(o => {
                  if (o.id === harvestOrderBuyer.id) {
                    const updated = { ...o, purchaseConfirmedByBuyer: true };
                    if (o.harvestConfirmedBySeller) {
                      updated.status = 'WAITING_FINAL_PAYMENT';
                    }
                    return updated;
                  }
                  return o;
                }));
                // If both ready, go to invoice
                const o = orders.find(oo => oo.id === harvestOrderBuyer.id);
                if (o?.harvestConfirmedBySeller) {
                   setCurrentOrderId(harvestOrderBuyer.id);
                   setActiveItem('transaksi-invoice');
                }
              }}
            />
          );
        }
        case 'lacak':
        case 'transaksi-tracking': {
          const shippingOrder = orders.find(o => o.status === 'SHIPPING' || o.status === 'DELIVERED');
          if (!shippingOrder) return <BuyerDashboard 
            onProductSelect={setSelectedProduct} 
            onCategorySelect={(cat) => { setSelectedCategory(cat); setActiveItem('produk'); }}
            onTrackingSelect={() => { setIsTrackingOpen(true); setActiveItem('lacak'); }}
            onMenuSelect={setActiveItem}
          />;
          
          return (
            <OrderShipping 
              order={shippingOrder} 
              role="buyer" 
              onConfirmReceipt={() => {
                setOrders(prev => prev.map(o => o.id === shippingOrder.id ? { ...o, status: 'COMPLETED' as any } : o));
                setActiveItem('beranda');
              }} 
            />
          );
        }
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
        case 'panen-produksi':
          return <HarvestProduction />;
        case 'pelanggan':
          return <Customers />;
        case 'sales-analytics':
          return <SalesAnalytics onBack={() => setActiveItem('dashboard')} />;
        case 'pesanan': {
          const harvestOrder = orders.find(o => o.status === 'WAITING_HARVEST' || o.status === 'HARVEST_CONFIRMED_SELLER');
          if (harvestOrder) {
             return (
               <OrderForum 
                order={harvestOrder} 
                role="seller" 
                messages={messages.filter(m => m.orderId === harvestOrder.id)}
                onSendMessage={(c, a) => handleSendMessage(harvestOrder.id, c, 'seller', a)}
                onConfirmHarvest={() => setOrders(prev => prev.map(o => {
                   if (o.id === harvestOrder.id) {
                     const updated = { ...o, harvestConfirmedBySeller: true };
                     if (o.purchaseConfirmedByBuyer) {
                       updated.status = 'WAITING_FINAL_PAYMENT' as any;
                     }
                     return updated;
                   }
                   return o;
                }))}
              />
             );
          }
          return <SellerDashboard onNavigate={setActiveItem} />;
        }
        case 'pre-order':
        case 'preorder-masuk':
          return <PreOrderManagement />;
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

