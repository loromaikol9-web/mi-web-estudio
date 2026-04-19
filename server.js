
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 SERVIR ARCHIVOS ESTÁTICOS (ESTO ES LA CLAVE)
app.use(express.static(__dirname));

// CONEXIÓN MONGO
mongoose.connect("mongodb+srv://loromaikol9_db_user:Cristian123@cluster0.v1iwu8u.mongodb.net/miapp?retryWrites=true&w=majority")
.then(() => console.log("🟢 Mongo conectado"))
.catch(err => console.log(err));

// MODELO
const Usuario = mongoose.model("Usuario", {
  username: String,
  password: String
});

// RUTA PRINCIPAL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

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

// PUERTO
app.listen(3000, () => {
  console.log("🚀 Servidor activo");
});
