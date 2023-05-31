// Import necessary modules and dependencies
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Create an instance of Express
const app = express();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

// Database (assuming you're using a simple in-memory data structure)
const sports = [];
const users = [];
const sessions = [];

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Sports Scheduler!');
});

// Admin routes
app.get('/admin/sports', (req, res) => {
  // Display a list of sports created by the admin
  res.send('List of sports created by the admin');
});

app.post('/admin/sports', (req, res) => {
  // Create a new sport
  const { name } = req.body;
  const sport = { id: uuidv4(), name };
  sports.push(sport);
  res.send(`Sport ${name} created successfully`);
});

// User routes
app.get('/signup', (req, res) => {
  // Display the signup form
  res.send('Signup form');
});

app.post('/signup', async (req, res) => {
  // Handle user signup
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, email, password: hashedPassword };
  users.push(user);
  res.send('Signup successful');
});

app.get('/signin', (req, res) => {
  // Display the signin form
  res.send('Signin form');
});

app.post('/signin', async (req, res) => {
  // Handle user signin
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.userId = user.id;
      return res.send('Signin successful');
    }
  }
  res.send('Invalid credentials');
});

app.get('/signout', (req, res) => {
  // Handle user signout
  req.session.destroy();
  res.send('Signout successful');
});

app.get('/sessions/create', (req, res) => {
  // Display the form to create a new session
  res.send('Create session form');
});

app.post('/sessions/create', (req, res) => {
  // Create a new session
  const { sportId, teamA, teamB, additionalPlayers, dateTime, venue } = req.body;
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
  res.send('List of sessions');
});

app.get('/sessions/:id', (req, res) => {
  // Display details of a specific session
  const sessionId = req.params.id;
  const session = sessions.find(s => s.id === sessionId);
  res.send(`Details of session ${sessionId}`);
});

app.post('/sessions/:id/join', (req, res) => {
  // Join a session
  const sessionId = req.params.id;
  const session = sessions.find(s => s.id === sessionId);
  if (session) {
    // Add the user to the session
    res.send(`Joined session ${sessionId}`);
  } else {
    res.send('Session not found');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
