'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Like', 
    {
      publicationId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      likeType: DataTypes.INTEGER
    },
    {}
  );

  Like.associate = function(models) {
    models.Like.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    models.Like.belongsTo(models.Publication, {
        foreignKey: {
          allowNull: false
        }
      });

  };

  return Like;
};