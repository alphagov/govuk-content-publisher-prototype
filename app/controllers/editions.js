var Edition = require('../models/editions');

exports.index = function(req, res) {
  // res.send('NOT IMPLEMENTED: Site Home Page');
  res.render('../views/index');
};

// Display list of all publications.
exports.edition_list = function(req, res) {
  // res.send('NOT IMPLEMENTED: Document edition list');
  res.render('../views/editions/list');
};

// Display detail page for a specific book.
exports.edition_detail = function(req, res) {
  // res.send('NOT IMPLEMENTED: Document edition detail: ' + req.params.id);
  res.render('../views/editions/show', { id: req.params.id });
};

// Display document edition create form on GET.
exports.edition_create_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: Document edition create GET');
  res.render('../views/editions/create');
};

// Handle document edition create on POST.
exports.edition_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Document edition create POST');
};

// Display document edition delete form on GET.
exports.edition_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Document edition delete GET');
};

// Handle document edition delete on POST.
exports.edition_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Document edition delete POST');
};

// Display document edition update form on GET.
exports.edition_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Document edition update GET');
};

// Handle document edition update on POST.
exports.edition_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Document edition update POST');
};
