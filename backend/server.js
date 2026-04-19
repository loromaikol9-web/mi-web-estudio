const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// IMPORTANTE
app.use(express.json());
app.use(express.static(__dirname));

// CONEXIÓN MONGODB
mongoose.connect("mongodb+srv://loromaikol9_db_user:Cristian123@cluster0.v1iwu8u.mongodb.net/miapp?retryWrites=true&w=majority")
.then(() => console.log("Mongo conectado"))
.catch(err => console.log(err));

// MODELO
const Usuario = mongoose.model("Usuario", {
  username: String,
  password: String
});

// RUTAS HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "register.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard.html"));
});

// REGISTER
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const existe = await Usuario.findOne({ username });
  if (existe) {
    return res.json({ ok: false });
  }

  await new Usuario({ username, password }).save();

  res.json({ ok: true });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Usuario.findOne({ username: email });

  if (!user) {
    return res.json({ ok: false });
  }

  if (user.password !== password) {
    return res.json({ ok: false });
  }

  res.json({ ok: true });
});

// SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor activo en puerto " + PORT);
});
