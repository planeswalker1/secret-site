const express                = require('express'),
      app                    = express(),
      mongoose               = require('mongoose'),
      bodyParser             = require('body-parser'),
      expressSession         = require('express-session'),
      passport               = require('passport'),
      LocalStrategy          = require('passport-local'),
      User                   = require('./models/user'),
      PORT                   = process.env.PORT || 3000;

// ==========
// APP CONFIG
// ==========

// connect to mongodb
mongoose.connect('mongodb://localhost/authentication', { useNewUrlParser: true });
// tell express to use public folder
app.use(express.static(__dirname + '/public'));
// set files to use ejs
app.set('view engine', 'ejs');
// tell express to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// ===============
// PASSPORT CONFIG
// ===============

// tell express to use express-session
app.use(expressSession({
  // string to encode and decode the session
  // Could be any combination of words
  secret: 'Daniel is the best programmer in the world',
  // required properties
  resave: false,
  saveUninitialized: false
}));
// tell express to use passport
app.use(passport.initialize());
app.use(passport.session());
// tell passport to use LocalStrategy for User.authenticate()
passport.use(new LocalStrategy(User.authenticate()));
// encoding the session and putting it back in the session
passport.serializeUser(User.serializeUser());
// reading the session (taking the data from the session that's encoded and unencoding it)
passport.deserializeUser(User.deserializeUser());

// ==========
// MIDDLEWARE
// ==========

// pass req.user to every template
app.use(function (req, res, next) {
  // whatever we put in res.locals is what's available inside our templates
  res.locals.currentUser = req.user;
  // run next code
  next();
});

// check if a user is logged in
function isLoggedIn (req, res, next) {
  // passport check
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// ======
// ROUTES
// ======

// root route - show home page
app.get('/', function (req, res) {;
  res.render('home');
});

// secret route - show secret page
app.get('/secret', isLoggedIn, function (req, res) {
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
  // make new user object
  User.register(new User({
    // pass in the username
    username: req.body.username
    // pass the password as a second argument
    // User.register will hash password and store that into the db
    // if everything goes well, callback will return a new user that has a username and the hashed password
  }), req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    } else {
      // log the user in
      passport.authenticate('local')(req, res, function () {
        // redirect to /secret
        res.redirect('/secret');
      });
    }
  });
});

// ============
// LOGIN ROUTESS
// ============

// login route - show login form
app.get('/login', function (req, res) {
  res.render('login');
});

// login route - Handle user login form
// passport will check login
app.post('/login', passport.authenticate('local', {
  // if login works redirect to
  successRedirect: '/secret',
  // if login doesn't work redirect to
  failureRedirect: '/login'
}), function (req, res) {
});

// logout route - log out user
app.get('/logout', function (req, res) {
  // passport is going to delete User data in the session
  req.logout();
  res.redirect('/');
});

// ============
// LOCAL SERVER
// ============

// tell express to listen for requests on PORT
app.listen(PORT, function () {
  console.log('listening on port ' + PORT);
});