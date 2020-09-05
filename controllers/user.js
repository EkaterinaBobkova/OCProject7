const UserModelBuilder = require('../models/User');
const {DataTypes} = require('sequelize');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const sequelize = require('../database_connection.js'); 

const fs = require('fs'); 
const PublicationModelBuilder = require('../models/Publication');



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
    User.findOne({ email: req.body.email })
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
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                process.env.KEY_TOKEN,
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };


// DELETE USER //
exports.deleteUser = (req, res, next) => {
    const User = UserModelBuilder(sequelize);
    const Publication = PublicationModelBuilder(sequelize);
    User.findOne({ where: {id: req.body.userId, email: req.body.email } }) 
        .then(user => {
            if (!user) { 
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password) 
                .then(valid => { 
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }else {
                            
                            Publication.findAll({ where:{ idUSERS: req.body.userId } }) 
                            .then(publications => { 
                              
                                 for (let a in publications){
                                  
                                    const pub = publications[a];
                                  
                                    const filename = pub.dataValues.file.split('/images/')[1]; 
                                
                                    fs.unlink(`images/${filename}`, () => { 
                                        Publication.destroy({ where:{ id: pub.dataValues.id } }) 
                                        .then(() => res.status(200).json({ message: 'Publication supprimée !' }))
                                        .catch(error => res.status(400).json({ error : 'publicationdestroy' }));
                                    });
                                };
                            })
                            .catch(error => res.status(500).json({ error : "pas de publication trouvée publicationfindall" }));
                      
                            User.destroy({ where: {email: req.body.email} }) 
                                .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
                                .catch(error => res.status(400).json({ error })); 
                    }
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
