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

  // let documents = fs.readdirSync(directoryPath,'utf8');
  //
  // // Only get JSON documents
  // documents = documents.filter( doc => doc.match(/.*\.(json)/ig));
  //
  // const docArray = [];
  //
  // documents.forEach(function (filename) {
  //   let rawdata = fs.readFileSync(directoryPath + '/' + filename);
  //   let docdata = JSON.parse(rawdata);
  //   docArray.push(docdata);
  // });
  //
  // let sort_order = (req.query.sort) ? (req.query.sort) : 'asc';
  // if (sort_order == 'desc') {
  //   docArray.sort((a,b) => new Date(a.updated_at) - new Date(b.updated_at));
  // }
  // else {
  //   docArray.sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at));
  // }
  //
  // // Total number of documents
  // let count = docArray.length;
  //
  // // Prevent users putting in a limit not in the pre-defined set: 10, 25, 50, 100
  // let limit = 50;
  // if ([10,25,50,100].indexOf(parseInt(req.query.limit)) !== -1) {
  //   limit = (req.query.limit) ? parseInt(req.query.limit) : 50;
  // }
  //
  // // Current page
  // let page = (req.query.page) ? parseInt(req.query.page) : 1;
  //
  // // Total number of pages
  // let page_count = Math.ceil(count / limit);
  //
  // // Calculate the previous and next pages
  // let prev_page = (page - 1) ? (page - 1) : 1;
  // let next_page = ((page + 1) > page_count) ? page_count : (page + 1);
  //
  // return pageArray = Helpers.paginate(docArray, limit, page);

};

exports.findById = function(document_id) {

  const filePath = directoryPath + '/' + document_id + '.json';

  let rawdata = fs.readFileSync(filePath);
  let documentData = JSON.parse(rawdata);

  return documentData;

};

exports.findByIdAndUpdate = function(document_id, data) {

  let documentData = this.findById(document_id);

  documentData.title = data.document.title;
  documentData.description = data.document.description;
  documentData.details = {};
  documentData.details.body = data.document.details.body;

  documentData.updated_at = new Date();
  documentData.updated_by = data.user.display_name;

  const filePath = directoryPath + '/' + documentData.content_id + '.json';

  // create a JSON sting for the submitted data
  const fileData = JSON.stringify(documentData);

  // write the JSON data
  fs.writeFileSync(filePath, fileData);

};

exports.findByIdAndUpdate = function(document_id, data) {
  if (!document_id)
    return null;

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

  // let documentData = this.findById(document_id);

  const fileName = document_id + '.json';

  fs.unlinkSync(directoryPath + '/' + fileName);

};
