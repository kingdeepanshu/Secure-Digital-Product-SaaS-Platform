// =====================
// IMPORTS
// =====================
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Resend } = require("resend");

const app = express();

// =====================
// WEBHOOK HANDLERS (TOP PRIORITY)
// =====================
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("🔥 WEBHOOK HIT");

    const signature = req.headers["x-razorpay-signature"];

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest("hex");

    if (signature !== expected) {
      console.log("❌ SIGNATURE FAILED");
      return res.status(400).send("Invalid signature");
    }

    console.log("✅ VERIFIED");

    const event = JSON.parse(req.body);

    if (event.event === "payment.captured") {
      console.log("💰 PAYMENT CAPTURED");

      const payment = event.payload.payment.entity;

      const order = await Order.findOne({
        razorpayOrderId: payment.order_id,
      });

      if (!order) {
        console.log("❌ ORDER NOT FOUND");
        return res.sendStatus(200);
      }

      if (order.status === "PAID") {
        console.log("⚠️ Already processed");
        return res.sendStatus(200);
      }

      order.status = "PAID";
      order.razorpayPaymentId = payment.id;
      await order.save();

      const user = await User.findById(order.userId);

      await sendEmail(
        user.email,
        "Payment Successful 💰",
        `<h2>Your payment is successful</h2>`,
      );

      console.log("✅ ORDER UPDATED");

      let links = "";

      for (let item of order.products) {
        const token = crypto.randomBytes(32).toString("hex");

        await DownloadToken.create({
          userId: order.userId,
          productId: item.productId,
          token,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });

        links += `<li><a href="${process.env.BASE_URL}/download/${token}">Download</a></li>`;
      }

      await sendEmail(
        user.email,
        "Your Downloads 🔐",
        `<ul>${links}</ul>`,
      );

      console.log("🔐 Download tokens created");

      await Cart.deleteOne({ userId: order.userId });

      console.log("🧹 Cart cleared");
    }

    res.sendStatus(200);
  },
);

// =====================
// CONFIG (ENV, KEYS, DB)
// =====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

const resend = new Resend(process.env.RESEND_API_KEY);

// =====================
// MIDDLEWARES
// =====================
app.use(express.json());
app.use(cors());

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).send("No token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access denied");
  }
  next();
};

// =====================
// DATABASE LOGIC (MODELS + VALIDATION)
// =====================
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

const downloadTokenSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  token: String,
  expiresAt: Date,
});

const DownloadToken = mongoose.model("DownloadToken", downloadTokenSchema);

const emailTokenSchema = new mongoose.Schema({
  userId: String,
  token: String,
  expiresAt: Date,
});

const EmailToken = mongoose.model("EmailToken", emailTokenSchema);

const productSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    fileUrl: String,
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    products: Array,
    totalAmount: Number,
    status: { type: String, default: "PENDING" },
    razorpayOrderId: String,
    razorpayPaymentId: String,
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const cartSchemaValidation = Joi.object({
  productId: Joi.string().required(),
});

// =====================
// EMAIL LOGIC
// =====================
const sendEmail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    console.log("mail sent");
  } catch (err) {
    console.log(err);
  }
};

// =====================
// ROUTES
// =====================

// AUTH
app.post("/register", async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).send("Email already exists");

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hash });

  const token = crypto.randomBytes(32).toString("hex");

  await EmailToken.create({
    userId: user._id,
    token,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  const link = `${process.env.BASE_URL}/verify-email?token=${token}`;

  await sendEmail(email, "Verify Email", `<a href="${link}">Verify</a>`);

  res.send("User registered, check email");
});

app.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  const record = await EmailToken.findOne({ token });

  if (!record || record.expiresAt < Date.now()) {
    return res.send("Token expired or invalid");
  }

  await User.findByIdAndUpdate(record.userId, { isVerified: true });

  res.send("Email verified");
});

app.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.isVerified) {
    return res.send("Invalid or not verified");
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.send("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.json({ token });
});

// PRODUCTS
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// CART
app.post("/cart", authMiddleware, async (req, res) => {
  const { error } = cartSchemaValidation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { productId } = req.body;

  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      userId: req.user.id,
      items: [{ productId, quantity: 1 }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }
    await cart.save();
  }

  res.send("Added to cart");
});

app.get("/cart", authMiddleware, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate({
    path: "items.productId",
    select: "title price",
  });

  if (!cart) {
    return res.json({ items: [] });
  }

  res.json(cart);
});

app.post("/cart/remove", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).send("Product ID required");
    }

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    await cart.save();

    res.send("Product removed from cart");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error removing product");
  }
});

// PAYMENT
app.post("/create-order", authMiddleware, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });

  if (!cart || cart.items.length === 0) {
    return res.status(400).send("Cart is empty");
  }

  let existingOrder = await Order.findOne({
    userId: req.user.id,
    status: "PENDING",
  });

  if (existingOrder) {
    return res.json({
      orderId: existingOrder.razorpayOrderId,
      amount: existingOrder.totalAmount * 100,
    });
  }

  let total = 0;

  const ids = cart.items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: ids } });

  products.forEach((p) => (total += p.price));

  const razorOrder = await razorpay.orders.create({
    amount: total * 100,
    currency: "INR",
  });

  await Order.create({
    userId: req.user.id,
    products: cart.items,
    totalAmount: total,
    razorpayOrderId: razorOrder.id,
  });

  res.json({ orderId: razorOrder.id, amount: total * 100 });
});

// DOWNLOAD
app.get("/download/:token", async (req, res) => {
  const token = req.params.token;

  const record = await DownloadToken.findOne({ token });

  if (!record) return res.send("Invalid link");
  if (record.expiresAt < Date.now()) return res.send("Link expired");

  const product = await Product.findById(record.productId);

  res.redirect(product.fileUrl);
});

app.get("/my-docs", authMiddleware, async (req, res) => {
  const tokens = await DownloadToken.find({ userId: req.user.id });

  const result = [];

  for (let t of tokens) {
    const product = await Product.findById(t.productId);

    result.push({
      id: product._id,
      title: product.title,
      downloadLink: `${process.env.BASE_URL}/download/${t.token}`,
    });
  }

  res.json(result);
});

// =====================
// Admin Apis
// =====================

app.get("/admin/users", authMiddleware, adminMiddleware, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

app.get("/admin/revenue", authMiddleware, adminMiddleware, async (req, res) => {
  const orders = await Order.find({ status: "PAID" });

  let total = 0;
  orders.forEach((o) => (total += o.totalAmount));

  res.json({ totalRevenue: total });
});

app.get("/admin/orders", authMiddleware, adminMiddleware, async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.get("/admin/stats", authMiddleware, adminMiddleware, async (req, res) => {
  const users = await User.countDocuments();
  const orders = await Order.countDocuments();
  const paidOrders = await Order.countDocuments({ status: "PAID" });

  res.json({
    users,
    orders,
    paidOrders,
  });
});

app.get("/", (req, res) => {
  res.send("its working");
});

// =====================
// SERVER START
// =====================
app.listen(5000, () => {
  console.log("Server running on 5000");
});
