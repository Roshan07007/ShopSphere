import dotenv from 'dotenv';
import { connectDB, closeDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import { categories, products, sampleReviews } from './seedData.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('[Seeder] Clearing previous collections...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();

    console.log('[Seeder] Creating Default Users...');
    const adminUser = await User.create({
      name: 'ShopSphere India Admin',
      email: 'admin@shopsphere.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 9876543210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      addresses: [
        {
          label: 'HQ Office',
          fullName: 'ShopSphere India Admin',
          phone: '+91 9876543210',
          houseNo: 'Tower 4, Level 12',
          street: 'Bandra-Kurla Complex (BKC), Bandra East',
          landmark: 'Near Diamond Bourse',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400051',
          country: 'India',
          isDefault: true
        }
      ]
    });

    const demoUser = await User.create({
      name: 'Rahul Sharma',
      email: 'john@example.com',
      password: 'User@123',
      role: 'user',
      phone: '+91 9876543210',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      addresses: [
        {
          label: 'Home',
          fullName: 'Rahul Sharma',
          phone: '+91 9876543210',
          houseNo: 'Flat 402, Building B',
          street: 'Palm Grove Avenue, Powai',
          landmark: 'Near Hiranandani Gardens',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400076',
          country: 'India',
          isDefault: true
        },
        {
          label: 'Work Office',
          fullName: 'Rahul Sharma',
          phone: '+91 9876543210',
          houseNo: 'Tower 3, 5th Floor',
          street: 'Prestige Tech Cloud, Indiranagar',
          landmark: 'Opposite Metro Station',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
          isDefault: false
        }
      ]
    });

    console.log('[Seeder] Creating Categories...');
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log('[Seeder] Creating Products...');
    const productsToInsert = products.map((prod) => {
      const catId = categoryMap[prod.categorySlug];
      const { categorySlug, ...rest } = prod;
      return {
        ...rest,
        category: catId
      };
    });

    const createdProducts = await Product.insertMany(productsToInsert);

    // Update item counts in categories
    for (const cat of createdCategories) {
      const count = await Product.countDocuments({ category: cat._id });
      cat.itemCount = count;
      await cat.save();
    }

    console.log('[Seeder] Creating Sample Product Reviews...');
    for (const product of createdProducts.slice(0, 8)) {
      await Review.create({
        product: product._id,
        user: demoUser._id,
        userName: demoUser.name,
        userAvatar: demoUser.avatar,
        rating: 5,
        title: sampleReviews[0].title,
        comment: sampleReviews[0].comment,
        isVerifiedPurchase: true
      });
    }

    console.log('[Seeder] Creating Sample Customer Orders...');
    const sampleOrderItems = [
      {
        product: createdProducts[0]._id,
        name: createdProducts[0].name,
        quantity: 1,
        image: createdProducts[0].images[0],
        price: createdProducts[0].price,
        discountPrice: createdProducts[0].discountPrice,
        selectedColor: createdProducts[0].colors?.[0] || '',
        selectedSize: ''
      },
      {
        product: createdProducts[1]._id,
        name: createdProducts[1].name,
        quantity: 1,
        image: createdProducts[1].images[0],
        price: createdProducts[1].price,
        discountPrice: createdProducts[1].discountPrice,
        selectedColor: createdProducts[1].colors?.[0] || '',
        selectedSize: ''
      }
    ];

    const order1Subtotal = (createdProducts[0].discountPrice || createdProducts[0].price) + (createdProducts[1].discountPrice || createdProducts[1].price);
    const order1Discount = Math.round(order1Subtotal * 0.1); // 10% SAVE10
    const order1Tax = Math.round((order1Subtotal - order1Discount) * 0.18);
    const order1Total = (order1Subtotal - order1Discount + order1Tax);

    await Order.create({
      user: demoUser._id,
      orderItems: sampleOrderItems,
      shippingAddress: demoUser.addresses[0],
      paymentMethod: 'UPI_DEMO',
      paymentResult: {
        id: 'DEMO-UPI-984210',
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: demoUser.email
      },
      itemsPrice: order1Subtotal,
      discountAmount: order1Discount,
      couponCode: 'SAVE10',
      taxPrice: order1Tax,
      shippingPrice: 0,
      totalPrice: order1Total,
      isPaid: true,
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      orderStatus: 'Processing',
      trackingHistory: [
        {
          status: 'Pending',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          note: 'Order placed via UPI (Google Pay)'
        },
        {
          status: 'Confirmed',
          timestamp: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000),
          note: 'Payment verified and order confirmed'
        },
        {
          status: 'Processing',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          note: 'Order packed in Mumbai Fulfillment Center'
        }
      ]
    });

    // Delivered older order
    const deliveredItem = [
      {
        product: createdProducts[2]._id,
        name: createdProducts[2].name,
        quantity: 1,
        image: createdProducts[2].images[0],
        price: createdProducts[2].price,
        discountPrice: createdProducts[2].discountPrice,
        selectedColor: '',
        selectedSize: ''
      }
    ];
    const itemPrice = createdProducts[2].discountPrice || createdProducts[2].price;
    const tax = Math.round(itemPrice * 0.18);

    await Order.create({
      user: demoUser._id,
      orderItems: deliveredItem,
      shippingAddress: demoUser.addresses[0],
      paymentMethod: 'UPI_DEMO',
      paymentResult: {
        id: 'DEMO-UPI-41829',
        status: 'COMPLETED',
        update_time: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        email_address: demoUser.email
      },
      itemsPrice: itemPrice,
      discountAmount: 0,
      couponCode: '',
      taxPrice: tax,
      shippingPrice: 0,
      totalPrice: itemPrice + tax,
      isPaid: true,
      paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      orderStatus: 'Delivered',
      deliveredAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      trackingHistory: [
        {
          status: 'Pending',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          note: 'Order confirmed'
        },
        {
          status: 'Confirmed',
          timestamp: new Date(Date.now() - 9.5 * 24 * 60 * 60 * 1000),
          note: 'Order processed by merchant'
        },
        {
          status: 'Processing',
          timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
          note: 'Packed and dispatched to BlueDart Hub'
        },
        {
          status: 'Shipped',
          timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          note: 'In transit - AWB: BD-98472910IN'
        },
        {
          status: 'Out for Delivery',
          timestamp: new Date(Date.now() - 6.2 * 24 * 60 * 60 * 1000),
          note: 'Out for delivery with courier rider'
        },
        {
          status: 'Delivered',
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          note: 'Package received by customer'
        }
      ]
    });

    console.log('[Seeder] Database seeded successfully! 🎉');
    console.log('--------------------------------------------------');
    console.log('DEMO ACCOUNTS:');
    console.log('Customer: john@example.com  | Password: User@123');
    console.log('Admin:    admin@shopsphere.com | Password: Admin@123');
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    throw error;
  }
};

// Check if run directly via CLI (e.g. node utils/seeder.js)
if (process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await closeDB();
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })();
}
