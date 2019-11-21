const S = require('sequelize');

// Connects to a local database.
const sequelize = new S('final_project_197', 'root', 'Informatica00', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,
  port: '3306',
  logging: false
});

// Register the models with sequelize
const user = sequelize.define('user', require('./models/user'));
const quote = sequelize.define('quote', require('./models/quote'));
user.hasMany(quote)
quote.belongsTo(user)


//user.findByPk(123).getQuotes()

// Load the sequelize models into the mysql database
sequelize.sync().then(() => console.log('synced'));

module.exports = {
  user, quote
};