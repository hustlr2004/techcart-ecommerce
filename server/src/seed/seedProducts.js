const Product = require('../models/Product.model');

const seed = async () => {
  const items = [
    { name: 'Sample Product 1', price: 9.99, countInStock: 10 },
    { name: 'Sample Product 2', price: 19.99, countInStock: 5 },
  ];
  await Product.insertMany(items);
  console.log('Seeded products');
  process.exit(0);
};

seed().catch(console.error);
