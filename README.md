
# **EkChinha – Personalized Gifting Platform (MERN Stack)**

This repository contains the **EkChinha** gifting platform developed using the **MERN (MongoDB, Express.js, React.js, Node.js)** stack. EkChinha is a culturally rich e-commerce solution empowering local Nepali artisans by providing them with a digital space to showcase and sell handcrafted items in customizable gift boxes. The platform features both **Customer** and **Vendor** portals with full CRUD functionality, personalized shopping experiences, and order management tools.

---

## **📌 Key Features**

### **👩‍💻 Customer Portal:**
- Browse handcrafted Nepali products with detailed artisan descriptions.
- Customize and build personalized gift boxes.
- Save items to wishlist or add directly to cart.
- Checkout using local payment methods.

### **🏪 Vendor Portal:**
- Register as a vendor and list products.
- Upload product images, edit listings, and manage inventory.
- Receive and fulfill orders with status tracking.

---

## **🛠 Tech Stack**

| Technology      | Purpose                           |
|-----------------|-----------------------------------|
| **MongoDB**     | NoSQL Database for product & user data |
| **Express.js**  | Backend server and REST APIs      |
| **React.js**    | Frontend interface                |
| **Node.js**     | Runtime environment               |
| **JWT**         | User authentication & route protection |
| **Multer**      | File/image uploads                |
| **Bcrypt**      | Secure password hashing           |
| **Figma**       | UI/UX Design Prototyping          |

---

## **🚀 Getting Started**

### **1️⃣ Prerequisites**

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (Local or Atlas)
- Git installed

---

### **2️⃣ Backend Setup (Express.js + MongoDB)**

```bash
# Clone the server repo
git clone https://github.com/dilasha-ghimire/EkChinha.git
cd ekchinha-backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run the server
npm start

# Or with nodemon for development
npm run dev
```

The backend will run on:  
🔗 http://localhost:5000

---

### **3️⃣ Frontend Setup (React.js)**

```bash
# Clone the client repo
git clone https://github.com/dilasha-ghimire/EkChinha.git
cd ekchinha-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on:  
🌐 http://localhost:5173

---

## **🔐 Authentication & Authorization**

- **JWT-based auth** with access/refresh tokens.
- **Role-based access control**: `customer`, `vendor`, and `admin`.
- Secure vendor onboarding and dashboard access.

---

## **📊 UX & Prototyping**

- **Low Fidelity Wireframes**: Paper prototypes tested using Wizard of Oz method.
- **High Fidelity Testing**: Guerilla testing in real-world settings for feedback loop.
- **User Personas**, **Task Flows**, and **Nielsen’s 10 Heuristics** were used for UI optimization.

---

### ✨ *“EkChinha” is more than a product. It’s a memory, a culture, and a legacy you give.*  
