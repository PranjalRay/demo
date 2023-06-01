const { DataTypes } = require('sequelize');
const sequelize = require('../config/config.json'); // Import the Sequelize instance

const User = sequelize.define('User', {
  // Define the attributes of the User model
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
