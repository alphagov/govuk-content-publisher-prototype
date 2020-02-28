const path = require('path');
const fs = require('fs');
const uuid = require('uuid/v1');

const Helpers = require('../helpers/helpers');
const Governments = require('../models/governments');
const Organisations = require('../models/organisations');

const directoryPath = path.join(__dirname, '../data/documents');

// https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/

exports.save = function(data) {

  // check if document directory exists
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  // create a unique file name
  const content_id = uuid();
  const fileName = content_id + '.json';

  const filePath = directoryPath + '/' + fileName;

  // document data
  let documentData = {};
  documentData.content_id = content_id;

  if (data.document_sub_type !== undefined) {
    documentData.document_type = data.document_sub_type;
  } else {
    documentData.document_type = data.document_type;
  }

  documentData.document_status = 'draft';

  documentData.created_at = new Date();
  documentData.created_by = data.user.display_name;

  // get political status of document creator's organisation
  documentData.political = Organisations.isPolitical(data.user.organisation);

  // get current government
  documentData.government = Governments.findGovernmentByDate(documentData.created_at);

  // create a JSON sting for the submitted data
  const fileData = JSON.stringify(documentData);

  // write the JSON data
  fs.writeFileSync(filePath, fileData);

  return documentData;

};

exports.find = function() {

  let documents = fs.readdirSync(directoryPath,'utf8');

  // Only get JSON documents
  documents = documents.filter( doc => doc.match(/.*\.(json)/ig));

  const documentsArray = [];

  documents.forEach(function (filename) {
    let rawdata = fs.readFileSync(directoryPath + '/' + filename);
    let docdata = JSON.parse(rawdata);
    documentsArray.push(docdata);
  });

  return documentsArray;

};

exports.findById = function(document_id) {

  const filePath = directoryPath + '/' + document_id + '.json';

  let rawdata = fs.readFileSync(filePath);
  let documentData = JSON.parse(rawdata);

  return documentData;

};

exports.findByIdAndUpdate = function(document_id, data) {
  if (!document_id)
    return null;

  console.log('Model: ',data.document.document_status);

  let documentData = this.findById(document_id);

  if (data.document.title !== undefined)
    documentData.title = data.document.title;

  if (data.document.description !== undefined)
    documentData.description = data.document.description;

  if (data.document.details !== undefined && data.document.details.body !== undefined) {
    documentData.details = {};
    documentData.details.body = data.document.details.body;
  }

  if (data.document.political !== undefined)
    documentData.political = data.document.political;

  if (data.document.document_status !== undefined)
    documentData.document_status = data.document.document_status;

  if (data.document.edition !== undefined && data.document.edition.change_note !== undefined) {
    documentData.edition = {};
    documentData.edition.change_note_option = '';
    documentData.edition.change_note = '';
  }

  documentData.updated_at = new Date();

  if (data.user.display_name !== undefined) {
    documentData.updated_by = data.user.display_name;
  } else {
    documentData.updated_by = 'Unknown';
  }

  const filePath = directoryPath + '/' + documentData.content_id + '.json';

  // create a JSON sting for the submitted data
  const fileData = JSON.stringify(documentData);

  // write the JSON data
  fs.writeFileSync(filePath, fileData);

};

exports.findByIdAndDelete = function(document_id) {
  const fileName = document_id + '.json';
  fs.unlinkSync(directoryPath + '/' + fileName);
};
