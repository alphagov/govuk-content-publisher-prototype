const path = require('path');
const marked = require('marked');

module.exports = {

  getHtmlFromMarkdown: function(filename) {
    if (!filename)
      return null;

    let fs = require('fs');

  	let doc = fs.readFileSync(path.join(__dirname, 'content', filename + '.md'), 'utf8');
    return html = marked(doc);
  }

}
