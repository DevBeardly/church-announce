const express          = require('express'),
      expressSanitizer = require('express-sanitizer'),
      router           = express.Router(),
      passport         = require('passport'),
      User             = require('../models/user'),
      Group            = require('../models/group'),
      middleware       = require('../middleware');

// NEW - display form to create new group
router.get('/new', middleware.isLoggedIn, (req, res) => {
   res.render('groups/new');
});

// CREATE - add new group to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
   req.body.group.description = req.sanitize(req.body.group.description);
   Group.create(req.body.group, (err, group) => {
      if (err) {
         req.flash('error', 'Your group could not be saved. Please try again.');
         res.redirect('back');
      } else {
         group.author.id = req.user._id;
         group.author.fullname = req.user.fullname;

         group.save();

         req.flash('success', 'Your group was successfully created!');
         res.redirect('/admin');
      }
   });
});

// EDIT - display form to update a group
router.get('/:id/edit', (req, res) => {
   Group.findById(req.params.id, (err, foundGroup) => {
      if (err) {
         req.flash('error', 'Could not find that group.');
         res.redirect('back');
      } else {
         res.render('groups/edit', { group: foundGroup });
      }
   });
});

// UPDATE - push edits to DB
router.put('/:id', (req, res) => {
   req.body.group.dateUpdated = Date.now();
   Group.findByIdAndUpdate(req.params.id, req.body.group, (err, updatedGroup) => {
      if (err) {
         req.flash('error', 'Could not find that group.');
         res.redirect('back');
      } else {
         req.flash('success', 'Successfully updated your group!');
         res.redirect('/admin/groups');
      }
   });
});

// DESTROY - delete a group
router.delete('/:id', (req, res) => {
   Group.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
         req.flash('error', 'Something went wrong with the database.');
         res.redirect('/admin');
      } else {
         req.flash('success', 'Successfully deleted your group.');
         res.redirect('/admin/groups');
      }
   });
});

// APPROVE
router.get('/:id/approve', middleware.isEditor, (req, res) => {
   Group.findById(req.params.id, (err, group) => {
      if (err) {
         req.flash('error', 'Could not find that group.');
         res.redirect('back');
      } else {
         group.isApproved = true;
         group.save();

         req.flash('success', 'That group has been approved!');
         res.redirect('back');
      }
   });
});

// UNAPPROVE
router.get('/:id/unapprove', middleware.isEditor, (req, res) => {
   Group.findById(req.params.id, (err, group) => {
      if (err) {
         req.flash('error', 'Could not find that group.');
         res.redirect('back');
      } else {
         group.isApproved = false;
         group.isPublished = false;
         group.save();
   
         req.flash('success', 'That group is no longer approved!');
         res.redirect('back');
      }
   });
});

// PUBLISH
router.get('/:id/publish', middleware.isEditor, (req, res) => {
   Group.findById(req.params.id, (err, group) => {
      if (err) {
         req.flash('error', 'Could not find that group.');
         res.redirect('back');
      } else {
         if (group.isApproved) {
            group.isPublished = true;
            group.save();

            req.flash('success', 'That group has been published!');
            res.redirect('back');
         } else {
            req.flash('error', 'That group must be approved first.');
            res.redirect('back');
         }
      }
   });
});

// UNPUBLISH
router.get('/:id/unpublish', middleware.isEditor, (req, res) => {
   Group.findById(req.params.id, (err, group) => {
      if (err) {
         req.flash('error', 'Could not find that group.');
         res.redirect('back');
      } else {
         group.isPublished = false;
         group.save();

         req.flash('success', 'That group is no longer published!');
         res.redirect('back');
      }
   });
});

module.exports = router;