const path = require('path');
const fs = require('fs');
const uuid = require('uuid/v1');

const organisations = require('../data/organisations.json');
const governments = require('../data/governments.json');
const users = require('../data/users.json');

const Documents = require('../models/documents');
const Attachments = require('../models/attachments');

function paginate(array, page_size, page_number) {
  --page_number; // because pages logically start with 1, but technically with 0
  return array.slice(page_number * page_size, (page_number + 1) * page_size);
}

function isPolitical(org_id) {
  if (!org_id) return null
  let org = organisations.find( ({ key }) => key === org_id );
  return org.political;
}

function getGovernment(pub_date) {
  let gov = {};
  gov = governments.filter( government => dateBetween(government.start_date, government.end_date, pub_date) );
  return gov[0];
}

function getUser(user_id) {
  if (!user_id) return null
  let result = {};
  result = users.filter(user => user.id === user_id);
  return result;
}

function getUsersByOrganisation(org_id) {
  if (!org_id) return null
  let result = [];
  result = users.filter(user => user.organisation === org_id);
  return result;
}

function dateBetween(start_date, end_date, my_date) {
  if (!end_date.length)
    end_date = new Date();

  return new Date(start_date) <= new Date(my_date) && new Date(end_date) >= new Date(my_date);
}

// Display list of all documents.
exports.document_list = function(req, res) {
  // res.send('NOT IMPLEMENTED: Document list');

  delete req.session.data.document_super_type;
  delete req.session.data.document_type;
  delete req.session.data.document_sub_type;

  const directoryPath = path.join(__dirname, '../data/documents');

  let documents = fs.readdirSync(directoryPath,'utf8');

  // Only get JSON documents
  documents = documents.filter( doc => doc.match(/.*\.(json)/ig));

  const docArray = [];

  documents.forEach(function (filename) {
    let rawdata = fs.readFileSync('./app/data/documents/' + filename);
    let docdata = JSON.parse(rawdata);
    docArray.push(docdata);
  });

  let sort_order = (req.query.sort) ? (req.query.sort) : 'asc';
  if (sort_order == 'desc') {
    docArray.sort((a,b) => new Date(a.updated_at) - new Date(b.updated_at));
  }
  else {
    docArray.sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at));
  }

  // Total number of documents
  let count = docArray.length;

  // Prevent users putting in a limit not in the pre-defined set: 10, 25, 50, 100
  let limit = 50;
  if ([10,25,50,100].indexOf(parseInt(req.query.limit)) !== -1) {
    limit = (req.query.limit) ? parseInt(req.query.limit) : 50;
  }

  // Current page
  let page = (req.query.page) ? parseInt(req.query.page) : 1;

  // Total number of pages
  let page_count = Math.ceil(count / limit);

  // Calculate the previous and next pages
  let prev_page = (page - 1) ? (page - 1) : 1;
  let next_page = ((page + 1) > page_count) ? page_count : (page + 1);

  pageArray = paginate(docArray, limit, page);

  res.render('../views/documents/list', {
    documents: pageArray,
    total_count: count,
    page_count: page_count,
    page_number: page,
    actions: {
      new: '/documents/super-type',
      clear: '/documents?filters=&sort=',
      next: '/documents?page=' + next_page + '&sort=' + sort_order,
      previous: '/documents?page=' + prev_page + '&sort=' + sort_order
    }
  });
};

// Display summary page for a specific document.
exports.document_summary_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: Document summary: ' + req.params.document_id);

  if (!req.session.data.document || (req.session.data.document.content_id != req.params.document_id)) {

    // HACK: load the correct data from the session
    res.redirect('/documents/' + req.params.document_id + '/load')

  }
  else {

    res.render('../views/documents/summary', {
      attachments: Attachments.findByDocumentId(req.params.document_id),
      actions: {
        home: '/documents',
        summary: '/documents/' + req.params.document_id,
        history: '/documents/' + req.params.document_id + '/history',
        content: '/documents/' + req.params.document_id + '/content',
        attachments: '/documents/' + req.params.document_id + '/attachments',
        images: '/documents/' + req.params.document_id + '/images',
        topics: '/documents/' + req.params.document_id + '/topics',
        tags: '/documents/' + req.params.document_id + '/tags',
        settings: {
          access: '/documents/' + req.params.document_id + '/access',
          back_date: '/documents/' + req.params.document_id + '/back-date',
          political: '/documents/' + req.params.document_id + '/political'
        },
        new_edition: '/documents/' + req.params.document_id + '/new',
        review: '/documents/' + req.params.document_id + '/review',
        approve: '/documents/' + req.params.document_id + '/approve',
        schedule: '/documents/' + req.params.document_id + '/schedule',
        preview: '/documents/' + req.params.document_id + '/preview',
        publish: '/documents/' + req.params.document_id + '/publish',
        delete_draft: '/documents/' + req.params.document_id + '/delete',
        withdraw: '/documents/' + req.params.document_id + '/withdraw',
        undo_withdraw: '/documents/' + req.params.document_id + '/undo-withdraw',
        remove: '/documents/' + req.params.document_id + '/remove'
      },
      id: req.params.document_id
    });

  }

};

// Display summary page for a specific document.
exports.document_history_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: Document history: ' + req.params.document_id);

  let historyData = [];
  let historyArray = [];

  let rawdata = fs.readFileSync('./app/data/history/' + req.params.document_id + '.json');
  historyData = JSON.parse(rawdata);

  historyData.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

  // Total number of documents
  let count = historyData.length;

  // Prevent users putting in a limit not in the pre-defined set: 10, 25, 50, 100
  let limit = 50;
  if ([10,25,50,100].indexOf(parseInt(req.query.limit)) !== -1) {
    limit = (req.query.limit) ? parseInt(req.query.limit) : 50;
  }

  // Current page
  let page = (req.query.page) ? parseInt(req.query.page) : 1;

  // Total number of pages
  let page_count = Math.ceil(count / limit);

  // Calculate the previous and next pages
  let prev_page = (page - 1) ? (page - 1) : 1;
  let next_page = ((page + 1) > page_count) ? page_count : (page + 1);

  historyArray = paginate(historyData, limit, page);

  res.render('../views/documents/history', {
    history: historyArray,
    total_count: count,
    page_count: page_count,
    page_number: page,
    actions: {
      home: '/documents',
      summary: '/documents/' + req.params.document_id,
      history: '/documents/' + req.params.document_id + '/history',
      next: '/documents/' + req.params.document_id + '/history?page=' + next_page,
      previous: '/documents/' + req.params.document_id + '/history?page=' + prev_page
    },
    id: req.params.document_id
  });

};

exports.document_load = function(req, res) {
  let rawdata = fs.readFileSync('./app/data/documents/' + req.params.document_id + '.json');
  let docdata = JSON.parse(rawdata);

  req.session.data.document = docdata;

  res.redirect('/documents/' + req.params.document_id)
}

// Display document create super type form on GET.
exports.document_create_super_type_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: Document create GET');

  delete req.session.data.document_type;

  res.render('../views/documents/super-type', {
    actions: {
      previous: '/documents',
      next: '/documents/type'
    }
  });
};

// Display document create type form on GET.
exports.document_create_type_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: Document create GET');

  delete req.session.data.document_sub_type

  res.render('../views/documents/type', {
    actions: {
      previous: '/documents/super-type',
      next: '/documents/sub-type'
    }
  });
};

// Display document create sub type form on GET.
exports.document_create_sub_type_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: Document create GET');

  const types = ['statement_to_parliament','articles_correspondence','guidance'];

  if (types.indexOf(req.session.data.document_type) === -1) {
    res.redirect('/documents/create');
  } else {
    res.render('../views/documents/sub-type', {
      actions: {
        previous: '/documents/type',
        next: '/documents/create'
      }
    });
  }

};

exports.document_create_get = function(req, res) {

  // documents directory path
  const documentDirectoryPath = path.join(__dirname, '../data/documents/');

  // check if document directory exists
  if (!fs.existsSync(documentDirectoryPath)) {
    fs.mkdirSync(documentDirectoryPath);
  }

  // create a unique file name
  const content_id = uuid();
  const fileName = content_id + '.json';

  const documentFilePath = documentDirectoryPath + '/' + fileName;

  // document data
  // let documentData = req.session.data.document;
  let documentData = {};
  documentData.content_id = content_id;

  if (req.session.data.document_sub_type !== undefined) {
    documentData.document_type = req.session.data.document_sub_type;
  } else {
    documentData.document_type = req.session.data.document_type;
  }

  documentData.document_status = 'draft';

  documentData.created_at = new Date();
  documentData.created_by = req.session.data.user.display_name;

  // documentData.updated_at = documentData.created_at;
  // documentData.updated_by = documentData.created_by;

  // get political status of document creator's organisation
  documentData.political = isPolitical(req.session.data.user.organisation);

  // get current government
  documentData.government = getGovernment(documentData.created_at);

  // create a JSON sting for the submitted data
  const documentFileData = JSON.stringify(documentData);

  // write the JSON data
  fs.writeFileSync(documentFilePath, documentFileData);

  // ==========
  // Document history
  // ==========

  // history directory path
  const historyDirectoryPath = path.join(__dirname, '../data/history/');

  // check if document history directory exists
  if (!fs.existsSync(historyDirectoryPath)) {
    fs.mkdirSync(historyDirectoryPath);
  }

  const historyFilePath = historyDirectoryPath + '/' + fileName;

  // TODO: write history data
  let historyArray = [];
  let historyData = {};
  historyData.id = documentData.content_id;
  historyData.title = 'First created';
  historyData.created_at = documentData.created_at;
  historyData.created_by = documentData.created_by;

  historyData.edition = {};
  historyData.edition.title = '1st Edition';
  historyData.edition.id = documentData.content_id;

  historyArray.push(historyData);

  // create a JSON sting for the submitted data
  const historyFileData = JSON.stringify(historyArray);

  // write the JSON data
  fs.writeFileSync(historyFilePath, historyFileData);

  // redirect the user back to the attachments page
  // TODO: show flash message (success/failure)
  delete req.session.data.document;
  res.redirect('/documents/' + content_id + '/new');

}

// Display document create form on GET.
exports.document_new_get = function(req, res) {

  const documentData = Documents.findById(req.params.document_id);

  let previous_page = '/documents/type';
  if (req.session.data.document_sub_type !== undefined) {
    previous_page = '/documents/sub-type';
  }

  res.render('../views/documents/new', {
    document: documentData,
    actions: {
      back: previous_page,
      save: '/documents/' + documentData.content_id + '/new'
    }
  });

};

// Handle document create on POST.
exports.document_new_post = function(req, res) {

  const documentData = Documents.findById(req.params.document_id);

  documentData.title = req.session.data.document.title;
  documentData.description = req.session.data.document.description;
  documentData.details = {};
  documentData.details.body = req.session.data.document.details.body;

  documentData.updated_at = new Date();
  documentData.updated_by = req.session.data.user.display_name;

  // documents directory path
  const documentDirectoryPath = path.join(__dirname, '../data/documents/');

  const documentFilePath = documentDirectoryPath + '/' + documentData.content_id + '.json';

  // create a JSON sting for the submitted data
  const documentFileData = JSON.stringify(documentData);

  // write the JSON data
  fs.writeFileSync(documentFilePath, documentFileData);

  res.redirect('/documents/' + documentData.content_id);

};

// Display document delete form on GET.
exports.document_delete_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: Document delete GET');
  res.render('../views/documents/delete', {
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id + '/delete'
    }
  });
};

// Handle document delete on POST.
exports.document_delete_post = function(req, res) {
  // res.send('NOT IMPLEMENTED: Document delete POST');

  // documents directory path
  const documentDirectoryPath = path.join(__dirname, '../data/documents/');
  const historyDirectoryPath = path.join(__dirname, '../data/history/');

  const fileName = req.params.document_id + '.json';

  fs.unlinkSync(documentDirectoryPath + fileName);
  fs.unlinkSync(historyDirectoryPath + fileName);

  // TODO: delete attachments directory
  // const attachmentDirectoryPath = path.join(__dirname, '../data/attachments/' + req.params.document_id);
  // fs.rmdirSync(attachmentsDirectoryPath);

  // redirect the user back to the attachments page
  // TODO: show flash message (success/failure)
  res.redirect('/documents');
};

// Display document update form on GET.
exports.document_update_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: Document update GET');
  res.render('../views/documents/edit', {
    id: req.params.document_id,
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id
    }
  });
};

// Handle document update on POST.
exports.document_update_post = function(req, res) {
  // res.send('NOT IMPLEMENTED: Document update POST');
  res.render('../views/documents/edit', {
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id
    }
  });
};

// Display document political update form on GET.
exports.document_political_update_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: Document update GET');
  res.render('../views/documents/political', {
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id
    }
  });
};

// Display document images update form on GET.
exports.document_images_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Document images update GET');
};

// Display document images update form on GET.
exports.document_images_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Document images update POST');
};

// Display document topics update form on GET.
exports.document_topics_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Document topics update GET');
};

// Display document topics update form on GET.
exports.document_topics_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Document topics update POST');
};

// Display document tags update form on GET.
exports.document_tags_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Document tags update GET');
};

// Display document tags update form on GET.
exports.document_tags_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Document tags update POST');
};


exports.document_new_edition_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: New edition GET');
  res.render('../views/documents/new-edition', {
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id + '/new'
    }
  });
};

exports.document_new_edition_post = function(req, res) {
  // res.send('NOT IMPLEMENTED: New edition POST');
  req.session.data.document.document_status = 'draft';
  res.redirect('/documents/' + req.params.document_id);
};

exports.document_review_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Review document GET');
};

exports.document_review_post = function(req, res) {
  // res.send('NOT IMPLEMENTED: Review document POST');
  req.session.data.document.document_status = 'submitted_for_review';
  res.redirect('/documents/' + req.params.document_id);
};

exports.document_approve_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Approve document GET');
};

exports.document_approve_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Approve document POST');
};

exports.document_schedule_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: Schedule document GET');
  res.render('../views/documents/schedule', {
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id
    }
  });
};

exports.document_schedule_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Schedule document POST');
};

exports.document_preview_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: Preview document GET');
  res.render('../views/documents/preview', {
    actions: {
      back: '/documents/' + req.params.document_id
    }
  });
};

exports.document_preview_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Preview document POST');
};

exports.document_publish_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Publish document GET');
};

exports.document_publish_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Publish document POST');
};

exports.document_delete_draft_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Delete draft document GET');
};

exports.document_delete_draft_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Delete draft document POST');
};

exports.document_withdraw_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: Withdraw document GET');
  res.render('../views/documents/withdraw', {
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id
    }
  });
};

exports.document_withdraw_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Withdraw document POST');
};

exports.document_undo_withdraw_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: Undo withdraw document GET');
  res.render('../views/documents/undo-withdraw', {
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id
    }
  });
};

exports.document_undo_withdraw_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Undo withdraw document POST');
};

exports.document_remove_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: Remove document GET');
  res.render('../views/documents/remove', {
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id
    }
  });
};

exports.document_remove_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Remove document POST');
};
