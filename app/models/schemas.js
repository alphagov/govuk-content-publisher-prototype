const schemas = require('../data/document_type_schemas.json');

exports.findDocumentSchemaByType = function(type) {
  if (!type) return null
  let item = schemas.find( ({ document_type }) => document_type === type );
  return item.document_schema;
}
