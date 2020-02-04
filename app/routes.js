const express = require('express');
const passport = require('passport');
const router = express.Router();

// Require controller modules.
var authentication_controller = require('./controllers/authentication');
var document_controller = require('./controllers/documents');
var edition_controller = require('./controllers/editions');
var attachment_controller = require('./controllers/attachments');

function checkIsAuthenticated(req, res, next) {
  if (req.session.passport || req.session.data.user) {
    req.session.data.user = req.session.passport.user;
    next();
  } else {
    res.redirect('/sign-in');
  }
}

// GET home page.
router.get('/', checkIsAuthenticated, function(req, res) {
  delete req.session.data.username;
  delete req.session.data.password;
  res.redirect('/documents');
});

/// --------------------------------------------------///
/// AUTHENTICATION ROUTES ///
/// --------------------------------------------------///

router.get('/sign-in', authentication_controller.sign_in_get);

router.post('/sign-in', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/sign-in', failureFlash: 'Missing credentials' }));

router.get('/sign-out', authentication_controller.sign_out_get);

/// --------------------------------------------------///
/// DOCUMENT ROUTES ///
/// --------------------------------------------------///

router.get('/documents/super-type', checkIsAuthenticated, document_controller.document_create_super_type_get);

router.get('/documents/type', checkIsAuthenticated, document_controller.document_create_type_get);

router.get('/documents/sub-type', checkIsAuthenticated, document_controller.document_create_sub_type_get);

// GET request for creating a Document. NOTE This must come before routes that display Document (uses id).
router.get('/documents/create', checkIsAuthenticated, document_controller.document_create_get);

// POST request for creating Document.
router.post('/documents/create', checkIsAuthenticated, document_controller.document_create_post);

// GET request to delete Document.
router.get('/documents/:id/delete', checkIsAuthenticated, document_controller.document_delete_get);

// POST request to delete Document.
router.post('/documents/:id/delete', checkIsAuthenticated, document_controller.document_delete_post);

// GET request to update Document.
router.get('/documents/:id/update', checkIsAuthenticated, document_controller.document_update_get);

// POST request to update Document.
router.post('/documents/:id/update', checkIsAuthenticated, document_controller.document_update_post);

// GET request for one Document.
router.get('/documents/:id', checkIsAuthenticated, document_controller.document_summary_get);

// GET request for one Document.
router.get('/documents/:id/history', checkIsAuthenticated, document_controller.document_history_get);

// HACK: to load document from session data
router.get('/documents/:id/load', checkIsAuthenticated, document_controller.document_load);



router.get('/documents/:id/content', checkIsAuthenticated, document_controller.document_update_get);

router.get('/documents/:id/images', checkIsAuthenticated, document_controller.document_images_update_get);

router.get('/documents/:id/topics', checkIsAuthenticated, document_controller.document_topics_update_get);

router.get('/documents/:id/tags', checkIsAuthenticated, document_controller.document_tags_update_get);

router.get('/documents/:id/political', checkIsAuthenticated, document_controller.document_political_update_get);


router.post('/documents/:id/new', checkIsAuthenticated, document_controller.document_new_edition_post);

router.get('/documents/:id/review', checkIsAuthenticated, document_controller.document_review_post);

router.get('/documents/:id/new', checkIsAuthenticated, document_controller.document_new_edition_get);

router.get('/documents/:id/review', checkIsAuthenticated, document_controller.document_review_get);

router.get('/documents/:id/approve', checkIsAuthenticated, document_controller.document_approve_get);

router.get('/documents/:id/schedule', checkIsAuthenticated, document_controller.document_schedule_get);

router.get('/documents/:id/preview', checkIsAuthenticated, document_controller.document_preview_get);

router.get('/documents/:id/publish', checkIsAuthenticated, document_controller.document_publish_get);

router.get('/documents/:id/delete', checkIsAuthenticated, document_controller.document_delete_draft_get);

router.get('/documents/:id/withdraw', checkIsAuthenticated, document_controller.document_withdraw_get);

router.get('/documents/:id/undo-withdraw', checkIsAuthenticated, document_controller.document_undo_withdraw_get);

router.get('/documents/:id/remove', checkIsAuthenticated, document_controller.document_remove_get);

// GET request for list of all Document items.
router.get('/documents', checkIsAuthenticated, document_controller.document_list);

/// --------------------------------------------------///
// DOCUMENT ATTACHMENTS MODAL ROUTES //
/// --------------------------------------------------///

// GET request for creating an attachment. NOTE This must come before routes that display attachment (uses id).
router.get('/documents/:document_id/attachments/modal/create', checkIsAuthenticated, attachment_controller.attachment_create_get);

// POST request for creating an attachment.
router.post('/documents/:document_id/attachments/modal/create', checkIsAuthenticated, attachment_controller.attachment_create_post);

// GET request to delete an attachment.
router.get('/documents/:document_id/attachments/:attachment_id/modal/delete', checkIsAuthenticated, attachment_controller.attachment_delete_get);

// POST request to delete an attachment.
router.post('/documents/:document_id/attachments/:attachment_id/modal/delete', checkIsAuthenticated, attachment_controller.attachment_delete_post);

// GET request to update an attachment.
router.get('/documents/:document_id/attachments/:attachment_id/modal/update', checkIsAuthenticated, attachment_controller.attachment_update_get);

// POST request to update an attachment.
router.post('/documents/:document_id/attachments/:attachment_id/modal/update', checkIsAuthenticated, attachment_controller.attachment_update_post);

// GET request to update an attachment's metadata.
router.get('/documents/:document_id/attachments/:attachment_id/modal/metadata', checkIsAuthenticated, attachment_controller.attachment_update_metadata_get);

// POST request to update an attachment's metadats.
router.post('/documents/:document_id/attachments/:attachment_id/modal/metadata', checkIsAuthenticated, attachment_controller.attachment_update_metadata_post);

// GET request to preview an attachment.
router.get('/documents/:document_id/attachments/:attachment_id/modal/preview', checkIsAuthenticated, attachment_controller.attachment_preview);

// GET request to preview an attachment.
router.get('/documents/:document_id/attachments/:attachment_id/modal/download', checkIsAuthenticated, attachment_controller.attachment_download);

// GET request for one attachment.
router.get('/documents/:document_id/attachments/:attachment_id/modal/', checkIsAuthenticated, attachment_controller.attachment_detail);

// GET request for list of all attachment items.
router.get('/documents/:document_id/attachments/modal/', checkIsAuthenticated, attachment_controller.attachment_list);


/// --------------------------------------------------///
// DOCUMENT ATTACHMENTS ROUTES //
/// --------------------------------------------------///

// GET request for creating an attachment. NOTE This must come before routes that display attachment (uses id).
router.get('/documents/:document_id/attachments/create', checkIsAuthenticated, attachment_controller.attachment_create_get);

// POST request for creating an attachment.
router.post('/documents/:document_id/attachments/create', checkIsAuthenticated, attachment_controller.attachment_create_post);

// GET request for list of all attachment items.
router.get('/documents/:document_id/attachments/reorder', checkIsAuthenticated, attachment_controller.attachment_list_reorder_get);

// GET request for list of all attachment items.
router.post('/documents/:document_id/attachments/reorder', checkIsAuthenticated, attachment_controller.attachment_list_reorder_post);

// GET request to delete an attachment.
router.get('/documents/:document_id/attachments/:attachment_id/delete', checkIsAuthenticated, attachment_controller.attachment_delete_get);

// POST request to delete an attachment.
router.post('/documents/:document_id/attachments/:attachment_id/delete', checkIsAuthenticated, attachment_controller.attachment_delete_post);

// GET request to update an attachment.
router.get('/documents/:document_id/attachments/:attachment_id/update', checkIsAuthenticated, attachment_controller.attachment_update_get);

// POST request to update an attachment.
router.post('/documents/:document_id/attachments/:attachment_id/update', checkIsAuthenticated, attachment_controller.attachment_update_post);

// GET request to update an attachment's metadata.
router.get('/documents/:document_id/attachments/:attachment_id/metadata', checkIsAuthenticated, attachment_controller.attachment_update_metadata_get);

// POST request to update an attachment's metadats.
router.post('/documents/:document_id/attachments/:attachment_id/metadata', checkIsAuthenticated, attachment_controller.attachment_update_metadata_post);

// GET request to preview an attachment.
router.get('/documents/:document_id/attachments/:attachment_id/preview', checkIsAuthenticated, attachment_controller.attachment_preview);

// GET request to preview an attachment.
router.get('/documents/:document_id/attachments/:attachment_id/download', checkIsAuthenticated, attachment_controller.attachment_download);

// GET request for one attachment.
router.get('/documents/:document_id/attachments/:attachment_id/', checkIsAuthenticated, attachment_controller.attachment_detail);

// GET request for list of all attachment items.
router.get('/documents/:document_id/attachments', checkIsAuthenticated, attachment_controller.attachment_list);


/// --------------------------------------------------///
// DOCUMENT EDITION ROUTES //
/// --------------------------------------------------///

// GET request for creating a document edition. NOTE This must come before routes that display document edition (uses edition_id).
router.get('/documents/:document_id/editions/create', edition_controller.edition_create_get);

// POST request for creating document edition.
router.post('/documents/:document_id/editions/create', edition_controller.edition_create_post);

// GET request to delete document edition.
router.get('/documents/:document_id/editions/:edition_id/delete', edition_controller.edition_delete_get);

// POST request to delete document edition.
router.post('/documents/:document_id/editions/:edition_id/delete', edition_controller.edition_delete_post);

// GET request to update document edition.
router.get('/documents/:document_id/editions/:edition_id/update', edition_controller.edition_update_get);

// POST request to update document edition.
router.post('/documents/:document_id/editions/:edition_id/update', edition_controller.edition_update_post);

// GET request for one document edition.
router.get('/documents/:document_id/editions/:edition_id/', edition_controller.edition_detail);

// GET request for list of all document items.
router.get('/documents/:document_id/editions', edition_controller.edition_list);


/// --------------------------------------------------///
// DOCUMENT REVISION ROUTES //
/// --------------------------------------------------///




/// --------------------------------------------------///
// CHANGELOG ROUTES //
/// --------------------------------------------------///
router.use(/\/changelog/, (req, res, next) => {
  require(`./views/changelog/routes`)(req, res, next);
});

module.exports = router
