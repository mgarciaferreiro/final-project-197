const S = require('sequelize');

// Schema for todo model
module.exports = {
  userId: {
    type: S.STRING,
    primaryKey: true,
    unique: true
  }
};