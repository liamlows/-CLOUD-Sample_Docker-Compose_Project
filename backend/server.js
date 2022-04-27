require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
// create the express.js object
const app = express();
// const mysqlConnect = require('./db');
const routes = require('./routes'); //http://localhost:8000/account/newnft
// const usersRoutes = require('./routes/users');
// const sessionRoutes = require('./routes/sessions');

// set up some configs for express.
const config = {
  name: 'sample-express-app',
  port: 8000,
  host: '0.0.0.0',
};

const { createModelsMiddleware } = require('./middleware/model-middleware');


// Importing route handlers
const usersRoutes = require('./routes/users');
const sessionRoutes = require('./routes/session');
const accountRoutes = require('./routes/account');
const adminRoutes = require('./routes/admin');
const ubRoutes = require('./routes/ub');

// create a logger object.  Using logger is preferable to simply writing to the console.
const logger = log({ console: true, file: false, label: config.name });

// specify middleware to use
app.use(createModelsMiddleware);
app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));
app.use(ExpressAPILogMiddleware(logger, { request: true }));
const { authenticateJWT, authenticateWithClaims } = require('./middleware/auth');

// Route handlers
app.use('/session', sessionRoutes);
app.use('/account', accountRoutes);


app.use('/users', authenticateWithClaims(['user']), usersRoutes);
app.use('/admin', authenticateWithClaims(['admin']), adminRoutes);
app.use('/ub', authenticateWithClaims(['unblocked']), ubRoutes);


app.get('/health', (request, response, next) => {
  const responseBody = { status: 'up', port };
  response.json(responseBody);
  // next() is how we tell express to continue through the middleware chain
  next();
});


//include routes
routes(app, logger);

// connecting the express object to listen on a particular port as defined in the config object.
app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
