import axios from 'axios';

// Determine and normalize API Base URL
const rawBaseURL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  '/api';

const getNormalizedBaseURL = (url) => {
  if (!url) return '/api';
  let cleaned = url.trim().replace(/\/+$/, '');
  // If it's an absolute URL without /api at the end, append /api
  if (/^https?:\/\//i.test(cleaned) && !cleaned.endsWith('/api')) {
    cleaned += '/api';
  }
  return cleaned;
};

const api = axios.create({
  baseURL: getNormalizedBaseURL(rawBaseURL),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization header if token is stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for clean error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected network or server error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

// Product APIs
export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getSuggestions: (q) => api.get('/products/suggestions', { params: { q } }),
  getProduct: (identifier) => api.get(`/products/${identifier}`),
  getShowcase: () => api.get('/products/collections/showcase'),
  getBrands: () => api.get('/products/brands'),
  getReviews: (id) => api.get(`/products/${id}/reviews`),
  createReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  // Admin
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`)
};

// Category APIs
export const categoryAPI = {
  getCategories: (params) => api.get('/categories', { params }),
  getCategory: (slug) => api.get(`/categories/${slug}`),
  // Admin
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`)
};

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
  addAddress: (data) => api.post('/auth/addresses', data),
  updateAddress: (id, data) => api.put(`/auth/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}`)
};

// Cart APIs
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateItem: (itemId, data) => api.put(`/cart/${itemId}`, data),
  removeItem: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
  mergeCart: (items) => api.post('/cart/merge', { items })
};

// Wishlist APIs
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  toggleWishlist: (productId) => api.post('/wishlist/toggle', { productId }),
  removeItem: (productId) => api.delete(`/wishlist/${productId}`)
};

// Order APIs
export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/myorders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  // Admin
  getAllOrders: (params) => api.get('/orders', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  markPaid: (id, data) => api.put(`/orders/${id}/pay`, data)
};

// Admin APIs
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`)
};

// Contact APIs
export const contactAPI = {
  submitContact: (data) => api.post('/contact', data),
  subscribeNewsletter: (email) => api.post('/contact/newsletter', { email })
};

export default api;
