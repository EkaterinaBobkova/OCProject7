const PublicationModelBuilder = require('../models/Publication');
const UserModelBuilder = require('../models/User'); 

const fs = require('fs'); 
const sequelize = require('../database_connection.js');

const { models } = require('../database_connection.js');

// LOGIQUE MÉTIER //

// POST //
exports.createPublication = (req, res, next) => {
  const Publication = PublicationModelBuilder(sequelize);
  const publicationObject = JSON.parse(req.body.publication); 
  const publication = new Publication({ 
    idUSERS : publicationObject.userId,
    title : publicationObject.title,
    text : publicationObject.text,
    file : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  publication.save()
    .then(() => res.status(201).json({ message: 'Publication enregistré' }))
    .catch(error => res.status(400).json({ error : "erreur createPublication" }));
};



//  GET //
exports.getAllPublication = (req, res, next) => {
  const Publication = PublicationModelBuilder(sequelize);
  const User = UserModelBuilder(sequelize); 
  const models = {Publication, User}; 
  User.associate(models); 
  Publication.associate(models); 
  Publication.findAll({order: sequelize.literal('(createdAt) DESC'), include: {model : models.User, attributes: ['username']} }) // ordonné par ordre de mise à jour inverse + Association table Users (uniquement le username !)
    .then(publications => res.status(200).json(publications))
    .catch(error => res.status(400).json({ error : "gettallpublication" }));

};


// GET ONE //
exports.getOnePublication = (req, res, next) => {
  const Publication = PublicationModelBuilder(sequelize);
  const User = UserModelBuilder(sequelize); 
  const models = {Publication, User}; 
  User.associate(models); 
  Publication.associate(models);
  Publication.findOne({ where:{ id: req.params.id } , include: {model : models.User, attributes: ['username']} }) // récupération d'un Publication unique en incluant l'user (JOIN) raw SQL : SELECT * FROM Publications JOIN users;
    .then(publication => {
       res.status(200).json(publication);
    }  
    )
    .catch(error => res.status(400).json({ error }));
};



// GET SELECTION (HOME PAGE) //
exports.getSelection = (req, res, next) => {
  const Publication = PublicationModelBuilder(sequelize);
  const User = UserModelBuilder(sequelize); 
  const models = {Publication, User}; 
  User.associate(models); 
  Publication.associate(models); 
  Publication.findAll({ where:{ selection : true }, order: sequelize.random(), include: {model : models.User, attributes: ['username']} })// récuparation de la liste complète des Publications en associant l'user
    .then(publications => res.status(200).json(publications))
    .catch(error => res.status(400).json({ error : "gettallpublication" }));
};


// PUT MODERATEUR //
exports.selectPublication = (req, res, next) => {
  const Publication = PublicationModelBuilder(sequelize);
 
    Publication.findOne({ where:{ id: req.params.id } })
      .then(() => { 
          Publication.update({ 
            selection : req.body.selection, 
          },{ where:{ id: req.params.id } }) 
            .then(() => res.status(200).json({ message: 'Publication modification selection' }))
            .catch(error => res.status(400).json({ error }));
        
      }).catch(error => res.status(400).json({ error }))
};