const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// MongoDB
mongoose.connect(process.env.MONGO_URI||"mongodb+srv://loromaikol9_db_user:Cristian123@cluster0.v1iwu8u.mongodb.net/miapp?retryWrites=true&w=majority)
.then(() => console.log("✅ Mongo conectado"))
.catch(err => console.log("❌ Error Mongo:", err));

// Modelo usuario
const Usuario = mongoose.model("Usuario", {
  username: String,
  password: String
});

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Registro
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const nuevo = new Usuario({ username, password });
    await nuevo.save();

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Usuario.findOne({ username, password });

  if (user) {
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Servidor funcionando"));
