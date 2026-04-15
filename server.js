const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// 🔗 Conexión MongoDB (pon tu link aquí)
mongoose.connect("TU_LINK_DE_MONGO")
.then(() => console.log("Mongo conectado"))
.catch(err => console.log(err));

// 📦 Modelo de usuario
const User = mongoose.model("User", {
  email: String,
  password: String,
  activo: Boolean // para membresía
});

// 📝 Registro
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hash,
    activo: true // aquí decides si tiene acceso
  });

  await user.save();
  res.send("Usuario creado");
});

// 🔐 Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("No existe");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).send("Clave incorrecta");

  if (!user.activo) {
    return res.status(403).send("Sin membresía");
  }

  const token = jwt.sign({ id: user._id }, "secreto");

  res.json({ token });
});

// 🔒 Ruta privada
app.get("/privado", (req, res) => {
  res.send("Contenido exclusivo 🔥");
});

// 🚀 Servidor
app.listen(3000, () => {
  console.log("Servidor corriendo");
});
