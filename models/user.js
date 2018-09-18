const passportLocalMongoose = require('passport-local-mongoose'),
      mongoose              = require('mongoose');

// create user Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// take our passportLocalMongoose package and add it's methods to the user Schema
userSchema.plugin(passportLocalMongoose);

// export User model
module.exports = mongoose.model('User', userSchema);