// load the things we need
var mongoose = require('mongoose'); // imports the mongoose module which  can be used to define a schema
var bcrypt   = require('bcrypt-nodejs'); //package used to make secure passwords, currently deprecated but still works

// define the schema for our user model
var userSchema = mongoose.Schema({ //when you create a new user in the passport module, this is what defines what the new user will look like

    local            : {// in the users collection that stores the users, it will have an object named "local"  that has email and password properties
        email        : String,
        password     : String
    },
    facebook         : {      //not useful unless you want to tie in facebook logins
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// generating a hash
userSchema.methods.generateHash = function(password) {   //this comes from the bcypt module we imported earlier, it creates an encryption for your passwords
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {// runs your input through the same function, if it comes out to the encrypted password, that means you inputed the right password
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);// will export a function called "User" that is the userSchema function defined above
