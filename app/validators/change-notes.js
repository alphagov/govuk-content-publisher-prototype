const Helpers = require('../helpers/validators');

exports.checkChangeNote = function(data) {

  let errors = [];

  // validate existence of change_note_option choice
  if (data.change_note_option == undefined){
    let error = {};
    error.fieldName = 'change_note_option';
    error.href = '#edition-change-note-option';
    error.text = 'Choose whether users need to know the content has changed';
    errors.push(error);
  }

  // if change_note_option == "yes", check existence of reason
  if(data.change_note_option == 'yes') {
    if (!data.change_note.length) {
      let error = {};
      error.fieldName = 'change_note';
      error.href = '#edition-change-note';
      error.text = 'Enter a description of the change for users';
      errors.push(error);
    }
  }

  return errors;

}
