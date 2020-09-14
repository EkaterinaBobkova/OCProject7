const PublicationModelBuilder = require('../models/Publication');
const UserModelBuilder = require('../models/User'); 

const fs = require('fs'); 
const sequelize = require('../database_connection.js');

const { models } = require('../database_connection.js');
const db = require('../models/index.js');
console.log(Object.keys(db));

// LOGIQUE MÉTIER //



//POST//
exports.createPublication = async (req, res, next) => {
  const Publication = db.Publication;
  // const publicationObject = JSON.parse(req.body.publication); 
  const user = await db.User.findOne({where: {id: request.body.userId}});
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
exports.modifyPublication = (req, res, next) => {
  
    const publicationObject = JSON.parse(req.body.publication);
  
    db.Publication.findOne({ where:{ id: req.params.id } })
      .then(publication => {
        const filename = publication.file.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          db.Publication.update({ 
            title : publicationObject.title,
            content : publicationObject.content,
            file : `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
          },{ where:{ id: req.params.id } }) 
            .then(() => res.status(200).json({ message: 'Publication et image modifiée' }))
            .catch(error => res.status(400).json({ error }));
        });
      }).catch(error => res.status(400).json({ error }))
}; 


// DELETE //

exports.deletePublication = (req, res, next) => {

  db.Publication.findOne({ where:{ id: req.params.id } }) 
    .then(publication => { 
      const filename = publication.file.split('/images/')[1]; 
      fs.unlink(`images/${filename}`, () => { 
        db.Publication.destroy({ where:{ id: req.params.id } }) 
          .then(() => res.status(200).json({ message: 'Publication supprimée !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
}; 
