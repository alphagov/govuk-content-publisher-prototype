const path = require('path');
const fs = require('fs');
// const multer = require('multer');
const uuid = require('uuid/v1');

const Attachments = require('../models/attachments');

// Display list of all attachments.
exports.attachment_list = function(req, res) {
  // res.send('NOT IMPLEMENTED: attachment list');

  // // attachment uploads directory path
  // const directoryPath = path.join(__dirname, '../data/attachments/', req.params.document_id);
  //
  // // check if document directory exists in attachment uploads directory
  // if (!fs.existsSync(directoryPath)) {
  //   fs.mkdirSync(directoryPath);
  // }
  //
  // let attachments = fs.readdirSync(directoryPath,'utf8');
  // // Only get JSON documents
  // attachments = attachments.filter( doc => doc.match(/.*\.(json)/ig));
  //
  // const attachmentArray = [];
  //
  // attachments.forEach(function (filename) {
  //   let rawdata = fs.readFileSync(directoryPath + '/' + filename);
  //   let attachmentData = JSON.parse(rawdata);
  //   attachmentArray.push(attachmentData);
  // });

  res.render('../views/attachments/list', {
    attachments: Attachments.findByDocumentId(req.params.document_id),
    links: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id + '/attachments'
    }
  });
};

// Display detail page for a specific book.
exports.attachment_detail = function(req, res) {
  // res.send('NOT IMPLEMENTED: attachment detail: ' + req.params.attachment_id);

  // attachment uploads directory path
  // const directoryPath = path.join(__dirname, '../data/attachments/', req.params.document_id);
  //
  // let rawdata = fs.readFileSync(directoryPath + '/' + req.params.attachment_id + '.json');
  // let attachmentData = JSON.parse(rawdata);

  res.render('../views/attachments/show', {
    attachment: Attachments.findById(req.params.document_id, req.params.attachment_id),
    links: {
      back: '/documents/' + req.params.document_id + '/attachments',
      edit: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id,
      delete: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/delete'
    }
  });
};

// Display attachment create form on GET.
exports.attachment_create_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: attachment create GET');
  const types = ['html','file','external'];

  if (types.indexOf(req.query.type) === -1) {

    res.redirect('/documents/' + req.params.document_id + '/attachments');

  } else {

    res.render('../views/attachments/create', {
      links: {
        back: '/documents/' + req.params.document_id + '/attachments',
        save: '/documents/' + req.params.document_id + '/attachments/create'
      }
    });

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

  // create a JSON sting for the submitted data
  const fileData = JSON.stringify(attachmentData);

  // write the JSON data
  fs.writeFileSync(filePath, fileData);

  // delete the attachment data we no longer need
  delete req.session.data.document.attachment;

  // redirect the user back to the attachments page
  // TODO: show flash message (success/failure)
  res.redirect('/documents/' + req.params.document_id + '/attachments');

};

// Display attachment delete form on GET.
exports.attachment_delete_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: attachment delete GET');
  // Show deletion secondary confirmation page

  res.render('../views/attachments/delete', {
    id: req.params.attachment_id,
    links: {
      back: '/documents/' + req.params.document_id + '/attachments',
      delete: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/delete'
    }
  });

};

// Handle attachment delete on POST.
exports.attachment_delete_post = function(req, res) {
  // res.send('NOT IMPLEMENTED: attachment delete POST');

  // attachment uploads directory path
  const directoryPath = path.join(__dirname, '../data/attachments/', req.params.document_id);

  fs.unlinkSync(directoryPath + '/' + req.params.attachment_id + '.json');

  // redirect the user back to the attachments page
  // TODO: show flash message (success/failure)
  res.redirect('/documents/' + req.params.document_id + '/attachments');
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

  res.render('../views/attachments/edit', {
    id: req.params.attachment_id,
    attachment: Attachments.findById(req.params.document_id, req.params.attachment_id),
    file: fileMetadata,
    links: {
      back: '/documents/' + req.params.document_id + '/attachments',
      save: '/documents/' + req.params.document_id + '/attachments/' + req.params.attachment_id + '/update'
    }
  });

};

// Handle attachment update on POST.
exports.attachment_update_post = function(req, res) {
  // res.send('NOT IMPLEMENTED: attachment update POST');

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
    attachmentData.isbn = req.session.data.document.attachment.isbn;
    attachmentData.urn = req.session.data.document.attachment.urn;

    // TODO: work out the hierarchy of CPN and unnumbered
    attachmentData.cpn = req.session.data.document.attachment.cpn;
    attachmentData.unnumbered = req.session.data.document.attachment.unnumbered;

    // TODO: work out the hierarchy of HCPN and unnumbered act
    attachmentData.hcpn = req.session.data.document.attachment.hcpn;
    attachmentData.unnumbered_act = req.session.data.document.attachment.unnumbered_act;
  }

  if (attachmentData.type === 'html') {
    attachmentData.body = req.session.data.document.attachment.body;
  }

  attachmentData.updated_at = new Date();
  attachmentData.updated_by = req.session.data.user.display_name;

  // create a JSON sting for the submitted data
  const fileData = JSON.stringify(attachmentData);

  // write the JSON data
  fs.writeFileSync(filePath, fileData);

  // delete the attachment data we no longer need
  delete req.session.data.document.attachment;

  // redirect the user back to the attachments page
  // TODO: show flash message (success/failure)
  res.redirect('/documents/' + req.params.document_id + '/attachments');

};
