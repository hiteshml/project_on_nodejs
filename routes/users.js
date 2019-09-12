const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../module/User');

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
  //console.log(req.body)
  //res.send('hello');
  const {name, email, password, password2} = req.body;
  let errors = [];

  if(!name || !email || !password || !password2){
    errors.push({msg: 'Please fill in all field'});
  }

  if(password != password2){
    errors.push({msg: 'Password not match'});
  }

  if(password.length < 6){
    errors.push({msg: 'Password should be atleast six characters'});
  }

  if(errors.length > 0){
    res.render('register',{
      errors,
      name,
      email,
      password,
      password2
    });
  }
else {
  //res.send('pass');
  User.findOne({email: email}).then(user => {
    if(user){
      errors.push({msg: 'Email is already registered'});
      res.render('register',{
        errors,
        name,
        email,
        password,
        password2
      });
    } else{
      const newUser = new User({
        name,
        email,
        password
      });

      bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) throw err;

        newUser.password = hash;
        newUser.save().then(user => {
          req.flash('success_msg', 'You are registered and now you can login');
          res.redirect('/users/login');
        })
        .catch(err => console.log(err));
      }))

}
  });

}
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { successRedirect: '/dashboard',
                                   failureRedirect: '/users/login',
                                   failureFlash: true })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

router.get('/Go', (req, res) => {
  req.Go();
  //req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});


module.exports = router;
