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
  UserModel.register(new UserModel({email: req.body.email}), req.body.password, (err, user) => {
    if (err) {
      return res.send(err);
    }
    else {
      passport.authenticate("local")(req, res, () => {
        req.login(req.user, (err) => {
          if (err){
            return res.send({ sucess: false, message : "login error" } )
          }
          return res.send({
            success: true,
            user: {
              email: req.user.email,
              _id: req.user._id
            }
          })
        })
      });
    }
  });
});

expressApp.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err); // will generate a 500 error
    }

    if (! user) {
      return res.send({ success : false, message : "authentication failed"});
    }

    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.send({ success : true, message : "authentication succeeded",  user: user });
    });
  })(req, res, next);
});

expressApp.post("/logout", (req, res, next) => {
  req.logout();
  res.send({
    success: true,
    user: null
  })
});

expressApp.post('/check', function(req, res, next) {
  if (req.isAuthenticated()){
    res.send({
      success: true,
      user: req.user
    })
  }
  else {
    res.send({
      success: true,
      user: null
    })
  }
});



expressApp.listen(expressApp.get("port"), () => {
  console.log(`listening on ${expressApp.get("port")}`);
});
