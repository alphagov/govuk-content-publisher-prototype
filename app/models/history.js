const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, '../data/history');

// https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/

exports.save = function(data) {

  // history directory path
  // const historyDirectoryPath = path.join(__dirname, '../data/history/');

  // check if document history directory exists
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }

  const fileName = data.content_id + '.json';

  const filePath = directoryPath + '/' + fileName;

  // TODO: write history data
  let historyArray = [];
  let historyData = {};
  historyData.id = data.content_id;
  historyData.title = 'First created';
  historyData.created_at = data.created_at;
  historyData.created_by = data.created_by;

  historyData.edition = {};
  historyData.edition.title = '1st Edition';
  historyData.edition.id = data.content_id;

  historyArray.push(historyData);

  // create a JSON sting for the submitted data
  const fileData = JSON.stringify(historyArray);

  // write the JSON data
  fs.writeFileSync(filePath, fileData);

  return historyArray;

};

exports.find = function() {

};

exports.findById = function() {



};

exports.findByDocumentId = function() {



};

exports.findByIdAndUpdate = function() {

};

exports.findByIdAndDelete = function() {

};

exports.findByDocumentIdAndDelete = function(document_id) {
  const fileName = document_id + '.json';
  fs.unlinkSync(directoryPath + '/' + fileName);
};
