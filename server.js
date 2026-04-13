
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Backend funcionando 🚀");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor listo");
});
