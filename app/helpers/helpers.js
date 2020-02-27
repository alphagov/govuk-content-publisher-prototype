
exports.paginate = function(array, page_size, page_number) {
  --page_number; // because pages logically start with 1, but technically with 0
  return array.slice(page_number * page_size, (page_number + 1) * page_size);
};

exports.slugify = function(text) {
  if (!text)
    return null;
  return text.toLowerCase()
          .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
          .replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
          .replace(/^-+|-+$/g, ''); // remove leading, trailing -
};
