import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { 
  ArrowLeft, 
  Trash2, 
  Heart, 
  Minus, 
  Plus, 
  ShieldCheck, 
  CheckCircle, 
  Gift, 
  ArrowRight, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    rawSubtotal,
    discountAmount,
    cartSubtotal, 
    shippingCost, 
    isFreeShipping, 
    freeShippingThreshold, 
    total,
    promoCode,
    applyPromoCode,
    removePromoCode
  } = useCart();

  const { toggleWishlist } = useWishlist();
  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyPromoCode(couponInput);
      setCouponInput('');
    }
  };

  const handleSaveForLater = (item) => {
    toggleWishlist({ id: item.productId, name: item.name });
    removeFromCart(item.id);
  };

  const progressPercent = Math.min(100, Math.round((rawSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="w-full bg-background min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Top Breadcrumb & Back Navigation */}
        <div className="flex items-center justify-between mb-6 pb-2 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider text-xs">
          <Link to="/shop" className="inline-flex items-center gap-1.5 hover:text-on-surface transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Continue Exploring Curations</span>
          </Link>
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-on-surface font-semibold">01. Bag</span>
            <span className="w-6 h-px bg-outline-variant"></span>
            <span className="text-on-surface-variant/60">02. Shipping</span>
            <span className="w-6 h-px bg-outline-variant"></span>
            <span className="text-on-surface-variant/60">03. Payment</span>
          </div>
        </div>

        {cartItems.length > 0 ? (
          <>
            {/* Title & Free Shipping Unlock Meter Banner */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-4">
                <div className="flex items-baseline gap-3">
                  <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface tracking-tight">
                    Your Shopping Bag
                  </h1>
                  <span className="font-label-lg text-label-lg text-primary font-medium text-sm">
                    ({cartItems.length} curated {cartItems.length === 1 ? 'item' : 'items'})
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                  Order Dossier: <span className="font-medium text-on-surface">#NVR-98421-E</span>
                </p>
              </div>

              {/* Shipping Progress Bar Card */}
              <div className="bg-surface-container-low rounded-xl p-5 shadow-sm border border-surface-container-high">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-tertiary" />
                    </div>
                    <div>
                      <p className="font-label-lg text-label-lg font-semibold text-on-surface text-sm">
                        {isFreeShipping 
                          ? 'Complimentary Express Global Shipping Unlocked!' 
                          : `Add $${freeShippingThreshold - rawSubtotal} more for Complimentary Express Shipping`}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                        You qualify for carbon-neutral express handling & atelier presentation gift wrapping.
                      </p>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider px-3 py-1 bg-tertiary text-on-tertiary rounded-full font-bold self-start sm:self-auto text-[11px]">
                    {isFreeShipping 
                      ? '100% Qualified' 
                      : `${progressPercent}% ($${rawSubtotal} / $${freeShippingThreshold})`}
                  </span>
                </div>

                {/* Progress Track */}
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-tertiary h-full rounded-full transition-all duration-700 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Two-Column Master Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* LEFT COLUMN: Line Items (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {cartItems.map((item) => (
                  <div 
                    key={item.id}
                    className="group bg-surface-container-lowest rounded-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-md shadow-sm relative flex flex-col sm:flex-row gap-5 items-start border border-surface-container-high/60"
                  >
                    {/* Thumbnail */}
                    <div className="w-full sm:w-36 h-48 sm:h-44 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0 relative">
                      <img 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        src={item.image} 
                      />
                      {item.badge && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-surface-container-highest/90 backdrop-blur-sm text-on-surface font-label-sm text-[10px] uppercase font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between w-full h-full min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold text-[11px]">
                              {item.categoryLabel || 'Atelier Collection'}
                            </span>
                            <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-0.5 tracking-tight text-lg">
                              <Link to={`/product/${item.productId}`} className="hover:text-primary transition-colors">
                                {item.name}
                              </Link>
                            </h2>
                          </div>
                          {/* Price Display */}
                          <div className="text-right flex-shrink-0">
                            <span className="font-body-lg text-body-lg font-semibold text-on-surface">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <span className="block font-label-sm text-label-sm text-on-surface-variant font-normal text-xs">
                              ${item.price} each
                            </span>
                          </div>
                        </div>

                        {/* Specs Pills */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {item.selectedColor && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container font-label-md text-label-md text-on-surface-variant text-xs">
                              <span 
                                className="w-2.5 h-2.5 rounded-full inline-block border border-outline-variant/30"
                                style={{ backgroundColor: item.colorHex || '#9e8f7d' }}
                              ></span>
                              Color: {item.selectedColor}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="px-2.5 py-1 rounded bg-surface-container font-label-md text-label-md text-on-surface-variant text-xs">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          <span className="px-2.5 py-1 rounded bg-surface-container-low text-tertiary font-label-md text-label-md font-medium text-xs">
                            In Stock ({item.origin || 'European Atelier'})
                          </span>
                        </div>
                      </div>

                      {/* Bottom Actions & Quantity Selector */}
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-surface-container-high/40">
                        {/* Quantity Stepper */}
                        <div className="inline-flex items-center bg-surface-container-low rounded-lg p-1 border border-surface-container-high">
                          <button 
                            aria-label="Decrease quantity" 
                            className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            type="button"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center font-label-lg text-label-lg font-semibold text-on-surface text-xs">
                            {item.quantity}
                          </span>
                          <button 
                            aria-label="Increase quantity" 
                            className="w-8 h-8 rounded flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            type="button"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Save for Later & Remove */}
                        <div className="flex items-center gap-4 text-on-surface-variant font-label-md text-label-md text-xs">
                          <button 
                            className="inline-flex items-center gap-1.5 hover:text-on-surface transition-colors py-1" 
                            onClick={() => handleSaveForLater(item)}
                            type="button"
                          >
                            <Heart className="w-4 h-4" />
                            <span>Save for later</span>
                          </button>
                          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                          <button 
                            className="inline-flex items-center gap-1.5 hover:text-error transition-colors py-1 group/del" 
                            onClick={() => removeFromCart(item.id)}
                            type="button"
                          >
                            <Trash2 className="w-4 h-4 group-hover/del:text-error" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT COLUMN: Order Summary (4 cols) */}
              <div className="lg:col-span-4 sticky top-[120px] space-y-6">
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container-high space-y-5">
                  <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface pb-3 border-b border-surface-container-high">
                    Order Summary
                  </h3>

                  {/* Promo Code Input */}
                  <div>
                    <span className="font-label-sm text-[11px] uppercase tracking-wider text-on-surface-variant block mb-2 font-semibold">
                      Promotional Privilege Code
                    </span>
                    {promoCode ? (
                      <div className="flex items-center justify-between bg-secondary-container px-3.5 py-2.5 rounded-lg text-on-secondary-container font-label-sm text-xs font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          {promoCode} Applied
                        </span>
                        <button 
                          onClick={removePromoCode}
                          className="text-error hover:underline text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="e.g. NOVARA20 or NOVARA35"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="flex-1 bg-surface-container-low text-on-surface placeholder:text-on-surface-variant px-3.5 py-2.5 rounded-lg text-xs focus:outline-none border border-surface-container-high"
                        />
                        <button 
                          type="submit"
                          className="px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold transition-colors"
                        >
                          Apply
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3 pt-3 border-t border-surface-container-high font-body-sm text-body-sm text-xs">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Cart Subtotal</span>
                      <span className="text-on-surface font-medium">${rawSubtotal.toFixed(2)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-tertiary">
                        <span>Privilege Discount ({promoCode})</span>
                        <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-on-surface-variant">
                      <span>Estimated Global Express</span>
                      <span className="text-tertiary font-semibold">
                        {isFreeShipping ? 'Complimentary' : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-on-surface-variant">
                      <span>Atelier Presentation Packaging</span>
                      <span className="text-tertiary font-semibold">Included</span>
                    </div>

                    <div className="pt-3 border-t border-surface-container-high flex justify-between items-baseline text-base">
                      <span className="font-headline-sm font-semibold text-on-surface">Total</span>
                      <span className="font-headline-sm font-bold text-on-surface text-xl">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Proceed to Checkout CTA */}
                  <button 
                    onClick={() => navigate('/checkout')}
                    className="w-full py-4 rounded-lg bg-primary hover:bg-on-surface text-on-primary font-label-lg text-label-lg uppercase tracking-wider font-bold transition-all shadow-md flex items-center justify-center gap-2 text-xs"
                  >
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-on-surface-variant text-[11px] pt-1">
                    <ShieldCheck className="w-4 h-4 text-tertiary" />
                    <span>256-Bit Encrypted & PCI-DSS Tokenized</span>
                  </div>
                </div>

                {/* Additional Trust Card */}
                <div className="bg-surface-container-low p-4 rounded-xl space-y-2 border border-surface-container-high text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2 text-on-surface font-semibold">
                    <Gift className="w-4 h-4 text-primary" />
                    <span>The Atelier Unboxing Ritual</span>
                  </div>
                  <p className="leading-relaxed">
                    All acquisitions arrive packed in unbleached organic linen wraps with cedar aroma blocks and an individualized provenance receipt.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty Bag State */
          <div className="bg-surface-container-lowest p-16 rounded-2xl text-center shadow-sm border border-surface-container-high max-w-xl mx-auto my-12">
            <ShoppingBag className="w-16 h-16 text-primary/40 mx-auto mb-4" />
            <h2 className="font-headline-md text-headline-md font-semibold text-on-surface mb-2">
              Your Atelier Bag is Empty
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8 text-sm leading-relaxed">
              Discover timeless silhouettes, tactile ceramics, and mindful ready-to-wear pieces crafted by quiet European ateliers.
            </p>
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-on-surface text-surface font-label-lg text-label-lg uppercase tracking-wider font-semibold hover:bg-primary transition-colors shadow-md text-xs"
            >
              <span>Explore Curations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
