const UserModelBuilder = require('../models/User');
const {DataTypes} = require('sequelize');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 


const fs = require('fs'); 

const db = require('../models/index.js');
console.log(Object.keys(db));




// LOGIQUE METIER //

// SIGNUP DES UTILISATEURS //
exports.signup = (req, res, next) => {
    const User = db.User;

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
    const user = db.User;
    let email= req.body.email;
    let password= req.body.password;
    if (email ==null || password == null){
      res.status(400).json({message: 'Il manque un paramètre ! '});
    }
    db.User.findOne({
          where: { email: email }
      })
          .then(user => {
              if (user) {
                  bcrypt.compare(password, user.password, (errBcrypt, resBcrypt) => {
                      if (resBcrypt) {
                          res.status(200).json({
                              userId: user.id,
                              token: jwt.sign({userId: user.id}, process.env.KEY_TOKEN,{
                                  expiresIn:"24h",
                              })
                          })
                      } else {
                          res.status(403).json({ error: 'invalid password' });
                      };
                  })
              } else {
                  res.status(404).json({ 'erreur': 'Cet utilisateur n\'existe pas' })
              }
          })
          .catch(err => { res.status(500).json({ err }) })
  };


// DELETE USER //

exports.deleteUser = async (req,res,next) => {
  try {
     await  db.User.destroy({ 
          where: { id: Number(req.params.id) }
      })
      return res.status(200).send({ message: "Utilisateur supprimé"})
  }
  catch(err){
      return res.status(500).json({ err});
  }          
}