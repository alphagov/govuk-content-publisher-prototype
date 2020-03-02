const path = require('path');
const fs = require('fs');

const users = require('../data/users.json');

// https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/

exports.save = function() {

};

exports.find = function() {

};

exports.findById = function(user_id) {
  if (!user_id) return null
  let result = {};
  result = users.filter(user => user.id === user_id);
  return result;
};

exports.findByOrganisationId = function(organisation_id) {
  if (!organisation_id) return null
  let result = {};
  result = users.filter(user => user.organisation === organisation_id);
  return result;
};

exports.findByIdAndUpdate = function() {

};

exports.findByIdAndDelete = function() {

};
