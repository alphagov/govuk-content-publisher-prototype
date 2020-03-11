const Helpers = require('../helpers/validators');

exports.checkAttachment = function(data) {

  let errors = [];

  if (!data.title.length) {
    let error = {};
    error.fieldName = 'title';
    error.href = '#attachment-title';
    error.text = 'Enter a title';
    errors.push(error);
  }

  if (data.type == 'external') {
    if (!(data.url.length && Helpers.isValidURL(data.url))) {
      let error = {};
      error.fieldName = 'url';
      error.href = '#attachment-url';
      error.text = 'Enter a valid URL';
      errors.push(error);
    }
  }

  // if (data.type == 'file') {
  //   if (!data.file.length) {
  //     let error = {};
  //     error.fieldName = 'file';
  //     error.href = '#attachment-file';
  //     error.text = 'Upload a file';
  //     errors.push(error);
  //   }
  // }

  if (data.type == 'html') {
    if (!data.body.length) {
      let error = {};
      error.fieldName = 'body';
      error.href = '#attachment-body';
      error.text = 'Enter a body';
      errors.push(error);
    }
  }

  return errors;

}

exports.checkAttachmentMetadata = function(data) {

  let errors = [];

  if (data.official_document === undefined) {
    let error = {};
    error.fieldName = 'official_document';
    error.href = '#attachment-official-document';
    error.text = 'Choose if this is an official document';
    errors.push(error);
  } else {

    if (data.official_document == 'yes_command_paper') {
      if (!data.cpn.length) {
        let error = {};
        error.fieldName = 'cpn';
        error.href = '#attachment-cpn';
        error.text = 'Enter a command paper number';
        errors.push(error);
      }
    }

    if (data.official_document == 'yes_house_of_commons_paper') {

      if (!data.hcpn.length) {
        let error = {};
        error.fieldName = 'hcpn';
        error.href = '#attachment-hcpn';
        error.text = 'Enter a House of Commons paper number';
        errors.push(error);
      }

      if (!data.parliamentary_session.length) {
        let error = {};
        error.fieldName = 'parliamentary_session';
        error.href = '#attachment-parliamentary-session';
        error.text = 'Enter a command paper number';

        errors.push(error);
      }

    }

  }

  if (data.isbn !== undefined && data.isbn.length) {
    if (!Helpers.isValidISBN(data.isbn)) {
      let error = {};
      error.fieldName = 'isbn';
      error.href = '#attachment-isbn';
      error.text = 'Enter a valid ISBN';
      errors.push(error);
    }
  }

  return errors;

}
