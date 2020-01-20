# Passport JS

This prototype uses [Passport](http://www.passportjs.org/), the [passport-local](https://www.npmjs.com/package/passport-local) strategy, and [connect-flash](https://www.npmjs.com/package/connect-flash) packages to manage user authentication.

Install the packages with the following commands:
```
$ npm install connect-flash --save
```

And
```
$ npm install passport --save
```

And
```
$ npm install passport-local --save
```

## Server.js

In `server.js` require both `connect-flash` and `passport`:
```
const flash = require('connect-flash');
```

```
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('./app/data/users.json');
```

After initialising the app `const app = express()`, include the following:
```
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// Authentication
passport.use(new LocalStrategy(
  function (username, password, done) {
    const user = Users.find(user => user.username === username && user.password === password && user.active === true);
    if (user) { return done(null, user); }
    return done(null, false);
  }
));

app.use(passport.initialize());
app.use(passport.session());
```

And `connect-flash`:
```
app.use(flash());
```

## Routes

Require passport:
```
const passport = require('passport');
```

Require an authentication controller to manage sign in and sign out, for example:
```
var authentication_controller = require('./controllers/authentication');
```

Create a function to check the user is authenticated, for example:
```
function checkIsAuthenticated(req, res, next) {
  if (req.session.passport || req.session.data.user) {
    req.session.data.user = req.session.passport.user;
    next();
  } else {
    res.redirect('/sign-in');
  }
}
```

Use this function in your route declarations, for example:
```
router.get('/documents', checkIsAuthenticated, document_controller.document_list);
```

## Authentication controller

The authentication controller contains the following to manage sign in and out:
```
const flash = require('connect-flash');

var Authentication = require('../models/authentication');

exports.sign_in_get = function(req, res) {
  if (req.session.passport || req.session.data.user) {
    res.redirect('/');
  } else {
    let errorMessage = req.flash();
    res.render('../views/auth/sign-in', errorMessage);
  }
};

exports.sign_out_get = function(req, res) {
  delete req.session.data;
  delete req.session.passport;
  res.redirect('/sign-in');
};
```

## Views

The sign in view contains two parts, the form and the error summary.

Error summary:
```
{%- if error | length %}
  {{ govukErrorSummary({
    titleText: "There is a problem",
    errorList: [
      {
        text: "Enter a valid email",
        href: "#username"
      },
      {
        text: "Enter a valid password",
        href: "#password"
      }
    ]
  }) }}
{% endif -%}
```

Form:
```
{{ govukInput({
  id: "username",
  name: "username",
  label: {
    text: "Email",
    classes: "govuk-label--s"
  },
  attributes: {
    autocomplete: "off",
    spellcheck: false
  },
  value: data.username,
  errorMessage: {
    text: "Enter a valid email"
  } if error | length
}) }}

{{ govukInput({
  id: "password",
  name: "password",
  type: "password",
  label: {
    text: "Password",
    classes: "govuk-label--s"
  },
  attributes: {
    autocomplete: "off",
    spellcheck: false
  },
  value: data.password,
  errorMessage: {
    text: "Enter a valid password"
  } if error | length
}) }}

{{ govukButton({
  text: "Sign in"
}) }}
```
