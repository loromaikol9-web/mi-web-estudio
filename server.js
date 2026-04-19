const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/proweb")
.then(() => console.log("✅ MongoDB conectado"))
.catch(err => console.log("❌ Error:", err));

// Modelo
const Usuario = mongoose.model("Usuario", {
  username: String,
  password: String
});

// RUTAS HTML
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "register.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "dashboard.html")));

// REGISTER
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const existe = await Usuario.findOne({ username });

  if (existe) return res.json({ ok: false, msg: "Usuario ya existe" });

  await new Usuario({ username, password }).save();
  res.json({ ok: true });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Usuario.findOne({ username, password });

  if (user) {
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});

app.listen(3000, () => console.log("🚀 Servidor activo"));
