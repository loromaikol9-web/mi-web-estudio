const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// Login fake (demo)
app.post("/login", (req, res) => {
  const { user, pass } = req.body;

  if (user === "admin" && pass === "1234") {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Generador contraseña
app.get("/api/password", (req, res) => {
  let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pass = "";
  for (let i = 0; i < 10; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  res.json({ password: pass });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Servidor listo 🚀");
});
