'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Publication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Article.belongsTo(models.User,{
        foreignKey: 'idUSERS'
      })
    }
  };
  
  Publication.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    idUSERS: DataTypes.INTEGER,
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Publication',
  });
  return Publication;
};

