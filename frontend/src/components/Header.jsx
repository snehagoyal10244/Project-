import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import { 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Truck, 
  Globe, 
  ChevronDown, 
  ShieldCheck, 
  LogOut,
  Package,
  Compass
} from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'New Arrivals', path: '/shop?filter=new' },
    { name: 'Best Sellers', path: '/shop?filter=bestseller' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_8px_rgba(29,26,24,0.03)] border-b border-surface-container-high/60">
      {/* Announcement Bar */}
      <div className="bg-surface-container-high text-on-surface-variant">
        <div className="w-full px-4 lg:px-12 flex items-center justify-between h-9 text-label-sm font-label-sm tracking-widest uppercase text-[11px]">
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-on-surface transition-colors">
              <Globe className="w-3.5 h-3.5" />
              <span>USD ($)</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="h-3 w-px bg-outline-variant"></div>
            <Link to="/contact" className="hover:text-on-surface transition-colors">
              Customer Concierge
            </Link>
          </div>

          <div className="flex-1 text-center font-medium tracking-wider text-on-surface px-2 truncate">
            <span>COMPLIMENTARY GLOBAL EXPRESS SHIPPING ON ORDERS OVER $150 • CODE 'NOVARA20' FOR 20% OFF</span>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link to="/tracking" className="hover:text-on-surface transition-colors flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </Link>
            <div className="h-3 w-px bg-outline-variant"></div>
            <span className="text-tertiary font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Atelier Guarantee
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full px-4 lg:px-12">
        <div className="h-20 flex items-center justify-between gap-6">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-surface-container-high text-on-surface transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center gap-3 group">
              <img 
                alt="NOVARA Luxury Logo" 
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida/ALJJyrBh7GK5loeEXpT2KpGXXthD7CYoIA9Y2D4HfrT_74HMjFQDGOIPY08qgnrXkhb30BKyIIB0FYNmsNwpNjjOJI_rwYSsN48GypB5Z2a89WGNIGhxyrUm4jlRBm2zaRcAZ1FaUvXKNV7ldds6zH7I8i3gLiyEt7WKxUJUv2xQSnupke8dnZbkk3W-Y4VN8pHnSDTezCv3dmbOixFHmDUNa0IxhPfYpTRV93fGdTHp3jZo" 
              />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface font-semibold">
                  NOVARA
                </span>
                <span className="font-label-sm text-[9px] tracking-[0.2em] text-primary uppercase -mt-1 font-semibold">
                  Atelier Curated
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 text-label-lg font-label-lg transition-colors ${
                    active
                      ? 'bg-secondary-container text-on-secondary-container font-semibold rounded-lg'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, Wishlist, Cart, Profile */}
          <div className="flex items-center gap-3">
            {/* Desktop Search Bar */}
            <div className="relative hidden md:block w-64 lg:w-72">
              <SearchBar />
            </div>

            {/* Wishlist Icon */}
            <Link 
              to="/wishlist" 
              className="relative p-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-on-primary font-label-sm text-[10px] flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Icon with Live Count */}
            <Link 
              to="/cart" 
              className="relative p-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-tertiary text-on-tertiary font-label-sm text-[10px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Profile Dropdown */}
            <div className="relative ml-1">
              {isAuthenticated ? (
                <div>
                  <button 
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors"
                    aria-label="User Account Menu"
                  >
                    <img 
                      alt={user?.name || "Profile"} 
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-primary/20" 
                      src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBtf8_qJ4rrHC-1_cvkhERj6DS8ej99PDQYHIxA7siPymNO5pdiDDyFoLN5E5UDUNLvVXJwpWW3QAk-aEbdEiaTxsmRnvjePVl4FqTnnzserOmARVCk9ir6KPwc6NVTwZMDv-B91XYn5EEIO2Yk0tJnPMqenXq5tYr-CHlkrcZD7MkZWsOLymnwzwU5XjEfXIG_cynn-lOsHo8qo2xGujShL0JUfdtJqhOc5rDish0a"} 
                    />
                    <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-xl py-2 border border-surface-container-high z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-surface-container-high">
                        <p className="font-label-md text-label-md font-semibold text-on-surface truncate">{user?.name}</p>
                        <p className="font-label-sm text-[11px] text-primary uppercase tracking-wider">{user?.role}</p>
                      </div>

                      <Link 
                        to="/profile" 
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-body-sm text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <User className="w-4 h-4 text-on-surface-variant" />
                        <span>Collector Profile</span>
                      </Link>

                      <Link 
                        to="/orders" 
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-body-sm text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <Package className="w-4 h-4 text-on-surface-variant" />
                        <span>Order Dossiers</span>
                      </Link>

                      <Link 
                        to="/tracking" 
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-body-sm text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <Truck className="w-4 h-4 text-on-surface-variant" />
                        <span>Track Live Delivery</span>
                      </Link>

                      <div className="h-px bg-surface-container-high my-1"></div>

                      <button 
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-body-sm text-error hover:bg-error-container/20 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link 
                    to="/login"
                    className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar inside header if screen is small */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface-container-lowest border-b border-surface-container-high px-6 py-6 shadow-xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-body-md font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-secondary-container text-on-secondary-container font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-px bg-surface-container-high my-2"></div>
            
            <Link
              to="/tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-body-md text-on-surface-variant hover:bg-surface-container-low flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track Orders</span>
            </Link>

            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-body-md text-on-surface-variant hover:bg-surface-container-low flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Account & Dossiers</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
