const path = require('path');
const fs = require('fs');
// const multer = require('multer');
const flash = require('connect-flash');

const Documents = require('../models/documents');
const Attachments = require('../models/attachments');
const Validators = require('../validators/attachments');

// Display list of all attachments.
exports.attachment_list = function(req, res) {

  const documentData = Documents.findById(req.params.document_id);
  const attachmentListData = Attachments.findByDocumentId(req.params.document_id);

  let flashMessage = req.flash();

  if (req.path.includes('/modal/')) {

    if (req.params.attachment_id !== undefined) {

      const attachmentData = Attachments.findById(req.params.document_id, req.params.attachment_id);

      res.render('../views/attachments/modals/list', {
        document: documentData,
        attachment: attachmentData,
        attachments: attachmentListData,
        message: flashMessage,
        actions: {
          add_file: '/documents/' + req.params.document_id + '/attachments/modal/create?type=file'
        }
      });

    } else {

      if (documentData.document_schema == 'publication' || attachmentListData.length) {

        res.render('../views/attachments/modals/list', {
          document: documentData,
          attachments: attachmentListData,
          message: flashMessage,
          actions: {
            add_file: '/documents/' + req.params.document_id + '/attachments/modal/create?type=file'
          }
        });

      } else {

        res.render('../views/attachments/modals/create', {
          document: documentData,
          message: flashMessage,
          actions: {
            save: '/documents/' + req.params.document_id + '/attachments/modal/create'
          }
        });

      }

    }

  } else {

    res.render('../views/attachments/list', {
      document: documentData,
      attachments: attachmentListData,
      message: flashMessage,
      actions: {
        back: '/documents/' + req.params.document_id,
        add_file: '/documents/' + req.params.document_id + '/attachments/create?type=file',
        add_external: '/documents/' + req.params.document_id + '/attachments/create?type=external',
        add_html: '/documents/' + req.params.document_id + '/attachments/create?type=html',
        reorder: '/documents/' + req.params.document_id + '/attachments/reorder'
      }
    });

  }

};

// Display detail page for a specific book.
exports.attachment_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Attachment detail');
};

// Display attachment create form on GET.
exports.attachment_create_get = function(req, res) {

  const types = ['html','file','external'];

  if (types.indexOf(req.query.type) === -1) {

    if (req.path.includes('/modal/')) {
      res.redirect('/documents/' + req.params.document_id + '/attachments/modal/');
    } else {
      res.redirect('/documents/' + req.params.document_id + '/attachments');
    }

  } else {

    const documentData = Documents.findById(req.params.document_id);

    if (req.path.includes('/modal/')) {

      res.render('../views/attachments/modals/create', {
        document: documentData,
        actions: {
          back: '/documents/' + req.params.document_id + '/attachments/modal/',
          save: '/documents/' + req.params.document_id + '/attachments/modal/create'
        }
      });

    } else {

      res.render('../views/attachments/create', {
        document: documentData,
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

  const errors = Validators.checkAttachment(req.session.data.document.attachment);

  if (errors.length) {

    const documentData = Documents.findById(req.params.document_id);

    if (req.path.includes('/modal/')) {

      res.render('../views/attachments/modals/create', {
        document: documentData,
        attachment: req.session.data.document.attachment,
        errors: errors,
        actions: {
          back: '/documents/' + req.params.document_id + '/attachments/modal/',
          save: '/documents/' + req.params.document_id + '/attachments/modal/create'
        }
      });

    } else {

      res.render('../views/attachments/create', {
        document: documentData,
        attachment: req.session.data.document.attachment,
        errors: errors,
        actions: {
          back: '/documents/' + req.params.document_id + '/attachments',
          save: '/documents/' + req.params.document_id + '/attachments/create'
        }
      });

    }

  } else {

    const attachmentData = Attachments.save(req.params.document_id, req.session.data);

    if (req.path.includes('/modal/')) {
      // set flash message (success/failure)
      req.flash('success', 'Attachment created');
      // redirect the user back to the attachments page
      res.redirect('/documents/' + req.params.document_id + '/attachments/modal/');
    } else {
      // redirect the user back to the attachments page
      res.redirect('/documents/' + req.params.document_id + '/attachments/' + attachmentData.content_id + '/add-details');
    }

  }

};

// Display attachment update form on GET.
exports.attachment_update_get = function(req, res) {

  const documentData = Documents.findById(req.params.document_id);
  const attachmentData = Attachments.findById(req.params.document_id, req.params.attachment_id);

  if (req.path.includes('/modal/')) {

    res.render('../views/attachments/modals/edit', {
      document: documentData,
      attachment: attachmentData,
      actions: {
        back: '/documents/' + req.params.document_id + '/attachments/modal/',
        save: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/modal/update'
      }
    });

  } else {

    res.render('../views/attachments/edit', {
      document: documentData,
      attachment: attachmentData,
      actions: {
        back: '/documents/' + req.params.document_id + '/attachments',
        save: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/update'
      }
    });

  }

};

// Handle attachment update on POST.
exports.attachment_update_post = function(req, res) {

  const errors = Validators.checkAttachment(req.session.data.document.attachment);

  if (errors.length) {

    const documentData = Documents.findById(req.params.document_id);

    if (req.path.includes('/modal/')) {

      res.render('../views/attachments/modals/edit', {
        document: documentData,
        attachment: req.session.data.document.attachment,
        actions: {
          back: '/documents/' + req.params.document_id + '/attachments/modal/',
          save: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/modal/update'
        }
      });

    } else {

      res.render('../views/attachments/edit', {
        document: documentData,
        attachment: req.session.data.document.attachment,
        actions: {
          back: '/documents/' + req.params.document_id + '/attachments',
          save: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/update'
        }
      });

    }


  } else {

    Attachments.findByIdAndUpdate(req.params.document_id, req.params.attachment_id, req.session.data);

    // set flash message (success/failure)
    req.flash('success', 'Attachment updated');

    if (req.path.includes('/modal/')) {
      // redirect the user back to the attachments page
      res.redirect('/documents/' + req.params.document_id + '/attachments/modal/');
    } else {
      // redirect the user back to the attachments page
      res.redirect('/documents/' + req.params.document_id + '/attachments');
    }

  }

};

// Display attachment metadata form on GET.
exports.attachment_create_metadata_get = function(req, res) {

  // Get attachment data
  const attachmentData = Attachments.findById(req.params.document_id, req.params.attachment_id);

  res.render('../views/attachments/create-details', {
    attachment: attachmentData,
    actions: {
      back: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/update',
      save: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/add-details'
    }
  });

};

// Display attachment metadata form on GET.
exports.attachment_create_metadata_post = function(req, res) {

  const errors = Validators.checkAttachmentMetadata(req.session.data.document.attachment);

  if (errors.length) {

    // Get attachment data
    const attachmentData = Attachments.findById(req.params.document_id, req.params.attachment_id);

    // overwrite the original data with the submitted form data
    for (let [key, value] of Object.entries(req.session.data.document.attachment)) {
      attachmentData[key] = value;
      // console.log(`${key}: ${value}`);
    }

    // delete the attachment data we no longer need
    delete req.session.data.document.attachment;

    res.render('../views/attachments/create-details', {
      attachment: attachmentData,
      errors: errors,
      actions: {
        back: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/update',
        save: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/add-details'
      }
    });

  } else {

    Attachments.findByIdAndUpdateDetails(req.params.document_id, req.params.attachment_id, req.session.data);

    // delete the attachment data we no longer need
    delete req.session.data.document.attachment;

    // set flash message (success/failure)
    req.flash('success', 'Attachment added');

    // redirect the user back to the attachments page
    res.redirect('/documents/' + req.params.document_id + '/attachments');

  }

};

// Display attachment metadata form on GET.
exports.attachment_update_metadata_get = function(req, res) {

  // Get attachment data
  const attachmentData = Attachments.findById(req.params.document_id, req.params.attachment_id);

  const errors = Validators.checkAttachmentMetadata(attachmentData);

  res.render('../views/attachments/update-details', {
    attachment: attachmentData,
    errors: errors,
    actions: {
      back: '/documents/' + req.params.document_id + '/attachments',
      save: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/update-details'
    }
  });

};

// Handle attachment metadata update on POST.
exports.attachment_update_metadata_post = function(req, res) {

  const errors = Validators.checkAttachmentMetadata(req.session.data.document.attachment);

  if (errors.length) {

    // Get attachment data
    let attachmentData = Attachments.findById(req.params.document_id, req.params.attachment_id);

    // overwrite the original data with the submitted form data
    for (let [key, value] of Object.entries(req.session.data.document.attachment)) {
      attachmentData[key] = value;
      // console.log(`${key}: ${value}`);
    }

    // delete the attachment data we no longer need
    delete req.session.data.document.attachment;

    res.render('../views/attachments/update-details', {
      attachment: attachmentData,
      errors: errors,
      actions: {
        back: '/documents/' + req.params.document_id + '/attachments',
        save: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/update-details'
      }
    });

  } else {

    Attachments.findByIdAndUpdateDetails(req.params.document_id, req.params.attachment_id, req.session.data);

    // delete the attachment data we no longer need
    delete req.session.data.document.attachment;

    // set flash message (success/failure)
    req.flash('success', 'Attachment details updated');

    // redirect the user back to the attachments page
    res.redirect('/documents/' + req.params.document_id + '/attachments');

  }

};

// Display attachment delete form on GET.
exports.attachment_delete_get = function(req, res) {

  const attachmentData = Attachments.findById(req.params.document_id, req.params.attachment_id);

  if (req.path.includes('/modal/')) {

    res.render('../views/attachments/modals/delete', {
      attachment: attachmentData,
      actions: {
        back: '/documents/' + req.params.document_id + '/attachments/modal/',
        delete: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/modal/delete'
      }
    });

  } else {

    res.render('../views/attachments/delete', {
      attachment: attachmentData,
      actions: {
        back: '/documents/' + req.params.document_id + '/attachments',
        delete: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/delete'
      }
    });

  }

};

// Handle attachment delete on POST.
exports.attachment_delete_post = function(req, res) {

  Attachments.findByIdAndDelete(req.params.document_id, req.params.attachment_id);

  // set flash message (success/failure)
  req.flash('success', 'Attachment deleted');

  if (req.path.includes('/modal/')) {
    // redirect the user back to the attachments page
    res.redirect('/documents/' + req.params.document_id + '/attachments/modal/');
  } else {
    // redirect the user back to the attachments page
    res.redirect('/documents/' + req.params.document_id + '/attachments');
  }

};

// Preview attachment on GET.
exports.attachment_preview = function(req, res) {

  const attachmentData = Attachments.findById(req.params.document_id, req.params.attachment_id);

  if (attachmentData.type === 'file') {
    res.sendFile(path.join(__dirname, '../data/attachments/attachment.pdf'));
  } else {
    res.send('NOT IMPLEMENTED: attachment preview');
  }

};

// Download attachment on GET.
exports.attachment_download = function(req, res) {
  res.download(path.join(__dirname, '../data/attachments/attachment.pdf'));
};

// Reorder attachments list on GET.
exports.attachment_list_reorder_get = function(req, res) {

  const documentData = Documents.findById(req.params.document_id);
  const attachmentData = Attachments.findByDocumentId(req.params.document_id);

  let backLink = '/documents/' + req.params.document_id + '/attachments';
  if (!req.headers.referer.includes(backLink)) {
    backLink = '/documents/' + req.params.document_id;
  }

  res.render('../views/attachments/reorder', {
    document: documentData,
    attachments: attachmentData,
    actions: {
      back: backLink,
      save: '/documents/' + req.params.document_id + '/attachments/reorder'
    }
  });
};

// Reorder attachments list on POST.
exports.attachment_list_reorder_post = function(req, res) {
  const attachmentsOrder = req.session.data.attachments_order

  const directoryPath = path.join(__dirname, '../data/attachments/', req.params.document_id);

  const filePath = directoryPath + '/index.json';
  // create a JSON sting for the submitted data
  const fileData = JSON.stringify(attachmentsOrder);

  // write the JSON data
  fs.writeFileSync(filePath, fileData);

  // set flash message (success/failure)
  req.flash('success', 'Attachments reordered');

  // redirect the user back to the document page
  res.redirect('/documents/' + req.params.document_id + '/attachments');
};
