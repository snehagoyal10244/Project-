import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { products } from '../data/products';
import { productsApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  ChevronRight, 
  Leaf, 
  ZoomIn, 
  AlertCircle, 
  Check, 
  Minus, 
  Plus, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  Ruler
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Find product or fallback to default
  const localProduct = products.find(p => p.id === id) || products[0];
  const [product, setProduct] = useState(localProduct);

  useEffect(() => {
    const fetchLiveProduct = async () => {
      try {
        const res = await productsApi.getProductBySlug(id);
        if (res && res.product) {
          setProduct({
            ...res.product,
            id: res.product.slug || res.product._id,
            coverImage: res.product.coverImage || (res.product.images && res.product.images[0])
          });
        }
      } catch (e) {
        // Keep local product
      }
    };
    fetchLiveProduct();
  }, [id]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : 'Default'
  );
  const [selectedSize, setSelectedSize] = useState(product.defaultSize || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [showSizeModal, setShowSizeModal] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.coverImage];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    navigate('/checkout');
  };

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Top Breadcrumb & Archive Indexing Bar */}
      <div className="w-full px-4 lg:px-12 py-4 bg-surface-container-low/70 border-b border-surface-container-high/60">
        <div className="flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant text-xs">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <Link to={`/shop?category=${product.category}`} className="hover:text-primary transition-colors uppercase">
              {product.categoryLabel || product.category}
            </Link>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <span className="text-on-surface font-medium truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          <div className="hidden md:flex items-center gap-6 font-label-sm text-label-sm tracking-widest text-on-surface-variant uppercase text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              Atelier Archive Edition No. 048
            </span>
            <span className="opacity-40">/</span>
            <span className="text-tertiary font-semibold">
              In Stock • {product.origin || 'European Origin'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Product Detail Split Area */}
      <section className="w-full px-4 lg:px-12 py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4 relative">
            {/* Main Display Image */}
            <div className="relative flex-1 bg-surface-container-low rounded-xl overflow-hidden group select-none shadow-sm border border-surface-container-high">
              {/* Eco Pill */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-surface/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm text-on-surface border border-surface-container-high/40">
                <Leaf className="w-3.5 h-3.5 text-tertiary" />
                <span className="font-label-sm text-label-sm tracking-wider uppercase font-semibold text-tertiary text-[10px]">
                  {product.subtitle}
                </span>
              </div>

              {/* Action Badges */}
              <button 
                className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-surface/90 hover:bg-surface text-on-surface backdrop-blur-sm flex items-center justify-center shadow-md transition-all active:scale-95" 
                title="Enlarge Visuals"
                type="button"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="relative w-full aspect-[4/5] bg-surface-container overflow-hidden">
                <img 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
                  src={images[activeImageIndex] || images[0]} 
                />
              </div>
            </div>

            {/* Thumbnails Strip */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none w-full md:w-24 shrink-0">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative rounded-lg overflow-hidden aspect-[4/5] md:aspect-square bg-surface-container shrink-0 w-20 md:w-full transition-all border ${
                    activeImageIndex === idx 
                      ? 'ring-2 ring-primary opacity-100' 
                      : 'opacity-65 hover:opacity-100 ring-0'
                  }`}
                >
                  <img alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" src={imgUrl} />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Specs & Purchase Actions */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Header info */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm tracking-[0.25em] text-primary uppercase font-bold text-[11px]">
                  Novara Atelier Archive
                </span>
                <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-fixed/40 px-2.5 py-0.5 rounded-full font-semibold text-xs">
                  Limited Run • {product.stockCount || 12} Pieces Left
                </span>
              </div>

              <h1 className="font-headline-lg text-headline-lg text-on-surface leading-tight tracking-tight">
                {product.name}
              </h1>

              {/* Reviews Summary */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-primary" />
                  ))}
                </div>
                <span className="font-label-md text-label-md text-on-surface font-semibold text-xs">
                  {product.rating ? product.rating.toFixed(1) : '4.9'} ({product.reviewsCount || 84} verified reviews)
                </span>
                <span className="text-outline-variant">•</span>
                <span className="text-tertiary font-semibold text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Authenticity Verified
                </span>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-2.5 border border-surface-container-high/60">
              <div className="flex items-baseline gap-3">
                <span className="font-headline-md text-headline-md font-semibold text-on-surface">
                  ${product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="font-body-md text-body-md text-on-surface-variant line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold text-xs">
                    Save ${product.originalPrice - product.price} ({product.discountPercent}% OFF)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant text-xs">
                <span className="px-2 py-0.5 rounded bg-surface-container font-semibold text-[10px] text-on-surface tracking-wider">
                  KLARNA
                </span>
                <span>or 4 interest-free payments of <strong>${(product.price / 4).toFixed(2)}</strong>.</span>
              </div>
            </div>

            {/* Description */}
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Color Selection Block */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex flex-col gap-2.5 pt-1">
                <div className="flex items-center justify-between font-label-md text-label-md text-xs">
                  <span className="text-on-surface uppercase tracking-wider font-semibold">Tonal Shade:</span>
                  <span className="font-medium text-primary">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((col) => (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setSelectedColor(col.name)}
                      className={`group relative p-1 rounded-full transition-all ${
                        selectedColor === col.name
                          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                          : 'ring-0 hover:ring-2 hover:ring-outline ring-offset-2 ring-offset-background'
                      }`}
                      title={col.name}
                    >
                      <span 
                        className="w-8 h-8 rounded-full block shadow-inner border border-outline-variant/30"
                        style={{ backgroundColor: col.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex flex-col gap-2.5 pt-1">
                <div className="flex items-center justify-between font-label-md text-label-md text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-on-surface uppercase tracking-wider font-semibold">Atelier Size:</span>
                    <span className="font-medium text-primary">{selectedSize}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowSizeModal(true)}
                    className="text-primary hover:text-on-surface flex items-center gap-1 font-semibold underline underline-offset-2 transition-colors"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Find Your Size</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2.5">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-3 text-center rounded-lg font-label-md text-label-md transition-all text-xs ${
                        selectedSize === sz
                          ? 'bg-primary text-on-primary font-semibold shadow-sm'
                          : 'bg-surface-container text-on-surface hover:bg-secondary-container'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-primary font-body-sm text-body-sm bg-primary-fixed/30 px-3 py-2 rounded-lg text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span><strong>Low Inventory Notice:</strong> Only {product.stockCount || 4} units remaining in this size.</span>
                </div>
              </div>
            )}

            {/* Quantity & CTA Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center bg-surface-container rounded-lg p-1 border border-surface-container-high">
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-11 flex items-center justify-center text-on-surface hover:bg-surface-container-high rounded transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input 
                    className="w-12 text-center bg-transparent font-label-lg text-label-lg font-semibold text-on-surface focus:outline-none text-sm" 
                    readOnly 
                    type="text" 
                    value={quantity}
                  />
                  <button 
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-11 flex items-center justify-center text-on-surface hover:bg-surface-container-high rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button 
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-[52px] bg-primary hover:bg-on-surface text-on-primary font-label-lg text-label-lg tracking-wider uppercase rounded-lg font-bold flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.98] text-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Atelier Bag</span>
                </button>

                {/* Wishlist Button */}
                <button 
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`w-[52px] h-[52px] rounded-lg border border-surface-container-high flex items-center justify-center transition-colors shadow-sm ${
                    isFavorited 
                      ? 'bg-error-container text-error' 
                      : 'bg-surface-container-lowest text-on-surface hover:text-error hover:bg-surface-container'
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Buy Now Direct Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full h-12 bg-on-surface hover:bg-primary text-surface font-label-lg text-label-lg tracking-wider uppercase rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm text-xs"
              >
                <span>Express Acquisition — ${(product.price * quantity).toFixed(2)}</span>
              </button>
            </div>

            {/* Shipping & Return Micro-Badges */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-surface-container-high/60 text-center">
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-surface-container-low">
                <Truck className="w-4 h-4 text-primary" />
                <span className="font-label-sm text-[10px] text-on-surface uppercase font-semibold">Express Delivery</span>
                <span className="font-body-sm text-[9px] text-on-surface-variant">2-4 Business Days</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-surface-container-low">
                <RotateCcw className="w-4 h-4 text-primary" />
                <span className="font-label-sm text-[10px] text-on-surface uppercase font-semibold">Effortless Returns</span>
                <span className="font-body-sm text-[9px] text-on-surface-variant">30-Day Window</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-surface-container-low">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="font-label-sm text-[10px] text-on-surface uppercase font-semibold">Provenance Guarantee</span>
                <span className="font-body-sm text-[9px] text-on-surface-variant">100% Traceable</span>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div className="border-t border-surface-container-high pt-4 space-y-3">
              <div className="flex items-center gap-4 border-b border-surface-container-high pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className={`font-label-md text-label-md uppercase tracking-wider pb-1 text-xs transition-colors ${
                    activeTab === 'details'
                      ? 'border-b-2 border-primary text-on-surface font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Craft & Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('shipping')}
                  className={`font-label-md text-label-md uppercase tracking-wider pb-1 text-xs transition-colors ${
                    activeTab === 'shipping'
                      ? 'border-b-2 border-primary text-on-surface font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Shipping & Handling
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('provenance')}
                  className={`font-label-md text-label-md uppercase tracking-wider pb-1 text-xs transition-colors ${
                    activeTab === 'provenance'
                      ? 'border-b-2 border-primary text-on-surface font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Origin & Care
                </button>
              </div>

              {activeTab === 'details' && (
                <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant text-xs">
                  {product.details ? (
                    product.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
                        <span>{d}</span>
                      </li>
                    ))
                  ) : (
                    <li>Meticulously created according to heritage atelier standards.</li>
                  )}
                </ul>
              )}

              {activeTab === 'shipping' && (
                <div className="font-body-sm text-body-sm text-on-surface-variant text-xs space-y-2 leading-relaxed">
                  <p>Each acquisition is layered in archival tissue, nested in unbleached organic cotton bags, and shipped via carbon-neutral air express.</p>
                  <p>Complimentary express courier service on all orders over $150.</p>
                </div>
              )}

              {activeTab === 'provenance' && (
                <div className="font-body-sm text-body-sm text-on-surface-variant text-xs space-y-2 leading-relaxed">
                  <p>Crafted in: <strong>{product.origin || 'European Atelier'}</strong></p>
                  <p>Sourced through certified conscious guilds with full wage transparency.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="w-full px-4 lg:px-12 py-16 max-w-7xl mx-auto border-t border-surface-container-high/60">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary text-xs font-semibold">
              Complementary Pieces
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-normal tracking-tight">
              Curator's Ensemble
            </h2>
          </div>
          <Link to="/shop" className="text-primary hover:text-on-surface font-label-md text-label-md font-semibold text-xs">
            View All Curations →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Size Guide Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-surface-container-high animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-surface-container-high mb-4">
              <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Atelier Size Guide</h3>
              <button onClick={() => setShowSizeModal(false)} className="text-on-surface-variant hover:text-on-surface">
                ✕
              </button>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-xs mb-4">
              Our silhouettes are tailored with intentional relaxed ease. Measurements in inches (Chest / Waist / Length).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm text-xs">
                <thead>
                  <tr className="border-b border-surface-container-high text-primary font-semibold">
                    <th className="py-2">Size</th>
                    <th className="py-2">Chest</th>
                    <th className="py-2">Waist</th>
                    <th className="py-2">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  <tr><td className="py-2 font-medium">XS</td><td>36"</td><td>30"</td><td>27"</td></tr>
                  <tr><td className="py-2 font-medium">S</td><td>38"</td><td>32"</td><td>28"</td></tr>
                  <tr><td className="py-2 font-medium">M</td><td>40"</td><td>34"</td><td>29"</td></tr>
                  <tr><td className="py-2 font-medium">L</td><td>42"</td><td>36"</td><td>30"</td></tr>
                  <tr><td className="py-2 font-medium">XL</td><td>45"</td><td>39"</td><td>31"</td></tr>
                </tbody>
              </table>
            </div>
            <button 
              onClick={() => setShowSizeModal(false)}
              className="w-full mt-6 py-3 rounded-lg bg-on-surface text-surface font-label-md text-label-md uppercase font-semibold text-xs"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
