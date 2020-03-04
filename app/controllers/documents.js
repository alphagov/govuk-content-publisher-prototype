const path = require('path');
const fs = require('fs');
const uuid = require('uuid/v1');

// helpers
const Helpers = require('../helpers/helpers');

// models
const Attachments = require('../models/attachments');
const Documents = require('../models/documents');
const History = require('../models/history');

// Display list of all documents.
exports.document_list = function(req, res) {
  // clear out the document types from the creation flow
  delete req.session.data.document_super_type;
  delete req.session.data.document_type;
  delete req.session.data.document_sub_type;

  let documentsArray = Documents.find();

  let sort_order = (req.query.sort) ? (req.query.sort) : 'asc';
  if (sort_order == 'desc') {
    documentsArray.sort((a,b) => new Date(a.updated_at) - new Date(b.updated_at));
  }
  else {
    documentsArray.sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at));
  }

  // Total number of documents
  let count = documentsArray.length;

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

  pageArray = Helpers.paginate(documentsArray, limit, page);

  let flashMessage = req.flash();

  res.render('../views/documents/list', {
    documents: pageArray,
    message: flashMessage,
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

  const documentData = Documents.findById(req.params.document_id);
  const attachmentData = Attachments.findByDocumentId(req.params.document_id);

  let flashMessage = req.flash();

  res.render('../views/documents/summary', {
    document: documentData,
    attachments: attachmentData,
    message: flashMessage,
    actions: {
      home: '/documents',
      summary: '/documents/' + req.params.document_id,
      history: '/documents/' + req.params.document_id + '/history',
      content: '/documents/' + req.params.document_id + '/content',
      attachments: '/documents/' + req.params.document_id + '/attachments',
      reorder_attachments: '/documents/' + req.params.document_id + '/attachments/reorder',
      images: '/documents/' + req.params.document_id + '/images',
      topics: '/documents/' + req.params.document_id + '/topics',
      tags: '/documents/' + req.params.document_id + '/tags',
      settings: {
        access: '/documents/' + req.params.document_id + '/access',
        back_date: '/documents/' + req.params.document_id + '/back-date',
        political: '/documents/' + req.params.document_id + '/political',
        nations: '/documents/' + req.params.document_id + '/nations'
      },
      new_edition: '/documents/' + req.params.document_id + '/new-edition',
      review: '/documents/' + req.params.document_id + '/review',
      approve: '/documents/' + req.params.document_id + '/approve',
      schedule: '/documents/' + req.params.document_id + '/schedule',
      preview: '/documents/' + req.params.document_id + '/preview',
      publish: '/documents/' + req.params.document_id + '/publish',
      delete_draft: '/documents/' + req.params.document_id + '/delete',
      withdraw: '/documents/' + req.params.document_id + '/withdraw',
      undo_withdraw: '/documents/' + req.params.document_id + '/undo-withdraw',
      remove: '/documents/' + req.params.document_id + '/remove',
      change_note: '/documents/' + req.params.document_id + '/change-note'
    }
  });

};

// Display summary page for a specific document.
exports.document_history_get = function(req, res) {
  // res.send('NOT IMPLEMENTED: Document history: ' + req.params.document_id);

  const directoryPath = path.join(__dirname, '../data/history/');;
  const filePath = directoryPath + req.params.document_id + '.json';

  const documentData = Documents.findById(req.params.document_id);

  let historyArray = [];
  let historyData = {};

  // Dummy data
  historyData.id = req.params.document_id;
  historyData.title = 'First created';
  historyData.created_at = documentData.first_published_at;
  historyData.created_by = req.session.data.user.display_name;
  historyData.edition = {};
  historyData.edition.id = uuid();
  historyData.edition.title = '1st edition';

  historyArray.push(historyData);

  // check if document directory exists
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath,JSON.stringify(historyArray));
  }

  let rawdata = fs.readFileSync(filePath);
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

  historyArray = Helpers.paginate(historyData, limit, page);

  res.render('../views/documents/history', {
    document: documentData,
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

// Display document create super type form on GET.
exports.document_create_super_type_get = function(req, res) {
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
  const types = ['statement_to_parliament','articles_correspondence','guidance','statistics'];

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
  const documentData = Documents.save(req.session.data);
  const historyData = History.save(documentData);
  delete req.session.data.document;
  res.redirect('/documents/' + documentData.content_id + '/new');
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
  Documents.findByIdAndUpdate(req.params.document_id, req.session.data);
  delete req.session.data.document;
  req.flash('success', 'Document saved');
  res.redirect('/documents/' + req.params.document_id);
};

// Display document delete form on GET.
exports.document_delete_get = function(req, res) {
  const documentData = Documents.findById(req.params.document_id);

  res.render('../views/documents/delete', {
    document: documentData,
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id + '/delete'
    }
  });
};

// Handle document delete on POST.
exports.document_delete_post = function(req, res) {
  Documents.findByIdAndDelete(req.params.document_id);
  History.findByDocumentIdAndDelete(req.params.document_id);
  Attachments.findByDocumentIdAndDelete(req.params.document_id);
  delete req.session.data.document;
  req.flash('success', 'Document deleted');
  res.redirect('/documents');
};

// Display document update form on GET.
exports.document_update_get = function(req, res) {
  const documentData = Documents.findById(req.params.document_id);

  res.render('../views/documents/edit', {
    document: documentData,
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id + '/update'
    }
  });
};

// Handle document update on POST.
exports.document_update_post = function(req, res) {
  Documents.findByIdAndUpdate(req.params.document_id, req.session.data);
  delete req.session.data.document;
  req.flash('success', 'Document saved');
  res.redirect('/documents/' + req.params.document_id);
};

// Display document political update form on GET.
exports.document_political_update_get = function(req, res) {
  const documentData = Documents.findById(req.params.document_id);

  res.render('../views/documents/political', {
    document: documentData,
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id + '/political'
    }
  });
};

exports.document_political_update_post = function(req, res) {
  Documents.findByIdAndUpdate(req.params.document_id, req.session.data);
  delete req.session.data.document;
  req.flash('success', 'Gets history mode updated');
  res.redirect('/documents/' + req.params.document_id);
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

// exports.document_new_edition_get = function(req, res) {
//   const documentData = Documents.findById(req.params.document_id);
//
//   res.render('../views/documents/new-edition', {
//     document: documentData,
//     actions: {
//       back: '/documents/' + req.params.document_id,
//       save: '/documents/' + req.params.document_id + '/new-edition'
//     }
//   });
// };

exports.document_new_edition_post = function(req, res) {
  let data = {};

  data.document = {};
  data.document.document_status = 'draft';
  data.document.edition = {};
  data.document.edition.change_note_option = '';
  data.document.edition.change_note = '';

  data.user = {};
  data.user.display_name = req.session.data.user.display_name;

  Documents.findByIdAndUpdate(req.params.document_id, data);

  delete req.session.data.document;

  req.flash('success', 'New edition created');

  res.redirect('/documents/' + req.params.document_id);
};

exports.document_review_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Review document GET');
};

exports.document_review_post = function(req, res) {

  let data = {};

  data.document = {};
  data.document.document_status = 'submitted_for_review';

  data.user = {};
  data.user.display_name = req.session.data.user.display_name;

  Documents.findByIdAndUpdate(req.params.document_id, data);

  delete req.session.data.document;

  req.flash('success', 'Document submitted for review');

  res.redirect('/documents/' + req.params.document_id);
};

exports.document_approve_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Approve document GET');
};

exports.document_approve_post = function(req, res) {
  let data = {};

  data.document = {};
  data.document.document_status = 'published';

  data.user = {};
  data.user.display_name = req.session.data.user.display_name;

  Documents.findByIdAndUpdate(req.params.document_id, data);

  delete req.session.data.document;

  req.flash('success', 'Document approved');

  res.redirect('/documents/' + req.params.document_id);
};

exports.document_schedule_get = function(req, res) {
  const documentData = Documents.findById(req.params.document_id);

  res.render('../views/documents/schedule', {
    document: documentData,
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id + '/schedule'
    }
  });
};

exports.document_schedule_post = function(req, res) {
  // res.send('NOT IMPLEMENTED: Schedule document POST');
  // Documents.findByIdAndUpdate();
  // delete req.session.data.document;
  // req.flash('success', 'Document scheduled for publishing');
  res.redirect('/documents/' + req.params.document_id);
};

exports.document_stop_schedule_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Stop schedule document GET');
  // res.render('../views/documents/schedule', {
  //   actions: {
  //     back: '/documents/' + req.params.document_id,
  //     save: '/documents/' + req.params.document_id + '/schedule'
  //   }
  // });
};

exports.document_stop_schedule_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Stop schedule document POST');
  // Documents.findByIdAndUpdate();
  // delete req.session.data.document;
  // req.flash('success', 'Document scheduled publishing stopped');
  // res.redirect('/documents/' + req.params.document_id);
};

exports.document_preview_get = function(req, res) {
  const documentData = Documents.findById(req.params.document_id);

  res.render('../views/documents/preview', {
    document: documentData,
    actions: {
      back: '/documents/' + req.params.document_id
    }
  });
};

exports.document_preview_post = function(req, res) {
  // res.send('NOT IMPLEMENTED: Preview document POST');

  res.redirect('/documents/' + req.params.document_id);
};

exports.document_publish_get = function(req, res) {
  const documentData = Documents.findById(req.params.document_id);

  res.render('../views/documents/publish', {
    document: documentData,
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id + '/publish'
    }
  });
};

exports.document_publish_post = function(req, res) {

  Documents.findByIdAndUpdate(req.params.document_id, req.session.data);

  // clean out the data as we don't need it
  delete req.session.data.document;

  req.flash('success', 'Document published');

  res.redirect('/documents/' + req.params.document_id);
};

exports.document_delete_draft_get = function(req, res) {
  const documentData = Documents.findById(req.params.document_id);

  res.render('../views/documents/delete', {
    document: documentData,
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id + '/delete'
    }
  });
};

exports.document_delete_draft_post = function(req, res) {
  delete req.session.data.document;
  req.flash('success', 'Document draft deleted');
  res.redirect('/documents');
};

exports.document_withdraw_get = function(req, res) {
  const documentData = Documents.findById(req.params.document_id);

  res.render('../views/documents/withdraw', {
    document: documentData,
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id + '/withdraw'
    }
  });
};

exports.document_withdraw_post = function(req, res) {
  Documents.findByIdAndUpdate(req.params.document_id, req.session.data);
  delete req.session.data.document;
  req.flash('success', 'Document withdrawn');
  res.redirect('/documents/' + req.params.document_id);
};

exports.document_undo_withdraw_get = function(req, res) {
  const documentData = Documents.findById(req.params.document_id);

  res.render('../views/documents/undo-withdraw', {
    document: documentData,
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id + '/undo-withdraw'
    }
  });
};

exports.document_undo_withdraw_post = function(req, res) {
  Documents.findByIdAndUndoWithdrawal(req.params.document_id, req.session.data);
  delete req.session.data.document;
  req.flash('success', 'Document unwithdrawn');
  res.redirect('/documents/' + req.params.document_id);
};

exports.document_remove_get = function(req, res) {
  const documentData = Documents.findById(req.params.document_id);

  res.render('../views/documents/remove', {
    document: documentData,
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id + '/remove'
    }
  });
};

exports.document_remove_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Remove document POST');

  // res.redirect('/documents');
};

exports.document_change_note_get = function(req, res) {
  const documentData = Documents.findById(req.params.document_id);

  res.render('../views/documents/change-note', {
    document: documentData,
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id + '/change-note'
    }
  });
};

exports.document_change_note_post = function(req, res) {
  Documents.findByIdAndUpdate(req.params.document_id, req.session.data);
  req.flash('success', 'Change note added');
  res.redirect('/documents/' + req.params.document_id);
};

exports.document_nations_get = function(req, res) {
  const documentData = Documents.findById(req.params.document_id);

  res.render('../views/documents/nations', {
    document: documentData,
    actions: {
      back: '/documents/' + req.params.document_id,
      save: '/documents/' + req.params.document_id + '/nations'
    }
  });
};

exports.document_nations_post = function(req, res) {
  Documents.findByIdAndUpdateNationalApplicability(req.params.document_id, req.session.data);
  delete req.session.data.document;
  req.flash('success', 'Nations covered updated');
  res.redirect('/documents/' + req.params.document_id);
};
