import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useCart();

  const [email, setEmail] = useState('eleanor.vane@atelier-vane.com');
  const [password, setPassword] = useState('password123');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await login(email, password);
      showToast(`Welcome back, ${email.split('@')[0]}`);
      navigate('/profile');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-background min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-surface-container-lowest p-8 sm:p-10 rounded-2xl shadow-md border border-surface-container-high space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <img 
              alt="NOVARA Logo" 
              className="h-8 w-auto object-contain mx-auto" 
              src="https://lh3.googleusercontent.com/aida/ALJJyrBh7GK5loeEXpT2KpGXXthD7CYoIA9Y2D4HfrT_74HMjFQDGOIPY08qgnrXkhb30BKyIIB0FYNmsNwpNjjOJI_rwYSsN48GypB5Z2a89WGNIGhxyrUm4jlRBm2zaRcAZ1FaUvXKNV7ldds6zH7I8i3gLiyEt7WKxUJUv2xQSnupke8dnZbkk3W-Y4VN8pHnSDTezCv3dmbOixFHmDUNa0IxhPfYpTRV93fGdTHp3jZo" 
            />
          </Link>
          <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary text-xs block font-semibold">
            Atelier Portal
          </span>
          <h1 className="font-headline-lg text-headline-lg font-normal text-on-surface tracking-tight mt-1">
            Sign In to Circle
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-1">
            Access your private dossiers, saved acquisitions, and concierge requests.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-label-sm text-xs text-on-surface-variant uppercase block mb-1">
              Collector Email
            </label>
            <div className="relative">
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface pl-10 pr-4 py-3 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                placeholder="name@atelier.com"
              />
              <Mail className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-label-sm text-xs text-on-surface-variant uppercase block">
                Privilege Key / Password
              </label>
              <button type="button" className="text-primary text-[11px] hover:underline">
                Forgot key?
              </button>
            </div>
            <div className="relative">
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface pl-10 pr-4 py-3 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 rounded-lg bg-on-surface hover:bg-primary text-surface font-label-lg text-label-lg uppercase tracking-wider font-bold transition-all shadow-md flex items-center justify-center gap-2 text-xs"
          >
            <span>Enter Private Lounge</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-surface-container-high text-center space-y-3">
          <p className="font-body-sm text-xs text-on-surface-variant">
            Not yet inducted into the NOVARA Circle?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Request Induction
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-tertiary text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted Atelier Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
