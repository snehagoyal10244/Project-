import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistApi } from '../services/api';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('novara_wishlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default initial wishlist items
    return [
      'cashmere-cocoon-cardigan',
      'travertine-minimal-vessel',
      'structured-leather-shopper'
    ];
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('novara_wishlist', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistItems]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  const toggleWishlist = async (productOrId) => {
    const id = typeof productOrId === 'string' ? productOrId : productOrId.id;
    const name = typeof productOrId === 'object' ? (productOrId.shortName || productOrId.name) : 'Item';

    if (wishlistItems.includes(id)) {
      setWishlistItems(prev => prev.filter(item => item !== id));
      showToast(`Removed "${name}" from your wishlist.`);
    } else {
      setWishlistItems(prev => [...prev, id]);
      showToast(`Saved "${name}" to your wishlist.`);
    }

    if (localStorage.getItem('novara_token')) {
      try {
        await wishlistApi.toggleWishlist(id);
      } catch (e) {
        // Soft fail
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    setWishlistItems(prev => prev.filter(item => item !== productId));
    showToast('Removed from wishlist.');

    if (localStorage.getItem('novara_token')) {
      try {
        await wishlistApi.removeFromWishlist(productId);
      } catch (e) {
        // Soft fail
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        wishlistCount: wishlistItems.length,
        toastMessage
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
