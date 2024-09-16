require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const pool = require("./db");
const cors = require('cors');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');
const routes = require('./routes');
const util = require('./util');
const fileUpload = require('express-fileupload');


// set up some configs for express.
const config = {
  name: 'sample-express-app',
  port: 8000,
  host: '0.0.0.0',
};

// create the express.js object
const app = express();

// create a logger object.  Using logger is preferable to simply writing to the console.
const logger = log({ console: true, file: false, label: config.name });

// specify middleware to use
app.use(bodyParser.json());

let corOptions;

if(process.env.REACT_CLIENT_ORIGIN === undefined){
  corOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
}
else{
  corOptions = {
    origin: process.env.REACT_CLIENT_ORIGIN,
    credentials: true,
  };
}


// enable files upload
app.use(fileUpload({
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024 // 2MB max file(s) size
  },
}));

app.use(cors(corOptions));

app.use(ExpressAPILogMiddleware(logger, { request: true }));

app.use('/static', express.static('public'))


const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({}, pool);

// 1 day in milliseconds
const oneDay = 1000 * 60 * 60 * 24;

app.use(session({
  secret: "llama-llama-llama",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: oneDay },
}));


//include routes
const account = require('./routes/account');
const friends = require('./routes/friends');
const course_metadata = require('./routes/course_metadata');
const courses = require('./routes/courses');
const enrollments = require('./routes/enrollments');
const roles = require('./routes/roles');
const schools = require('./routes/schools');
const waitlist = require('./routes/waitlist');
const notifications = require('./routes/notifications');
app.use('/', account);
app.use('/api/friends', friends);
app.use('/api/courses', courses);
app.use('/api/course-metadata', course_metadata);
app.use('/api/enrollments', enrollments);
app.use('/api/roles', roles);
app.use('/api/schools', schools);
app.use('/api/waitlist', waitlist);
app.use('/api/notifications', notifications);
app.use('/', routes);

// connecting the express object to listen on a particular port as defined in the config object.
app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
