const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
//require('dotenv').config({path: 'ENV_FILENAME'});
//const db = require('./config/key').MongoURI;
require('./config/passport')(passport);

mongoose.connect('mongodb+srv://project:project@cluster0-a7e3i.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true}).then(() => console.log('MongoDB Connected'))

  .catch(err => console.log(err));


app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false}));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.use('/public', express.static('public'))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});



app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
