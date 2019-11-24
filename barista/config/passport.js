// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;//another module that you have to import from npm, passport-Strategy is actually a dependency of the passport-local module


// load up the user model
var User       		= require('../app/models/user');//importing the design we want to use to make or check users by

// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);//basically this fUnctionality takes on of the values (keys) of your user object from the database and stores it in your current session so it can be used later on to be able to access the entire user object that has info on the user like email, password, id, etc
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user); //the "user" argument here is the user.id argument from above, its used to go to the database and pull the entire user object
        });
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({ //basically since we have a signup and a login, we need two different methods defined in the passport object, one for "local-login", the other for "local-signup"
        // by default, passport's local strategy expects username and password, we will override "username" with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { //this is for when somebody is trying to sign up

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to signup already exists
        User.findOne({ 'local.email' :  email }, function(err, user) { //in the collections, look for an email address in the "local" object with "email" properties, because we don't want people to use the same emails
            // if there are any errors, return the error
            if (err)
                return done(err); //done is kinda like saying do the next thing

            // check to see if theres already a user with that email
            if (user) {// if the "user" response from above exists ie. there's no error
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

				// if there is no user with that email
                // create the user
                var newUser            = new User(); //user contains the design template for making a new user

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password); // this is where the encryption happens

				// save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({ //basically since we have a signup and a login, we need two different methods defined in the passport object, one for "local-login", the other for "local-signup"
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email', //same as above, we need to redefine what the passport is looking to verify because by default it expects websites to use usernames
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {//checks in the collection's "local" object for a "email" property with the value of the input
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))//this method comes from the bcrypt module in user.js
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));

};
