import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const Footer = () => {
  const { showToast } = useCart();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      showToast('Thank you for subscribing to The Atelier Journal.');
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-surface-container-low text-on-surface mt-space-xl shadow-[0_-1px_12px_rgba(29,26,24,0.02)] border-t border-surface-container-high/60">
      <div className="w-full px-4 lg:px-12 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img 
                alt="NOVARA Luxury Logo" 
                className="h-7 w-auto object-contain" 
                src="https://lh3.googleusercontent.com/aida/ALJJyrBh7GK5loeEXpT2KpGXXthD7CYoIA9Y2D4HfrT_74HMjFQDGOIPY08qgnrXkhb30BKyIIB0FYNmsNwpNjjOJI_rwYSsN48GypB5Z2a89WGNIGhxyrUm4jlRBm2zaRcAZ1FaUvXKNV7ldds6zH7I8i3gLiyEt7WKxUJUv2xQSnupke8dnZbkk3W-Y4VN8pHnSDTezCv3dmbOixFHmDUNa0IxhPfYpTRV93fGdTHp3jZo" 
              />
              <span className="font-headline-sm text-headline-sm tracking-tight font-semibold">
                NOVARA
              </span>
            </Link>

            <p className="font-headline-sm text-headline-sm italic text-primary">
              Shop Smart. Live Better.
            </p>

            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm leading-relaxed">
              Curating timeless elegance, tactile home collections, and mindful ready-to-wear essentials crafted by premier European ateliers.
            </p>

            <div className="pt-2">
              <p className="font-label-md text-label-md font-semibold tracking-wider text-on-surface mb-2 uppercase text-[11px]">
                Join The Atelier Journal
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-tertiary font-body-sm text-body-sm bg-surface-container-lowest px-4 py-3 rounded-lg border border-tertiary/20">
                  <CheckCircle2 className="w-4 h-4 text-tertiary" />
                  <span>Welcome to the circle. Check your inbox soon.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center max-w-md gap-2">
                  <input 
                    className="flex-1 bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-surface-container-high" 
                    placeholder="Enter your personal email" 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button 
                    className="bg-primary text-on-primary hover:bg-on-surface font-label-md text-label-md px-5 py-2.5 rounded-lg transition-colors font-semibold shadow-sm flex items-center gap-1.5" 
                    type="submit"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Curation & Shop Column */}
          <div className="lg:col-span-2 lg:col-start-6 flex flex-col gap-3">
            <h3 className="font-label-lg text-label-lg font-semibold tracking-wider text-on-surface uppercase text-xs">
              Curation & Shop
            </h3>
            <ul className="flex flex-col gap-2.5 font-body-sm text-body-sm text-on-surface-variant">
              <li><Link className="hover:text-on-surface transition-colors" to="/shop?filter=new">New In</Link></li>
              <li><Link className="hover:text-on-surface transition-colors" to="/shop?category=apparel">Women's Atelier</Link></li>
              <li><Link className="hover:text-on-surface transition-colors" to="/shop?category=apparel">Men's Wardrobe</Link></li>
              <li><Link className="hover:text-on-surface transition-colors" to="/shop?category=home">Living & Decor</Link></li>
              <li><Link className="hover:text-on-surface transition-colors" to="/shop?category=beauty">Beauty & Wellness</Link></li>
              <li><Link className="hover:text-on-surface transition-colors" to="/shop?category=leather">Fine Leather & Carry</Link></li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="font-label-lg text-label-lg font-semibold tracking-wider text-on-surface uppercase text-xs">
              Customer Care
            </h3>
            <ul className="flex flex-col gap-2.5 font-body-sm text-body-sm text-on-surface-variant">
              <li><Link className="hover:text-on-surface transition-colors" to="/contact">Shipping & Delivery</Link></li>
              <li><Link className="hover:text-on-surface transition-colors" to="/contact">Returns & Exchanges</Link></li>
              <li><Link className="hover:text-on-surface transition-colors" to="/tracking">Order Tracking</Link></li>
              <li><Link className="hover:text-on-surface transition-colors" to="/contact">Size Guides</Link></li>
              <li><Link className="hover:text-on-surface transition-colors" to="/contact">Atelier FAQ</Link></li>
              <li><Link className="hover:text-on-surface transition-colors" to="/contact">Contact Concierge</Link></li>
            </ul>
          </div>

          {/* The House Column */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h3 className="font-label-lg text-label-lg font-semibold tracking-wider text-on-surface uppercase text-xs">
              The House
            </h3>
            <ul className="flex flex-col gap-2.5 font-body-sm text-body-sm text-on-surface-variant">
              <li><Link className="hover:text-on-surface transition-colors" to="/about">About NOVARA</Link></li>
              <li><Link className="hover:text-on-surface transition-colors" to="/about">The Atelier Manifesto</Link></li>
              <li><Link className="hover:text-on-surface transition-colors" to="/about">Sustainability Pledge</Link></li>
              <li><Link className="hover:text-on-surface transition-colors" to="/about">Master Artisans</Link></li>
              <li><Link className="hover:text-on-surface transition-colors" to="/contact">Press & Media</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Payment Badges & Copyright */}
        <div className="mt-14 pt-8 border-t border-surface-container-high flex flex-col lg:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-on-surface-variant">
          <div className="flex flex-wrap items-center gap-2.5 text-label-sm font-label-sm">
            <span className="px-2.5 py-1 bg-surface-container rounded font-medium">Visa</span>
            <span className="px-2.5 py-1 bg-surface-container rounded font-medium">Mastercard</span>
            <span className="px-2.5 py-1 bg-surface-container rounded font-medium">Amex</span>
            <span className="px-2.5 py-1 bg-surface-container rounded font-medium">Apple Pay</span>
            <span className="px-2.5 py-1 bg-surface-container rounded font-medium">PayPal</span>
            <span className="px-2.5 py-1 bg-surface-container rounded font-medium">Klarna</span>
            <span className="px-2.5 py-1 bg-surface-container rounded font-medium">UPI</span>
            <span className="px-2.5 py-1 bg-surface-container rounded font-medium">Net Banking</span>
            <span className="px-2.5 py-1 bg-surface-container-high text-tertiary font-semibold rounded">COD Available</span>
          </div>

          <div className="flex items-center gap-6 font-body-sm text-body-sm">
            <span>© {new Date().getFullYear()} NOVARA Inc. All Rights Reserved.</span>
            <Link className="hover:text-on-surface transition-colors" to="/about">Privacy Policy</Link>
            <Link className="hover:text-on-surface transition-colors" to="/about">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
