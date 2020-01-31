const moment = require('moment');
// Moment complains about RFC2822/ISO date not being correct
moment.suppressDeprecationWarnings = true;

const numeral = require('numeral');

const TurndownService = require('turndown');

const mimetypes = require('./data/mimetypes.json');
const languages = require('./data/languages.json');

module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
   let filters = {}

   /* ------------------------------------------------------------------
     date filter for use in Nunjucks
     example: {{ params.date | date("DD/MM/YYYY") }}
     outputs: 01/01/1970
   ------------------------------------------------------------------ */
   filters.date = function(timestamp, format) {
     return moment(timestamp).format(format);
   }

   /* ------------------------------------------------------------------
     dateAdd filter for use in Nunjucks
     example: {{ '1970-01-01' | dateAdd(1, 'weeks') | date("DD/MM/YYYY") }}
     outputs: 08/01/1970
   ------------------------------------------------------------------ */
   filters.dateAdd = function(date, num, unit='days') {
     return moment(date).add(num, unit).toDate();
   }

   /* ------------------------------------------------------------------
     utility date functions
   ------------------------------------------------------------------ */
   filters.govDate = function(timestamp) {
     return moment(timestamp).format('D MMMM YYYY');
   }

   filters.govShortDate = function(timestamp) {
     return moment(timestamp).format('D MMM YYYY');
   }

   filters.govTime = function(timestamp) {
     let t = moment(timestamp);
     if(t.minutes() > 0) {
       return t.format('h:mma');
     } else {
       return t.format('ha');
     }
   }

  /* ------------------------------------------------------------------
   numeral filter for use in Nunjucks
   example: {{ params.number | numeral("0,00.0") }}
   outputs: 1,000.00
  ------------------------------------------------------------------ */
  filters.numeral = function(number, format) {
   return numeral(number).format(format);
  }

 /* ------------------------------------------------------------------
  language filter for use in Nunjucks
  example: {{ "en" | language }}
  outputs: English
 ------------------------------------------------------------------ */
 filters.language = function(code, type = 'english_name') {
   if (!code)
     return null;

   let language = languages.filter( (obj) =>
     obj.code == code
   )[0];

   return language[type];
 }

  /* ------------------------------------------------------------------
   document type filter for use in Nunjucks
   example: {{ 'news_story' | documentType }}
   outputs: "News story"
  ------------------------------------------------------------------ */
  filters.documentType = function(type) {

    switch (type) {
      case 'articles_correspondence': return 'Articles and correspondence';
      case 'authored_article': return 'Authored article';
      case 'case_study': return 'Case study';
      case 'consultation': return 'Consultation';
      case 'corporate_information': return 'Corporate information';
      case 'corporate_report': return 'Corporate report';
      case 'correspondence': return 'Correspondence';
      case 'decision': return 'Decision';
      case 'detailed_guide': return 'Detailed guide';
      case 'fatality_notice': return 'Fatality notice';
      case 'foi_release': return 'FOI release';
      case 'form': return 'Form';
      case 'guidance': return 'Guidance';
      case 'guidance_regulation': return 'Guidance and regulation';
      case 'impact_assessment': return 'Impact assessment';
      case 'independent_report': return 'Independent report';
      case 'international_treaty': return 'International treaty';
      case 'manuals': return 'Manuals';
      case 'map': return 'Map';
      case 'national_statistics': return 'National statistics';
      case 'news_communications': return 'News and communications';
      case 'news_story': return 'News story';
      case 'non_statutory_guidance': return 'Non-statutory guidance';
      case 'not_sure': return 'I’m not sure if this should be on GOV.UK';
      case 'notice': return 'Notice';
      case 'official_statistics': return 'Official statistics';
      case 'oral_statement': return 'Oral statement to Parliament';
      case 'policy_consultation': return 'Policy or consultation';
      case 'policy_paper': return 'Policy paper';
      case 'press_release': return 'Press release';
      case 'regulation': return 'Regulation';
      case 'research_analysis': return 'Research and analysis';
      case 'speech': return 'Speech';
      case 'statement_to_parliament': return 'Statement to Parliament';
      case 'statistics_announcement': return 'Statistics announcement';
      case 'statistical_dataset': return 'Statistical dataset';
      case 'statutory_guidance': return 'Statutory guidance';
      case 'transparency_statistics': return 'Transparency and statistics';
      case 'transparency': return 'Transparency';
      case 'written_statement': return 'Written statement to parliament';
      default: return type;
    }

  }

  /* ------------------------------------------------------------------
   attachment type filter for use in Nunjucks
   example: {{ 'file' | attachmentType }}
   outputs: "File attachment"
  ------------------------------------------------------------------ */
  filters.attachmentType = function(type) {

    switch (type) {
      case 'file': return 'File attachment';
      case 'external': return 'External link';
      case 'html': return 'HTML attachment';
      default: return type;
    }

  }

  /* ------------------------------------------------------------------
   document status filter for use in Nunjucks
   example: {{ 'submitted_for_review' | documentStatus }}
   outputs: "Submitted for 2i review"
  ------------------------------------------------------------------ */
  filters.documentStatus = function(status) {

    switch (status) {
      case 'draft': return 'Draft';
      case 'submitted_for_review': return 'Submitted for 2i review';
      case 'scheduled': return 'Scheduled to publish';
      case 'published': return 'Published';
      case 'published_but_needs_2i': return 'Published but needs 2i review';
      case 'withdrawn': return 'Withdrawn';
      case 'removed': return 'Removed';
      case 'failed_to_publish': return 'Failed to publish';
      default: return status;
    }

  }

  /* ------------------------------------------------------------------
   strip HTML filter for use in Nunjucks
   example: {{ '<p>Hello world</p>' | stripHtml }}
   outputs: "Hello world"
  ------------------------------------------------------------------ */
  filters.stripHtml = function(html) {
    if (!html)
      return null;

    return html.replace(/<[^>]*>/g,'');
  }

  /* ------------------------------------------------------------------
   absoluteUrl filter for use in Nunjucks
   example: {{ '/browse' | absoluteUrl }}
   outputs: "https://www.gov.uk/browse"
  ------------------------------------------------------------------ */
  filters.absoluteUrl = function(path, domain) {
    if (!path)
      return path;

    if (!domain)
      domain = 'https://www.gov.uk';

    return domain + path;
  }

  /* ------------------------------------------------------------------
   toMarkdown filter for use in Nunjucks
   example: {{ '<h1>Lorem ipsum</h1>' | toMarkdown }}
   outputs: "# Lorem ispum"
  ------------------------------------------------------------------ */
  filters.toMarkdown = function(html) {
    if (!html)
      return html;

    let turndownService = new TurndownService();

    return turndownService.turndown(html);
  }

  /* ------------------------------------------------------------------
   utility functions to determine file size
  ------------------------------------------------------------------ */
  filters.fileSizeFormat = function(input, binary) {
  	let kwargs = getKwargs(arguments);
  	binary = (kwargs.binary !== undefined) ? kwargs.binary : binary;

  	let base = binary ? 1024 : 1000;
  	let bytes = parseFloat(input);
  	let units = [
  		'Bytes',
  		(binary ? 'KiB' : 'KB'),
  		(binary ? 'MiB' : 'MB'),
  		(binary ? 'GiB' : 'GB'),
  		(binary ? 'TiB' : 'TB'),
  		(binary ? 'PiB' : 'PB'),
  		(binary ? 'EiB' : 'EB'),
  		(binary ? 'ZiB' : 'ZB'),
  		(binary ? 'YiB' : 'YB')
  	];

  	if (bytes === 1) {
  		return '1 Byte';
  	} else if (bytes < base) {
  		return bytes + ' Bytes';
  	} else {
  		return units.reduce(function (match, unit, index) {
  			let size = Math.pow(base, index);
  			if (bytes >= size) {
  				return (bytes/size).toFixed(1) + ' ' + unit;
  			}
  			return match;
  		});
  	}
  }

  function getKwargs(args) {
  	let kwargs = [].pop.call(args);
  	return (typeof kwargs === 'object' && kwargs.__keywords) ? kwargs : {};
  }

  /* ------------------------------------------------------------------
    utility functions to determine document content type
  ------------------------------------------------------------------ */
  filters.parseContentType = function(type, attribute = 'abbreviation') {

    if (!type)
      return null;

    let mimetype = mimetypes.filter( (obj) =>
      obj.type == type
    )[0];

    return mimetype[attribute];

  }

  /* ------------------------------------------------------------------
    utility function to slugify text in Nunjucks
    example: {{ "This is some text" | slugify }}
    outputs: this-is-some-text
  ------------------------------------------------------------------ */
  filters.slugify = function(text) {

    if (!text)
      return null;

    return text.toLowerCase()
            .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
            .replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
            .replace(/^-+|-+$/g, ''); // remove leading, trailing -

  }

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
