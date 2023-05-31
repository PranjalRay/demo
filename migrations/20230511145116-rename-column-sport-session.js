'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column exists
    const tableInfo = await queryInterface.describeTable('SportSessions');
    if (!tableInfo || !tableInfo.teamA) {
      console.log('Column does not exist in SportSessions table');
      return;
    }

    // Rename the column
    await queryInterface.renameColumn('SportSessions', 'teamA', 'newTeamA');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('SportSessions', 'newTeamA', 'teamA');
  }
};
