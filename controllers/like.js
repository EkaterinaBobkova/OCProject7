const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const fs = require('fs');

const db = require('../models/index.js');
console.log(Object.keys(db));


exports.reactPublication = async (req, res, next) => {
     const token = req.headers.authorization.split(" ")[1]; 
     const decodedToken = jwt.verify(token, process.env.KEY_TOKEN);
     const userId = decodedToken.userId;
     const liked = await db.Like.findOne({
          where: {
               publicationId: req.params.id,
               userId: userId,
          },
     });

     const disliked = await db.Like.findOne({
          where: {
            publicationId: req.params.id,
               userId: userId,
          },
     });
     if (liked) {
          await liked.destroy();
     } else if (disliked) {
          disliked.like = 1;
          await disliked.save();
     } else {
          await db.Like.create({
            publicationId: req.params.id,
               userId: userId,
               likeType: req.body.likeType,
          });
          await db.Like.findAndCountAll({
               where: {
                publicationId: req.body.req.params.id,
                   
               },
              
          })
               
                    
              .then(result => 
                      
                result.rows.forEach(row => {
                      res.status(201).json({publicationId : row.publicationId, 
                                             count : result.count,
                                             reacts : result.rows })
                                                 })
                      
               )
              
               .catch((error) => 
                     res.status(500).json(error));
     }
};