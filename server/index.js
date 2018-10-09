const bodyParser                          = require("body-parser");
const express                             = require("express");
const cookieParser                        = require("cookie-parser");
const expressApp                          = express();
const session                             = require("express-session");
const sessionMongoStore                   = require("connect-mongo")(session);
const localStrategy                       = require("passport-local");
const mongoose                            = require("mongoose");
const passport                            = require("passport");
const passportLocalMongoose               = require("passport-local-mongoose");

const UserModel                           = require("./models/user.js");

mongoose.connect("mongodb://127.0.0.1/express-auth");

expressApp.set("port", (process.env.PORT || 1337));
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());
expressApp.use(cookieParser());
expressApp.use(session({
    secret: "DFGHJKLKJHGFDFGHJK",
    resave: false,
    saveUninitialized: true,
    store: new sessionMongoStore({ mongooseConnection: mongoose.connection })
}));
expressApp.use((req, res, next) =>{
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
expressApp.use(passport.initialize());
expressApp.use(passport.session());


passport.use(new localStrategy({usernameField: "email", passwordField: "password" }, UserModel.authenticate()));
//passport.use(new localStrategy(UserModel.authenticate()));

//passport.use(UserModel.createStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

expressApp.post("/register", (req, res, next) => {
  console.log("working....")
  UserModel.register(new UserModel({email: req.body.email}), req.body.password, (err, user) => {
    if (err) {
      console.log("error");
      console.log(err)
      res.send(err);
    }
    else {
      console.log("no error")
      passport.authenticate("local")(req, res, () => {
        console.log(req.body)
        next()
      });
      res.send("worked....")
    }
  });
});


expressApp.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }

    if (! user) {
      return res.send({ success : false, message : 'authentication failed' });
    }

    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.send({ success : true, message : 'authentication succeeded' });
    });
  })(req, res, next);
});


expressApp.post('/check', function(req, res, next) {
  console.log(req)
  console.log(req.isAuthenticated())
  res.send("yes");
});



expressApp.listen(expressApp.get("port"), () => {
  console.log(`listening on ${expressApp.get("port")}`);
});
