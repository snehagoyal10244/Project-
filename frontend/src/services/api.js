import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('novara_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Could not read token from storage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common error codes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // Do not hard-redirect if in offline/fallback mode
    }
    return Promise.reject(error);
  }
);

/* ---------------- Auth API ---------------- */
export const authApi = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (e) {
      return { success: true };
    }
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (token, password) => {
    const response = await api.put(`/auth/reset-password/${token}`, { password });
    return response.data;
  }
};

/* ---------------- User Profile API ---------------- */
export const usersApi = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  changePassword: async (passwordData) => {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  }
};

/* ---------------- Products API ---------------- */
export const productsApi = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  getProductBySlug: async (slug) => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

/* ---------------- Categories API ---------------- */
export const categoriesApi = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  getCategoryBySlug: async (slug) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  }
};

/* ---------------- Cart API ---------------- */
export const cartApi = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },
  addToCart: async (itemData) => {
    const response = await api.post('/cart/add', itemData);
    return response.data;
  },
  updateQuantity: async (itemId, quantity) => {
    const response = await api.put('/cart/update', { itemId, quantity });
    return response.data;
  },
  removeFromCart: async (itemId) => {
    const response = await api.delete(`/cart/remove/${itemId}`);
    return response.data;
  },
  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
  applyPromo: async (code) => {
    const response = await api.post('/cart/apply-promo', { code });
    return response.data;
  }
};

/* ---------------- Wishlist API ---------------- */
export const wishlistApi = {
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },
  toggleWishlist: async (productId) => {
    const response = await api.post('/wishlist/toggle', { productId });
    return response.data;
  },
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  },
  moveToCart: async (productId, color, size) => {
    const response = await api.post(`/wishlist/move-to-cart/${productId}`, {
      selectedColor: color,
      selectedSize: size
    });
    return response.data;
  }
};

/* ---------------- Orders API ---------------- */
export const ordersApi = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  trackOrder: async (orderNumber) => {
    const response = await api.get(`/orders/track/${encodeURIComponent(orderNumber)}`);
    return response.data;
  },
  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  }
};

/* ---------------- Reviews API ---------------- */
export const reviewsApi = {
  getProductReviews: async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },
  addReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  }
};

/* ---------------- Admin API ---------------- */
export const adminApi = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getAllOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },
  getAllCustomers: async (params = {}) => {
    const response = await api.get('/admin/customers', { params });
    return response.data;
  },
  updateOrderStatus: async (orderId, statusData) => {
    const response = await api.put(`/orders/${orderId}/status`, statusData);
    return response.data;
  }
};

export default api;
