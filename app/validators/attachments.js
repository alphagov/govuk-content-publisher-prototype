const Helpers = require('../helpers/validators');

exports.checkAttachment = function(data) {

  let errors = [];

  if (!data.title.length) {
    errors.push('title');
  }

  if (data.type == 'external') {
    if (!(data.url.length && Helpers.isValidURL(data.url))) {
      errors.push('url');
    }
  }

  // if (data.type == 'file') {
  //   if (!data.file.length) {
  //     errors.push('file');
  //   }
  // }

  if (data.type == 'html') {
    if (!data.body.length) {
      errors.push('body');
    }
  }

  return errors;

}

exports.checkAttachmentMetadata = function(data) {

  let errors = [];

  if (data.official_document === undefined) {
    errors.push('official_document');
  } else {
    if (data.official_document == 'yes_command_paper') {
      if (!data.cpn.length) {
        errors.push('cpn');
      }
    }

    if (data.official_document == 'yes_house_of_commons_paper') {
      if (!data.hcpn.length) {
        errors.push('hcpn');
      }
      if (!data.parliamentary_session.length) {
        errors.push('parliamentary_session');
      }
    }
  }

  if (data.isbn !== undefined && data.isbn.length) {
    if (!Helpers.isValidISBN(data.isbn)) {
      errors.push('isbn');
    }
  }

  return errors;

}
