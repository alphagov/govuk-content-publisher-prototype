const Helpers = require('../helpers/validators');

exports.checkLink = function(data) {

  let errors = [];

  if (!data.title.length) {
    let error = {};
    error.fieldName = 'title';
    error.href = '#link-title';
    error.text = 'Enter a title';
    errors.push(error);
  }

  if (!(data.url.length && Helpers.isValidURL(data.url))) {
    let error = {};
    error.fieldName = 'url';
    error.href = '#link-url';
    error.text = 'Enter a valid URL';
    errors.push(error);
  }

  return errors;

}
