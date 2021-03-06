'use strict';

var _ = require('lodash');
var Idea = require('./idea.model');
var helpers = require('../../helpers');

// Get list of ideas
exports.index = function(req, res) {

  var newGetter = function() {
    Idea
      .find()
      .sort("_id")
      .limit(10)
      .exec(helpers.sendResults(res, {category: "new"}));
  }

  var opinionGetter = function(showLiked) {
    Idea
      .find()
      .sort("_id")
      .limit(10)
      .exec(helpers.sendResults(res, {category: showLiked ? "liked" : "disliked"}));
  }

  var hotGetter = function() {
    Idea
      .find()
      .sort("_id")
      .limit(10)
      .exec(helpers.sendResults(res, {category: "hot"}));
  }

  var categoriesGetter = {
    'new': newGetter,
    'liked': opinionGetter.bind(this, true),
    'disliked': opinionGetter.bind(this, false),
    'hot': hotGetter
  };

  (categoriesGetter[req.param('category')] || categoriesGetter['new'])()
};

// Get a single idea
exports.show = function(req, res) {
  if (!helpers.isObjectId(req.params.id))
    return helpers.handleNotFound(res);
  Idea
    .findById(req.params.id)
    .exec(helpers.sendResults(res));
};

// Creates a new idea in the DB.
exports.create = function(req, res) {
  Idea.create(req.body, function(err, idea) {
    if(err) { return handleError(res, err); }
    return res.json(201, idea);
  });
};

// Updates an existing idea in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Idea.findById(req.params.id, function (err, idea) {
    if (err) { return handleError(res, err); }
    if(!idea) { return res.send(404); }
    var updated = _.merge(idea, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, idea);
    });
  });
};

// Deletes a idea from the DB.
exports.destroy = function(req, res) {
  Idea.findById(req.params.id, function (err, idea) {
    if(err) { return handleError(res, err); }
    if(!idea) { return res.send(404); }
    idea.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};
