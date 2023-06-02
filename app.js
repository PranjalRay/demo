/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { request, response } = require("express");
const express = require("express");
const csrf = require("tiny-csrf");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.json());
app.set("view engine", "ejs");
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
app.set("views", path.join(__dirname, "views"));
app.use(flash());
const bcrypt = require("bcrypt");
const saltRounds = 10;
const CancelSession = require("./models/CancelSession");
const Index = require("./models/Index");
const Sport = require("./models/Sport");
const SportSession = require("./models/SportSession");
const Todo = require("./models/Todo");
const User = require("./models/User");

app.use(
  session({
    secret: "my-super-secret-key-21728172615261563",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async function (user) {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid credentials" });
          }
        })
        .catch((error) => {
          return done(null, false, {
            message: "Your account doesn't exist, try signing up",
          });
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
function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// GET route for home page
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    csrfToken: req.csrfToken(),
  });
});
// POST route for user signup
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({ name, email, password: hashedPassword });
    req.flash("success", "Signup successful");
    res.redirect("/login");
  } catch (error) {
    req.flash("error", "Signup failed");
    res.redirect("/signup");
  }
});
// GET route for user login
app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
    csrfToken: req.csrfToken(),
  });
});

// POST route for user login
app.post("/login", passport.authenticate("local", {
  successRedirect: "/SportList",
  failureRedirect: "/login",
  failureFlash: true,
}));

// GET route for user dashboard (protected route)
app.get("/SportList", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.render("/SportList", {
    title: "SportList",
    user: req.user,
  });
});

// GET route for user logout
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// GET route for admin panel (protected route)
app.get("/admin/admin-signin", connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  // Check if the user is an admin
  if (req.user.isAdmin) {
    res.render("/admin/index", {
      title: "Admin Panel",
      user: req.user,
    });
  } else {
    res.redirect("/SportList");
  }
});
const { sequelize } = require("./models/Index");
sequelize.sync().then(() => {
  const server = app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
});

User.findOne({ where: { email: "admin@admin.com", password: "admin" } })
  .then((user) => {
    if (user) {
      user.isAdmin = true;
      user.save();
    }
  });

module.exports = app;
