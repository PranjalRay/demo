const request = require('supertest');
const app = require('../app');

describe('Sports Scheduler App', () => {
  // Test signup functionality
  describe('POST /signup', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/signup')
        .send({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: 'password123'
        });

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Signup successful');
    });

    it('should return an error if name, email, or password is missing', async () => {
      const response = await request(app)
        .post('/signup')
        .send({
          name: 'John Doe',
          email: '',
          password: 'password123'
        });

      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('Name, email, and password are required');
    });

    // Add more signup test cases as needed
  });

  // Test signin functionality
  describe('POST /signin', () => {
    it('should sign in a user with correct credentials', async () => {
      const response = await request(app)
        .post('/signin')
        .send({
          email: 'johndoe@example.com',
          password: 'password123'
        });

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Signin successful');
    });

    it('should return an error if email or password is missing', async () => {
      const response = await request(app)
        .post('/signin')
        .send({
          email: 'johndoe@example.com',
          password: ''
        });

      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('Email and password are required');
    });

    // Add more signin test cases as needed
  });

  // Test session creation functionality
  describe('POST /sessions/create', () => {
    it('should create a new session', async () => {
      const response = await request(app)
        .post('/sessions/create')
        .send({
          sportId: '1',
          teamA: 'Team A',
          teamB: 'Team B',
          additionalPlayers: 'Player 1, Player 2',
          dateTime: '2023-06-01 10:00:00',
          venue: 'Stadium'
        });

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Session created successfully');
    });

    it('should return an error if any field is missing', async () => {
      const response = await request(app)
        .post('/sessions/create')
        .send({
          sportId: '1',
          teamA: '',
          teamB: 'Team B',
          additionalPlayers: 'Player 1, Player 2',
          dateTime: '2023-06-01 10:00:00',
          venue: 'Stadium'
        });

      expect(response.statusCode).toBe(400);
      expect(response.text).toBe('All fields are required');
    });

    // Add more session creation test cases as needed
  });

  // Test session details functionality
  describe('GET /sessions/:id', () => {
    it('should return details of a specific session', async () => {
      const response = await request(app).get('/sessions/1');

      expect(response.statusCode).toBe(200);
      expect(response.text).toBe('Details of session 1');
    });

    it('should return an error if session is not found', async () => {
      const response = await request(app).get('/sessions/999');

      expect(response.statusCode).toBe(404);
      expect(response.text).toBe('Session not found');
    });

    // Add more session details test cases as needed
  });

  // Add more test cases for other routes and functionalities as needed

  afterAll(() => {
    // Perform any necessary cleanup or database resets
  });
});
