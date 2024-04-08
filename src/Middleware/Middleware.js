function authMiddleware(req,res,next) {
    const token = req.cookies;

    if(!token) {
        return res.status(401).json({message:'Token d\'authentification manquant'});
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded) => {
        if(err) {
            return res.status(401).json({ message: 'Échec de l\'authentification. Token invalide' });
        }
        req.user = decoded;
        next();
    });
}

module.exports = {authMiddleware};