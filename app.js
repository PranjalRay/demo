const express = require("express");
const app = express();
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const { User, Sport, SportSession, cancelSession } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(
  session({
    secret: "my key super secret",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const saltRounds = 10;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

// Passport configuration
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        })
        .catch((error) => {
          return done(error);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Middleware for admin access
function AdminSport(req, res, next) {
  const adminEmail = req.user.email;
  const adminPassword = req.user.password; // Assuming the password is available in the req.user object
  const actualAdminEmail = "admin@admin.com";
  const actualAdminPassword = "admin"; // Replace with the actual admin password

  if (adminEmail === actualAdminEmail && adminPassword === actualAdminPassword) {
    return next();
  } else {
    res.redirect("/sportList");
    req.flash("error", "Please login with admin user ID and password.");
  }
}

// Middleware for user validation
function validateUser(req, res, next) {
  User.findOne({ where: { email: req.body.email } })
    .then(async (user) => {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        res.cookie(`em`, user.email, {
          maxAge: 500 * 60 * 60 * 1000,
          secure: true,
          httpOnly: true,
        });
        res.cookie(`ps`, user.password, {
          maxAge: 500 * 60 * 60 * 1000,
          secure: true,
          httpOnly: true,
        });
        res.cookie(`fn`, user.firstName, {
          maxAge: 500 * 60 * 60 * 1000,
          secure: true,
          httpOnly: true,
        });
        next();
      } else {
        return done(null, false, { message: "Invalid password" });
      }
    })
    .catch((error) => {
      return next(error);
    });
}

// Define your routes here
app.get("/", (req, res) => {
  // Handle home page route
});

app.get("/sportList", (req, res) => {
  // Handle sport list route
});

app.get("/adminOnly", AdminOfSport, (req, res) => {
  // Handle admin-only route
});

app.post("/login", validateUser, (req, res) => {
  // Handle login route
});

// Export the app
module.exports = app;
