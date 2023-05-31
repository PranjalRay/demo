const app = require('./app');

// Set the port number
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
