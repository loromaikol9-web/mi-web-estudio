const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// 🔥 Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend"))); // ajusta si tu carpeta se llama diferente

// 🔗 CONEXIÓN MONGODB
mongoose.connect("mongodb+srv://loromaikol9_db_user:Cristian123@cluster0.v1iwu8u.mongodb.net/miapp?retryWrites=true&w=majority")
  .then(() => console.log("Mongo conectado 🔥"))
  .catch(err => console.log("Error Mongo:", err));

// 📦 MODELO USUARIO
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Usuario = mongoose.model("Usuario", userSchema);

// 🌐 RUTAS HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/register.html"));
});

// 📝 REGISTER
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existe = await Usuario.findOne({ username });

    if (existe) {
      return res.json({ ok: false, msg: "Usuario ya existe" });
    }

    await new Usuario({ username, password }).save();

    res.json({ ok: true });
  } catch (err) {
    res.json({ ok: false, msg: "Error servidor" });
  }
});

// 🔐 LOGIN
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Usuario.findOne({ username });

    if (!user) {
      return res.json({ ok: false });
    }

    if (user.password !== password) {
      return res.json({ ok: false });
    }

    res.json({ ok: true });

  } catch (err) {
    res.json({ ok: false });
  }
});

// 🚀 SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor activo en puerto " + PORT);
});
