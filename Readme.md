# 🚀 Secure Digital Product SaaS Platform

## 📌 Overview

This is a production-ready backend system for selling digital products with secure payment handling, email verification, and instant file delivery.

It solves the problem of **secure digital product delivery after payment**, including webhook verification, token-based downloads, and automated email workflows.

---

## ⚙️ Features

* 🔐 JWT Authentication (Login / Register)
* 📧 Email Verification System
* 🛒 Smart Cart Management
* 💳 Razorpay Payment Integration
* 🔔 Webhook Handling (Payment Confirmation)
* 🔐 Secure Download Links (Expiring Tokens)
* 🧾 Order Management System
* 🧑‍💼 Admin Dashboard APIs
* 📊 Revenue & Stats APIs
* 🧠 Optimized DB Queries (Batch product fetching)
* 🧹 Auto Cart Cleanup after Payment
* 📩 Automated Email Notifications
* 📜 Logging for Debugging & Monitoring

---

## 🧱 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT, bcrypt
* **Validation:** Joi
* **Payments:** Razorpay
* **Email Service:** Resend
* **Other:** Crypto, CORS

---

## 🔌 API Endpoints

### 🔐 Auth

POST /register
POST /login
GET /verify-email

---

### 📦 Products

GET /products

---

### 🛒 Cart

POST /cart
GET /cart
POST /cart/remove

---

### 💳 Payments

POST /create-order
POST /webhook

---

### 📥 Downloads

GET /download/:token
GET /my-docs

---

### 🧑‍💼 Admin

GET /admin/users
GET /admin/orders
GET /admin/revenue
GET /admin/stats

---

## 📸 Screenshots

<img width="1231" height="830" alt="Screenshot 2026-04-14 223917" src="https://github.com/user-attachments/assets/1347b245-2fe8-403e-97df-59a429aa8c4e" />
<img width="1243" height="755" alt="Screenshot 2026-04-14 230217" src="https://github.com/user-attachments/assets/5d7f3826-c2bc-40ec-87ca-27e8d33efe07" />
<img width="1224" height="889" alt="Screenshot 2026-04-14 230233" src="https://github.com/user-attachments/assets/71670196-e4be-4a91-80b8-132e2aa64223" />

---

## Live Demo: https://secure-digital-product-saas-platform.onrender.com

---

## 🧠 How it works

1. User registers and verifies email 📧
2. User logs in and receives JWT 🔐
3. User adds products to cart 🛒
4. User creates order → Razorpay order generated 💳
5. Payment is completed on frontend
6. Razorpay sends webhook → backend verifies signature 🔔
7. Order is marked as PAID ✅
8. Secure download tokens are generated 🔐
9. Email with download links is sent 📩
10. User downloads files via token-based links 📥

---

## 🛠️ Run Locally

### 1️⃣ Clone the repo

```bash
git clone <your-repo-url>
cd project-folder
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file:

```env
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY=your_key
RAZORPAY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
RESEND_API_KEY=your_resend_key
BASE_URL=http://localhost:5000
```

### 4️⃣ Start server

```bash
npm start
```

---

## ⚠️ Important Notes

* Webhook route uses **raw body parser** — do NOT modify middleware order
* Tokens expire after 24 hours for security
* Email verification is mandatory before login
* Payment duplication is prevented using status checks

---

## 📌 Future Improvements

* Rate limiting 🚦
* Winston logging 📊
* Retry mechanism for failed emails 🔁
* File streaming instead of redirect 📥
* Frontend integration (React / Next.js)

---

## 👨‍💻 Author

Dev Karan

---

## ⭐ If you like this project

Give it a star ⭐ and use it in your portfolio 🚀
