
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// 🔥 MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // sirve tus HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🔗 CONEXIÓN A MONGODB
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://loromaikol9_db_user:Cristian123@cluster0.v1iwu8u.mongodb.net/miapp?retryWrites=true&w=majority")
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.log("❌ Error MongoDB:", err));

// 👤 MODELO DE USUARIO
const Usuario = mongoose.model("Usuario", {
  username: String,
  password: String
});

// 📝 REGISTRO
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const nuevo = new Usuario({ username, password });
    await nuevo.save();

    res.json({ ok: true, msg: "Usuario registrado" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Error al registrar" });
  }
});

// 🔐 LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Usuario.findOne({ username, password });

  if (user) {
    res.json({ ok: true, msg: "Login correcto" });
  } else {
    res.json({ ok: false, msg: "Datos incorrectos" });
  }
});

// 🧠 VALIDACIÓN LUHN (solo formato)
function luhnCheck(cardNumber) {
  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

// 💳 CHECK TARJETA (LEGAL - solo formato)
app.post("/check", (req, res) => {
  const { card } = req.body;

  if (!card) {
    return res.json({ ok: false, msg: "No enviaste tarjeta" });
  }

  const valid = luhnCheck(card);

  res.json({
    ok: true,
    valid,
    msg: valid ? "Tarjeta válida (formato)" : "Tarjeta inválida"
  });
});

// 🏠 RUTA PRINCIPAL (MUESTRA TU WEB)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🚀 SERVIDOR
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🔥 Servidor corriendo en puerto " + PORT);
});
