const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// 🔗 CONEXIÓN A MONGODB
mongoose.connect("mongodb+srv://loromaikol9_db_user:Cristian123@cluster0.v1iwu8u.mongodb.net/miapp?retryWrites=true&w=majority")
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.log("❌ Error MongoDB:", err));

// 📌 MODELO DE USUARIO
const Usuario = mongoose.model("Usuario", {
  username: String,
  password: String
});

// 📌 REGISTRO
app.post("/register", async (req, res) => {
  try {
    const nuevo = new Usuario(req.body);
    await nuevo.save();
    res.send("✅ Usuario registrado");
  } catch (error) {
    res.status(500).send("❌ Error al registrar");
  }
});

// 📌 LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Usuario.findOne({ username, password });

  if (user) {
    res.send("✅ Login correcto");
  } else {
    res.send("❌ Usuario o contraseña incorrectos");
  }
});

// 📌 RUTA PRINCIPAL
app.get("/", (req, res) => {
  res.send("🔥 Servidor funcionando");
});

// 🚀 INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
