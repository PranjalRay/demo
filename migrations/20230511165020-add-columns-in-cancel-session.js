'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('CancelSessions', 'teamOne', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('CancelSessions', 'teamTwo', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('CancelSessions', 'teamOne');
    await queryInterface.removeColumn('CancelSessions', 'teamTwo');
  }
};
