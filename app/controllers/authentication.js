const flash = require('connect-flash');

var Authentication = require('../models/authentication');

exports.sign_in_get = function(req, res) {
  if (req.session.passport || req.session.data.user) {
    res.redirect('/');
  } else {
    let errorMessage = req.flash();
    res.render('../views/auth/sign-in', errorMessage);
  }
};

exports.sign_out_get = function(req, res) {
  delete req.session.data;
  delete req.session.passport;
  res.redirect('/sign-in');
};
