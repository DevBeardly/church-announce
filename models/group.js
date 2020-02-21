var mongoose = require('mongoose');

var groupSchema = new mongoose.Schema({
  name: String,
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

module.exports = mongoose.model('Group', groupSchema);