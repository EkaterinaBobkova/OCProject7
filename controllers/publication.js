const Publication = require('../models/Publication');
const User = require('../models/User'); 

const fs = require('fs'); 
// const sequelize = require('../database_connection.js');

// const { models } = require('../database_connection.js');
const db = require('../models/index.js');
console.log(Object.keys(db));

// LOGIQUE MÉTIER //



//POST//
exports.createPublication = async (req, res, next) => {
  const Publication = db.Publication;
  // const publicationObject = JSON.parse(req.body.publication); 
  const user = await db.User.findOne({WHERE: {id: req.body.userId}});
  const publication = new Publication({ 
    title : req.body.title,
    content : req.body.content,
    // attachment : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  publication.setUser(user);
  publication.save()
    .then(() => res.status(201).json({ message: 'publication enregistrée' }))
    .catch(error => res.status(400).json({ error : error.message }));
};






//  GET //
exports.getAllPublication = (req, res, next) => {
  
  db.Publication.findAll({order: sequelize.literal('(createdAt) DESC'), include: {model : db.User, attributes: ['username']} }) 
    .then(publications => res.status(200).json(publications))
    .catch(error => console.log(error) || res.status(400).json({ error : "gettallpublication" }));

};





// GET ONE //
exports.getOnePublication = (req, res, next) => {
  
  db.Publication.findOne({ where:{ id: req.params.id } , include: {model : db.User, attributes: ['username']} })
    .then(publication => {
       res.status(200).json(publication);
    }  
    )
    .catch(error => res.status(400).json({ error }));
};


//PUT //


exports.modifyPublication = async (req, res) => {
  try {
      const publication = await db.Publication.findOne({ WHERE: {
          id: req.params.id
      }})        
      if (req.file) {
          const filename = publication.imageUrl.split('/images/')[1]
          fs.unlink(`images/${filename}`, (err) => {
              if (err) throw err;
              console.log('Image modifiée')
          })
      }
      const publicationObject = req.file ? {
          ...JSON.parse(req.body.publication),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : {
         ...JSON.parse(req.body.publication) 
      }
      if (publication && publication.userId !== req.userId) {
          return res.sendStatus(401);
      }
      await db.Publication.update({
          ...publicationObject, 
          id: req.params.id}
      )
      res.status(200).send({ message: "Publication modifiée"})
  } catch (err) {
      res.sendStatus(500)    
  }
}

// DELETE //

exports.deletePublication = async (req, res) => {
  try {
      const publication = await db.Publication.findOne({ where: {
          id: req.params.id
      }})
      if (publication.imageUrl) {
          const filename = publication.imageUrl.split('/images/')[1]
          fs.unlink(`images/${filename}`, (err) => {
              if (err) throw err;
              console.log('Image supprimée')
          })
      }
      if (publication && publication.userId !== req.userId) {
          return res.sendStatus(401);
      }
      await db.Publication.destroy({ where: {
          id: req.params.id
      }})
      
      
      res.status(200).send({ message: "Publication supprimée"})
  } catch (err) {
      res.status(500).send(err)
  }
}