const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, '../data/documents');

// https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/

exports.save = function() {

};

exports.find = function() {

};

exports.findById = function(document_id) {

  const filePath = directoryPath + '/' + document_id + '.json';

  let rawdata = fs.readFileSync(filePath);
  let documentData = JSON.parse(rawdata);

  return documentData;

};

exports.findByIdAndUpdate = function() {

};

exports.findByIdAndDelete = function() {

};
