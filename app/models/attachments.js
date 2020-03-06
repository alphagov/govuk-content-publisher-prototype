const path = require('path');
const fs = require('fs');
const uuid = require('uuid/v1');

const Helpers = require('../helpers/helpers');

// https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/

exports.save = function(document_id, data) {

  // attachment uploads directory path
  const directoryPath = path.join(__dirname, '../data/attachments/', document_id);

  // check if document directory exists in attachment uploads directory
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  // create a unique file name
  const content_id = uuid();
  const fileName = content_id + '.json';

  const filePath = directoryPath + '/' + fileName;

  // attachment data
  let attachmentData = data.document.attachment;
  attachmentData.content_id = content_id;
  attachmentData.document_id = document_id;
  attachmentData.created_at = new Date();
  attachmentData.created_by = data.user.display_name;

  if (data.document.attachment.type === 'file') {
    attachmentData.file = Helpers.slugify(attachmentData.title);
  }

  if (data.document.attachment.type === 'html') {
    attachmentData.base_path = Helpers.slugify(attachmentData.title);
  }

  // create a JSON sting for the submitted data
  const fileData = JSON.stringify(attachmentData);

  // write the JSON data
  fs.writeFileSync(filePath, fileData);

  // append the new file path to the index.js
  let index;

  // initalise an attachments order array
  let attachmentsOrder = [];

  try {
    index = fs.readFileSync(directoryPath + '/index.json');
  } catch (err) {
    // no index file
  }

  // parse the existing file order if exists
  if (index) {
    attachmentsOrder = JSON.parse(index);
  }

  // push the new file to the end of the array
  attachmentsOrder.push(fileName);

  const indexFileData = JSON.stringify(attachmentsOrder);

  fs.writeFileSync(directoryPath + '/index.json', indexFileData);

  return attachmentData;

};

exports.find = function() {

};

exports.findById = function(document_id, attachment_id) {

  // attachment uploads directory path
  const directoryPath = path.join(__dirname, '../data/attachments/', document_id);

  const filePath = directoryPath + '/' + attachment_id + '.json';

  let rawdata = fs.readFileSync(filePath);
  let attachmentData = JSON.parse(rawdata);

  return attachmentData;

};

exports.findByIdAndUpdate = function(document_id, attachment_id, data) {

  // Get attachment data
  let attachmentData = this.findById(document_id, attachment_id);

  attachmentData.title = data.document.attachment.title;

  if (attachmentData.type === 'external') {
    attachmentData.url = data.document.attachment.url;
  }

  if (attachmentData.type === 'file') {
    attachmentData.file = Helpers.slugify(attachmentData.title);
  }

  if (attachmentData.type === 'html') {
    attachmentData.numbered_headings = data.document.attachment.numbered_headings;
    attachmentData.body = data.document.attachment.body;
    attachmentData.base_path = Helpers.slugify(attachmentData.title);
  }

  attachmentData.updated_at = new Date();
  attachmentData.updated_by = data.user.display_name;

  // attachment uploads directory path
  const directoryPath = path.join(__dirname, '../data/attachments/', document_id);

  const filePath = directoryPath + '/' + attachment_id + '.json';
  // create a JSON sting for the submitted data
  const fileData = JSON.stringify(attachmentData);

  // write the JSON data
  fs.writeFileSync(filePath, fileData);

};

exports.findByIdAndUpdateDetails = function(document_id, attachment_id, data) {

  // Get attachment data
  let attachmentData = this.findById(document_id, attachment_id);

  // Update attachment data
  attachmentData.official_document = data.document.attachment.official_document;

  attachmentData.isbn = data.document.attachment.isbn;
  attachmentData.urn = data.document.attachment.urn;

  if (attachmentData.official_document === 'yes_command_paper') {

    attachmentData.cpn = data.document.attachment.cpn;

    // clear the house of commons paper fields
    attachmentData.hcpn = '';
    attachmentData.parliamentary_session = '';

  }

  if (attachmentData.official_document === 'yes_unnumbered_command_paper' || attachmentData.official_document === 'yes_unnumbered_act_paper') {

    // clear the command paper number
    attachmentData.cpn = '';

    // clear the house of commons paper fields
    attachmentData.hcpn = '';
    attachmentData.parliamentary_session = '';

  }

  if (attachmentData.official_document === 'yes_house_of_commons_paper') {

    attachmentData.hcpn = data.document.attachment.hcpn;
    attachmentData.parliamentary_session = data.document.attachment.parliamentary_session;

    // clear the command paper field
    attachmentData.cpn = '';

  }

  const officialTypes = ['yes_command_paper','yes_unnumbered_command_paper','yes_house_of_commons_paper','yes_unnumbered_act_paper'];

  if (officialTypes.indexOf(attachmentData.official_document) !== -1) {
    attachmentData.order_url = "https://www.gov.uk/guidance/how-to-buy-printed-copies-of-official-documents";
  }

  if (attachmentData.official_document === 'no') {
    attachmentData.cpn = '';
    attachmentData.hcpn = '';
    attachmentData.parliamentary_session = '';
    attachmentData.order_url = '';
  }

  if (attachmentData.type === 'html') {
    attachmentData.body = data.document.attachment.body;
  }

  attachmentData.updated_at = new Date();
  attachmentData.updated_by = data.user.display_name;

  // attachment uploads directory path
  const directoryPath = path.join(__dirname, '../data/attachments/', document_id);

  const filePath = directoryPath + '/' + attachment_id + '.json';
  // create a JSON sting for the submitted data
  const fileData = JSON.stringify(attachmentData);

  // write the JSON data
  fs.writeFileSync(filePath, fileData);

};

exports.findByIdAndDelete = function(document_id, attachment_id) {

  // attachment uploads directory path
  const directoryPath = path.join(__dirname, '../data/attachments/', document_id);

  const filePath = directoryPath + '/' + attachment_id + '.json';

  fs.unlinkSync(filePath);

  // append the new file path to the index.js
  let index;

  try {
    index = fs.readFileSync(directoryPath + '/index.json');
  } catch (err) {
    // no index file
  }
  if (index) {
    attachmentsOrder = JSON.parse(index);

    const i = attachmentsOrder.indexOf(attachment_id + '.json');
    if (i > -1) {
      attachmentsOrder.splice(i, 1);
    }

    const indexFileData = JSON.stringify(attachmentsOrder);
    fs.writeFileSync(directoryPath + '/index.json', indexFileData);
  }

};

exports.findByDocumentIdAndDelete = function(document_id) {
  const directoryPath = path.join(__dirname, '../data/attachments/', document_id);
  Helpers.deleteDirectoryRecursive(directoryPath);
};

// get array of all attachments for a document.
exports.findByDocumentId = function(document_id) {

  // attachment uploads directory path
  const directoryPath = path.join(__dirname, '../data/attachments/', document_id);

  // check if document directory exists in attachment uploads directory
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  let attachments = [];
  let index;

  try {
    index = fs.readFileSync(directoryPath + '/index.json');
  } catch (err) {
    // no index file
  }

  if (index) {
    attachments = JSON.parse(index);
  } else {
    attachments = fs.readdirSync(directoryPath,'utf8');
    // Only get JSON documents
    attachments = attachments.filter( doc => doc.match(/.*\.(json)/ig));
  }

  const attachmentArray = [];

  attachments.forEach(function (filename) {
    let rawdata = fs.readFileSync(directoryPath + '/' + filename);
    let attachmentData = JSON.parse(rawdata);
    attachmentArray.push(attachmentData);
  });

  return attachmentArray;

};
