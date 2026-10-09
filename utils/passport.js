import passport from "passport";
import { User } from "../models/User.js";
import { Strategy as FaceBookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import { Strategy as GitHubStrategy } from "passport-github";

//google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET,
      callbackURL: `${process.env.SERVER_URI}/api/auth/v1/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email  = profile?.emails?.[0].value;
        if (!email) {
          return done(
            new Error("Google account is not associated with this profile"),
            null,
          );
        }
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            googleId: profile.id,
            email,
          });
        }
        if (!user.googleId) {
          user.googleId = profile.id;
        }
        await user.save();
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENTID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: `${process.env.SERVER_URI}/api/auth/v1/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile?.emails?.[0]?.value;
        if (!email) {
          return done(
            new Error("GitHub account is not associated with this profile"),
            null,
          );
        }
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile?.displayName,
            githubId: profile?.id,
          });
        }
        if (!user.githubId) {
          user.githubId = profile.id;
          await user.save();
        }
        done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

//facebook strategy
passport.use(
  new FaceBookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENTID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: `${process.env.SERVER_URI}/api/auth/v1/facebook/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile?.emails?.[0]?.value;
        if (!email) {
          return done(
            new Error("Facebook account is not associated with this profile"),
            null,
          );
        }
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile?.displayName,
            facebookId: profile?.id,
          });
        }
        if (!user.facebookId) {
          user.facebookId = profile.id;
          await user.save();
        }
        done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKED_CLIENTID,
      clientSecret: process.env.LINKEDIN_SECRET,
      callbackURL: `${process.env.SERVER_URI}/api/auth/v1/linkedin/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile?.email;
        if (!email) {
          return done(
            new Error("LinkedIn account is not associated with this profile"),
            null,
          );
        }
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile?.name,
            linkedinId: profile?.sub,
          });
        }
        if (!user.linkedinId) {
          user.linkedinId = profile?.sub;
          await user.save();
        }
        done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

export default passport;