const path = require('path');
const fs = require('fs');
// const multer = require('multer');
const uuid = require('uuid/v1');

const Attachments = require('../models/attachments');

function slugify(text) {

  if (!text)
    return null;

  return text.toLowerCase()
          .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
          .replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
          .replace(/^-+|-+$/g, ''); // remove leading, trailing -

}

// Display list of all attachments.
exports.attachment_list = function(req, res) {

  if (req.path.indexOf('/modal/') !== -1) {
    res.render('../views/attachments/modals/list', {
      attachments: Attachments.findByDocumentId(req.params.document_id),
      actions: {
        add_file: '/documents/' + req.params.document_id + '/attachments/modal/create?type=file',
        add_external: '/documents/' + req.params.document_id + '/attachments/modal/create?type=external'
      }
    });
  } else {
    res.render('../views/attachments/list', {
      attachments: Attachments.findByDocumentId(req.params.document_id),
      actions: {
        back: '/documents/' + req.params.document_id,
        add_file: '/documents/' + req.params.document_id + '/attachments/create?type=file',
        add_external: '/documents/' + req.params.document_id + '/attachments/create?type=external',
        reorder: '/documents/' + req.params.document_id + '/attachments/reorder'
      }
    });
  }

};

// Display detail page for a specific book.
exports.attachment_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Attachment detail');
  // res.render('../views/attachments/show', {
  //   attachment: Attachments.findById(req.params.document_id, req.params.attachment_id),
  //   actions: {
  //     back: '/documents/' + req.params.document_id + '/attachments',
  //     edit: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id,
  //     delete: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/delete'
  //   }
  // });
};

// Display attachment create form on GET.
exports.attachment_create_get = function(req, res) {
  const types = ['html','file','external'];

  if (types.indexOf(req.query.type) === -1) {

    if (req.path.indexOf('/modal/') !== -1) {
      res.redirect('/documents/' + req.params.document_id + '/attachments/modal/');
    } else {
      res.redirect('/documents/' + req.params.document_id + '/attachments');
    }


  } else {

    if (req.path.indexOf('/modal/') !== -1) {
      res.render('../views/attachments/modals/create', {
        actions: {
          back: '/documents/' + req.params.document_id + '/attachments/modal/',
          save: '/documents/' + req.params.document_id + '/attachments/modal/create'
        }
      });
    } else {
      res.render('../views/attachments/create', {
        actions: {
          back: '/documents/' + req.params.document_id + '/attachments',
          save: '/documents/' + req.params.document_id + '/attachments/create'
        }
      });
    }

  }

};

// Handle attachment create on POST.
exports.attachment_create_post = function(req, res) {
  // res.send('NOT IMPLEMENTED: attachment create POST');

  // attachment uploads directory path
  const directoryPath = path.join(__dirname, '../data/attachments/', req.params.document_id);

  // check if document directory exists in attachment uploads directory
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  // create a unique file name
  const content_id = uuid();
  const fileName = content_id + '.json';

  const filePath = directoryPath + '/' + fileName;

  // attachment data
  let attachmentData = req.session.data.document.attachment;
  attachmentData.content_id = content_id;
  attachmentData.document_id = req.params.document_id;
  attachmentData.created_at = new Date();
  attachmentData.created_by = req.session.data.user.display_name;

  if (req.session.data.document.attachment.type === 'file') {
    attachmentData.file = slugify(attachmentData.title);
  }

  // create a JSON sting for the submitted data
  const fileData = JSON.stringify(attachmentData);

  // write the JSON data
  fs.writeFileSync(filePath, fileData);

  // redirect the user back to the attachments page
  // TODO: show flash message (success/failure)
  if (req.session.data.document.attachment.type === 'external') {
    // delete the attachment data we no longer need
    delete req.session.data.document.attachment;

    if (req.path.indexOf('/modal/') !== -1) {
      res.redirect('/documents/' + req.params.document_id + '/attachments/modal/');
    } else {
      res.redirect('/documents/' + req.params.document_id + '/attachments');
    }

  } else {

    if (req.path.indexOf('/modal/') !== -1) {
      res.redirect('/documents/' + req.params.document_id + '/attachments/' + attachmentData.content_id + '/modal/metadata');
    } else {
      res.redirect('/documents/' + req.params.document_id + '/attachments/' + attachmentData.content_id + '/metadata');
    }

  }

};

// Display attachment delete form on GET.
exports.attachment_delete_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: attachment delete GET');
  // Show deletion secondary confirmation page

  if (req.path.indexOf('/modal/') !== -1) {
    res.render('../views/attachments/modals/delete', {
      id: req.params.attachment_id,
      attachment: Attachments.findById(req.params.document_id, req.params.attachment_id),
      actions: {
        back: '/documents/' + req.params.document_id + '/attachments/modal/',
        delete: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/modal/delete'
      }
    });
  } else {
    res.render('../views/attachments/delete', {
      id: req.params.attachment_id,
      attachment: Attachments.findById(req.params.document_id, req.params.attachment_id),
      actions: {
        back: '/documents/' + req.params.document_id + '/attachments',
        delete: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/delete'
      }
    });
  }

};

// Handle attachment delete on POST.
exports.attachment_delete_post = function(req, res) {
  // res.send('NOT IMPLEMENTED: attachment delete POST');

  // attachment uploads directory path
  const directoryPath = path.join(__dirname, '../data/attachments/', req.params.document_id);

  fs.unlinkSync(directoryPath + '/' + req.params.attachment_id + '.json');

  // redirect the user back to the attachments page
  // TODO: show flash message (success/failure)
  if (req.path.indexOf('/modal/') !== -1) {
    res.redirect('/documents/' + req.params.document_id + '/attachments/modal/');
  } else {
    res.redirect('/documents/' + req.params.document_id + '/attachments');
  }

};

// Display attachment update form on GET.
exports.attachment_update_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: attachment update GET');

  // attachment uploads directory path
  // const directoryPath = path.join(__dirname, '../data/attachments/', req.params.document_id);
  //
  // const filePath = directoryPath + '/' + req.params.attachment_id + '.json';
  //
  // let rawdata = fs.readFileSync(filePath);
  // let attachmentData = JSON.parse(rawdata);

  // HACK this is to mock the details of a file
  let fileMetadata = {
    filename: 'attachment.pdf',
    fileSize: 1234560,
    contentType: 'application/pdf',
    pageCount: 25,
    thumbnail: 'document'
  };

  if (req.path.indexOf('/modal/') !== -1) {
    res.render('../views/attachments/modals/edit', {
      id: req.params.attachment_id,
      attachment: Attachments.findById(req.params.document_id, req.params.attachment_id),
      file: fileMetadata,
      actions: {
        back: '/documents/' + req.params.document_id + '/attachments/modal/',
        save: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/modal/update'
      }
    });
  } else {
    res.render('../views/attachments/edit', {
      id: req.params.attachment_id,
      attachment: Attachments.findById(req.params.document_id, req.params.attachment_id),
      file: fileMetadata,
      actions: {
        back: '/documents/' + req.params.document_id + '/attachments',
        save: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/update'
      }
    });
  }

};

// Handle attachment update on POST.
exports.attachment_update_post = function(req, res) {
  // attachment uploads directory path
  const directoryPath = path.join(__dirname, '../data/attachments/', req.params.document_id);

  const filePath = directoryPath + '/' + req.params.attachment_id + '.json';

  let rawdata = fs.readFileSync(filePath);
  let attachmentData = JSON.parse(rawdata);

  // attachment data
  attachmentData.title = req.session.data.document.attachment.title;

  if (attachmentData.type === 'external') {
    attachmentData.url = req.session.data.document.attachment.url;
  }

  if (attachmentData.type === 'file') {
    attachmentData.file = slugify(attachmentData.title);
    // attachmentData.language = req.session.data.document.attachment.language;
  }

  //
  // if (attachmentData.type === 'file') {
  //   attachmentData.isbn = req.session.data.document.attachment.isbn;
  //   attachmentData.urn = req.session.data.document.attachment.urn;
  //
  //   // TODO: work out the hierarchy of CPN and unnumbered
  //   attachmentData.cpn = req.session.data.document.attachment.cpn;
  //   attachmentData.unnumbered = req.session.data.document.attachment.unnumbered;
  //
  //   // TODO: work out the hierarchy of HCPN and unnumbered act
  //   attachmentData.hcpn = req.session.data.document.attachment.hcpn;
  //   attachmentData.unnumbered_act = req.session.data.document.attachment.unnumbered_act;
  //
  //   attachmentData.parliamentary_session = req.session.data.document.attachment.parliamentary_session;
  // }
  //
  // if (attachmentData.type === 'html') {
  //   attachmentData.body = req.session.data.document.attachment.body;
  // }
  //
  // if (attachmentData.type === 'file' || attachmentData.type == 'html') {
  //   attachmentData.order_url = "https://www.gov.uk/guidance/how-to-buy-printed-copies-of-official-documents";
  // }

  attachmentData.updated_at = new Date();
  attachmentData.updated_by = req.session.data.user.display_name;

  // create a JSON sting for the submitted data
  const fileData = JSON.stringify(attachmentData);

  // write the JSON data
  fs.writeFileSync(filePath, fileData);

  let modalRoute = '';
  if (req.path.indexOf('/modal/') !== -1) {
    modalRoute = '/modal';
  }

  // redirect the user back to the attachments page
  // TODO: show flash message (success/failure)
  if (attachmentData.type === 'external') {

    if (req.path.indexOf('/modal/') !== -1) {
      res.redirect('/documents/' + req.params.document_id + '/attachments/modal/');
    } else {
      res.redirect('/documents/' + req.params.document_id + '/attachments');
    }

  } else {

    if (req.path.indexOf('/modal/') !== -1) {
      res.redirect('/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/modal/metadata');
    } else {
      res.redirect('/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/metadata');
    }

  }

};

// Display attachment metadata form on GET.
exports.attachment_update_metadata_get = function(req, res) {

  // Get attachment data
  let attachmentData = Attachments.findById(req.params.document_id, req.params.attachment_id);

  if (req.path.indexOf('/modal/') !== -1) {
    res.render('../views/attachments/modals/metadata', {
      attachment: attachmentData,
      actions: {
        back: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/modal/update',
        save: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/modal/metadata'
      }
    });
  } else {
    res.render('../views/attachments/metadata', {
      attachment: attachmentData,
      actions: {
        back: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/update',
        save: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/metadata'
      }
    });
  }

};

// Handle attachment metadata update on POST.
exports.attachment_update_metadata_post = function(req, res) {

  // Get attachment data
  let attachmentData = Attachments.findById(req.params.document_id, req.params.attachment_id);

  // console.log('Before', attachmentData);

  if (attachmentData.type === 'file' || attachmentData.type == 'html') {

    attachmentData.official_document = req.session.data.document.attachment.official_document;

    attachmentData.isbn = req.session.data.document.attachment.isbn;
    attachmentData.urn = req.session.data.document.attachment.urn;

    if (attachmentData.official_document === 'yes_command_paper') {

      attachmentData.cpn = req.session.data.document.attachment.cpn;
      attachmentData.unnumbered = req.session.data.document.attachment.unnumbered;

      if (attachmentData.cpn.length || attachmentData.unnumbered === undefined) {
        attachmentData.unnumbered = '';
      }

      // clear the house of commons paper fields
      attachmentData.hcpn = '';
      attachmentData.parliamentary_session = '';
      attachmentData.unnumbered_act = '';

    }

    if (attachmentData.official_document === 'yes_house_of_commons_paper') {

      attachmentData.hcpn = req.session.data.document.attachment.hcpn;
      attachmentData.parliamentary_session = req.session.data.document.attachment.parliamentary_session;
      attachmentData.unnumbered_act = req.session.data.document.attachment.unnumbered_act;

      if (attachmentData.hcpn.length || attachmentData.unnumbered_act === undefined) {
        attachmentData.unnumbered_act = '';
      }

      // clear the command paper fields
      attachmentData.cpn = '';
      attachmentData.unnumbered = '';

    }

    if (attachmentData.official_document === 'yes_command_paper' || attachmentData.official_document === 'yes_house_of_commons_paper') {
      attachmentData.order_url = "https://www.gov.uk/guidance/how-to-buy-printed-copies-of-official-documents";
    }

    if (attachmentData.official_document === 'no') {
      attachmentData.cpn = '';
      attachmentData.unnumbered = '';
      attachmentData.hcpn = '';
      attachmentData.parliamentary_session = '';
      attachmentData.unnumbered_act = '';
      attachmentData.order_url = '';
    }

  }

  if (attachmentData.type === 'html') {
    attachmentData.body = req.session.data.document.attachment.body;
  }

  // if (attachmentData.type === 'file' || attachmentData.type == 'html') {
  //   attachmentData.order_url = "https://www.gov.uk/guidance/how-to-buy-printed-copies-of-official-documents";
  // }

  attachmentData.updated_at = new Date();
  attachmentData.updated_by = req.session.data.user.display_name;

  // console.log('After', attachmentData);

  // attachment uploads directory path
  const directoryPath = path.join(__dirname, '../data/attachments/', req.params.document_id);

  const filePath = directoryPath + '/' + req.params.attachment_id + '.json';
  // create a JSON sting for the submitted data
  const fileData = JSON.stringify(attachmentData);

  // write the JSON data
  fs.writeFileSync(filePath, fileData);

  // delete the attachment data we no longer need
  delete req.session.data.document.attachment;

  // redirect the user back to the attachments page
  // TODO: show flash message (success/failure)
  if (req.path.indexOf('/modal/') !== -1) {
    res.redirect('/documents/' + req.params.document_id + '/attachments/modal/');
  } else {
    res.redirect('/documents/' + req.params.document_id + '/attachments');
  }

};

// Preview attachment on GET.
exports.attachment_preview = function(req, res) {

  let attachmentData = Attachments.findById(req.params.document_id, req.params.attachment_id);

  if (attachmentData.type === 'file') {
    res.sendFile(path.join(__dirname, '../data/attachments/attachment.pdf'));
  } else {
    res.send('NOT IMPLEMENTED: attachment preview');
  }

};

// Download attachment on GET.
exports.attachment_download = function(req, res) {
  // res.send('NOT IMPLEMENTED: attachment download');
  res.download(path.join(__dirname, '../data/attachments/attachment.pdf'));
};

// Reorder attachments list on GET.
exports.attachment_list_reorder_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: attachment reorder GET');
  res.render('../views/attachments/reorder', {
    attachments: Attachments.findByDocumentId(req.params.document_id),
    actions: {
      back: '/documents/' + req.params.document_id + '/attachments',
      save: '/documents/' + req.params.document_id + '/attachments/reorder'
    }
  });
};

// Reorder attachments list on POST.
exports.attachment_list_reorder_post = function(req, res) {
  res.send('NOT IMPLEMENTED: attachment reorder POST');
};
