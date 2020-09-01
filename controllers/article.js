const ArticleModelBuilder = require('../models/Article');
const UserModelBuilder = require('../models/User'); 

const fs = require('fs'); 
const sequelize = require('../database_connection.js');

const { models } = require('../database_connection.js');

// LOGIQUE MÉTIER //

// POST //
exports.createArticle = (req, res, next) => {
  const Article = ArticleModelBuilder(sequelize);
  const articleObject = JSON.parse(req.body.article); 
  const article = new Article({ 
    idUSERS : articleObject.userId,
    title : articleObject.title,
    text : articleObject.text,
    file : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  article.save()
    .then(() => res.status(201).json({ message: 'Article enregistré' }))
    .catch(error => res.status(400).json({ error : "erreur createArticle" }));
};



//  GET //
exports.getAllArticle = (req, res, next) => {
  const Article = ArticleModelBuilder(sequelize);
  const User = UserModelBuilder(sequelize); 
  const models = {Article, User}; 
  User.associate(models); 
  Article.associate(models); 
  Article.findAll({order: sequelize.literal('(createdAt) DESC'), include: {model : models.User, attributes: ['username']} }) // ordonné par ordre de mise à jour inverse + Association table Users (uniquement le username !)
    .then(articles => res.status(200).json(articles))
    .catch(error => res.status(400).json({ error : "gettallarticle" }));

};


// GET ONE //
exports.getOneArticle = (req, res, next) => {
  const Article = ArticleModelBuilder(sequelize);
  const User = UserModelBuilder(sequelize); 
  const models = {Article, User}; 
  User.associate(models); 
  Article.associate(models);
  Article.findOne({ where:{ id: req.params.id } , include: {model : models.User, attributes: ['username']} }) // récupération d'un article unique en incluant l'user (JOIN) raw SQL : SELECT * FROM articles JOIN users;
    .then(article => {
       res.status(200).json(article);
    }  
    )
    .catch(error => res.status(400).json({ error }));
};



// GET SELECTION (HOME PAGE) //
exports.getSelection = (req, res, next) => {
  const Article = ArticleModelBuilder(sequelize);
  const User = UserModelBuilder(sequelize); 
  const models = {Article, User}; 
  User.associate(models); 
  Article.associate(models); 
  Article.findAll({ where:{ selection : true }, order: sequelize.random(), include: {model : models.User, attributes: ['username']} })// récuparation de la liste complète des articles en associant l'user
    .then(articles => res.status(200).json(articles))
    .catch(error => res.status(400).json({ error : "gettallarticle" }));
};


// PUT MODERATEUR //
exports.selectArticle = (req, res, next) => {
  const Article = ArticleModelBuilder(sequelize);
 
    Article.findOne({ where:{ id: req.params.id } })
      .then(() => { 
          Article.update({ 
            selection : req.body.selection, 
          },{ where:{ id: req.params.id } }) 
            .then(() => res.status(200).json({ message: 'Article modification selection' }))
            .catch(error => res.status(400).json({ error }));
        
      }).catch(error => res.status(400).json({ error }))
};