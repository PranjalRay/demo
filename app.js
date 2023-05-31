// Import necessary modules and dependencies
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Import models
const CancelSession = require('./models/CancelSession');
const Index = require('./models/Index');
const Sport = require('./models/Sport');
const SportSession = require('./models/SportSession');
const Todo = require('./models/Todo');
const User = require('./models/User');

// Create an instance of Express
const app = express();

// Set up middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// Database (assuming you're using a simple in-memory data structure)
const sports = [];
const users = [];
const sessions = [];

// Middleware to set 'message' variable
app.use((req, res, next) => {
  res.locals.message = ''; // Initialize with an empty message
  next();
});

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

// Admin routes
app.get('/admin/sports', (req, res) => {
  // Display a list of sports created by the admin
  res.render('admin');
});

app.post('/admin/sports', (req, res) => {
  // Create a new sport
  const { name } = req.body;
  if (!name) {
    return res.status(400).send('Sport name is required');
  }
  const sport = { id: uuidv4(), name };
  sports.push(sport);
  res.send(`Sport ${name} created successfully`);
});

// User routes
app.get('/signup', (req, res) => {
  // Display the signup form
  res.render('signup', { message: res.locals.message });
});

app.post('/signup', async (req, res) => {
  // Handle user signup
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.locals.message = 'Name, email, and password are required';
    return res.redirect('/signup');
  }
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    res.locals.message = 'User with that email already exists';
    return res.redirect('/signup');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, email, password: hashedPassword };
  users.push(user);
  res.send('Signup successful');
});

app.get('/login', (req, res) => {
  // Display the signin form
  res.render('login', { message: res.locals.message });
});
app.post('/login', async (req, res) => {
  // Handle user signin
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).send('User not found');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).send('Invalid credentials');
  }
  req.session.userId = user.id;
  res.send('Signin successful');
});

// Admin routes

app.get('/admin/admin-signin', (req, res) => {
  // Render the admin sign-in form
  res.render('admin-signin');
});

app.post('/admin/signin', (req, res) => {
  // Handle admin sign-in
  const { email, password } = req.body;
  // Check if the email and password match the admin credentials
  if (email === 'admin@admin.com' && password === 'admin') {
    // Admin sign-in successful
    // Set a flag in the session to indicate that the user is an admin
    req.session.isAdmin = true;
    res.send('Admin sign-in successful');
  } else {
    // Invalid admin credentials
    res.status(400).send('Invalid admin credentials');
  }
});

app.get('/signout', (req, res) => {
  // Handle user signout
  req.session.destroy();
  res.send('Signout successful');
});

app.get('/sessions/create', (req, res) => {
  // Display the form to create a new session
  res.render('create-session', { message: res.locals.message });
});

app.post('/sessions/create', (req, res) => {
  // Create a new session
  const { sportId, teamA, teamB, additionalPlayers, dateTime, venue } = req.body;
  if (!sportId || !teamA || !teamB || !additionalPlayers || !dateTime || !venue) {
    res.locals.message = 'All fields are required';
    return res.redirect('/sessions/create');
  }
  const session = {
    id: uuidv4(),
    sportId,
    teamA,
    teamB,
    additionalPlayers,
    dateTime,
    venue,
    createdBy: req.session.userId
  };
  sessions.push(session);
  res.send('Session created successfully');
});

app.get('/sessions', (req, res) => {
  // Display a list of sessions
  res.render('sessions');
});

app.get('/sessions/:id', (req, res) => {
  // Display details of a specific session
  const sessionId = req.params.id;
  const session = sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).send('Session not found');
  }
  res.send(`Details of session ${sessionId}`);
});

app.post('/sessions/:id/join', (req, res) => {
  // Join a session
  const sessionId = req.params.id;
  const session = sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(404).send('Session not found');
  }
  // Add the user to the session
  res.send(`Joined session ${sessionId}`);
});

module.exports = app;
