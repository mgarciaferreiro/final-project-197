// Connect to the database and import models
const { user, quote } = require('./dbconnect');

function getQuotes(userId) {
  return user.findByPk(userId).getQuotes()
}

function createUser(userId) {
  return user.create({ userId: userId }).then(() => {
    console.log ('user added. users: ' + user.findAll())
    return user.findAll()
  }, error => console.log(error))
}

function addQuote(line, song, artist, userId) {
  return quote.create({ quote: line, song: song, artist: artist, userId: userId }).then(() => {
    console.log ('quote added. quote: ' + quote.findAll())
    return quote.findAll()
  }, error => console.log(error))
}

// get all the todos. note that a promise is returned
function getTodos() {
  return todo.findAll();
}

// add todo and then return all todos. Note that a promise is returned
function addTodo(todoname) {
  return todo.create({ taskname: todoname }).then(() => {
    return todo.findAll();
  });
}

// removes a todo by id and then returns all todos
function removeTodo(todoId) {
  return todo.destroy(todoId).then(() => todo.findAll());
}

// Export the functions so that they can be used throughout your backend
module.exports = {
  getQuotes, createUser, addQuote
};
