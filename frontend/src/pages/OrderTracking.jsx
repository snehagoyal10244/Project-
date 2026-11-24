import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  CheckCircle, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  Package, 
  Truck, 
  Home, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../services/api';

const OrderTracking = () => {
  const { showToast } = useCart();
  const [searchParams] = useSearchParams();
  const paramOrderNumber = searchParams.get('orderNumber');
  const [copiedCode, setCopiedCode] = useState(false);

  const [order, setOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('novara_last_order');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  useEffect(() => {
    const fetchOrder = async () => {
      const target = paramOrderNumber || order?.orderNumber;
      if (target) {
        try {
          const res = await ordersApi.trackOrder(target);
          if (res && res.order) {
            setOrder(res.order);
          }
        } catch (e) {
          console.warn('Could not track live order from API:', e.message);
        }
      }
    };
    fetchOrder();
  }, [paramOrderNumber]);

  const orderNumber = order?.orderNumber || paramOrderNumber || "NVR-98421-E";
  const trackingNumber = order?.trackingNumber || "TRK-NV-8842-IT";
  const courier = order?.deliveryCourier || "Ferrari Logistics SpA";

  const handleCopyTracking = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(trackingNumber);
    }
    setCopiedCode(true);
    showToast('Tracking ID copied to clipboard');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="w-full bg-background min-h-screen py-8">
      <div className="w-full px-4 lg:px-12 py-4 max-w-7xl mx-auto flex flex-col gap-8">
        {/* Top Progress Indicator Banner */}
        <div className="flex items-center justify-between text-label-sm font-label-sm text-secondary uppercase tracking-[0.2em] text-xs">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            <span>Receipt & Dispatch Dossier</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-on-surface-variant font-medium text-xs">
            <span>Order Reference: <strong className="text-on-surface font-semibold">#{orderNumber}</strong></span>
            <span>•</span>
            <span>Secure Atelier Checkout</span>
          </div>
        </div>

        {/* Celebration Header & Status Card */}
        <section className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-6 lg:p-10 shadow-md border border-surface-container-high">
          {/* Ambient Decorative Backdrop Gradient */}
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-gradient-to-br from-primary-fixed/25 to-tertiary-fixed/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4 lg:gap-6 max-w-2xl">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shadow-sm">
                  <CheckCircle className="w-7 h-7 text-tertiary fill-current text-surface-container-lowest" />
                </div>
                <div className="absolute -inset-1 rounded-full bg-tertiary/10 animate-ping pointer-events-none"></div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-label-sm text-label-sm uppercase tracking-[0.16em] text-primary font-semibold text-xs">
                  Order Confirmed & Payment Verified
                </span>
                <h1 className="font-headline-lg text-headline-lg font-normal tracking-tight text-on-surface text-2xl lg:text-3xl">
                  Thank you. Your acquisition has been curated & confirmed.
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 text-sm leading-relaxed">
                  A comprehensive confirmation receipt and courier tracking dossier have been dispatched to{' '}
                  <span className="font-semibold text-on-surface underline decoration-outline-variant underline-offset-4">
                    eleanor.vane@atelier-vane.com
                  </span>.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2 text-label-md font-label-md text-secondary text-xs">
                  <span className="inline-flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded">
                    #{orderNumber}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    October 24, 2024 at 14:32 CET
                  </span>
                  <span>•</span>
                  <span className="text-tertiary font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Payment Authorized
                  </span>
                </div>
              </div>
            </div>

            {/* Document Export CTA Group */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 lg:self-center flex-shrink-0">
              <button 
                onClick={() => showToast('Generating official PDF invoice...')}
                className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-on-surface font-label-md text-label-md px-5 py-3 rounded-lg shadow-sm transition-all text-xs font-semibold"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Invoice (PDF)</span>
              </button>
              <button 
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md px-5 py-3 rounded-lg transition-colors text-xs font-semibold border border-surface-container-high"
              >
                <Printer className="w-4 h-4" />
                <span>Print Atelier Receipt</span>
              </button>
            </div>
          </div>
        </section>

        {/* Visual Timeline / Live Order & Fulfillment Stepper */}
        <section className="rounded-xl bg-surface-container-lowest p-6 lg:p-8 shadow-sm flex flex-col gap-6 border border-surface-container-high">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary text-xs font-semibold">
                Live Dispatch Schedule
              </span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-lg">
                Curated Fulfillment Progress
              </h2>
            </div>

            {/* Copyable Live Tracker */}
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg self-start sm:self-auto border border-surface-container-high">
              <Truck className="w-4 h-4 text-tertiary" />
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium text-xs">
                Tracking Code:
              </span>
              <span className="font-label-md text-label-md font-semibold text-on-surface tracking-wider text-xs">
                {trackingNumber}
              </span>
              <button 
                onClick={handleCopyTracking}
                className="p-1 text-on-surface-variant hover:text-on-surface transition-colors" 
                title="Copy Tracking ID"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-tertiary" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Stepper Nodes */}
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
            {/* Step 1: Finished */}
            <div className="relative z-10 flex flex-row md:flex-col items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                <Check className="w-5 h-5 text-on-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider text-[11px]">
                  Step 01 • Finished
                </span>
                <h3 className="font-body-md text-body-md font-semibold text-on-surface mt-0.5 text-sm">
                  Order Confirmed
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5">
                  Payment verified & tokenized via PCI-DSS Vault.
                </p>
                <span className="font-label-sm text-label-sm text-secondary mt-1 text-[11px]">
                  Oct 24, 14:32 CET
                </span>
              </div>
            </div>

            {/* Step 2: In Progress */}
            <div className="relative z-10 flex flex-row md:flex-col items-start gap-4">
              <div className="relative w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-md">
                <Package className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-tertiary animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-tertiary"></span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-tertiary uppercase font-bold tracking-wider text-[11px]">
                  Step 02 • In Progress
                </span>
                <h3 className="font-body-md text-body-md font-semibold text-on-surface mt-0.5 text-sm">
                  Artisanal Packaging
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5">
                  Hand-inspection & mulberry tissue layering in Milan Atelier hub.
                </p>
                <span className="font-label-sm text-label-sm text-tertiary font-semibold mt-1 text-[11px]">
                  Active Now • Desk #4
                </span>
              </div>
            </div>

            {/* Step 3: Upcoming */}
            <div className="relative z-10 flex flex-row md:flex-col items-start gap-4 opacity-70">
              <div className="w-11 h-11 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold tracking-wider text-[11px]">
                  Step 03 • Next
                </span>
                <h3 className="font-body-md text-body-md font-semibold text-on-surface mt-0.5 text-sm">
                  Global Express Transit
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5">
                  Departing Malpensa Airport (MXP) direct to New York (JFK).
                </p>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 text-[11px]">
                  Est. Tomorrow, 08:00 EST
                </span>
              </div>
            </div>

            {/* Step 4: Final */}
            <div className="relative z-10 flex flex-row md:flex-col items-start gap-4 opacity-70">
              <div className="w-11 h-11 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center flex-shrink-0">
                <Home className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold tracking-wider text-[11px]">
                  Step 04 • Arrival
                </span>
                <h3 className="font-body-md text-body-md font-semibold text-on-surface mt-0.5 text-sm">
                  Doorstep Delivery
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mt-0.5">
                  White glove courier delivery with signature confirmation.
                </p>
                <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 text-[11px]">
                  Est. Oct 27, 2024
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Courier & Destination Dossier Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-container-high space-y-3">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Destination Dossier</span>
            </div>
            <p className="font-headline-sm font-semibold text-on-surface">Eleanor Vane</p>
            <p className="text-body-sm text-on-surface-variant text-xs">442 West Broadway, Penthouse 5B</p>
            <p className="text-body-sm text-on-surface-variant text-xs">New York, NY 10012 • United States</p>
            <p className="text-body-sm text-on-surface-variant text-xs">Contact: +1 (555) 234-8901</p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-container-high space-y-3">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Courier Concierge Service</span>
            </div>
            <p className="font-headline-sm font-semibold text-on-surface">DHL Global Luxury Express</p>
            <p className="text-body-sm text-on-surface-variant text-xs">Direct Milan-New York Courier flight DL-8842</p>
            <p className="text-body-sm text-on-surface-variant text-xs">Carbon-neutral offset certificate attached</p>
            <Link to="/contact" className="inline-block text-primary text-xs font-semibold hover:underline">
              Contact Courier Concierge →
            </Link>
          </div>
        </div>

        {/* Continue Exploring CTA */}
        <div className="text-center pt-4 pb-12">
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-on-surface text-surface font-label-lg text-label-lg uppercase tracking-wider font-semibold hover:bg-primary transition-colors shadow-md text-xs"
          >
            <span>Continue Exploring Atelier Pieces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
