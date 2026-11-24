import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, Star, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : null
  );

  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedColor, product.defaultSize);
  };

  const handleToggleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  // Determine badge
  let badgeText = null;
  let badgeClasses = "bg-on-surface text-surface";
  if (product.discountPercent > 0) {
    badgeText = `${product.discountPercent}% OFF`;
    badgeClasses = "bg-secondary-container text-on-secondary-container";
  } else if (product.isNewArrival) {
    badgeText = "New";
    badgeClasses = "bg-primary text-on-primary";
  } else if (product.isTrending) {
    badgeText = "Trending";
    badgeClasses = "bg-on-surface text-surface";
  }

  return (
    <div className="group relative flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-surface-container-high/40">
      {/* Photo Container */}
      <div className="relative w-full aspect-[4/5] bg-surface-container overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
            src={product.coverImage || (product.images && product.images[0])} 
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        {badgeText && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span className={`px-2.5 py-1 rounded text-label-sm font-label-sm uppercase tracking-wider font-semibold text-[11px] shadow-sm ${badgeClasses}`}>
              {badgeText}
            </span>
          </div>
        )}

        {/* Wishlist Toggle Button */}
        <button 
          aria-label="Save to wishlist" 
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-surface/85 backdrop-blur-sm flex items-center justify-center transition-colors z-10 shadow-sm ${
            isFavorited ? 'text-error' : 'text-on-surface hover:text-error'
          }`} 
          onClick={handleToggleFav} 
          type="button"
        >
          <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Action Sheet */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 z-10">
          <button 
            className="flex-1 py-2.5 rounded-lg bg-on-surface text-surface text-label-md font-label-md uppercase tracking-wider font-semibold hover:bg-primary transition-colors shadow-md text-xs" 
            onClick={handleQuickAdd} 
            type="button"
          >
            Quick Add
          </button>
          <button 
            aria-label="Quick preview" 
            className="w-10 h-10 rounded-lg bg-surface text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-colors shadow-md" 
            onClick={handleQuickView} 
            type="button"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Meta Details */}
      <div className="p-5 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-1 text-primary mb-1.5">
          <Star className="w-3.5 h-3.5 fill-current text-primary" />
          <span className="font-label-md text-label-md font-semibold text-on-surface">
            {product.rating ? product.rating.toFixed(1) : '5.0'}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant font-light text-xs">
            ({product.reviewsCount || 42} reviews)
          </span>
        </div>

        {/* Title */}
        <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-normal line-clamp-1 mb-1 tracking-tight">
            {product.shortName || product.name}
          </h3>
        </Link>

        {/* Subtitle / Material */}
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 line-clamp-1 text-xs">
          {product.subtitle}
        </p>

        {/* Pricing & Swatches Row */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-surface-container-high/40">
          <div className="flex items-baseline gap-2">
            <span className="font-body-md text-body-md font-bold text-on-surface">
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-body-sm text-body-sm text-on-surface-variant line-through text-xs">
                ${product.originalPrice}
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="font-label-sm text-label-sm text-error font-semibold text-[11px]">
                -{product.discountPercent}%
              </span>
            )}
          </div>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5">
              {product.colors.slice(0, 3).map((col) => (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => setSelectedColor(col.name)}
                  title={col.name}
                  className={`w-3.5 h-3.5 rounded-full transition-all ${
                    selectedColor === col.name
                      ? 'ring-1 ring-offset-2 ring-primary scale-110'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: col.hex }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
