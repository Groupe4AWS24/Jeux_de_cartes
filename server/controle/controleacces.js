// Imports
const User = require("../modeles/user");
const { hashPassword, comparePassword } = require("../aide/hachage");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Register Endpoint
/**
 * Fonction asynchrone pour créer un nouvel utilisateur dans la base de données,
 * et enregistre le mot de passe haché.
 *
 * Si le mail ou l'username existe déjà dans la base de données, une erreur
 * sera retournée.
 *
 * @param {Object} req - requête contenant les informations de l'utilisateur
 * @param {Object} res - reponse de la requête
 */
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let majerror = false;
    let msgerrormail = "";
    let msgerrorname = "";
    // Check si email dans la bdd
    const existmail = await User.findOne({ email });
    if (existmail) {
      msgerrormail = "Email is taken already";
      majerror = true;
    }
    // Check si username dans la bdd
    const existname = await User.findOne({ username });
    if (existname) {
      msgerrorname = "Username is taken already";
      majerror = true;
    }
    if (majerror == true) {
      return res.json({
        majerror,
        errormail: msgerrormail,
        errorname: msgerrorname,
      });
    }
    // Hachage du mot de passe
    const hashedpassword = await hashPassword(password);
    // Création de l'utilisateur dans la base de données avec mongoose
    const user = await User.create({
      username,
      email,
      password: hashedpassword,
    });
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

// Login Endpoint
/**
 * Fonction asynchrone pour vérifier qu'un utilisateur existe dans
 * la base de données, et que l'username et le mot de passe sont corrects :
 * créer le cookie pour stocker le token signé si c'est le cas.
 *
 * Si l'username n'est pas existant, ou que le mot de passe ne
 * correspond pas à celui retrouvé dans la base de donnée,
 * retourne une erreur.
 *
 * @param {Object} req - requête contenant les informations de l'utilisateur
 * @param {Object} res - reponse contenant un header qui set le cookie
 */
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check si l'username existe dans la bdd
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        error: "Wrong username or password",
      });
    }

    // Check si le mot de passe est le bon
    const match = await comparePassword(password, user.password);
    if (match) {
      // Créer le token
      jwt.sign(
        { email: user.email, id: user._id, username: user.username },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json({ user });
        }
      );
    } else {
      return res.json({
        error: "Wrong username or password",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Fonction qui vérifie que le token récupéré est valide.
 *
 * Si il existe et est valide, retourne les informations de l'utilisateur.
 * Si il n'existe pas, ne retourne rien.
 *
 * @param {Object} req - requête contenant le token
 * @param {Object} res - reponse du serveur
 */
const getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

// forgotPassword Endpoint
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const expediteur = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: `UnmdpsansSaveur56#`, //process.env.PASSWORD,
    },
  })
  const contenu = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: "Réinitialisation du mot de passe",
    html: `<h1>Reinitialisation du mot de passe</h1>
    <p>Cliquer sur ce lien pour reinitialiser votre mot de passe</p>`,
  }

  expediteur.sendMail(contenu, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  })
  return res.json();
}
// Export
module.exports = { registerUser, loginUser, getProfile, forgotPassword };
