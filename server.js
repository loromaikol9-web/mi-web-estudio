

const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// Base de datos
const adapter = new JSONFile("db.json");
const db = new Low(adapter);

async function initDB() {
  await db.read();
  db.data = db.data || { users: [] };
  await db.write();
}
initDB();

// REGISTRO
app.post("/register", async (req, res) => {
  const { user, pass } = req.body;

  await db.read();

  const exists = db.data.users.find(u => u.user === user);
  if (exists) return res.json({ success: false, msg: "Usuario ya existe" });

  const hash = await bcrypt.hash(pass, 10);

  db.data.users.push({ user, pass: hash });
  await db.write();

  res.json({ success: true });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { user, pass } = req.body;

  await db.read();

  const found = db.data.users.find(u => u.user === user);
  if (!found) return res.json({ success: false });

  const ok = await bcrypt.compare(pass, found.pass);

  res.json({ success: ok });
});

// GUARDAR NOTAS
app.post("/save", async (req, res) => {
  const { user, text } = req.body;

  await db.read();

  const u = db.data.users.find(u => u.user === user);
  if (!u) return res.json({ success: false });

  u.notes = u.notes || [];
  u.notes.push(text);

  await db.write();

  res.json({ success: true });
});

// OBTENER NOTAS
app.get("/notes/:user", async (req, res) => {
  await db.read();

  const u = db.data.users.find(u => u.user === req.params.user);

  res.json({ notes: u?.notes || [] });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🔥 Servidor hacker activo");
});
