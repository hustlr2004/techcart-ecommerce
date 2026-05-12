# 🛒 TechCart — Full-Stack E-Commerce Platform

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

TechCart is a scalable, full-stack e-commerce web application that supports end-to-end shopping workflows — from product discovery to checkout. Built with the MERN stack, it delivers a fast, responsive user experience backed by a robust REST API.

---

## ✨ Features

- 🔍 **Product Browsing** — Browse and search a dynamic product catalog
- 🛒 **Shopping Cart** — Add, update, and remove items in real time
- 💳 **Checkout Workflow** — Seamless order placement and confirmation
- 📦 **Order Management** — Track and manage customer orders
- 🔐 **User Authentication** — Secure registration and login
- 📱 **Responsive UI** — Optimized for desktop and mobile devices

---

## 🧰 Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | ReactJS                       |
| Backend    | Node.js, ExpressJS            |
| Database   | MongoDB                       |
| API Style  | RESTful                       |
| Version Control | Git & GitHub             |

---

## 📁 Project Structure

```
TechCart/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Route-level pages
│       ├── context/         # State management
│       └── App.js
├── server/                  # Node.js + Express backend
│   ├── controllers/         # Route handler logic
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── middleware/          # Auth & error middleware
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/techcart.git
   cd techcart
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `server/` directory based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. **Run the application**

   Start the backend:
   ```bash
   cd server
   npm run dev
   ```

   Start the frontend (in a new terminal):
   ```bash
   cd client
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoints

| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| GET    | `/api/products`        | Fetch all products       |
| GET    | `/api/products/:id`    | Get product by ID        |
| POST   | `/api/users/register`  | Register a new user      |
| POST   | `/api/users/login`     | Authenticate user        |
| GET    | `/api/cart`            | Get user's cart          |
| POST   | `/api/cart`            | Add item to cart         |
| PUT    | `/api/cart/:id`        | Update cart item         |
| DELETE | `/api/cart/:id`        | Remove item from cart    |
| POST   | `/api/orders`          | Place a new order        |
| GET    | `/api/orders/:id`      | Get order details        |

---

## 🗃️ Database Models

- **User** — name, email, password (hashed), timestamps
- **Product** — name, description, price, category, stock, image
- **Cart** — user reference, array of product items with quantity
- **Order** — user reference, items, total amount, status, timestamps

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-linkedin](https://linkedin.com/in/your-linkedin)

---

> ⭐ If you found this project helpful, consider giving it a star on GitHub!
