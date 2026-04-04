const dotenv = require('dotenv');
const Product = require('./src/models/Product');
const { connectDB } = require('./src/config/db');

dotenv.config();

const sampleProducts = [
  {
    name: 'iPhone 15',
    description: 'Apple smartphone with Dynamic Island, A16 Bionic performance, bright OLED display, and excellent battery life.',
    price: 79900,
    comparePrice: 91900,
    category: 'Phones',
    stock: 24,
    images: ['https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Premium Android flagship with Galaxy AI features, brilliant AMOLED display, and dependable all-day performance.',
    price: 74999,
    comparePrice: 86999,
    category: 'Phones',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'Google Pixel 8',
    description: 'Clean Android experience with Tensor-powered AI features, outstanding cameras, and compact flagship comfort.',
    price: 75999,
    comparePrice: 84999,
    category: 'Phones',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'OnePlus 12',
    description: 'Fast Snapdragon flagship with smooth LTPO display, rapid charging, and a premium Hasselblad camera setup.',
    price: 64999,
    comparePrice: 74999,
    category: 'Phones',
    stock: 17,
    images: ['https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'MacBook Air M3',
    description: 'Ultra-light Apple laptop with M3 power, silent operation, long battery life, and a stunning Liquid Retina display.',
    price: 114900,
    comparePrice: 129900,
    category: 'Laptops',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'Dell XPS 15',
    description: 'Premium Windows ultrabook with sharp display, strong Intel performance, and a compact high-end chassis.',
    price: 169990,
    comparePrice: 189990,
    category: 'Laptops',
    stock: 10,
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'ThinkPad X1 Carbon',
    description: 'Business-class laptop with legendary keyboard comfort, lightweight carbon build, and reliable premium performance.',
    price: 154990,
    comparePrice: 176990,
    category: 'Laptops',
    stock: 11,
    images: ['https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'HP Spectre x360',
    description: 'Convertible premium laptop with OLED touchscreen, sleek design, and flexible productivity on the go.',
    price: 139990,
    comparePrice: 159990,
    category: 'Laptops',
    stock: 9,
    images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading wireless noise canceling headphones with premium comfort and rich detail.',
    price: 29990,
    comparePrice: 34990,
    category: 'Audio',
    stock: 28,
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'AirPods Pro',
    description: 'Apple true wireless earbuds with active noise cancellation, transparency mode, and effortless device pairing.',
    price: 24900,
    comparePrice: 27900,
    category: 'Audio',
    stock: 32,
    images: ['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'Bose QuietComfort 45',
    description: 'Comfort-first wireless headphones with effective noise cancellation and balanced sound for everyday listening.',
    price: 26900,
    comparePrice: 30900,
    category: 'Audio',
    stock: 21,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Advanced smartwatch with fitness tracking, bright display, health sensors, and seamless Apple integration.',
    price: 41900,
    comparePrice: 46900,
    category: 'Wearables',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'Samsung Galaxy Watch6',
    description: 'Sleek smartwatch with health tracking, bright AMOLED display, and polished Galaxy ecosystem support.',
    price: 32999,
    comparePrice: 37999,
    category: 'Wearables',
    stock: 14,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'Fitbit Charge 6',
    description: 'Fitness-focused wearable with heart rate tracking, workout insights, and long battery life.',
    price: 15999,
    comparePrice: 18999,
    category: 'Wearables',
    stock: 19,
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'PS5 DualSense Controller',
    description: 'PlayStation controller with adaptive triggers, haptic feedback, and refined ergonomics for immersive gaming.',
    price: 5990,
    comparePrice: 6990,
    category: 'Gaming',
    stock: 34,
    images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB mechanical keyboard with tactile switches, low-latency input, and durable aluminum top plate.',
    price: 8999,
    comparePrice: 10499,
    category: 'Gaming',
    stock: 26,
    images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'Gaming Mouse',
    description: 'Lightweight gaming mouse with accurate sensor, fast switches, and customizable RGB accents.',
    price: 3499,
    comparePrice: 4199,
    category: 'Gaming',
    stock: 41,
    images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'USB-C Hub',
    description: 'Compact multiport hub with HDMI, USB-A, USB-C pass-through, and card reader for laptop expansion.',
    price: 3999,
    comparePrice: 4599,
    category: 'Accessories',
    stock: 36,
    images: ['https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'Full HD Webcam',
    description: '1080p webcam with clear video, stereo microphones, and plug-and-play support for calls and streaming.',
    price: 5499,
    comparePrice: 6299,
    category: 'Accessories',
    stock: 27,
    images: ['https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=900&q=80'],
  },
  {
    name: 'Portable Charger 20000mAh',
    description: 'High-capacity fast-charging power bank for phones, tablets, and travel-friendly everyday backup.',
    price: 2999,
    comparePrice: 3499,
    category: 'Accessories',
    stock: 43,
    images: ['https://images.unsplash.com/photo-1609592806596-b43bada2f2e9?auto=format&fit=crop&w=900&q=80'],
  },
];

async function seedProducts() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    const connected = await connectDB(mongoUri);
    if (!connected) {
      throw new Error('Could not connect to MongoDB for seeding');
    }

    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);

    console.log('Inserted 20 sample tech products');
    process.exit(0);
  } catch (error) {
    console.error('Seeder failed:', error);
    process.exit(1);
  }
}

seedProducts();
