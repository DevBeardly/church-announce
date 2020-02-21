const express      = require('express'),
      router       = express.Router(),
      passport     = require('passport'),
      User         = require('../models/user'),
      Announcement = require('../models/announcement'),
      middleware   = require('../middleware');

// ADMIN DASHBOARD LANDING
router.get('/', middleware.isEditor, (req, res) => {
   res.redirect('/admin/announcements');
});

// ADMIN ANNOUNCEMENTS PANEL
router.get('/announcements', middleware.isEditor, (req, res) => {
   Announcement.find({}, (err, allAnnouncements) => {
      if (err) {
         console.log(err);
      } else {
         res.render('admin/announcements', { announcements: allAnnouncements });
      }
   });
});

// ADMIN GROUPS PANEL
router.get('/groups', middleware.isEditor, (req, res) => {
   Group.find({}, (err, allGroups) => {
      if (err) {
         console.log(err);
      } else {
         res.render('/admin/groups', { groups: allGroups });
      }
   })
});

// ADMIN CONNECT PANEL
router.get('/connect', middleware.isEditor, (req, res) => {
   res.redirect('/admin/announcements');
});

// ADMIN USERS PANEL
router.get('/users', middleware.isEditor, (req, res) => {
   User.find({}, (err, allUsers) => {
      if (err) {
         console.log(err);
      } else {
         res.render('admin/users', { users: allUsers });
      }
   });
});

module.exports = router;