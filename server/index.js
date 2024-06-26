// Imports
// Framework pour node.js
const express = require("express");
const dotenv = require("dotenv").config();
const { mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http");
const path = require('path');
const { setupSocket } = require("./chat/tchat");

// Créer l'instance de l'application
const app = express();
const server = http.createServer(app);

// Connexion à la base de données
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connexion bdd reussie"))
  .catch((err) => console.log("Connexion bdd echouée", err));

// Paramètrage de l'application principale
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Définit le chemin pour retrouver les modules du serveur
app.use("/", require("./routes/authRoutes"));

// Choix du part et affichage
const port = 8000;
server.listen(process.env.PORT || 8000, () => console.log(`Server is running on port ${process.env.PORT || 8000}`));

setupSocket(server);
