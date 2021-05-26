const jwtModel = require('../models/auth-jwt');

//used passportjs library for jwt authentication
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

//used Bearer authentication strategy
module.exports = function(passport) {
    passport.use(
        new JwtStrategy(
            {
                secretOrKey: process.env.JWT_AUTH_SECRET_KEY,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true
            },
            async function(request, jwt_payload,callback) {
                const authHeader = request.headers['authorization'];
                const token = authHeader && authHeader.split(' ')[1];
                if(token === null) {
                    return callback(null,false);
                }
                let verifiedId = await jwtModel.verifyJwtAuth(jwt_payload.user_id,token);
                if(verifiedId === null) {
                    return callback(null,false);
                }
                else if(verifiedId.user_id !== undefined) {
                    return callback(null,true);
                } else {
                    return callback(verifiedId,false);
                }
            }
        )
    )
}