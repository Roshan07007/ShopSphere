import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import Product from './models/Product.js';
import { seedDatabase } from './utils/seeder.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// Middleware imports
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Connect Database & perform auto-seed if empty
const initDB = async () => {
  await connectDB();
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    console.log('[ShopSphere] Fresh database detected. Auto-populating rich demo data...');
    try {
      await seedDatabase();
    } catch (err) {
      console.error('[ShopSphere] Auto-seed failed:', err.message);
    }
  }
};
initDB();

// Global Middlewares
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check and root API endpoint
const apiStatusHandler = (req, res) => {
  res.json({
    success: true,
    name: 'ShopSphere E-Commerce REST API',
    version: '1.0.0',
    status: 'online',
    currency: 'INR (₹)',
    timestamp: new Date().toISOString()
  });
};

app.get('/api', apiStatusHandler);
app.get('/api/health', apiStatusHandler);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 [ShopSphere Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
