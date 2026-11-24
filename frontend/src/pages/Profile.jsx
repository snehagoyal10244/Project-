import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  User, 
  MapPin, 
  Package, 
  ShieldCheck, 
  Check, 
  Phone, 
  Mail, 
  Calendar, 
  Award,
  Sparkles
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useCart();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Eleanor Vane',
    email: user?.email || 'eleanor.vane@atelier-vane.com',
    phone: user?.phone || '+1 (555) 234-8901',
    street: user?.shippingAddress?.street || '442 West Broadway, Penthouse 5B',
    city: user?.shippingAddress?.city || 'New York',
    state: user?.shippingAddress?.state || 'NY',
    postalCode: user?.shippingAddress?.postalCode || '10012'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: 'US',
        countryName: 'United States'
      }
    });
    setIsEditing(false);
    showToast('Atelier Collector profile updated successfully.');
  };

  return (
    <div className="w-full bg-background min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 space-y-8">
        {/* Header Profile Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-8 shadow-sm border border-surface-container-high">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img 
              src={user?.avatar} 
              alt={user?.name} 
              className="w-24 h-24 rounded-full object-cover shadow-md ring-4 ring-primary-fixed"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-bold uppercase tracking-wider">
                  {user?.role || 'Atelier VIP Collector'}
                </span>
                <span className="flex items-center gap-1 text-tertiary text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Provenance Tier
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface mt-1">
                {user?.name}
              </h1>
              <p className="text-body-sm text-on-surface-variant text-xs mt-0.5 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {user?.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Member Since: {user?.memberSince || 'November 2023'}
                </span>
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-5 py-2.5 rounded-lg border border-surface-container-high text-on-surface hover:bg-surface-container text-xs font-semibold transition-colors"
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Membership details */}
          <div className="space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-container-high space-y-4">
              <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span>Privileges & Tier</span>
              </h3>
              <ul className="space-y-3 text-xs text-on-surface-variant">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-tertiary flex-shrink-0" />
                  <span>Complimentary Global Express Courier</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-tertiary flex-shrink-0" />
                  <span>Private Access to Archival Editions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-tertiary flex-shrink-0" />
                  <span>Dedicated Personal Concierge (24/7)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-tertiary flex-shrink-0" />
                  <span>Bespoke presentation packaging on all gifts</span>
                </li>
              </ul>
            </div>

            <div className="bg-secondary-container/50 p-6 rounded-xl border border-secondary-container space-y-2">
              <div className="flex items-center gap-1.5 text-on-secondary-container font-semibold text-xs">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Active Privilege Code</span>
              </div>
              <p className="font-bold text-on-surface tracking-widest text-sm">NOVARA35</p>
              <p className="text-[11px] text-on-secondary-container">
                Entitles you to 35% off any seasonal piece or curated set.
              </p>
            </div>
          </div>

          {/* Right Column: Contact & Address Form */}
          <div className="md:col-span-2">
            <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-xl border border-surface-container-high shadow-sm">
              <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface text-lg mb-6 pb-3 border-b border-surface-container-high">
                Collector Information & Default Shipping
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-label-sm text-xs text-on-surface-variant uppercase block mb-1">
                      Full Legal Name
                    </label>
                    <input 
                      type="text"
                      name="name"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-lg text-sm focus:outline-none border border-surface-container-high disabled:opacity-75"
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-xs text-on-surface-variant uppercase block mb-1">
                      Email Address
                    </label>
                    <input 
                      type="email"
                      name="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-lg text-sm focus:outline-none border border-surface-container-high disabled:opacity-75"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-sm text-xs text-on-surface-variant uppercase block mb-1">
                    Direct Phone Number
                  </label>
                  <input 
                    type="text"
                    name="phone"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-lg text-sm focus:outline-none border border-surface-container-high disabled:opacity-75"
                  />
                </div>

                <div>
                  <label className="font-label-sm text-xs text-on-surface-variant uppercase block mb-1">
                    Shipping Address (Primary Dossier)
                  </label>
                  <input 
                    type="text"
                    name="street"
                    disabled={!isEditing}
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-lg text-sm focus:outline-none border border-surface-container-high disabled:opacity-75"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="font-label-sm text-xs text-on-surface-variant uppercase block mb-1">
                      City
                    </label>
                    <input 
                      type="text"
                      name="city"
                      disabled={!isEditing}
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-lg text-sm focus:outline-none border border-surface-container-high disabled:opacity-75"
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-xs text-on-surface-variant uppercase block mb-1">
                      State / Region
                    </label>
                    <input 
                      type="text"
                      name="state"
                      disabled={!isEditing}
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-lg text-sm focus:outline-none border border-surface-container-high disabled:opacity-75"
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-xs text-on-surface-variant uppercase block mb-1">
                      Postal Code
                    </label>
                    <input 
                      type="text"
                      name="postalCode"
                      disabled={!isEditing}
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-lg text-sm focus:outline-none border border-surface-container-high disabled:opacity-75"
                    />
                  </div>
                </div>

                {isEditing && (
                  <button
                    type="submit"
                    className="w-full mt-4 py-3 rounded-lg bg-primary hover:bg-on-surface text-on-primary font-label-md text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
