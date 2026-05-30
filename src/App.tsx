import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import { useAuth } from './contexts/AuthContext';
import { useCart } from './contexts/CartContext';
import { useOrder } from './contexts/OrderContext';

import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import ProductManagement from './pages/seller/ProductManagement';
import SalesAnalytics from './pages/seller/SalesAnalytics';
import PreOrderManagement from './pages/seller/PreOrderManagement';
import Orders from './pages/seller/Orders';
import Financials from './pages/seller/Financials';
import Reviews from './pages/seller/Reviews';
import SellerHelp from './pages/seller/SellerHelp';
import HarvestProduction from './pages/seller/HarvestProduction';
import Customers from './pages/seller/Customers';
import SellerProfilePage from './pages/seller/SellerProfilePage';
import ProductDetail from './components/UI/ProductDetail';
import Cart from './components/UI/Cart';
import Tracking from './components/UI/Tracking';
import AIChatPage from './pages/AIChatPage';
import { Product, Order } from './types';
import { Settings, Clock } from 'lucide-react';
import { ensureDayMonthYear } from './utils/harvestHelper';

import AdminDashboard from './pages/AdminDashboard';
import Invoice from './components/Transaction/Invoice';
import OrderForum from './components/Transaction/OrderForum';
import OrderShipping from './components/Transaction/OrderShipping';

import AllProducts from './pages/buyer/AllProducts';
import CategoriesPage from './pages/buyer/CategoriesPage';
import FavoritesPage from './pages/buyer/FavoritesPage';
import OrderHistory from './pages/buyer/OrderHistory';
import PaymentMethods from './pages/buyer/PaymentMethods';
import SettingsPage from './pages/buyer/SettingsPage';
import ProfileDetailPage from './pages/buyer/ProfileDetailPage';
import ChangePasswordPage from './pages/buyer/ChangePasswordPage';
import PinManagementPage from './pages/buyer/PinManagementPage';
import AddressPage from './pages/buyer/AddressPage';
import PreOrderPage from './pages/buyer/PreOrderPage';
import PromoPage from './pages/buyer/PromoPage';
import HelpPage from './pages/buyer/HelpPage';
import ActiveOrders from './pages/buyer/ActiveOrders';
import BuyerRequestPO from './pages/buyer/BuyerRequestPO';
import BrowseBuyerRequests from './pages/seller/BrowseBuyerRequests';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  const navigate = useNavigate();
  const { isLoggedIn, activeRole, login, setActiveRole, user } = useAuth();
  const { cartItems, addToCart, clearCart } = useCart();
  const { orders, messages, addOrder, updateOrderStatus, sendMessage } = useOrder();
  
  // Local state for product browsing (can be moved to a SearchContext later)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const handleAdminConfirmPayment = (orderId: string, type: 'DP' | 'FINAL') => {
    if (type === 'DP') {
      updateOrderStatus(orderId, 'WAITING_HARVEST');
    } else {
      updateOrderStatus(orderId, 'SHIPPING');
    }
  };

  // Route protect
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={async (username, password) => { await login(username, password); navigate(`/${localStorage.getItem('role') || 'buyer'}`); }} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${activeRole}`} replace />} />

      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<MainLayout />}>
        <Route index element={<AdminDashboard orders={orders} onConfirmPayment={handleAdminConfirmPayment} />} />
        <Route path="transaksi-panen" element={
          orders.find(o => o.status === 'WAITING_HARVEST' || o.status === 'HARVEST_CONFIRMED_SELLER' || o.status === 'WAITING_FINAL_PAYMENT') ? (
            <OrderForum 
              order={orders.find(o => o.status === 'WAITING_HARVEST' || o.status === 'HARVEST_CONFIRMED_SELLER' || o.status === 'WAITING_FINAL_PAYMENT')!} 
              role="admin" 
              messages={messages}
              onSendMessage={(c, a) => {
                const activeOrder = orders.find(o => o.status === 'WAITING_HARVEST' || o.status === 'HARVEST_CONFIRMED_SELLER' || o.status === 'WAITING_FINAL_PAYMENT')!;
                return sendMessage(activeOrder.id, c, 'admin', a);
              }}
            />
          ) : <Navigate to="/admin" />
        } />
      </Route>

      {/* BUYER ROUTES */}
      <Route path="/buyer" element={<MainLayout />}>
        <Route index element={
          selectedProduct ? (
            <ProductDetail 
              product={selectedProduct} 
              onBack={() => setSelectedProduct(null)}
              onPreOrder={(p, q, date) => {
                setSelectedProduct(null);
                addToCart(p, q, date);
                navigate('/buyer/cart');
              }}
            />
          ) : (
            <BuyerDashboard 
              onProductSelect={setSelectedProduct} 
              onCategorySelect={(cat) => { setSelectedCategory(cat); navigate('/buyer/produk'); }}
              onTrackingSelect={() => navigate('/buyer/lacak')}
              onMenuSelect={(m) => navigate(`/buyer/${m}`)}
            />
          )
        } />
        <Route path="produk" element={<AllProducts onProductSelect={setSelectedProduct} initialCategory={selectedCategory} />} />
        <Route path="preorder" element={<PreOrderPage onProductSelect={setSelectedProduct} />} />
        <Route path="kategori" element={<CategoriesPage onCategorySelect={(cat) => { setSelectedCategory(cat); navigate('/buyer/produk'); }} />} />
        <Route path="promo" element={<PromoPage />} />
        <Route path="bantuan" element={<HelpPage />} />
        <Route path="favorit" element={<FavoritesPage onProductSelect={setSelectedProduct} />} />
        <Route path="pesanan" element={
          <ActiveOrders 
            orders={orders} 
            onTrack={() => navigate('/buyer/lacak')} 
            onPayPelunasan={(orderId) => {
              setCurrentOrderId(orderId);
              navigate('/buyer/transaksi-invoice');
            }}
            onOpenForum={() => navigate('/buyer/transaksi-panen')}
          />
        } />
        <Route path="riwayat" element={<OrderHistory />} />
        <Route path="request-po" element={<BuyerRequestPO />} />
        <Route path="alamat" element={<AddressPage />} />
        <Route path="metode-pembayaran" element={<PaymentMethods />} />
        <Route path="pengaturan" element={<SettingsPage onNavigate={(m) => navigate(`/buyer/${m}`)} />} />
        <Route path="profil-detail" element={<ProfileDetailPage onBack={() => navigate('/buyer/pengaturan')} />} />
        <Route path="ganti-password" element={<ChangePasswordPage onBack={() => navigate('/buyer/pengaturan')} />} />
        <Route path="pin-keamanan" element={<PinManagementPage onBack={() => navigate('/buyer/pengaturan')} />} />
        <Route path="lacak" element={
          orders.find(o => o.status === 'SHIPPING' || o.status === 'DELIVERED') ? (
            <OrderShipping order={orders.find(o => o.status === 'SHIPPING' || o.status === 'DELIVERED')!} role="buyer" onConfirmReceipt={() => navigate('/buyer')} />
          ) : <Tracking onBack={() => navigate('/buyer')} />
        } />
        
        <Route path="chat" element={<AIChatPage role="buyer" onBack={() => navigate('/buyer')} />} />
        <Route path="cart" element={
          <Cart 
            onBack={() => navigate('/buyer')} 
            onCheckout={() => {
              const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
              const activeSellerId = cartItems[0]?.sellerId || '2';
              const newOrder: Order = {
                id: Math.random().toString(36).substr(2, 9),
                buyerId: user?.id ? String(user.id) : '3',
                sellerId: String(activeSellerId),
                items: cartItems.map(item => ({
                  productId: item.id,
                  name: item.name + (item.selectedHarvestDate ? ` (Panen: ${ensureDayMonthYear(item.selectedHarvestDate)})` : ''),
                  quantity: item.quantity,
                  price: item.price,
                  image: item.image,
                  unit: item.unit
                })),
                totalAmount: total, dpAmount: total * 0.3, remainingAmount: total * 0.7,
                status: 'WAITING_PAYMENT_DP',
                createdAt: new Date().toLocaleDateString('id-ID'),
                harvestConfirmedBySeller: false, purchaseConfirmedByBuyer: false
              };
              addOrder(newOrder);
              setCurrentOrderId(newOrder.id);
              clearCart();
              navigate('/buyer/transaksi-invoice');
            }} 
          />
        } />
        <Route path="transaksi-invoice" element={
           orders.find(o => o.id === currentOrderId) ? (
             <Invoice 
              order={orders.find(o => o.id === currentOrderId)!} 
              onConfirm={() => {
                const currentOrder = orders.find(o => o.id === currentOrderId)!;
                const newStatus = currentOrder.status === 'WAITING_PAYMENT_DP' ? 'WAITING_ADMIN_DP' : 'WAITING_ADMIN_FINAL';
                updateOrderStatus(currentOrder.id, newStatus);
                navigate('/buyer/transaksi-waiting');
              }} 
            />
           ) : <Navigate to="/buyer" />
        } />
        <Route path="transaksi-waiting" element={
          <div className="flex-1 flex items-center justify-center bg-white p-12 text-center">
            <div className="max-w-md space-y-6">
              <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto text-brand-600 animate-pulse border-4 border-brand-100">
                <Clock size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Menunggu Verifikasi</h2>
              <button onClick={() => { setActiveRole('admin'); navigate('/admin'); }} className="mt-4 bg-brand-900 text-white py-4 px-8 rounded-2xl font-bold text-xs uppercase">Demo: Buka Admin</button>
            </div>
          </div>
        } />
        <Route path="transaksi-panen" element={
          orders.find(o => o.status === 'WAITING_HARVEST' || o.status === 'HARVEST_CONFIRMED_SELLER' || o.status === 'WAITING_FINAL_PAYMENT') ? (
            <OrderForum 
              order={orders.find(o => o.status === 'WAITING_HARVEST' || o.status === 'HARVEST_CONFIRMED_SELLER' || o.status === 'WAITING_FINAL_PAYMENT')!} 
              role="buyer" 
              messages={messages}
              onSendMessage={(c, a) => {
                const activeOrder = orders.find(o => o.status === 'WAITING_HARVEST' || o.status === 'HARVEST_CONFIRMED_SELLER' || o.status === 'WAITING_FINAL_PAYMENT')!;
                return sendMessage(activeOrder.id, c, 'buyer', a);
              }}
              onConfirmPurchase={() => {
                const activeOrder = orders.find(o => o.status === 'WAITING_HARVEST' || o.status === 'HARVEST_CONFIRMED_SELLER' || o.status === 'WAITING_FINAL_PAYMENT')!;
                updateOrderStatus(activeOrder.id, 'COMPLETED');
                navigate('/buyer');
              }}
            />
          ) : <Navigate to="/buyer" />
        } />
      </Route>

      {/* SELLER ROUTES */}
      <Route path="/seller" element={<MainLayout />}>
        <Route index element={<SellerDashboard orders={orders} onNavigate={(p) => navigate(p === 'transaksi-panen' ? '/seller/transaksi-panen' : `/seller/${p}`)} />} />
        <Route path="produk-saya" element={<ProductManagement />} />
        <Route path="ambil-po" element={<BrowseBuyerRequests />} />
        <Route path="panen-produksi" element={<HarvestProduction />} />
        <Route path="pelanggan" element={<Customers />} />
        <Route path="sales-analytics" element={<SalesAnalytics onBack={() => navigate('/seller')} />} />
        <Route path="analitik" element={<SalesAnalytics onBack={() => navigate('/seller')} />} />
        <Route path="preorder-masuk" element={<PreOrderManagement />} />
        <Route path="pesanan" element={<Orders />} />
        <Route path="keuangan" element={<Financials />} />
        <Route path="ulasan" element={<Reviews />} />
        <Route path="pengaturan-penjual" element={<SellerProfilePage onBack={() => navigate('/seller')} />} />
        <Route path="bantuan-penjual" element={<SellerHelp />} />
        <Route path="transaksi-panen" element={
          orders.find(o => o.status === 'WAITING_HARVEST' || o.status === 'HARVEST_CONFIRMED_SELLER' || o.status === 'WAITING_FINAL_PAYMENT') ? (
            <OrderForum 
              order={orders.find(o => o.status === 'WAITING_HARVEST' || o.status === 'HARVEST_CONFIRMED_SELLER' || o.status === 'WAITING_FINAL_PAYMENT')!} 
              role="seller" 
              messages={messages}
              onSendMessage={(c, a) => {
                const activeOrder = orders.find(o => o.status === 'WAITING_HARVEST' || o.status === 'HARVEST_CONFIRMED_SELLER' || o.status === 'WAITING_FINAL_PAYMENT')!;
                return sendMessage(activeOrder.id, c, 'seller', a);
              }}
              onConfirmHarvest={() => {
                const activeOrder = orders.find(o => o.status === 'WAITING_HARVEST' || o.status === 'HARVEST_CONFIRMED_SELLER' || o.status === 'WAITING_FINAL_PAYMENT')!;
                updateOrderStatus(activeOrder.id, 'HARVEST_CONFIRMED_SELLER');
              }}
            />
          ) : <Navigate to="/seller" />
        } />
        <Route path="ai-assistant" element={<AIChatPage role="seller" onBack={() => navigate('/seller')} />} />
        <Route path="profil-detail" element={<SellerProfilePage onBack={() => navigate('/seller')} />} />
        <Route path="ganti-password" element={<ChangePasswordPage onBack={() => navigate('/seller')} />} />
        <Route path="pin-keamanan" element={<PinManagementPage onBack={() => navigate('/seller')} />} />
        
        <Route path="*" element={
          <div className="flex-1 flex items-center justify-center bg-white p-12">
            <div className="text-center">
              <Settings size={48} className="animate-spin-slow mx-auto text-brand-600 mb-6" />
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Halaman sedang dikembangkan</h3>
              <button onClick={() => navigate('/seller')} className="mt-8 bg-brand-600 text-white px-8 py-3 rounded-2xl font-bold">Kembali</button>
            </div>
          </div>
        } />
      </Route>
      
      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
