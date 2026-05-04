import express from "express";
import { createServer as createViteServer } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json());

  // --- MOCK DATABASE ---
  const users: any[] = [
    { 
      email: "demo@example.com", 
      password: "password123", 
      name: "Demo User", 
      username: "demouser", 
      balance: 1000000,
      phone: "+628123456789"
    }
  ];

  const items = [
    {
      id: 1,
      name: "Analog Camera Mark II",
      price: 1800000,
      description: "Mint condition classic optics with leather strap included.",
      stock: 5,
      image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Ceramic Studio Vase",
      price: 450000,
      description: "Hand-poured minimalist ceramic piece for home decor.",
      stock: 12,
      image_url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const transactions: any[] = [];

  // --- API ROUTES ---
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _p, ...safeUser } = user;
      res.json({ success: true, payload: { token: "token-" + Date.now(), user: safeUser } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const { email, password, name, username, phone } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const newUser = {
      email,
      password,
      name: name || username,
      username: username || email.split('@')[0],
      phone: phone || "",
      balance: 1000000,
    };

    users.push(newUser);
    const { password: _p, ...safeUser } = newUser;
    
    res.json({ 
      success: true, 
      payload: { token: "token-" + Date.now(), user: safeUser },
      message: "Registration successful" 
    });
  });

  app.get("/api/user/:email", (req, res) => {
    const user = users.find(u => u.email === req.params.email);
    if (user) {
      const { password: _p, ...safeUser } = user;
      res.json({ success: true, payload: safeUser });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  });

  app.put("/api/user/update", (req, res) => {
    const { email, ...updateData } = req.body;
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex > -1) {
      users[userIndex] = { ...users[userIndex], ...updateData };
      const { password: _p, ...safeUser } = users[userIndex];
      res.json({ success: true, payload: safeUser, message: "Profile updated" });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  });

  app.get("/api/items", (req, res) => {
    res.json({ success: true, payload: items });
  });

  app.get("/api/transactions", (req, res) => {
    res.json({ success: true, payload: transactions });
  });

  app.post("/api/transaction/create", (req, res) => {
    const { item_id, quantity, description } = req.body;
    const item = items.find(i => i.id === item_id);
    
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    if (item.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    const total = item.price * quantity;
    // For this mock, we'll assume the logged in user is the first one or we'd get it from a token
    const user = users[0]; 

    if (user.balance < total) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    item.stock -= quantity;
    user.balance -= total;

    const transaction = {
      id: transactions.length + 1,
      item_id,
      description: description || `Purchased ${quantity}x ${item.name}`,
      total,
      created_at: new Date().toISOString()
    };

    transactions.unshift(transaction);
    res.json({ success: true, message: "Purchase successful", payload: transaction });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // --- FRONTEND MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa", 
    });
    
    // Vite middleware handles static files and standard SPA paths
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA fallback for Production
    app.get("*", (req, res, next) => {
      if (req.url.startsWith("/api")) return next();
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // --- FALLBACKS ---

  // Handle remaining API 404s
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint ${req.originalUrl} not found`
    });
  });

  // Start server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(err => {
  console.error("Critical server error:", err);
});
