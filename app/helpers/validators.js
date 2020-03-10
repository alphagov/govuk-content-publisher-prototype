
exports.isValidEmail = function(email) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let valid = true;

  valid = regex.test(email);

  return valid;
}

exports.isValidURL = function(url) {
  const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/igm;
  let valid = true;

  valid = regex.test(url);

  return valid;
}

// https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s13.html
exports.isValidISBN = function(isbn) {
  // Checks for ISBN-10 or ISBN-13 format
  const regex = /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;
  let valid = true;

  if (regex.test(isbn)) {
    // Remove non ISBN digits, then split into an array
    let chars = isbn.replace(/[- ]|^ISBN(?:-1[03])?:?/g, "").split("");
    // Remove the final ISBN digit from `chars`, and assign it to `last`
    let last = chars.pop();
    let sum = 0;
    let check, i;

    if (chars.length == 9) {
      // Compute the ISBN-10 check digit
      chars.reverse();
      for (i = 0; i < chars.length; i++) {
        sum += (i + 2) * parseInt(chars[i], 10);
      }
      check = 11 - (sum % 11);
      if (check == 10) {
        check = "X";
      } else if (check == 11) {
        check = "0";
      }
    } else {
      // Compute the ISBN-13 check digit
      for (i = 0; i < chars.length; i++) {
        sum += (i % 2 * 2 + 1) * parseInt(chars[i], 10);
      }
      check = 10 - (sum % 10);
      if (check == 10) {
        check = "0";
      }
    }

    if (check == last) {
      // Valid ISBN
      valid = true;
    } else {
      // Invalid ISBN check digit
      valid = false;
    }
  } else {
    // Invalid ISBN
    valid = false;
  }

  return valid;
}

exports.isValidUUID = function(uuid) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  let valid = true;

  valid = regex.test(uuid);

  return valid;
}

exports.isValidDate = function(date) {

}
