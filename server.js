const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db");
const Product = require("./models/Product");
const Order = require("./models/Order");
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connect Database
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});
// Create Order Route
app.post("/api/orders", async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const newOrder = new Order({
      items,
      totalAmount
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", orderId: newOrder._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// 1. GET ALL PRODUCTS 
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. ADD A PRODUCT 
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, category, image } = req.body;
    const newProduct = new Product({ name, price, category, image });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
// Sample Products Add Karne Ke Liye (Seed Route)
// Sample Products Add Karne Ke Liye (Seed Route)
app.get("/api/seed", async (req, res) => {
  try {
    await Product.deleteMany({}); // Purana 3 products ka data clear karne ke liye
    
    const sampleProducts = [
      { name: "Fresh Apple", category: "fruit", brand: "FreshFarm", price: 120, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300", description: "Fresh red apples rich in vitamins and fiber." },
      { name: "Banana", category: "fruit", brand: "FreshFarm", price: 60, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300", description: "Fresh bananas perfect for daily nutrition." },
      { name: "Tomatoes", category: "vegetable", brand: "FreshFarm", price: 40, image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300", description: "Fresh farm tomatoes." },
      { name: "Potatoes", category: "vegetable", brand: "FreshFarm", price: 50, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300", description: "Fresh quality potatoes." },
      { name: "Amul Milk", category: "dairy", brand: "Amul", price: 65, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300", description: "Pure and fresh Amul milk." },
      { name: "Paneer", category: "dairy", brand: "Amul", price: 250, image: "images/paneer.jpg", description: "Soft and fresh paneer." },
      { name: "Cheese", category: "dairy", brand: "Amul", price: 180, image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300", description: "Premium cheese slices." },
      { name: "Oreo Biscuits", category: "snacks", brand: "Nestle", price: 40, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300", description: "Crunchy chocolate biscuits." },
      { name: "Maggi Noodles", category: "snacks", brand: "Nestle", price: 30, image: "images/maggi.jpg", description: "Instant noodles loved by everyone." },
      { name: "Orange Juice", category: "beverage", brand: "FreshFarm", price: 120, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300", description: "Healthy fresh orange juice." },
      { name: "Cold Drink", category: "beverage", brand: "FreshFarm", price: 60, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300", description: "Refreshing cold drink." },
      { name: "Rice Bag", category: "household", brand: "FreshFarm", price: 500, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300", description: "Premium quality rice." },
      { name: "Cooking Oil", category: "household", brand: "FreshFarm", price: 180, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300", description: "Healthy cooking oil." },
      { name: "Coffee", category: "snacks", brand: "Nestle", price: 20, image: "images/coffee.jpg", description: "Sunrise coffee." }
    ];

    const createdProducts = await Product.insertMany(sampleProducts);
    res.json({ message: "All 14 Products Seeded Successfully!", count: createdProducts.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});