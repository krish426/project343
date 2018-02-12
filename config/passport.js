const passport = require('passport'),
      Strategy = require('passport-local').Strategy,
      datatable = require('../models/user');


//Passport Strategy
passport.use(new Strategy(function(username, password, done){
    datatable.findOne({username:username},function(err,user){
        if(err) return done(err);
        if(!user){
            return done(null,false);
        }
        if(!user.comparePassword(password)){
            return done(null,false);
        }
        return done(null,user);
    });
}));

//passport Serialization
passport.serializeUser(function(user,done){
    done(null,user._id);
});

//passport Deserialize
passport.deserializeUser(function(id,done){
    datatable.findById(id,function(err,user){
        if(err) return done(err);
        done(null,user);
    })
});

module.exports = passport;
