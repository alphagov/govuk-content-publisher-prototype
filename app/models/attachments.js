const path = require('path');
const fs = require('fs');

// https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/

exports.save = function() {

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

exports.findByIdAndUpdate = function(attachment_id) {

};

exports.findByIdAndDelete = function(attachment_id) {

};

// get array of all attachments for a document.
exports.findByDocumentId = function(document_id) {

  // attachment uploads directory path
  const directoryPath = path.join(__dirname, '../data/attachments/', document_id);

  // check if document directory exists in attachment uploads directory
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  let attachments = fs.readdirSync(directoryPath,'utf8');
  // Only get JSON documents
  attachments = attachments.filter( doc => doc.match(/.*\.(json)/ig));

  const attachmentArray = [];

  attachments.forEach(function (filename) {
    let rawdata = fs.readFileSync(directoryPath + '/' + filename);
    let attachmentData = JSON.parse(rawdata);
    attachmentArray.push(attachmentData);
  });

  return attachmentArray;

};
