import session from "express-session";

export default session({
    secret: process.env.CSRFT_SESSION_SECRET,
    keys: ["session1"],
    resave: false,
    saveUninitialized: false,
    secret: true, // Ensures the browser only sends the cookie over HTTPS. false for localhost.
    cookie: {
        // maxAge: parseInt(process.env.CSRFT_EXPIRESIN), // Used for expiration time.
        sameSite: "strict", // Cookies will only be sent in a first-party context. 'lax' is default value for third-parties.
        // httpOnly: true, //Ensures the cookie is sent only over HTTP(S)
        domain: process.env.DOMAIN, //Used to compare against the domain of the server in which the URL is being requested.
    },
});
