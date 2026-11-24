import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart, showToast } = useCart();

  const favoritedProducts = products.filter(p => wishlistItems.includes(p.id));

  const handleMoveAllToBag = () => {
    favoritedProducts.forEach(prod => {
      addToCart(prod, 1, prod.colors?.[0]?.name, prod.defaultSize);
    });
    showToast(`Added ${favoritedProducts.length} items to your atelier bag.`);
  };

  return (
    <div className="w-full bg-background min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-surface-container-high gap-4">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary text-xs font-semibold">
              Curated Private Vault
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-normal tracking-tight">
              Saved Pieces & Wishlist
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
              Your hand-selected wishlist of timeless silhouettes and objects.
            </p>
          </div>

          {favoritedProducts.length > 0 && (
            <button 
              onClick={handleMoveAllToBag}
              className="px-6 py-3 rounded-lg bg-on-surface text-surface font-label-md text-label-md uppercase tracking-wider font-semibold hover:bg-primary transition-colors shadow-sm text-xs flex items-center gap-2 self-start sm:self-auto"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Bag</span>
            </button>
          )}
        </div>

        {favoritedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoritedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-lowest p-16 rounded-2xl text-center shadow-sm border border-surface-container-high max-w-lg mx-auto my-12">
            <Heart className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 text-xs leading-relaxed">
              Explore our permanent collection and save your favorite garments and tactile objects.
            </p>
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-on-surface text-surface font-label-md text-label-md uppercase tracking-wider font-semibold hover:bg-primary transition-colors shadow-sm text-xs"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
