const connection = require('../model/connection');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

require('dotenv').config();

module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.PASSPORT_SECRET;
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        let sqlQuery=`SELECT users.* FROM users
                     LEFT JOIN designations ON users.designation_id=users.id where users.id=?`;
        connection.query(sqlQuery,[jwt_payload.id],function(err,result){
            if (err) {
                return done(err, false);
            }
            if (result.length>0) {
                delete result[0].password;
                done(null, result[0]);
            } else {
                done(null, false);

            }
        });
    }));

    //admin-strategy
    passport.use('admin',new JwtStrategy(opts, function(jwt_payload, done) {
        let sqlQuery=`SELECT admins.* FROM admins where admins.id=?`;
        connection.query(sqlQuery,[jwt_payload.id],function(err,result){
            if (err) {
                return done(err, false);
            }
            if (result.length>0) {
                delete result[0].password;
                done(null, result[0]);
            } else {
                done(null, false);

            }
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
};