'use strict'

const express = require('express');
const router = express.Router();

// content functions
const content = require('./content');

router.get('/history-mode', (req, res) => {
  res.render('./changelog/content', {
    title: 'History mode',
    content: content.getHtmlFromMarkdown('history-mode')
  });
});

router.get('/document-history', (req, res) => {
  res.render('./changelog/content', {
    title: 'Document history',
    content: content.getHtmlFromMarkdown('document-history')
  });
});

module.exports = router
