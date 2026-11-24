import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../services/api';
import { 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Lock, 
  Truck, 
  CreditCard, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, rawSubtotal, discountAmount, shippingCost, total, promoCode, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(2); // 1 = Bag, 2 = Shipping, 3 = Payment
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || 'eleanor.vane@atelier-vane.com',
    firstName: user?.firstName || 'Eleanor',
    lastName: user?.lastName || 'Vane',
    address: user?.shippingAddress?.street || '442 West Broadway, Penthouse 5B',
    city: user?.shippingAddress?.city || 'New York',
    state: user?.shippingAddress?.state || 'NY',
    postalCode: user?.shippingAddress?.postalCode || '10012',
    country: 'United States',
    shippingMethod: 'express', // express or priority
    paymentMethod: 'card', // card, klarna, paypal
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '•••'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderItems = cartItems.map(item => ({
        product: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        image: item.image
      }));

      const shippingAddress = {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: 'US',
        countryName: formData.country || 'United States'
      };

      const orderData = {
        items: orderItems,
        shippingAddress,
        paymentMethod: formData.paymentMethod === 'card' ? 'Card' : (formData.paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'),
        shippingCost,
        promoCode: promoCode || '',
        notes: `Atelier checkout via ${formData.paymentMethod}`
      };

      const res = await ordersApi.createOrder(orderData);
      if (res && res.order) {
        localStorage.setItem('novara_last_order', JSON.stringify(res.order));
        clearCart();
        navigate(`/tracking?orderNumber=${encodeURIComponent(res.order.orderNumber)}`);
        return;
      }
    } catch (err) {
      console.warn('Orders API offline or error, creating local order reference:', err.message);
    }

    const fallbackOrder = {
      orderNumber: "NVR-98421-E",
      trackingNumber: "TRK-NV-8842-IT",
      status: "Confirmed",
      deliveryCourier: "Ferrari Logistics SpA",
      estimatedDelivery: "October 28, 2024",
      items: cartItems,
      total: total
    };
    localStorage.setItem('novara_last_order', JSON.stringify(fallbackOrder));
    clearCart();
    navigate('/tracking');
  };

  return (
    <div className="w-full bg-background min-h-screen py-8">
      {/* Stepper Progress Ribbon */}
      <section className="w-full bg-surface-container-low/70 py-4 px-4 sm:px-8 lg:px-12 border-b border-surface-container-high/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link 
              to="/cart" 
              className="text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-colors font-label-md text-label-md tracking-wider uppercase text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Bag</span>
            </Link>
            <span className="text-outline-variant font-light">•</span>
            <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase text-xs font-semibold">
              Secure Session #NV-8842
            </span>
          </div>

          {/* Stepper Steps */}
          <nav aria-label="Checkout Progress" className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-1">
            {/* Step 1: Bag Completed */}
            <Link to="/cart" className="flex items-center gap-2 group cursor-pointer">
              <span className="w-6 h-6 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-label-sm text-label-sm text-xs">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface tracking-wider text-xs">
                01. Bag
              </span>
            </Link>

            <div className="w-8 h-px bg-outline-variant"></div>

            {/* Step 2: Shipping Active */}
            <button 
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-left"
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-label-sm text-label-sm font-semibold text-xs ${
                step === 2 ? 'bg-primary text-on-primary' : 'bg-tertiary text-on-tertiary'
              }`}>
                {step > 2 ? <Check className="w-3.5 h-3.5" /> : '02'}
              </span>
              <span className={`font-label-md text-label-md tracking-wider text-xs ${
                step === 2 ? 'font-semibold text-on-surface' : 'text-on-surface-variant'
              }`}>
                Shipping
              </span>
            </button>

            <div className="w-8 h-px bg-outline-variant"></div>

            {/* Step 3: Payment */}
            <button 
              onClick={() => setStep(3)}
              className="flex items-center gap-2 text-left"
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-label-sm text-label-sm font-semibold text-xs ${
                step === 3 ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                03
              </span>
              <span className={`font-label-md text-label-md tracking-wider text-xs ${
                step === 3 ? 'font-semibold text-on-surface' : 'text-on-surface-variant'
              }`}>
                Payment
              </span>
            </button>
          </nav>

          <div className="hidden xl:flex items-center gap-2 text-tertiary font-label-sm text-label-sm font-semibold tracking-wider text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>256-BIT ENCRYPTED CHECKOUT</span>
          </div>
        </div>
      </section>

      {/* Main Checkout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* LEFT COLUMN: Form Steps */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Express Checkout Options */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container-high">
              <div className="flex items-center justify-between mb-4">
                <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-semibold text-xs">
                  Express Atelier Checkout
                </span>
                <span className="font-label-sm text-label-sm text-primary text-xs">Instant Authorization</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  type="button"
                  onClick={() => setStep(3)}
                  className="h-11 rounded-lg bg-black text-white hover:opacity-90 transition-opacity flex items-center justify-center font-semibold text-sm shadow-sm"
                >
                  Pay
                </button>
                <button 
                  type="button"
                  onClick={() => setStep(3)}
                  className="h-11 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center font-bold text-sm shadow-sm"
                >
                  G Pay
                </button>
                <button 
                  type="button"
                  onClick={() => setStep(3)}
                  className="h-11 rounded-lg bg-[#FFC439] text-[#003087] hover:opacity-95 transition-opacity flex items-center justify-center font-bold text-sm italic shadow-sm"
                >
                  PayPal
                </button>
              </div>

              <div className="relative flex py-5 items-center">
                <div className="flex-grow h-px bg-surface-container-high"></div>
                <span className="flex-shrink mx-4 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant bg-surface-container-lowest px-2 text-[10px]">
                  OR CONTINUE WITH ATELIER CHECKOUT
                </span>
                <div className="flex-grow h-px bg-surface-container-high"></div>
              </div>
            </div>

            {/* STEP 2: Shipping & Address */}
            {step === 2 && (
              <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm border border-surface-container-high space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-surface-container-high">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md font-bold text-xs">
                      1
                    </span>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-lg">
                        Contact & Shipping Details
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                        Provide where your curated atelier goods will be delivered.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="font-label-md text-label-md font-semibold text-on-surface uppercase text-xs block mb-1">
                      Contact Information
                    </label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                      placeholder="Email address for tracking dossiers"
                      required
                    />
                  </div>

                  {/* Name fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs block mb-1">
                        First Name
                      </label>
                      <input 
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs block mb-1">
                        Last Name
                      </label>
                      <input 
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                        required
                      />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs block mb-1">
                      Street Address
                    </label>
                    <input 
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                      placeholder="House number, street name, apartment"
                      required
                    />
                  </div>

                  {/* City, State, Zip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs block mb-1">
                        City
                      </label>
                      <input 
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs block mb-1">
                        State
                      </label>
                      <input 
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs block mb-1">
                        Postal Code
                      </label>
                      <input 
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                        required
                      />
                    </div>
                  </div>

                  {/* Delivery Options */}
                  <div className="pt-4 space-y-2">
                    <label className="font-label-md text-label-md font-semibold text-on-surface uppercase text-xs block mb-1">
                      Delivery Method
                    </label>
                    <div 
                      onClick={() => setFormData(p => ({ ...p, shippingMethod: 'express' }))}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        formData.shippingMethod === 'express'
                          ? 'border-primary bg-primary-fixed/20'
                          : 'border-surface-container-high bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-label-md font-semibold text-on-surface text-xs">Complimentary Atelier Express</p>
                          <p className="text-on-surface-variant text-[11px]">Carbon-neutral air transport (2-4 business days)</p>
                        </div>
                      </div>
                      <span className="font-semibold text-tertiary text-xs">Free</span>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-full mt-6 py-4 rounded-lg bg-primary hover:bg-on-surface text-on-primary font-label-lg text-label-lg uppercase tracking-wider font-bold transition-all shadow-md flex items-center justify-center gap-2 text-xs"
                  >
                    <span>Proceed to Payment & Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 3 && (
              <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm border border-surface-container-high space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-surface-container-high">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md font-bold text-xs">
                      2
                    </span>
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-lg">
                        Payment & Final Authorization
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                        All transactions are securely encrypted and protected.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCompleteOrder} className="space-y-4">
                  {/* Card fields */}
                  <div className="p-4 rounded-xl border border-primary bg-surface-container-lowest space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
                      <span className="font-label-md font-semibold text-on-surface text-xs flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        Credit or Debit Card
                      </span>
                      <span className="text-[11px] text-tertiary font-medium">Encrypted PCI-DSS</span>
                    </div>

                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs block mb-1">
                        Card Number
                      </label>
                      <input 
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs block mb-1">
                          Expiration (MM/YY)
                        </label>
                        <input 
                          type="text"
                          name="cardExp"
                          value={formData.cardExp}
                          onChange={handleInputChange}
                          className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase text-xs block mb-1">
                          Security CVC
                        </label>
                        <input 
                          type="text"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          className="w-full bg-surface-container-low text-on-surface px-4 py-2.5 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-on-surface-variant space-y-1">
                    <p className="font-semibold text-on-surface">Delivering to:</p>
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.address}, {formData.city}, {formData.state} {formData.postalCode}</p>
                    <button 
                      type="button" 
                      onClick={() => setStep(2)}
                      className="text-primary hover:underline text-[11px] mt-1 inline-block"
                    >
                      Edit shipping address
                    </button>
                  </div>

                  <button 
                    type="submit"
                    className="w-full mt-6 py-4 rounded-lg bg-on-surface hover:bg-primary text-surface font-label-lg text-label-lg uppercase tracking-wider font-bold transition-all shadow-md flex items-center justify-center gap-2 text-xs"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Place Order — ${total.toFixed(2)}</span>
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Order Summary Dossier */}
          <div className="lg:col-span-5 sticky top-[120px] space-y-6">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high space-y-5">
              <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface pb-3 border-b border-surface-container-high flex items-center justify-between">
                <span>Acquisition Dossier</span>
                <span className="text-xs font-normal text-on-surface-variant font-sans">
                  {cartItems.length} items
                </span>
              </h3>

              {/* Items summary */}
              <div className="divide-y divide-surface-container-high max-h-64 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-14 object-cover rounded-md bg-surface-container flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-body-sm text-body-sm font-medium text-on-surface truncate text-xs">
                        {item.name}
                      </p>
                      <p className="text-on-surface-variant text-[11px]">
                        Qty: {item.quantity} • {item.selectedSize}
                      </p>
                    </div>
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface text-xs">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="pt-3 border-t border-surface-container-high space-y-2 text-xs text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-on-surface font-medium">${rawSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-tertiary">
                    <span>Discount ({promoCode})</span>
                    <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-tertiary font-semibold">Complimentary</span>
                </div>
                <div className="pt-3 border-t border-surface-container-high flex justify-between text-base font-headline-sm font-semibold text-on-surface">
                  <span>Total Amount</span>
                  <span className="text-xl font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
