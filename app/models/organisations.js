const organisations = require('../data/organisations.json');

exports.save = function() {

};

exports.find = function() {

};

exports.findById = function(organisation_id) {
  if (!organisation_id) return null
  let result = {};
  result = organisations.find( ({ key }) => key === organisation_id );
  return result;
};

exports.findByIdAndUpdate = function() {

};

exports.findByIdAndDelete = function() {

};

exports.isPolitical = function(organisation_id) {
  if (!organisation_id) return null
  let org = organisations.find( ({ key }) => key === organisation_id );
  return org.political;
}
