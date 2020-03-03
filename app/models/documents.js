const path = require('path');
const fs = require('fs');
const uuid = require('uuid/v1');

const Helpers = require('../helpers/helpers');
const Governments = require('../models/governments');
const Organisations = require('../models/organisations');
const Schemas = require('../models/schemas');

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

  // get document schema eg. 'publication' for a given document type
  documentData.document_schema = Schemas.findDocumentSchemaByType(documentData.document_type);

  // get political status of document creator's organisation
  documentData.political = Organisations.isPolitical(data.user.organisation);

  // get current government
  documentData.government = Governments.findGovernmentByDate(documentData.created_at);

  documentData.created_at = new Date();
  documentData.created_by = data.user.display_name;

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

  if (data.document.edition !== undefined) {
    documentData.edition = {};
    if (data.document.edition.change_note !== undefined) {
      documentData.edition.change_note_option = data.document.edition.change_note_option;
      if (data.document.edition.change_note_option === 'yes') {
        documentData.edition.change_note = data.document.edition.change_note;
      } else {
        documentData.edition.change_note = '';
      }
    } else {
      documentData.edition.change_note_option = '';
      documentData.edition.change_note = '';
    }
  }

  if(data.document.withdrawn_notice !== undefined) {
    documentData.withdrawn_notice = {};
    if (data.document.withdrawn_notice.explanation !== undefined) {
      documentData.withdrawn_notice.explanation = data.document.withdrawn_notice.explanation;
      documentData.withdrawn_notice.withdrawn_at = new Date();
    }
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

exports.findByIdAndUndoWithdrawal = function(document_id, data) {
  if (!document_id)
    return null;

  let documentData = this.findById(document_id);

  delete documentData.withdrawn_notice;

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

exports.findByIdAndUpdateNationalApplicability = function(document_id, data) {
  if (!document_id)
    return null;

  let documentData = this.findById(document_id);

  documentData.details.national_applicability = {};

  const nations = ["england","northern_ireland","scotland","wales"];

  nations.forEach((nation) => {

    documentData.details.national_applicability[nation] = {};

    // TODO: title case and remove underscore
    documentData.details.national_applicability[nation].label = nation.replace(/_+/g, " ");

    // if the user hasn't checked the checkbox, the nation is applicable
    if (data.document.details.national_applicability.nations === undefined || data.document.details.national_applicability.nations.indexOf(nation) === -1) {

      documentData.details.national_applicability[nation].applicable = true;

      documentData.details.national_applicability[nation].alternative_url = '';

    } else {

      documentData.details.national_applicability[nation].applicable = false;

      if (data.document.details.national_applicability[nation].alternative_url.length) {
        documentData.details.national_applicability[nation].alternative_url = data.document.details.national_applicability[nation].alternative_url;
      } else {
        documentData.details.national_applicability[nation].alternative_url = '';
      }

    }

  });

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
