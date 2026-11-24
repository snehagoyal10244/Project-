import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { productsApi } from '../services/api';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Truck, 
  Leaf, 
  RotateCcw, 
  Headphones, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Star, 
  ShieldCheck, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart, showToast } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Drop Countdown Timer (4 days, 18 hrs, 42 mins, 9 secs)
  const [timeLeft, setTimeLeft] = useState(() => {
    return (4 * 86400) + (18 * 3600) + (42 * 60) + 9;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  // Best Sellers Filter Tab State
  const [activeTab, setActiveTab] = useState('all');
  const [copiedCode, setCopiedCode] = useState(false);
  const [productList, setProductList] = useState(products);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const res = await productsApi.getProducts({ limit: 20 });
        if (res && res.products && res.products.length > 0) {
          const formatted = res.products.map(p => ({
            ...p,
            id: p.slug || p._id,
            coverImage: p.coverImage || (p.images && p.images[0])
          }));
          setProductList(formatted);
        }
      } catch (e) {
        // Fallback to local products
      }
    };
    fetchHomeProducts();
  }, []);

  // Newsletter Form State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterJoined, setNewsletterJoined] = useState(false);

  const handleCopyCode = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedCode(true);
    showToast(`Code '${code}' copied to clipboard!`);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterJoined(true);
      showToast('Welcome to the NOVARA Circle. Check your inbox.');
      setNewsletterEmail('');
    }
  };

  // Filter best sellers
  const filteredBestSellers = productList.filter((p) => {
    if (!p.isBestSeller) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'apparel') return p.category === 'apparel';
    if (activeTab === 'decor') return p.category === 'home';
    if (activeTab === 'objects') return p.category === 'home' || p.category === 'leather';
    return true;
  });

  const trendingProducts = productList.filter((p) => p.isTrending);

  return (
    <div className="w-full bg-background min-h-screen">
      {/* SECTION 1: Editorial Split Hero */}
      <section className="relative w-full px-4 lg:px-12 pt-6 pb-16 lg:pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typography & Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1 pt-4 lg:pt-0">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-px bg-primary"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-primary font-semibold text-xs">
                The 2025 Permanent Curation
              </span>
            </div>

            <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-on-surface leading-[1.08] tracking-tight mb-6">
              Effortless Elegance <br className="hidden sm:inline" />
              <span className="italic font-normal font-display-lg text-primary">
                for Modern Living
              </span>
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed">
              Discover meticulously crafted apparel, minimalist home aesthetics, and clean daily essentials, consciously sourced from quiet European ateliers.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                to="/shop" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-on-surface text-surface font-label-lg text-label-lg uppercase tracking-wider font-semibold shadow-md hover:bg-primary transition-all duration-300 hover:shadow-lg group"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/about" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-surface-container text-on-surface font-label-lg text-label-lg uppercase tracking-wider font-semibold hover:bg-surface-container-high transition-colors group"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 ml-2 text-primary group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Metric micro-callout */}
            <div className="mt-12 pt-8 flex items-center gap-6 sm:gap-8 border-t border-surface-container-high">
              <div>
                <div className="font-display-lg text-headline-lg font-normal text-on-surface">98.4%</div>
                <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant text-[11px]">
                  Traceable Provenance
                </div>
              </div>
              <div className="w-px h-10 bg-outline-variant"></div>
              <div>
                <div className="font-display-lg text-headline-lg font-normal text-on-surface">32</div>
                <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant text-[11px]">
                  Master Artisans
                </div>
              </div>
              <div className="w-px h-10 bg-outline-variant"></div>
              <div>
                <div className="font-display-lg text-headline-lg font-normal text-tertiary">Zero</div>
                <div className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant text-[11px]">
                  Single-Use Plastics
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Editorial Visuals */}
          <div className="lg:col-span-6 order-1 lg:order-2 relative">
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low shadow-xl">
              <img 
                alt="High-end editorial fashion photography" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBXFE1UXaPEFepcKWfCHy1gSojBlLc3621LlXpxAq2BSCdZPR6FfEEDyIFO-ThjR4WDXv8hUuCSBDDuR1KDfNS6_vG3bCbJElfM17BE6of2fK32yGXVwk3fbHQUkFlOKUk0qezyp6XXEgPPvoFINzjKBQ9rEZj-Pne3h6HuGkZlrwAdBdClr1XKWaki14ljglcOT_AvPmcIcrQTW1QW9QimirWacgVmnQmMYtl5lee" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 via-transparent to-transparent"></div>

              {/* Floating Lookbook Pill */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-lg bg-surface/90 backdrop-blur-md shadow-lg flex items-center justify-between border border-surface-container-high/40">
                <div>
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest block text-[11px] font-semibold">
                    Lookbook No. 14
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-medium">
                    The Sculptural Silhouette
                  </span>
                </div>
                <Link 
                  to="/shop" 
                  className="p-2.5 rounded-full bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-colors"
                  aria-label="View lookbook item"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Overlapping Secondary Card */}
            <div className="hidden sm:flex absolute -bottom-6 -left-8 p-4 rounded-xl bg-surface-container-lowest shadow-2xl items-center gap-4 max-w-xs z-10 border border-surface-container-high/60">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                <img 
                  alt="Travertine Minimal Urn" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoM2texUC_k7QkuMeuYfxvldSetSURFDuAJrpSCmkpvHREbHPjLq8HnFiNdVzhnzp8s5Q79pOUBFWNYSa96cAyqZWg1kIn6mqJKgb7_gxWb-98RQqExXxkVBFqp2ptsr__M6BjLdNZ2qk-0qRr03zhgpAMFFvcR5Cp7xKt9jWFtlhONPZwWRe8-dKlibqGp7xYbbBvN25JTo6zmJYyjSOjU7azaqtjgrult1JDeBIW" 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-tertiary font-semibold uppercase tracking-wider text-[10px]">
                  Atelier Release
                </span>
                <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                  Travertine Minimal Urn
                </span>
                <span className="font-label-md text-label-md text-primary font-bold mt-0.5">
                  $185.00
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges Strip */}
        <div className="mt-16 pt-8 pb-8 px-6 bg-surface-container-low rounded-xl shadow-sm border border-surface-container-high/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-label-lg text-label-lg font-semibold text-on-surface leading-tight">
                  Complimentary Delivery
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                  Global express on orders over $150
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-tertiary flex-shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <p className="font-label-lg text-label-lg font-semibold text-on-surface leading-tight">
                  Artisanal & Sustainable
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                  100% natural, traceable textiles
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <p className="font-label-lg text-label-lg font-semibold text-on-surface leading-tight">
                  30-Day Effortless Returns
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                  Doorstep pickup & direct refunds
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <p className="font-label-lg text-label-lg font-semibold text-on-surface leading-tight">
                  Dedicated Concierge
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                  Private style counsel available 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Featured Categories */}
      <section className="w-full px-4 lg:px-12 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px bg-primary"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary text-xs font-semibold">
                Department Curation
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg font-normal text-on-surface tracking-tight">
              Distinct Disciplines
            </h2>
          </div>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-1 font-label-lg text-label-lg text-primary hover:text-on-surface transition-colors font-semibold group text-sm"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* SECTION 3: Trending Products */}
      <section className="w-full px-4 lg:px-12 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px bg-primary"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary text-xs font-semibold">
                In High Demand
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg font-normal text-on-surface tracking-tight">
              Trending Now
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              to="/shop?filter=trending" 
              className="inline-flex items-center gap-1 font-label-lg text-label-lg text-primary hover:text-on-surface transition-colors font-semibold text-sm"
            >
              <span>Explore All Trending</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 4: Editorial Spotlight Banner */}
      <section className="w-full px-4 lg:px-12 py-8 max-w-7xl mx-auto">
        <div className="relative w-full rounded-2xl bg-surface-container-high overflow-hidden shadow-lg border border-surface-container-highest">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
            {/* Imagery Area */}
            <div className="lg:col-span-6 relative h-72 lg:h-auto overflow-hidden">
              <img 
                alt="Spring Atelier Lookbook" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuHKV6wgiMND1BjOgcaucRgv5dZpFMCcpPigFwPBelm2SkuTicG7-do6tDbnp9mQwUQ5uGpq2wOviSr-Slj_SMleClgO4nDiPOuL667_xedVUfIg29NZ8U6f93vuBWyp4aZmFF2gN5w2dUnGG-46V7UIBS5RMwuq8m0mtBH-Km97lq5-pG5vf0qFTyybTONFz6Azeqacpwb_X3Ytzr2t-3Vo79dkzyqm_UXbb2gNxP" 
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-transparent to-surface-container-high/60"></div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-6 p-8 lg:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-px bg-primary"></span>
                <span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-primary text-xs font-semibold">
                  Limited Capsule
                </span>
              </div>

              <h2 className="font-display-lg text-headline-lg lg:text-display-lg text-on-surface font-normal tracking-tight mb-2">
                The Spring/Summer <br />
                <span className="italic font-display-lg text-primary">Atelier Edition</span>
              </h2>

              <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-8 leading-relaxed">
                Crafted with intention. An homage to tactile serenity featuring raw wild silks, lightweight unbleached slub cotton, and sculpted olive wood homeware.
              </p>

              {/* Drop Countdown Timer */}
              <div className="mb-8">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant block mb-3 text-[11px] font-semibold">
                  Seasonal Drop Closes In
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-surface-container-lowest shadow-sm">
                    <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                      {String(days).padStart(2, '0')}
                    </span>
                    <span className="font-label-sm text-[10px] tracking-wider text-on-surface-variant uppercase">
                      Days
                    </span>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-outline">:</span>
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-surface-container-lowest shadow-sm">
                    <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                      {String(hours).padStart(2, '0')}
                    </span>
                    <span className="font-label-sm text-[10px] tracking-wider text-on-surface-variant uppercase">
                      Hours
                    </span>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-outline">:</span>
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-surface-container-lowest shadow-sm">
                    <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                      {String(mins).padStart(2, '0')}
                    </span>
                    <span className="font-label-sm text-[10px] tracking-wider text-on-surface-variant uppercase">
                      Mins
                    </span>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-outline">:</span>
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-surface-container-lowest shadow-sm">
                    <span className="font-headline-sm text-headline-sm font-semibold text-primary">
                      {String(secs).padStart(2, '0')}
                    </span>
                    <span className="font-label-sm text-[10px] tracking-wider text-on-surface-variant uppercase">
                      Secs
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Link 
                  to="/shop" 
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-on-surface text-surface font-label-lg text-label-lg uppercase tracking-wider font-semibold shadow-sm hover:bg-primary transition-colors group"
                >
                  <span>Discover The Lookbook</span>
                  <BookOpen className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Best Sellers with Tab Filter */}
      <section className="w-full px-4 lg:px-12 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px bg-primary"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary text-xs font-semibold">
                Timeless Icons
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg font-normal text-on-surface tracking-tight">
              Best Sellers
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <button 
              className={`px-5 py-2.5 rounded-full text-label-md font-label-md tracking-wider font-semibold transition-all text-xs ${
                activeTab === 'all'
                  ? 'bg-on-surface text-surface shadow-sm'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => setActiveTab('all')}
              type="button"
            >
              All
            </button>
            <button 
              className={`px-5 py-2.5 rounded-full text-label-md font-label-md tracking-wider font-semibold transition-all text-xs ${
                activeTab === 'apparel'
                  ? 'bg-on-surface text-surface shadow-sm'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => setActiveTab('apparel')}
              type="button"
            >
              Ready-to-Wear
            </button>
            <button 
              className={`px-5 py-2.5 rounded-full text-label-md font-label-md tracking-wider font-semibold transition-all text-xs ${
                activeTab === 'decor'
                  ? 'bg-on-surface text-surface shadow-sm'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => setActiveTab('decor')}
              type="button"
            >
              Living Decor
            </button>
            <button 
              className={`px-5 py-2.5 rounded-full text-label-md font-label-md tracking-wider font-semibold transition-all text-xs ${
                activeTab === 'objects'
                  ? 'bg-on-surface text-surface shadow-sm'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => setActiveTab('objects')}
              type="button"
            >
              Objects
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBestSellers.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 6: Special Promotional Discount Banner */}
      <section className="w-full px-4 lg:px-12 py-8 max-w-7xl mx-auto">
        <div className="relative w-full rounded-2xl bg-secondary-container p-8 lg:p-12 overflow-hidden shadow-md border border-secondary-container">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-surface/70 text-on-surface text-label-sm font-label-sm uppercase tracking-widest font-semibold mb-3 text-xs">
                Private Client Access
              </span>
              <h2 className="font-headline-lg text-headline-lg font-normal text-on-surface tracking-tight mb-2">
                Mid-Season Private Sale
              </h2>
              <p className="font-body-md text-body-md text-on-secondary-container leading-relaxed">
                Enjoy up to 35% off selected atelier curations, archival apparel, and hand-poured candle sets with your bespoke privilege key.
              </p>
            </div>

            {/* Coupon Copy Component */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center justify-between gap-4 bg-surface-container-lowest px-5 py-3.5 rounded-lg shadow-sm w-full sm:w-auto border border-surface-container-high">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Coupon Code
                  </span>
                  <span className="font-label-lg text-label-lg font-bold tracking-widest text-on-surface">
                    NOVARA35
                  </span>
                </div>
                <button 
                  aria-label="Copy promotion code" 
                  className="p-2 rounded-md hover:bg-surface-container transition-colors text-primary flex items-center justify-center" 
                  onClick={() => handleCopyCode('NOVARA35')} 
                  type="button"
                >
                  {copiedCode ? <Check className="w-5 h-5 text-tertiary" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              <button 
                className="w-full sm:w-auto px-7 py-4 rounded-lg bg-on-surface text-surface text-label-lg font-label-lg uppercase tracking-wider font-semibold hover:bg-primary transition-colors shadow-md whitespace-nowrap" 
                onClick={() => handleCopyCode('NOVARA35')} 
                type="button"
              >
                Claim 35% Off
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Customer Testimonials */}
      <section className="w-full px-4 lg:px-12 py-16 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-6 h-px bg-primary"></span>
            <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary text-xs font-semibold">
              Voices of Living
            </span>
            <span className="w-6 h-px bg-primary"></span>
          </div>
          <h2 className="font-headline-lg text-headline-lg font-normal text-on-surface tracking-tight">
            The Atelier Experience
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Reflections from collectors who embrace conscious, intentional living.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Testimonial 1 */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm flex flex-col justify-between border border-surface-container-high/50">
            <div>
              <div className="flex items-center gap-1 text-primary mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-primary" />
                ))}
              </div>
              <p className="font-headline-sm text-headline-sm italic text-on-surface font-normal mb-6 leading-relaxed">
                “The cashmere cardigan feels like an heirloom. The tactile weight and hand-stitched detailing surpass any heritage luxury brand I have owned.”
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-surface-container-high/50">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container flex-shrink-0">
                <img 
                  alt="Camilla Lindqvist" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWek1PWa8GOxklC0SSekIfTDHpxhjqXJpha8tZTTAJV7jkaUmsZ6FnpslkCtruTjMvVT8ojw-v6g1ZfiextKYExBZqO5FHO2suoSPyiUGQMnrJOvQNsnxlf4y537IkwqmosAuZTQpzpoGAZYRcF-pCqleQlEcPa9txe5pLgimVrHl_5bNnWwn-NJDx-iDUExsQKwuXAAXEPo1qh5ANetFh-LWp4i0X6Mny5sukT3GY" 
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-lg text-label-lg font-semibold text-on-surface text-sm">
                    Camilla Lindqvist
                  </span>
                  <ShieldCheck className="w-4 h-4 text-tertiary" title="Verified Collector" />
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                  Stockholm • Verified Collector
                </span>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm flex flex-col justify-between border border-surface-container-high/50">
            <div>
              <div className="flex items-center gap-1 text-primary mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-primary" />
                ))}
              </div>
              <p className="font-headline-sm text-headline-sm italic text-on-surface font-normal mb-6 leading-relaxed">
                “Unboxing was a tranquil ritual. Thoughtfully packaged in unbleached cotton with cedar blocks. The travertine urn anchored my entire study.”
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-surface-container-high/50">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container flex-shrink-0">
                <img 
                  alt="Julian Vance-Moreau" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0gcklvo_xClTBzUpTDyzaZBnzLC0iq_PKGGrheGOy2bZV-nWG87m1sqHzWocswoQk3tayx7yMucDRcpKebGPZmDzgDFm61865_PSZQGoyEtYgKjhekCII7sYUZoGuuOncamkc102CchL25Y0Sm4eQIX6IzJlGz_tr2OiRMqfOPrn5I_dQUb2c6-46AVK_cvzjmjhd3IMGZIB8YE2yaWJx2O-8qFlMqx0AjLnlLRME" 
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-lg text-label-lg font-semibold text-on-surface text-sm">
                    Julian Vance-Moreau
                  </span>
                  <ShieldCheck className="w-4 h-4 text-tertiary" title="Verified Collector" />
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                  Paris • Interior Architect
                </span>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm flex flex-col justify-between border border-surface-container-high/50">
            <div>
              <div className="flex items-center gap-1 text-primary mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-primary" />
                ))}
              </div>
              <p className="font-headline-sm text-headline-sm italic text-on-surface font-normal mb-6 leading-relaxed">
                “From customer concierge advice on bedding sizing to delivery across the world in 72 hours, NOVARA defines modern conscious luxury.”
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-surface-container-high/50">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container flex-shrink-0">
                <img 
                  alt="Elena Rostova" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOiYfqu-nR1v3fMXyhaz5Vmh2U8x1hRt08fZRZMg98V86PDtC6gB4ZMg7Pn_NV55Z4igZYrP-mnfqJm07HBMBBs3F3oRaPt6b28UVJ9zPsXcgIJuH2TWnZaYm-nTNX0QLPedke7_tibuvempUkRMgwwDn5peS-c1-7QgAP95Yj9ljpb05pdoNX8XQAa13l8_Him6XJICX1ZpVg1pzn0aXv5BRyhwNMyF5kf2bKaLyi" 
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-lg text-label-lg font-semibold text-on-surface text-sm">
                    Elena Rostova
                  </span>
                  <ShieldCheck className="w-4 h-4 text-tertiary" title="Verified Collector" />
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                  New York • Art Consultant
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: Newsletter & VIP Club Invitation */}
      <section className="w-full px-4 lg:px-12 pt-4 pb-20 max-w-7xl mx-auto">
        <div className="relative w-full rounded-2xl bg-surface-container p-8 sm:p-12 lg:p-16 shadow-md overflow-hidden border border-surface-container-highest">
          {/* Subtle Decorative SVG motif */}
          <div className="absolute -top-12 -right-12 w-64 h-64 text-outline-variant/30 pointer-events-none">
            <svg className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.75" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90"></circle>
              <circle cx="100" cy="100" r="70"></circle>
              <circle cx="100" cy="100" r="50"></circle>
              <circle cx="100" cy="100" r="30"></circle>
            </svg>
          </div>

          <div className="max-w-2xl mx-auto text-center relative z-10">
            <span className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-primary block mb-3 font-semibold text-xs">
              Private Circulation
            </span>
            <h2 className="font-display-lg text-headline-lg lg:text-display-lg font-normal text-on-surface tracking-tight mb-4">
              Join the NOVARA Circle
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
              Receive 15% off your maiden acquisition, private previews of seasonal editions, and essays on intentional interior craft.
            </p>

            {/* Newsletter Form */}
            {newsletterJoined ? (
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-surface-container-high max-w-lg mx-auto">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">You're on the list</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Use code <span className="font-bold text-primary">NOVARA15</span> at checkout for 15% off your first order.
                </p>
              </div>
            ) : (
              <form className="flex flex-col gap-4 max-w-lg mx-auto" onSubmit={handleNewsletterSubmit}>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    className="flex-1 bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm px-5 py-4 rounded-lg focus:outline-none shadow-sm border border-surface-container-high focus:ring-1 focus:ring-primary" 
                    placeholder="Enter your email address" 
                    required 
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                  />
                  <button 
                    className="px-8 py-4 rounded-lg bg-on-surface text-surface font-label-lg text-label-lg uppercase tracking-wider font-semibold hover:bg-primary transition-colors shadow-md whitespace-nowrap" 
                    type="submit"
                  >
                    Join Circle
                  </button>
                </div>

                {/* Category Preference Checkboxes */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-left">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary" type="checkbox" />
                    <span className="font-body-sm text-body-sm text-on-surface">Apparel & Textiles</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary" type="checkbox" />
                    <span className="font-body-sm text-body-sm text-on-surface">Living & Objects</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary" type="checkbox" />
                    <span className="font-body-sm text-body-sm text-on-surface">Fragrance & Self-Care</span>
                  </label>
                </div>

                <p className="font-label-sm text-[11px] text-on-surface-variant text-center mt-2">
                  We honor your privacy. Unsubscribe seamlessly with a single click at any time.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
