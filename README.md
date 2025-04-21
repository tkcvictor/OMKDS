# O.M.K.DS - Organic meal kit delivery services (OMKDS) App
## Delivering flavor with code – one order at a time!

## Introduction
**OMKDS** is a dynamic and responsive food delivery web application built with **React.js**, **Context API**, **Express.js**, and **MongoDB** and **Stripe**. It enables users to browse a curated food menu, add items to cart, and make secure payments via Stripe Checkout. Admins can manage food items and orders through a separate dashboard.



## 🚀 Deployed App
**Live Demo:** 


## 📌 Features
##👨‍🍳 User App
- **User Authentication:** Register & login securely with JWT.
- **Cart & Checkout System:**  Add/remove items and view order totals.
- **Order History:** View previous orders made by the user.
- **Admin Dashboard:** Manage dishes and customer orders.
- **Image Uploads:** Seamless food image management using Multer.
- **Stripe Payments:** Integrated Stripe Checkout for seamless and secure payments.
- **Fully Responsive:** Works great on desktop, tablets, and mobile.

## 🛠 Technology Stack
### Framework & Libraries
- **React.js** – Component-based UI framework.
- **Vite** – Lightning-fast build tool for optimized performance.
- **Context API** – State management for global currency selection.
- **MongoDB** – NoSQL database for persistent storage.
- **Express.js** – Backend server framework for routing and APIs.
- **Stripe** – Secure payment processing

### 📌 Languages & Styling
- **HTML – Core programming language.**
- **JavaScript (ES6) – Core programming language.**
- **CSS (Custom Styling)** – Responsive UI with modern design.
- **React Icons** – Intuitive icons for user actions.

### 📦 Key Dependencies
- `axios` -  For client-server communication.
- `jsonwebtoken` - Secure token-based auth.
- `mongoose` - MongoDB object modeling.
- `multer` -   File upload middleware.
- `react-router-dom ` - Client-side routing.
- `cors, dotenv, bcrypt` - Backend essentials.
- `stripe` – Payment gateway


### ⚙ API Integration
- **Custom REST APIs** – Built using Express.js to handle auth, food, cart, and orders.
- **No third-party API dependency** 

---

## 🚀 Getting Started

### 📌 Prerequisites
Ensure you have the following installed:
- **Node.js** (LTS version recommended)
- **npm** or **yarn** (for package management)
- **MongoDB** (Global or local)
- **Stripe Account** (for API keys)

### 📂 Installation & Setup
#### 1️⃣ Clone the repository and Create .env
```sh
git clone https://github.com/tkcvictor/Comp4212_Project.git
cd Comp4212_Project
```
In the server > .env file, you can find some information. Please use your own API key for future use, as this key may not work in the future.
```sh
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
MONGO_URI=your_db_uri
```
#### 2️⃣ Install dependencies
```sh
cd frontend
npm install
```
```sh
cd backend
npm install
```
```sh
cd admin
npm install
```
#### 3️⃣ Start the development server
```sh
For frontend
npm run dev
```
```sh
For backend
npm run server
```
```sh
For admin
npm run dev
```
- **OMKDS frontend will now be running at**  (http://localhost:5173/) 🎉
- **OMKDS backend will now be running at**  (http://localhost:4000/) 🎉
- **OMKDS admin panel will now be running at**  (http://localhost:5174/) 🎉

### 📸 Using CoinPulse

- 1️⃣ Browse food and add items to your cart.
- 2️⃣ Sign in to place orders and view order history.
- 3️⃣ Analyze Market Trends – Use interactive charts to track price movements.
