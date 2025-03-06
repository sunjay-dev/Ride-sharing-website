const passport = require("passport");
const AzureOAuth2Strategy = require("passport-azure-ad-oauth2").Strategy;
require("dotenv").config();
const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");

passport.use(
    new AzureOAuth2Strategy(
        {
            clientID: process.env.MICROSOFT_CLIENT_ID,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
            callbackURL: `${process.env.CLIENT_URL}/auth/microsoft/callback`,
            scope: ["openid", "profile", "email"],
            authorizationURL: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
            tokenURL: "https://login.microsoftonline.com/common/oauth2/v2.0/token"
        },
        async (accessToken, refreshToken, params, profile, done) => {
            try {
            
                const decodedToken = jwt.decode(params.id_token);
                if (!decodedToken || !decodedToken.email) {
                    return done(null, false, { message: "Invalid authentication token" });
                }
                const email = decodedToken.email;

                if (!email.endsWith("@students.muet.edu.pk")) {
                    return done(null, false, { message: "Only MUET students can log in" });
                }

                const user = await userModel.findOne({ email });

                if (!user) {
                    return done(null, false, { message: "No account found. Please sign up first." });
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

module.exports = passport;
