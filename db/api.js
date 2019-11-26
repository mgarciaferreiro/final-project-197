// Connect to the database and import models
const { user, quote } = require('./dbconnect');

function getQuotes(userId) {
  return user.findByPk(userId).then(user => {
    return user.getQuotes()
    .catch(error => console.log(error))
  })
}

function createUser(userId) {
  return user.create({ userId: userId })
  .catch(error => console.log(error))
}

function addQuote(line, song, artist, userId) {
  return user.findByPk(userId)
  .then(user => {
    return quote.create({ quote: line, song: song, artist: artist })
    .then(quote => {
      console.log({quote})
      user.addQuote(quote)
      return quote
    })
  }).catch(error => console.log(error))

}

// removes a todo by id and then returns all todos
function removeTodo(todoId) {
  return todo.destroy(todoId).then(() => todo.findAll());
}

// Export the functions so that they can be used throughout your backend
module.exports = {
  getQuotes, createUser, addQuote
};
