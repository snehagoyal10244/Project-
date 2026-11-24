import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider, useWishlist } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';
import About from './pages/About';
import Contact from './pages/Contact';

import { CheckCircle2, Heart } from 'lucide-react';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Global Toast Banner
function GlobalToast() {
  const { toastMessage: cartToast } = useCart();
  const { toastMessage: wishToast } = useWishlist();

  const message = cartToast || wishToast;
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-lg shadow-2xl animate-in slide-in-from-bottom-5 duration-300 border border-surface-container-high/20">
      <CheckCircle2 className="w-5 h-5 text-tertiary-fixed flex-shrink-0" />
      <span className="font-body-sm text-body-sm font-medium tracking-wide text-xs">
        {message}
      </span>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-background text-on-surface">
              <Header />
              
              {/* Main routing container with top padding for fixed header */}
              <main className="flex-1 pt-[116px] md:pt-[116px]">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/categories" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/tracking" element={<OrderTracking />} />
                  <Route path="/order-tracking" element={<OrderTracking />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/about-us" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  {/* Catch-all fallback */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>

              <Footer />
              <GlobalToast />
            </div>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
