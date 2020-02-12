const Announcement = require('../models/announcement');
const User = require('../models/user');

const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
   if (req.isAuthenticated()) {
      return next();
   }

   req.flash('error', "You need to be logged in to do that!");
   res.redirect('/login');
};

middlewareObj.isAdmin = (req, res, next) => {
   if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
         return next();
      } else {
         req.flash('error', 'You don\'t have permission to do that. Ask an admin for help.');
         res.redirect('back');
      }
   }

   req.flash('error', 'You need to be logged in to do that!');
   res.redirect('/login');
};

middlewareObj.isEditor = (req,res,next) => {
   if (req.isAuthenticated()) {
      if (req.user.isEditor || req.user.isAdmin) {
         return next();
      } else {
         req.flash('error', 'You don\'t have permission to do that.');
         res.redirect('back');
      }
   }
   
   req.flash('error', 'You need to be logged in to do that!');
   res.redirect('/login');
};

module.exports = middlewareObj;

