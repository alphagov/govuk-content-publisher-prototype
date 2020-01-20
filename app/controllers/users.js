var User = require('../models/users');

exports.index = function(req, res) {
  // res.send('NOT IMPLEMENTED: Site Home Page');
  res.render('../views/index');
};

// Display list of all publications.
exports.user_list = function(req, res) {
  // res.send('NOT IMPLEMENTED: User list');
  res.render('../views/user/list');
};

// Display detail page for a specific book.
exports.user_detail = function(req, res) {
  // res.send('NOT IMPLEMENTED: User detail: ' + req.params.id);
  res.render('../views/user/show', { id: req.params.id });
};

// Display user create form on GET.
exports.user_create_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: User create GET');
  res.render('../views/user/create');
};

// Handle user create on POST.
exports.user_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: User create POST');
};

// Display user delete form on GET.
exports.user_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: User delete GET');
};

// Handle user delete on POST.
exports.user_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: User delete POST');
};

// Display user update form on GET.
exports.user_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: User update GET');
};

// Handle user update on POST.
exports.user_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: User update POST');
};
