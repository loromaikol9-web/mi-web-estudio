const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");

const app = express();

// 🔥 MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "secreto_pro",
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(__dirname));

// 🔥 CONEXIÓN
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://loromaikol9_db_user:Cristian123@cluster0.v1iwu8u.mongodb.net/miapp?retryWrites=true&w=majority)
.then(() => console.log("✅ Mongo conectado"))
.catch(err => console.log(err));

// 🔥 MODELO
const Usuario = mongoose.model("Usuario", {
  username: String,
  password: String
});

// 🔥 REGISTRO
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const user = new Usuario({ username, password });
  await user.save();

  res.json({ ok: true });
});

// 🔥 LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Usuario.findOne({ username, password });

  if (!user) {
    return res.json({ ok: false });
  }

  req.session.user = user;
  res.json({ ok: true });
});

// 🔥 PROTEGER DASHBOARD
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  res.sendFile(path.join(__dirname, "dashboard.html"));
});

// 🔥 INICIO
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🔥 Server ON");
});
