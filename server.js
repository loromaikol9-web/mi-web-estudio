const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// CONFIG
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// CONEXIÓN MONGO
mongoose.connect("mongodb+srv://loromaikol9_db_user:Cristian123@cluster0.v1iwu8u.mongodb.net/miapp?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Mongo conectado"))
.catch(err => console.log(err));

// MODELO
const Usuario = require("./models/Usuario");

// RUTAS HTML
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public/login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public/register.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "public/dashboard.html")));

// REGISTER
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const existe = await Usuario.findOne({ email });

  if (existe) {
    return res.json({ ok: false, msg: "Usuario ya existe" });
  }

  await new Usuario({ email, password }).save();

  res.json({ ok: true });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Usuario.findOne({ email, password });

  if (user) {
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});

// SERVER
app.listen(3000, () => console.log("🚀 Servidor activo"));
