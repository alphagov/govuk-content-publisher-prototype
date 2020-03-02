const Dates = require('../helpers/dates');

const governments = require('../data/governments.json');

exports.findGovernmentByDate = function(date) {
  let gov = {};
  gov = governments.filter( government => Dates.dateBetween(government.start_date, government.end_date, date) );
  return gov[0];
};
