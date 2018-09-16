const express                = require('express'),
      app                    = express(),
      bodyParser             = require('body-parser'),
      PORT                   = 3000;

// ==========
// APP CONFIG
// ==========

// set files to use ejs
app.set('view engine', 'ejs');
// tell express to use public folder
app.use(express.static(__dirname + '/public'));
// tell express to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// ======
// ROUTES
// ======

// root route - show home page
app.get('/', function (req, res) {;
  res.render('home');
});

// secret route - show secret page
app.get('/secret', function (req, res) {
  res.render('secret');
});

// ===========
// AUTH ROUTES
// ===========

// register route - Show sign up form
app.get('/register', function (req, res) {
  res.render('register');
});

// register route - Handle user sign up form
app.post('/register', function (req, res) {
  console.log('username: ', req.body.username);
  res.send('Hit register post route');
});

// ============
// LOGIN ROUTESS
// ============

// login route - show login form
app.get('/login', function (req, res) {
  res.render('login');
});

// login route - Handle user login form
app.post('/login', function (req, res) {
  res.send('Hit login post route');
});

// logout route - log out user
app.get('/logout', function (req, res) {
  res.send('Logged out');
});

// ============
// LOCAL SERVER
// ============

// tell express to listen for requests on PORT
app.listen(PORT, function () {
  console.log('listening on port ' + PORT);
});