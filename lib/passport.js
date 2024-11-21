// lib/passport.js

import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
// import LinkedInStrategy from 'passport-linkedin-oauth2';
import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.ENV_FILE || '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
console.log(`Loaded Google Callback URL: ${process.env.NEXT_PUBLIC_API_FRONT}`);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.NEXT_PUBLIC_API_FRONT}/api/auth/google/callback`
}, function(token, tokenSecret, profile, done) {
    return done(null, profile);
}));

// passport.use(new LinkedInStrategy({
//     clientID: process.env.LINKEDIN_CLIENT_ID,
//     clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/api/auth/linkedin/callback",
//     scope: ['r_emailaddress', 'r_liteprofile'],
// }, function(token, tokenSecret, profile, done) {
//     return done(null, profile);
// }));

export default passport;
