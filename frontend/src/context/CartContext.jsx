import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('novara_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default initial items matching Stitch shopping bag screen
    return [
      {
        id: 'cashmere-cocoon-cardigan-1',
        productId: 'cashmere-cocoon-cardigan',
        name: 'Oversized Pure Cashmere Cocoon Cardigan',
        price: 320,
        originalPrice: 390,
        quantity: 1,
        selectedColor: 'Oatmeal Melange',
        colorHex: '#dfd7cc',
        selectedSize: 'M',
        categoryLabel: 'Atelier Wardrobe',
        origin: 'Biella, Italy',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADddT2dqoFRwr-l_EflfYnzyj6YXuMDMvT5nts_f8eHcNhgJFbf-Y-195QApvxmOWlOt-AZ8wd5C6HdFpS5dMIpc405FWrq3rbdXFwvIoweR-2T1zrA5p7V0_h9TCSXcMW__LOUpPcxueMaqRknU6cBT0cPBPpDnp0MYaoTAVl6wTc7Vpvzi1-OWubAn6HiVUlbC2V9ou6vMbAcz59LtmucmRMQZM9RcGBT3_PneQf',
        badge: '100% Cashmere'
      },
      {
        id: 'travertine-minimal-vessel-2',
        productId: 'travertine-minimal-vessel',
        name: 'Minimalist Travertine Vessel & Object',
        price: 165,
        originalPrice: 185,
        quantity: 1,
        selectedColor: 'Cream Travertine',
        colorHex: '#E5DFD7',
        selectedSize: 'Standard',
        categoryLabel: 'Living & Objects',
        origin: 'Tivoli, Italy',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtHTpwR4kYaVZ5E0da6Qx5cS9t9OF3zQOaBPF22xDsLVyB3mP2nNn8NUqgrWkTy8CAUdQWU7ZNuQZB6BgtkQ1qjLe_3ytHQKRfJ9ZdfgVWOXcHAEpSvNEp2g6-XnvKf34cXqY5C2gKwI0EXCZoDb_T4C-V5fRfEQzqW713d-hEZ9l2o7KNWk-APDPp4VjmYFV9B4xWULxvW2kfRs3nGfDgg7ZE80C46Apk611-Eh5X',
        badge: 'Hand Carved'
      },
      {
        id: 'monolith-brass-incense-well-3',
        productId: 'monolith-brass-incense-well',
        name: 'Monolith Brass Incense Well',
        price: 95,
        originalPrice: 95,
        quantity: 1,
        selectedColor: 'Raw Brass',
        colorHex: '#C8A966',
        selectedSize: 'Standard',
        categoryLabel: 'Objects & Rituals',
        origin: 'Kyoto, Japan',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQKGYZuHmuGLDxEIZwPa5CCNlqQVEVq4QTyuYS498jR88LF-QYBxfxjfarZ1J_zwHzirsJ7hHqvBrm0s_zeXfuJfQgtrUal9MjH9a24AlFZS35NqtmqSE4Fcbd3jK0QJ_IhK0CCFsXHpFMQ5WDJXqCvOhMfK8chQxG5A9uBx-i5c-GgbBjahL-U1YEMi7tZe4L8DT415GMkVFEXMNwzCLzqLHMXlrwTywN0ZRMcgvU',
        badge: 'Solid Brass'
      }
    ];
  });

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('novara_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = async (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    const color = selectedColor || (product.colors && product.colors[0]?.name) || 'Default';
    const colorHex = (product.colors && product.colors.find(c => c.name === color)?.hex) || '#9e8f7d';
    const size = selectedSize || product.defaultSize || (product.sizes && product.sizes[0]) || 'Standard';
    const itemKey = `${product.id}-${color}-${size}`;

    setCartItems(prev => {
      const existing = prev.find(item => item.id === itemKey);
      if (existing) {
        return prev.map(item =>
          item.id === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: itemKey,
            productId: product.id,
            name: product.name || product.shortName,
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            quantity: quantity,
            selectedColor: color,
            colorHex: colorHex,
            selectedSize: size,
            categoryLabel: product.categoryLabel || 'Atelier Collection',
            origin: product.origin || 'European Atelier',
            image: (product.images && product.images[0]) || product.coverImage,
            badge: product.subtitle ? product.subtitle.split(' ')[0] : 'Curated'
          }
        ];
      }
    });

    showToast(`Added "${product.shortName || product.name}" to your atelier bag.`);

    // Async sync with backend if user has token
    if (localStorage.getItem('novara_token')) {
      try {
        await cartApi.addToCart({
          productId: product.id || product._id,
          quantity,
          selectedColor: color,
          colorHex,
          selectedSize: size
        });
      } catch (err) {
        // Soft fail; local cart is preserved
      }
    }
  };

  const removeFromCart = async (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    showToast('Item removed from atelier bag.');

    if (localStorage.getItem('novara_token')) {
      try {
        await cartApi.removeFromCart(id);
      } catch (err) {
        // Soft fail
      }
    }
  };

  const updateQuantity = async (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item => item.id === id ? { ...item, quantity: newQty } : item)
    );

    if (localStorage.getItem('novara_token')) {
      try {
        await cartApi.updateQuantity(id, newQty);
      } catch (err) {
        // Soft fail
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (localStorage.getItem('novara_token')) {
      try {
        await cartApi.clearCart();
      } catch (err) {
        // Soft fail
      }
    }
  };

  const applyPromoCode = async (code) => {
    const clean = code.trim().toUpperCase();

    // Check backend first if token present
    if (localStorage.getItem('novara_token')) {
      try {
        const res = await cartApi.applyPromo(clean);
        if (res && res.success) {
          setPromoCode(res.promoCode || clean);
          setDiscountPercent(res.discountPercent || 20);
          showToast(`Promo applied: ${res.discountPercent}% discount!`);
          return { success: true, message: `${res.discountPercent}% off applied` };
        }
      } catch (e) {
        // Fall back to local check
      }
    }

    if (clean === 'NOVARA20') {
      setPromoCode('NOVARA20');
      setDiscountPercent(20);
      showToast("Promo code 'NOVARA20' applied: 20% discount!");
      return { success: true, message: '20% off applied successfully' };
    } else if (clean === 'NOVARA35') {
      setPromoCode('NOVARA35');
      setDiscountPercent(35);
      showToast("VIP code 'NOVARA35' applied: 35% private discount!");
      return { success: true, message: '35% off applied successfully' };
    } else if (clean === 'NOVARA15') {
      setPromoCode('NOVARA15');
      setDiscountPercent(15);
      showToast("Circle code 'NOVARA15' applied: 15% discount!");
      return { success: true, message: '15% off applied successfully' };
    } else {
      showToast('Invalid promotion code. Try NOVARA20 or NOVARA35.');
      return { success: false, message: 'Invalid promotional code' };
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercent(0);
    showToast('Promotion code removed.');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const cartSubtotal = rawSubtotal - discountAmount;
  const freeShippingThreshold = 150;
  const isFreeShipping = rawSubtotal >= freeShippingThreshold || cartItems.length === 0;
  const shippingCost = isFreeShipping ? 0 : 25;
  const total = cartSubtotal + shippingCost;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        rawSubtotal,
        discountAmount,
        cartSubtotal,
        shippingCost,
        isFreeShipping,
        freeShippingThreshold,
        total,
        promoCode,
        discountPercent,
        applyPromoCode,
        removePromoCode,
        toastMessage,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
