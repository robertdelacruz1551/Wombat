var cors = require('cors');
var { PrismaClient } = require('@prisma/client');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Import routes
var indexRouter = require('./routes/index');
var authenticate = require('./routes/authenticate');
var authenticated = require('./routes/authenticated');

var app = express();
app.use(cors({
  origin: "http://localhost:3000", 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var prisma = new PrismaClient();

// add the database to incoming request objects as meddleware
app.use((req, res, next) => {
  req.app.locals.db = prisma; // Make db available to routes
  next();
});

// Add the routes to the app
app.use('/', indexRouter);
app.use('/authenticate', authenticate);
app.use('/authenticated', authenticated);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
