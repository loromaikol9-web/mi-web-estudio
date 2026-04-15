
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// 🔗 PON AQUÍ TU URL DE MONGODB (la de Atlas)
const MONGO_URI = "TU_URL_AQUI";

// Conectar a MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.log("❌ Error:", err));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor en puerto " + PORT);
});
