import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Lock, Mail, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = useCart();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await signup(name, email, password);
      showToast(`Welcome to NOVARA, ${name}. 15% discount activated.`);
      navigate('/shop');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Induction request could not be completed.');
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
            Private Induction
          </span>
          <h1 className="font-headline-lg text-headline-lg font-normal text-on-surface tracking-tight mt-1">
            Join the NOVARA Circle
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-1">
            Unlock complimentary global express delivery and 15% off your initial acquisition.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-label-sm text-xs text-on-surface-variant uppercase block mb-1">
              Full Name
            </label>
            <div className="relative">
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface pl-10 pr-4 py-3 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                placeholder="Eleanor Vane"
              />
              <User className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="font-label-sm text-xs text-on-surface-variant uppercase block mb-1">
              Personal Email
            </label>
            <div className="relative">
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface pl-10 pr-4 py-3 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                placeholder="name@domain.com"
              />
              <Mail className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="font-label-sm text-xs text-on-surface-variant uppercase block mb-1">
              Create Privilege Passcode
            </label>
            <div className="relative">
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface pl-10 pr-4 py-3 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                placeholder="Minimum 8 characters"
              />
              <Lock className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="p-3 bg-secondary-container/50 rounded-lg flex items-center gap-2 text-xs text-on-secondary-container">
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Includes 15% Welcome Key (NOVARA15) for your first acquisition.</span>
          </div>

          <button 
            type="submit"
            className="w-full py-4 rounded-lg bg-primary hover:bg-on-surface text-on-primary font-label-lg text-label-lg uppercase tracking-wider font-bold transition-all shadow-md flex items-center justify-center gap-2 text-xs"
          >
            <span>Complete Induction</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-surface-container-high text-center space-y-3">
          <p className="font-body-sm text-xs text-on-surface-variant">
            Already have an active atelier dossier?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
