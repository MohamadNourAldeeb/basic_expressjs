import { Strategy as GoogleStrategy } from "passport-google-oauth2"; //
import dotenv from "dotenv"; 
dotenv.config({ path: "../.env" });
let authenticationLogicGoogle = async (req, token, refresh, profile, done) => {
	try {
		return done(null, profile);
	} catch (error) {
		return done(error, false);
	}
};
export default (passport) => {
	// OAuth Google
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID.toString(),
				clientSecret: process.env.GOOGLE_CLIENT_SECRET.toString(),
				callbackURL: "/oauth2/redirect/google",
				passReqToCallback: true,
			},
			authenticationLogicGoogle
		)
	);
};
