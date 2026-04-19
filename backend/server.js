const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// IMPORTANTE
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// CONEXIÓN MONGODB
mongoose.connect("mongodb+srv://loromaikol9_db_user:Cristian123@cluster0.v1iwu8u.mongodb.net/miapp?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Mongo conectado"))
.catch(err => console.log(err));

// MODELO
const usuarioSchema = new mongoose.Schema({
  email: String,
  password: String
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

// RUTAS HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/register.html"));
});

// REGISTRO
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existe = await Usuario.findOne({ email });

    if (existe) {
      return res.json({ ok: false });
    }

    const nuevo = new Usuario({ email, password });
    await nuevo.save();

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.json({ ok: false });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Usuario.findOne({ email });

    if (!user) {
      return res.json({ ok: false });
    }

    if (user.password !== password) {
      return res.json({ ok: false });
    }

    res.json({ ok: true });

  } catch (error) {
    console.log(error);
    res.json({ ok: false });
  }
});

// SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor activo en puerto " + PORT);
});
