// Imports
const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
} = require("../controle/controleacces");

const {authMiddleware} = require("../Middleware/Middleware.js");

// Paramétrage du serveur, pour l'instant en local
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

// Modules pour les routes, endpoints
app.get('/', authMiddleware,(req, res) => {
  res.send('Bienvenue sur notre jeu Uno');
});
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware,getProfile);
router.post("/disconnect", (req, res) => {
  res.clearCookie("token");
  return res.json(null);
});
//router.post('/forgotpassword', forgotPassword);

// Export
module.exports = router;
