var mongoose = require('mongoose');

var announcementSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    fullname: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateUpdated: {
    type: Date,
    default: Date.now,
  },
  isApproved: Boolean,
  isPublished: Boolean,
  needsReview: Boolean,
  needsReviewComment: String,
});

module.exports = mongoose.model('Announcement', announcementSchema);