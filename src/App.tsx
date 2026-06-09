import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
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
import { Settings, Clock, CheckCircle2 } from 'lucide-react';
import { ensureDayMonthYear } from './utils/harvestHelper';

import AdminDashboardOverview from './pages/admin/AdminDashboardOverview';
import PaymentVerification from './pages/admin/PaymentVerification';
import PaymentVerificationDetail from './pages/admin/PaymentVerificationDetail';
import UserManagement from './pages/admin/UserManagement';
import SystemReports from './pages/admin/SystemReports';
// import PromoManagement from './pages/admin/PromoManagement';
import SystemConfiguration from './pages/admin/SystemConfiguration';
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
// import PromoPage from './pages/buyer/PromoPage';
import HelpPage from './pages/buyer/HelpPage';
import ActiveOrders from './pages/buyer/ActiveOrders';
import BuyerRequestPO from './pages/buyer/BuyerRequestPO';
import BrowseBuyerRequests from './pages/seller/BrowseBuyerRequests';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function OrderForumWrapper({ role }: { role: 'buyer' | 'seller' | 'admin' }) {
  const { orderId } = useParams();
  const { orders, messages, sendMessage, updateOrderStatus } = useOrder();
  const navigate = useNavigate();

  // Find order by ID, or fallback to the first active order
  const order = orderId 
    ? orders.find(o => o.id === orderId)
    : orders.find(o => o.status === 'WAITING_HARVEST' || o.status === 'HARVEST_CONFIRMED_SELLER' || o.status === 'WAITING_FINAL_PAYMENT');

  if (!order) {
    return <Navigate to={`/${role}`} replace />;
  }

  return (
    <OrderForum 
      order={order}
      role={role}
      messages={messages}
      onSendMessage={(content, attachmentType) => sendMessage(order.id, content, role, attachmentType)}
      onConfirmHarvest={role === 'seller' ? () => updateOrderStatus(order.id, 'HARVEST_CONFIRMED_SELLER') : undefined}
      onConfirmPurchase={role === 'buyer' ? () => {
        updateOrderStatus(order.id, 'COMPLETED');
        navigate('/buyer');
      } : undefined}
    />
  );
}

function WaitingVerification() {
  const { orders, messages, sendMessage, loadChatMessages } = useOrder();
  const navigate = useNavigate();

  const latestWaitingOrder = React.useMemo(() => {
    return [...orders]
      .reverse()
      .find(o => o.status === 'WAITING_ADMIN_DP' || o.status === 'WAITING_ADMIN_FINAL');
  }, [orders]);

  React.useEffect(() => {
    if (latestWaitingOrder?.id) {
      loadChatMessages(latestWaitingOrder.id);
    }
  }, [latestWaitingOrder?.id]);

  if (!latestWaitingOrder) {
    return <Navigate to="/buyer" replace />;
  }

  const amountToPay = latestWaitingOrder.status === 'WAITING_ADMIN_DP' 
    ? latestWaitingOrder.dpAmount 
    : latestWaitingOrder.remainingAmount;

  const typeText = latestWaitingOrder.status === 'WAITING_ADMIN_DP' 
    ? 'Down Payment (30%)' 
    : 'Pelunasan (70%)';

  const bankParts = latestWaitingOrder.paymentMethod 
    ? latestWaitingOrder.paymentMethod.split(' - ')
    : ['BNI', '1384354499 a.n SRIWIJAYA DIGITAL INDONESIA'];
  
  const bankName = bankParts[0] || 'BNI';
  const bankRest = bankParts[1] || '1384354499 a.n SRIWIJAYA DIGITAL INDONESIA';
  const bankSubParts = bankRest.split(' a.n ');
  const bankNum = bankSubParts[0] || '1384354499';
  const bankHolder = bankSubParts[1] || 'SRIWIJAYA DIGITAL INDONESIA';

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 p-4 sm:p-8 md:p-12 flex flex-col items-center gap-6 animate-in fade-in duration-300">
      <div className="max-w-md w-full space-y-6 bg-white rounded-[32px] p-8 sm:p-10 border border-slate-100 shadow-xl shadow-slate-100/50">
        <div className="w-16 h-16 bg-emerald-50 rounded-[24px] flex items-center justify-center mx-auto text-emerald-600 animate-bounce-slow border-4 border-emerald-100 shrink-0">
          <Clock size={28} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight font-display mb-1.5">Menunggu Verifikasi</h2>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Bukti transfer pembayaran Anda sedang diverifikasi secara manual oleh Admin PanganDesa.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200/60">
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">ID Pesanan</p>
              <p className="text-xs font-black text-slate-800">#{latestWaitingOrder.id.toUpperCase()}</p>
            </div>
            <span className="bg-orange-50 text-orange-650 border border-orange-100 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
              Pending
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">Rekening Bank Tujuan Transfer</p>
              <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                <div className="w-10 h-10 bg-[#1a4d2e] rounded-xl flex items-center justify-center text-white font-black text-xs font-display shrink-0">
                  {bankName}
                </div>
                <div>
                  <p className="text-[11px] font-black text-emerald-950">Transfer Bank {bankName} (Manual)</p>
                  <p className="text-xs font-black text-[#1a4d2e] tracking-wider">{bankNum}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tight mt-0.5">a.n {bankHolder}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Jenis Pembayaran</p>
                <p className="text-xs font-bold text-slate-700">{typeText}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Jumlah Ditransfer</p>
                <p className="text-xs font-black text-[#1a4d2e]">
                  Rp {amountToPay.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button 
            onClick={() => navigate('/buyer/pesanan')}
            className="flex-1 py-3 bg-[#1a4d2e] hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all border-0 cursor-pointer shadow-md shadow-emerald-950/10 active:scale-95"
          >
            Pantau Pesanan Saya
          </button>
          <button 
            onClick={() => navigate('/buyer')}
            className="flex-1 py-3 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer bg-white"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>

      <div className="max-w-md w-full bg-white rounded-[32px] p-5 sm:p-6 border border-slate-100 shadow-xl shadow-slate-100/50 space-y-4 text-left">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">Diskusi Forum Transaksi</h3>
        </div>
        <div className="h-[400px] border border-slate-100 rounded-2xl overflow-hidden flex flex-col w-full">
          <OrderForum 
            order={latestWaitingOrder}
            role="buyer"
            messages={messages}
            onSendMessage={(content, attachmentType) => sendMessage(latestWaitingOrder.id, content, 'buyer', attachmentType)}
            hideHeader={true}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const { isLoggedIn, activeRole, login, setActiveRole, user } = useAuth();
  const { cartItems, addToCart, clearCart, removeFromCart } = useCart();
  const { orders, messages, addOrder, updateOrderStatus, sendMessage } = useOrder();
  
  // Local state for product browsing (can be moved to a SearchContext later)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(() => localStorage.getItem('current_order_id'));
  const [checkoutOrder, setCheckoutOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });

  const activeInvoiceOrder = checkoutOrder || orders.find(o => o.id === currentOrderId);

  const handleAdminConfirmPayment = (orderId: string, type: 'DP' | 'FINAL' | 'DP_REJECT' | 'FINAL_REJECT' | 'CANCEL_DP' | 'CANCEL_FINAL') => {
    if (type === 'DP') {
      updateOrderStatus(orderId, 'WAITING_HARVEST');
    } else if (type === 'FINAL') {
      updateOrderStatus(orderId, 'SHIPPING');
    } else if (type === 'DP_REJECT') {
      updateOrderStatus(orderId, 'WAITING_PAYMENT_DP');
    } else if (type === 'FINAL_REJECT') {
      updateOrderStatus(orderId, 'WAITING_FINAL_PAYMENT');
    } else if (type === 'CANCEL_DP') {
      updateOrderStatus(orderId, 'WAITING_ADMIN_DP');
    } else if (type === 'CANCEL_FINAL') {
      updateOrderStatus(orderId, 'WAITING_ADMIN_FINAL');
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
    <>
    <Routes>
      <Route path="/" element={<Navigate to={`/${activeRole}`} replace />} />

      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<MainLayout />}>
        <Route index element={<AdminDashboardOverview orders={orders} />} />
        <Route path="verifikasi" element={<PaymentVerification orders={orders} onConfirmPayment={handleAdminConfirmPayment} />} />
        <Route path="verifikasi/:orderId" element={<PaymentVerificationDetail orders={orders} onConfirmPayment={handleAdminConfirmPayment} />} />
        <Route path="pengguna" element={<UserManagement />} />
        <Route path="laporan" element={<SystemReports orders={orders} />} />
        {/* <Route path="promo" element={<PromoManagement />} /> */}
        <Route path="pengaturan-admin" element={<SystemConfiguration />} />
        <Route path="transaksi-panen" element={<OrderForumWrapper role="admin" />} />
        <Route path="transaksi-panen/:orderId" element={<OrderForumWrapper role="admin" />} />
        <Route path="profil-detail" element={<ProfileDetailPage onBack={() => navigate('/admin')} />} />
        <Route path="ganti-password" element={<ChangePasswordPage onBack={() => navigate('/admin')} />} />
        <Route path="pin-keamanan" element={<PinManagementPage onBack={() => navigate('/admin')} />} />
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
                setToast({ message: `Berhasil menambahkan ${p.name} ke keranjang!`, show: true });
                setTimeout(() => {
                  setToast(prev => ({ ...prev, show: false }));
                }, 3000);
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
        {/* <Route path="promo" element={<PromoPage />} /> */}
        <Route path="bantuan" element={<HelpPage />} />
        <Route path="favorit" element={<FavoritesPage onProductSelect={setSelectedProduct} />} />
        <Route path="pesanan" element={
          <ActiveOrders 
            orders={orders} 
            onTrack={() => navigate('/buyer/lacak')} 
            onPayPelunasan={(orderId) => {
              setCurrentOrderId(orderId);
              localStorage.setItem('current_order_id', orderId);
              navigate('/buyer/transaksi-invoice');
            }}
            onOpenForum={(orderId) => navigate(`/buyer/transaksi-panen/${orderId}`)}
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
            onCheckout={(selectedItems, appliedPromo, selectedBank, shippingAddress) => {
              if (selectedItems.length === 0) return;
              const serviceFeePercent = Number(localStorage.getItem('service_fee') || '7');
              const subtotal = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
              const ongkir = 15000;
              const biayaLayanan = Math.round(subtotal * (serviceFeePercent / 100));
              
              let discountAmount = 0;
              if (appliedPromo && subtotal >= appliedPromo.minPurchase) {
                discountAmount = Math.round(subtotal * (appliedPromo.discountPercent / 100));
              }
              
              const totalAmount = subtotal + ongkir + biayaLayanan - discountAmount;
              const dpAmount = Math.round(totalAmount * 0.3);
              const remainingAmount = totalAmount - dpAmount;
 
              const activeSellerId = selectedItems[0]?.sellerId || '2';
              const newOrder: Order = {
                id: Math.random().toString(36).substr(2, 9),
                buyerId: user?.id ? String(user.id) : '3',
                sellerId: String(activeSellerId),
                items: selectedItems.map(item => ({
                  productId: item.id,
                  name: item.name + (item.selectedHarvestDate ? ` (Panen: ${ensureDayMonthYear(item.selectedHarvestDate)})` : ''),
                  quantity: item.quantity,
                  price: item.price,
                  image: item.image,
                  unit: item.unit
                })),
                totalAmount: totalAmount,
                dpAmount: dpAmount,
                remainingAmount: remainingAmount,
                status: 'WAITING_PAYMENT_DP',
                createdAt: new Date().toLocaleDateString('id-ID'),
                harvestConfirmedBySeller: false, purchaseConfirmedByBuyer: false,
                paymentMethod: selectedBank || 'BNI - 1384354499 a.n SRIWIJAYA DIGITAL INDONESIA',
                shippingAddress: shippingAddress
              };
              addOrder(newOrder);
              setCheckoutOrder(newOrder);
              setCurrentOrderId(newOrder.id);
              localStorage.setItem('current_order_id', newOrder.id);
              // Remove only the checked items from the cart!
              selectedItems.forEach(item => removeFromCart(item.id, item.selectedHarvestDate));
              navigate('/buyer/transaksi-invoice');
            }} 
          />
        } />
        <Route path="transaksi-invoice" element={
           activeInvoiceOrder ? (
             <Invoice 
              order={activeInvoiceOrder} 
              onConfirm={(proof) => {
                const newStatus = activeInvoiceOrder.status === 'WAITING_PAYMENT_DP' ? 'WAITING_ADMIN_DP' : 'WAITING_ADMIN_FINAL';
                updateOrderStatus(activeInvoiceOrder.id, newStatus, proof);
                navigate('/buyer/transaksi-waiting');
                
                // Clear the state in the next tick to allow navigation to complete smoothly
                setTimeout(() => {
                  setCheckoutOrder(null);
                  localStorage.removeItem('current_order_id');
                }, 100);
              }} 
            />
           ) : <Navigate to="/buyer" />
        } />
        <Route path="transaksi-waiting" element={<WaitingVerification />} />
        <Route path="transaksi-panen" element={<OrderForumWrapper role="buyer" />} />
        <Route path="transaksi-panen/:orderId" element={<OrderForumWrapper role="buyer" />} />
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
        <Route path="transaksi-panen" element={<OrderForumWrapper role="seller" />} />
        <Route path="transaksi-panen/:orderId" element={<OrderForumWrapper role="seller" />} />
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

    {toast.show && (
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-[#1a4d2e] text-white rounded-2xl shadow-xl shadow-brand-950/20 border border-emerald-800 transition-all duration-300 transform translate-y-0 animate-fade-in">
        <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
          <CheckCircle2 size={18} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wider">Berhasil</p>
          <p className="text-[11px] text-emerald-100 font-medium">{toast.message}</p>
        </div>
      </div>
    )}
    </>
  );
}
