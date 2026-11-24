import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { 
  Headphones, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Send, 
  MessageSquare,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

const Contact = () => {
  const { showToast } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Atelier Sizing & Consultation',
    message: ''
  });

  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "What is the typical transit duration for complimentary express orders?",
      a: "All orders over $150 receive complimentary carbon-neutral air express shipping. Deliveries within North America and Europe typically arrive within 2 to 4 business days."
    },
    {
      q: "How does the 30-Day Effortless Return process work?",
      a: "We offer complimentary doorstep pickup for returns. All returned items must remain unworn with intact atelier provenance tags and original unbleached cotton presentation packaging."
    },
    {
      q: "Can I request personalized sizing counsel or interior curation advice?",
      a: "Yes. Our private concierge team provides bespoke sizing counsel and interior styling advice via email or scheduled video appointment."
    },
    {
      q: "What payment methodologies are supported?",
      a: "We accept all major credit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, PayPal, Klarna 4 interest-free installments, UPI, and Net Banking."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Concierge inquiry dispatched. We will reply within 4 hours.');
  };

  return (
    <div className="w-full bg-background min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-primary text-xs font-semibold">
            Dedicated Assistance
          </span>
          <h1 className="font-headline-lg text-headline-lg font-semibold text-on-surface tracking-tight">
            Customer Concierge & Inquiries
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-sm">
            Whether inquiring about provenance, custom dimensions, or express fulfillment, our team is at your counsel.
          </p>
        </div>

        {/* Contact Grid: Info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-container-high space-y-6 shadow-sm">
              <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface text-base">
                Direct Atelier Channels
              </h3>

              <div className="space-y-4 text-xs text-on-surface-variant">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-on-surface block text-xs">Direct Concierge Email</span>
                    <span>concierge@novara-atelier.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-on-surface block text-xs">VIP Collector Line</span>
                    <span>+1 (800) 942-0192 (Toll Free)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-on-surface block text-xs">Hours of Counsel</span>
                    <span>Monday – Sunday • 24/7 Global Coverage</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Atelier Flagship Locations */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-container-high space-y-4 shadow-sm">
              <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Flagship Boutiques</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs text-on-surface-variant">
                <div>
                  <p className="font-semibold text-on-surface">Milan Flagship</p>
                  <p className="text-[11px]">Via Monte Napoleone 14</p>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">Paris Salon</p>
                  <p className="text-[11px]">Rue du Faubourg Saint-Honoré 28</p>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">New York Studio</p>
                  <p className="text-[11px]">442 West Broadway, SoHo</p>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">Tokyo Ginza</p>
                  <p className="text-[11px]">6 Chome Ginza, Chuo City</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-surface-container-high shadow-sm">
              <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface text-lg mb-2">
                Send a Private Counsel Request
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mb-6">
                Fill in your request below. A senior stylist or provenance specialist will answer directly.
              </p>

              {submitted ? (
                <div className="p-8 rounded-xl bg-surface-container text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-tertiary mx-auto" />
                  <h4 className="font-headline-sm font-semibold text-on-surface">Inquiry Received</h4>
                  <p className="font-body-sm text-on-surface-variant text-xs max-w-md mx-auto">
                    Your counsel ticket has been assigned to a senior concierge partner. Expect a response in your inbox shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-label-sm text-xs text-on-surface-variant uppercase block mb-1">
                        Your Name
                      </label>
                      <input 
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                        className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                        placeholder="Eleanor Vane"
                      />
                    </div>
                    <div>
                      <label className="font-label-sm text-xs text-on-surface-variant uppercase block mb-1">
                        Email Address
                      </label>
                      <input 
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                        className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                        placeholder="name@atelier.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-label-sm text-xs text-on-surface-variant uppercase block mb-1">
                      Inquiry Discipline
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                      className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg text-sm focus:outline-none border border-surface-container-high cursor-pointer"
                    >
                      <option>Atelier Sizing & Consultation</option>
                      <option>Order & Dispatch Tracking</option>
                      <option>Bespoke Presentation Inquiries</option>
                      <option>Artisan Provenance Questions</option>
                      <option>Press & Private Salon Access</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-label-sm text-xs text-on-surface-variant uppercase block mb-1">
                      Message
                    </label>
                    <textarea 
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                      className="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-lg text-sm focus:outline-none border border-surface-container-high"
                      placeholder="Detail your request or specific garment / vessel of interest..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 rounded-lg bg-on-surface hover:bg-primary text-surface font-label-lg text-label-lg uppercase tracking-wider font-bold transition-all shadow-md flex items-center justify-center gap-2 text-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch Inquiry to Concierge</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-surface-container-low p-8 sm:p-12 rounded-2xl border border-surface-container-high space-y-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface">
              Frequently Clarified Inquiries
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-surface-container-lowest rounded-xl border border-surface-container-high overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-headline-sm text-sm font-semibold text-on-surface hover:text-primary transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-on-surface-variant leading-relaxed border-t border-surface-container-high/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
