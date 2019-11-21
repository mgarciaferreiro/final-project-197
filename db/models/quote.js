const S = require('sequelize');

// Schema for todo model
module.exports = {
  quote: {
    type: S.STRING,
    allowNull: false
  },
  song: {
    type: S.STRING
  },
  artist: {
    type: S.STRING
  }
};
