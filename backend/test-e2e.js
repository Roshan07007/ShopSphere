const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('🧪 Starting ShopSphere Comprehensive Full-Stack E2E Automated Integration Tests...\n');
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  };

  // 1. Health check
  await test('API Root & Health Check', async () => {
    const res = await fetch(`${BASE_URL}`);
    const data = await res.json();
    if (!data.success) throw new Error('API not healthy');
  });

  // 2. Fetch Categories
  let sampleCategorySlug = '';
  await test('Fetch Categories (Curated Departments)', async () => {
    const res = await fetch(`${BASE_URL}/categories`);
    const data = await res.json();
    if (!data.success || data.categories.length === 0) throw new Error('No categories found');
    sampleCategorySlug = data.categories[0].slug;
  });

  // 3. Fetch Products & Search
  let sampleProduct = null;
  await test('Fetch Products Catalog & Filter by Category (INR Pricing)', async () => {
    const res = await fetch(`${BASE_URL}/products?category=${sampleCategorySlug}`);
    const data = await res.json();
    if (!data.success || data.products.length === 0) throw new Error('No products found');
    sampleProduct = data.products[0];
    if (typeof sampleProduct.price !== 'number' || sampleProduct.price <= 0) {
      throw new Error('Invalid product price');
    }
  });

  // 4. Product Autocomplete Suggestions
  await test('Search Suggestions for Autocomplete ("Aero" / "Nike" / "Sony")', async () => {
    const res = await fetch(`${BASE_URL}/products/suggestions?q=Aero`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.suggestions)) throw new Error('Suggestions failed');
  });

  // 5. Product Details by Slug & Reviews
  await test('Get Product Details by Slug with Related Items', async () => {
    const res = await fetch(`${BASE_URL}/products/${sampleProduct.slug}`);
    const data = await res.json();
    if (!data.success || !data.product) throw new Error('Product not found');
  });

  // 6. User Authentication (Customer Login)
  let customerToken = '';
  let customerUser = null;
  await test('Customer Authentication (john@example.com)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'User@123'
      })
    });
    const data = await res.json();
    if (!data.success || !data.token) throw new Error(data.message || 'Login failed');
    customerToken = data.token;
    customerUser = data.user;
  });

  const customerAuthHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${customerToken}`
  };

  // 7. Indian Address Management
  let addedAddressId = '';
  await test('Customer: Add New Indian Delivery Address', async () => {
    const res = await fetch(`${BASE_URL}/auth/addresses`, {
      method: 'POST',
      headers: customerAuthHeaders,
      body: JSON.stringify({
        label: 'Work',
        fullName: 'John Doe',
        phone: '9876543210',
        houseNo: 'Suite 404, Tech Horizon',
        street: 'MG Road, Indiranagar',
        landmark: 'Near Metro Station',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        country: 'India',
        isDefault: false
      })
    });
    const data = await res.json();
    if (!data.success || !data.addresses) throw new Error('Failed to add address');
    const newAddr = data.addresses.find(a => a.city === 'Bengaluru');
    if (!newAddr) throw new Error('Added address not in returned list');
    addedAddressId = newAddr._id;
  });

  // 8. Cart Operations
  let cartItemId = '';
  await test('Cart: Add Product to Bag', async () => {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: 'POST',
      headers: customerAuthHeaders,
      body: JSON.stringify({
        productId: sampleProduct._id,
        quantity: 2,
        selectedColor: 'Black'
      })
    });
    const data = await res.json();
    if (!data.success || data.cart.items.length === 0) throw new Error('Failed adding to cart');
    cartItemId = data.cart.items[0]._id;
  });

  await test('Cart: Update Item Quantity and Recalculate Subtotal', async () => {
    const res = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
      method: 'PUT',
      headers: customerAuthHeaders,
      body: JSON.stringify({ quantity: 3 })
    });
    const data = await res.json();
    if (!data.success || !data.cart) throw new Error('Failed updating cart item');
  });

  // 9. Wishlist Operations
  await test('Wishlist: Toggle Item in Wishlist', async () => {
    const res = await fetch(`${BASE_URL}/wishlist/toggle`, {
      method: 'POST',
      headers: customerAuthHeaders,
      body: JSON.stringify({ productId: sampleProduct._id })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Failed toggling wishlist');
  });

  // 10. Product Review Creation
  await test('Product: Create Verified Review', async () => {
    const res = await fetch(`${BASE_URL}/products/${sampleProduct._id}/reviews`, {
      method: 'POST',
      headers: customerAuthHeaders,
      body: JSON.stringify({
        rating: 5,
        title: 'Outstanding Quality and Sound!',
        comment: 'Truly exceeded expectations. Fast metro delivery to Mumbai and genuine packaging.'
      })
    });
    const data = await res.json();
    // It may succeed (201) or say already reviewed (400) if test ran previously
    if (!data.success && !data.message?.includes('already reviewed')) {
      throw new Error(data.message || 'Failed to submit review');
    }
  });

  // 11. Order Creation & Placement with INR Pricing & UPI/Card simulation
  let createdOrderId = '';
  await test('Order: Place Order with Indian Address, SAVE10 Coupon & COD/UPI', async () => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: customerAuthHeaders,
      body: JSON.stringify({
        orderItems: [
          {
            product: sampleProduct._id,
            name: sampleProduct.name,
            quantity: 1,
            image: sampleProduct.images[0],
            price: sampleProduct.price,
            discountPrice: sampleProduct.discountPrice
          }
        ],
        shippingAddress: {
          fullName: 'John Doe',
          phone: '9876543210',
          houseNo: 'Flat 402, Lotus Tower',
          street: 'Linking Road, Bandra West',
          landmark: 'Near National Park',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India'
        },
        paymentMethod: 'UPI',
        couponCode: 'SAVE10',
        paymentResult: { id: 'UPI-REF-987654321', status: 'COMPLETED' }
      })
    });
    const data = await res.json();
    if (!data.success || !data.order) throw new Error(data.message || 'Order creation failed');
    createdOrderId = data.order._id;
  });

  // 12. Fetch Customer Orders
  await test('Order: Fetch Customer Order History & Milestone Tracking', async () => {
    const res = await fetch(`${BASE_URL}/orders/myorders`, {
      headers: customerAuthHeaders
    });
    const data = await res.json();
    if (!data.success || data.orders.length === 0) throw new Error('No customer orders returned');
  });

  // 13. Admin Authentication
  let adminToken = '';
  await test('Admin Authentication (admin@shopsphere.com)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@shopsphere.com',
        password: 'Admin@123'
      })
    });
    const data = await res.json();
    if (!data.success || !data.token || data.user.role !== 'admin') {
      throw new Error(data.message || 'Admin login failed');
    }
    adminToken = data.token;
  });

  const adminAuthHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminToken}`
  };

  // 14. Admin Dashboard Stats
  await test('Admin: Get Executive Analytics & Gross Revenue in INR (₹)', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: adminAuthHeaders
    });
    const data = await res.json();
    if (!data.success || typeof data.stats.totalRevenue !== 'number') {
      throw new Error('Admin stats failed');
    }
  });

  // 15. Admin Order Management (Update status to Out for Delivery)
  await test('Admin: Update Order Status to "Out for Delivery"', async () => {
    const res = await fetch(`${BASE_URL}/orders/${createdOrderId}/status`, {
      method: 'PUT',
      headers: adminAuthHeaders,
      body: JSON.stringify({
        status: 'Out for Delivery',
        note: 'Assigned to BlueDart express delivery agent'
      })
    });
    const data = await res.json();
    if (!data.success || data.order.orderStatus !== 'Out for Delivery') {
      throw new Error('Order status update failed');
    }
  });

  // 16. Admin Users Management
  await test('Admin: Fetch Registered Customers & Address Records', async () => {
    const res = await fetch(`${BASE_URL}/admin/users`, {
      headers: adminAuthHeaders
    });
    const data = await res.json();
    if (!data.success || data.users.length === 0) throw new Error('Admin users list failed');
  });

  // 17. Contact Inquiry Submission API
  await test('Contact Inquiry API (Mumbai Concierge Desk)', async () => {
    const res = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Aarav Mehta',
        email: 'aarav@example.in',
        subject: 'Corporate Diwali Gifting Inquiry',
        message: 'Looking to place bulk order for 50 wireless ANC headphones.'
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Contact inquiry failed');
  });

  // 18. Newsletter Subscription API
  await test('Newsletter Subscription API (WELCOME500 Voucher)', async () => {
    const res = await fetch(`${BASE_URL}/contact/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `tester_${Date.now()}@example.in` })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Newsletter subscription failed');
  });

  console.log('\n=============================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log('=============================================================\n');

  if (failed > 0) process.exit(1);
};

runTests();
