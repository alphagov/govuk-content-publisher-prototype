const path = require('path');
const fs = require('fs');
// const multer = require('multer');
const flash = require('connect-flash');

const Attachments = require('../models/attachments');

// Display list of all attachments.
exports.attachment_list = function(req, res) {

  // console.log(req.headers.referer);

  let flash = req.flash();

  // console.log(flash);

  if (req.path.indexOf('/modal/') !== -1) {
    res.render('../views/attachments/modals/list', {
      attachments: Attachments.findByDocumentId(req.params.document_id),
      message: flash,
      actions: {
        add_file: '/documents/' + req.params.document_id + '/attachments/modal/create?type=file',
        add_external: '/documents/' + req.params.document_id + '/attachments/modal/create?type=external'
      }
    });
  } else {
    res.render('../views/attachments/list', {
      attachments: Attachments.findByDocumentId(req.params.document_id),
      message: flash,
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

    res.redirect('/documents/' + req.params.document_id + '/attachments');

  } else {

    res.render('../views/attachments/create', {
      actions: {
        back: '/documents/' + req.params.document_id + '/attachments',
        save: '/documents/' + req.params.document_id + '/attachments/create'
      }
    });

  }

};

// Handle attachment create on POST.
exports.attachment_create_post = function(req, res) {

  const attachmentData = Attachments.save(req.params.document_id, req.session.data);

  // show flash message (success/failure)
  // req.flash('success', 'Attachment created');

  // redirect the user back to the attachments page
  res.redirect('/documents/' + req.params.document_id + '/attachments/' + attachmentData.content_id + '/add-details');

};

// Display attachment update form on GET.
exports.attachment_update_get = function(req, res) {

  res.render('../views/attachments/edit', {
    attachment: Attachments.findById(req.params.document_id, req.params.attachment_id),
    actions: {
      back: '/documents/' + req.params.document_id + '/attachments',
      save: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/update'
    }
  });

};

// Handle attachment update on POST.
exports.attachment_update_post = function(req, res) {

  Attachments.findByIdAndUpdate(req.params.document_id, req.params.attachment_id, req.session.data);

  // show flash message (success/failure)
  req.flash('success', 'Attachment updated');

  // redirect the user back to the attachments page
  res.redirect('/documents/' + req.params.document_id + '/attachments');

};

// Display attachment metadata form on GET.
exports.attachment_create_metadata_get = function(req, res) {

  // Get attachment data
  let attachmentData = Attachments.findById(req.params.document_id, req.params.attachment_id);

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

  Attachments.findByIdAndUpdateDetails(req.params.document_id, req.params.attachment_id, req.session.data);

  // delete the attachment data we no longer need
  delete req.session.data.document.attachment;

  // show flash message (success/failure)
  req.flash('success', 'Attachment added');

  // redirect the user back to the attachments page
  res.redirect('/documents/' + req.params.document_id + '/attachments');

};

// Display attachment metadata form on GET.
exports.attachment_update_metadata_get = function(req, res) {

  // Get attachment data
  let attachmentData = Attachments.findById(req.params.document_id, req.params.attachment_id);

  res.render('../views/attachments/update-details', {
    attachment: attachmentData,
    actions: {
      back: '/documents/' + req.params.document_id + '/attachments',
      save: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/update-details'
    }
  });

};

// Handle attachment metadata update on POST.
exports.attachment_update_metadata_post = function(req, res) {

  Attachments.findByIdAndUpdateDetails(req.params.document_id, req.params.attachment_id, req.session.data);

  // delete the attachment data we no longer need
  delete req.session.data.document.attachment;

  // show flash message (success/failure)
  req.flash('success', 'Attachment details updated');

  // redirect the user back to the attachments page
  res.redirect('/documents/' + req.params.document_id + '/attachments');

};

// Display attachment delete form on GET.
exports.attachment_delete_get = function(req, res) {

  res.render('../views/attachments/delete', {
    id: req.params.attachment_id,
    attachment: Attachments.findById(req.params.document_id, req.params.attachment_id),
    actions: {
      back: '/documents/' + req.params.document_id + '/attachments',
      delete: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/delete'
    }
  });

};

// Handle attachment delete on POST.
exports.attachment_delete_post = function(req, res) {

  Attachments.findByIdAndDelete(req.params.document_id, req.params.attachment_id);

  // show flash message (success/failure)
  req.flash('success', 'Attachment deleted');

  // redirect the user back to the attachments page
  res.redirect('/documents/' + req.params.document_id + '/attachments');

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

  let backLink = '/documents/' + req.params.document_id + '/attachments';
  if (!req.headers.referer.includes(backLink)) {
    backLink = '/documents/' + req.params.document_id;
  }

  res.render('../views/attachments/reorder', {
    attachments: Attachments.findByDocumentId(req.params.document_id),
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

  // show flash message (success/failure)
  req.flash('success', 'Attachments reordered');

  // redirect the user back to the document page
  res.redirect('/documents/' + req.params.document_id + '/attachments');
};
