const express          = require('express'),
      expressSanitizer = require('express-sanitizer'),
      router           = express.Router(),
      passport         = require('passport'),
      User             = require('../models/user'),
      Announcement     = require('../models/announcement'),
      middleware       = require('../middleware');

// NEW - display form to create new announcement
router.get('/new', middleware.isLoggedIn, (req, res) => {
   res.render('announcements/new');
});

// CREATE - add new announcement to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
   req.body.announcement.description = req.sanitize(req.body.announcement.description);
   Announcement.create(req.body.announcement, (err, announcement) => {
      if (err) {
         req.flash('error', 'Your announcement could not be saved. Please try again.');
         res.redirect('back');
      } else {
         announcement.author.id = req.user._id;
         announcement.author.fullname = req.user.fullname;

         announcement.save();

         req.flash('success', 'Your announcement was successfully created!');
         res.redirect('/admin');
      }
   });
});

// EDIT - display form to update an announcement
router.get('/:id/edit', (req, res) => {
   Announcement.findById(req.params.id, (err, foundAnnouncement) => {
      if (err) {
         req.flash('error', 'Could not find that announcement.');
         res.redirect('back');
      } else {
         res.render('announcements/edit', { announcement: foundAnnouncement });
      }
   });
});

// UPDATE - push edits to DB
router.put('/:id', (req, res) => {
   req.body.announcement.dateUpdated = Date.now();
   Announcement.findByIdAndUpdate(req.params.id, req.body.announcement, (err, updatedAnnouncement) => {
      if (err) {
         req.flash('error', 'Could not find that announcement.');
         res.redirect('back');
      } else {
         req.flash('success', 'Successfully updated your announcement!');
         res.redirect('/admin/announcements');
      }
   });
});

// DESTROY - delete an announcement
router.delete('/:id', (req, res) => {
   Announcement.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
         req.flash('error', 'Something went wrong with the database.');
         res.redirect('/admin');
      } else {
         req.flash('success', 'Successfully deleted your announcement.');
         res.redirect('/admin/announcements');
      }
   });
});

// APPROVE
router.get('/:id/approve', middleware.isEditor, (req, res) => {
   Announcement.findById(req.params.id, (err, announcement) => {
      if (err) {
         req.flash('error', 'Could not find that announcement.');
         res.redirect('back');
      } else {
         announcement.isApproved = true;
         announcement.save();

         req.flash('success', 'That announcement has been approved!');
         res.redirect('back');
      }
   });
});

// UNAPPROVE
router.get('/:id/unapprove', middleware.isEditor, (req, res) => {
   Announcement.findById(req.params.id, (err, announcement) => {
      if (err) {
         req.flash('error', 'Could not find that announcement.');
         res.redirect('back');
      } else {
         announcement.isApproved = false;
         announcement.isPublished = false;
         announcement.save();
   
         req.flash('success', 'That announcement is no longer approved!');
         res.redirect('back');
      }
   });
});

// PUBLISH
router.get('/:id/publish', middleware.isEditor, (req, res) => {
   Announcement.findById(req.params.id, (err, announcement) => {
      if (err) {
         req.flash('error', 'Could not find that announcement.');
         res.redirect('back');
      } else {
         if (announcement.isApproved) {
            announcement.isPublished = true;
            announcement.save();

            req.flash('success', 'That announcement has been published!');
            res.redirect('back');
         } else {
            req.flash('error', 'That announcement must be approved first.');
            res.redirect('back');
         }
      }
   });
});

// UNPUBLISH
router.get('/:id/unpublish', middleware.isEditor, (req, res) => {
   Announcement.findById(req.params.id, (err, announcement) => {
      if (err) {
         req.flash('error', 'Could not find that announcement.');
         res.redirect('back');
      } else {
         announcement.isPublished = false;
         announcement.save();

         req.flash('success', 'That announcement is no longer published!');
         res.redirect('back');
      }
   });
});

module.exports = router;