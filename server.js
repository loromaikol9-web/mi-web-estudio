const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// 🔗 CONEXIÓN A MONGODB (USA TU LINK)
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://TU_USUARIO:TU_PASS@cluster.mongodb.net/miweb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB conectado"))
.catch(err => console.log("❌ Error MongoDB:", err));

// 📦 MODELO USUARIO
const User = mongoose.model('User', {
  username: String,
  email: String,
  password: String
});

// 📝 REGISTRO
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "Usuario registrado ✅" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar" });
  }
});

// 🔐 LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "Usuario no existe" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(400).json({ error: "Contraseña incorrecta" });

    res.json({ message: "Login exitoso 🔥" });
  } catch (error) {
    res.status(500).json({ error: "Error en login" });
  }
});

// 🌐 RUTA PRINCIPAL
app.get('/', (req, res) => {
  res.send("Backend funcionando 🚀");
});

// 🚀 SERVIDOR
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
