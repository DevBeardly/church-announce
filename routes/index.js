const express      = require('express'),
      router       = express.Router(),
      passport     = require('passport'),
      User         = require('../models/user'),
      Announcement = require('../models/announcement'),
      Group        = require('../models/group'),
      middleware   = require('../middleware');

// LANDING PAGE
router.get('/', (req, res) => {
   Announcement.find({}, (err, allAnnouncements) => {
      if (err) {
         console.log(err);
      } else {
         Group.find({}, (err, allGroups) => {
            if (err) {
               console.log(err);
            } else {      
               res.render('index', { announcements: allAnnouncements, groups: allGroups });
            };
         });
      };
   });
});

// show register form
router.get('/register', (req, res) => {
   res.render('register');
});

// handle signup logic
router.post('/register', (req, res) => {
   const newUser = new User({ username: req.body.username, fullname: req.body.fullname, isMember: true, isEditor: true, isAdmin: true });
   User.register(newUser, req.body.password, (err, user) => {
      if (err) {
         req.flash('error', err.message);
         return res.redirect('/register');
      }

      passport.authenticate('local')(req, res, () => {
         req.flash('success', 'Welcome to Forest Community Church, ' + user.username);
         res.redirect('/');
      });
   });
});

// show login form
router.get('/login', (req, res) => {
   res.render('login');
});

// handle login logic
router.post('/login', passport.authenticate('local', {
   failureRedirect: '/login',
}), (req, res) => {
   if (req.user.isAdmin || req.user.isEditor) {
      res.redirect('/admin/announcements');
   } else {
      res.redirect('/user');
   }
});

// logout route
router.get('/logout', (req, res) => {
   req.logout();
   req.flash('success', 'Logged you out!');
   res.redirect('/');
});

// Contact Form success route
router.get('/contact-success', (req, res) => {
   req.flash('success', 'Thanks for your time, you should hear back from us soon!');
   res.redirect('/');
});

module.exports = router;