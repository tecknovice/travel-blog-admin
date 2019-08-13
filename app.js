const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('./config/db')

const indexRouter = require('./routes/index');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter')
const imageRouter = require('./routes/imageRouter')
const tagRouter = require('./routes/tagRouter')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const {session, passport, authRouter} = require('./config/auth')
// Authentication related middleware.
app.use(session);
// Initialize Passport and restore authentication state, if any,
// from the session.
app.use(passport.initialize());
app.use(passport.session());

// Pass isAuthenticated and current_user to all views.
app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.current_user = req.user;
  next();
});

// Use our Authentication and Authorization middleware.
app.use(authRouter);

app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/image', imageRouter)
app.use('/tag', tagRouter)
app.use('/post', postRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
