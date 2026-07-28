# 🛒 FreshCart - Full-Stack E-Commerce Web Application

FreshCart is a lightweight, responsive full-stack grocery e-commerce application designed to streamline product browsing, cart management, and online order placement. Built using Node.js, Express, MongoDB Atlas, and Bootstrap 5.

---

## 🚀 Features
- **Dynamic Product Catalogue:** Real-time fetching of grocery items from MongoDB Atlas.
- **Interactive Shopping Cart:** Client-side cart operations with dynamic total price calculations.
- **Order Management:** Checkout functionality that records user orders directly to the cloud database.
- **RESTful API Architecture:** Clean client-server separation using Express routes and middleware.
- **Responsive UI:** Built with Bootstrap 5 for seamless experience across mobile and desktop.

---

## 🛠️ Tech Stack & Key Concepts
- **Frontend:** HTML5, CSS3, JavaScript (ES6+ Fetch API, Async/Await), Bootstrap 5
- **Backend:** Node.js, Express.js (REST APIs, CORS Handling)
- **Database:** MongoDB Atlas (Cloud NoSQL), Mongoose ODM
- **Environment & Security:** Dotenv (`.env`), `.gitignore` configuration
- **API Testing:** Postman

---

## 📁 Database Architecture
The project utilizes a single primary database (`FreshCart`) hosted on **MongoDB Atlas** consisting of the following key collections:
1. `products` - Stores catalogue items, prices, and stock details.
2. `orders` - Captures finalized customer orders and delivery information.
3. `cart` - Manages temporary items during user session.

---

## ⚡ Local Setup Instructions

### 1. Clone the repository
```bash
git clone [https://github.com/YOUR_USERNAME/FreshCart-FullStack.git](https://github.com/YOUR_USERNAME/FreshCart-FullStack.git)
cd FreshCart-FullStack
