
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// 🔒 Evitar errores silenciosos
process.on("uncaughtException", err => {
  console.log("Error:", err);
});

// 📦 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 Archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "../public")));

// 🔗 Conexión a MongoDB
mongoose.connect("mongodb+srv://loromaikol9_db_user:Cristian123@cluster0.v1iwu8u.mongodb.net/miapp?retryWrites=true&w=majority")
.then(() => console.log("✅ Mongo conectado"))
.catch(err => console.log("❌ Error Mongo:", err));

// 👤 Modelo Usuario
const Usuario = mongoose.model("Usuario", {
  username: String,
  password: String
});

// 🌐 Rutas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});

// 📝 Registro
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const nuevo = new Usuario({ username, password });
  await nuevo.save();

  res.send("Usuario registrado");
});

// 🔑 Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Usuario.findOne({ username, password });

  if (user) {
    res.redirect("/dashboard.html");
  } else {
    res.send("Datos incorrectos");
  }
});

// 🚀 PUERTO (CLAVE PARA RENDER)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 Servidor corriendo en puerto " + PORT);
});
