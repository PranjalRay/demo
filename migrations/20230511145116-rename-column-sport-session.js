'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('SportSessions', 'teamA', 'teamOne');
    await queryInterface.renameColumn('SportSessions', 'teamB', 'teamTwo');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('SportSessions', 'teamOne', 'teamA');
    await queryInterface.renameColumn('SportSessions', 'teamTwo', 'teamB');
  }
};
