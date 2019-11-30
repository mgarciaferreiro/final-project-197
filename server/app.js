'use strict';

const express      = require('express');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const path         = require('path');
const logger       = require('morgan');
const routes       = require('./routes');

// Connect to the database
require('../db/dbconnect');

const port = process.env.PORT || 3000;

// configure the express server
const app = express();

// if we're developing, use webpack middleware for module hot reloading
if (process.env.NODE_ENV !== 'production') {

  // load and configure webpack
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../webpack/dev.config');

  // setup middleware
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

app.set('port', port);
app.use(logger('dev'))
  .use(cookieParser())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(express.static(path.resolve(__dirname, '../public')))
  .use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
  .use('/', routes);

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
