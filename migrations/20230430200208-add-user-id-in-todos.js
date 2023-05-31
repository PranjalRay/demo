'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Todos', 'userId', {
      type: Sequelize.INTEGER, // Change the data type to INTEGER
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Todos', 'userId');
  }
};

