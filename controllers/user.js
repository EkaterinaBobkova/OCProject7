const UserModelBuilder = require('../models/User');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const sequelize = require('../database_connection.js'); 

const fs = require('fs'); 
const ArticleModelBuilder = require('../models/Article');

// LOGIQUE METIER //

// SIGNUP DES UTILISATEURS //
exports.signup = (req, res, next) => {
    const User = UserModelBuilder(sequelize);
    bcrypt.hash(req.body.password, 10) 
        .then(hash => { 
            const user = new User({ 
                username: req.body.username,
                email: req.body.email, 
                password: hash, 
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur crée' }))
                .catch(error => res.status(500).json({ message: 'Cette adresse mail et\\ou ce nom d\'utilisateur semble être déjà utilisé' }));
        })
        .catch(error =>console.log(error) || res.status(500).json({ error : "erreur signup" }));
};


// LOGIN DES UTILISATEURS //
exports.login = (req, res, next) => {
    const User = UserModelBuilder(sequelize);
    User.findOne({ where: {email: req.body.email} }) 
        .then(user => {
            if (!user) { 
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({ 
                        userId: user.id, 
                        token: jwt.sign( 
                            { userId: user.id }, 
                            process.env.TOKEN_KEY,
                            { expiresIn: '24h' } 
                        ),
                        isAdmin : user.isAdmin 
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error : "erreur signin" }));
};