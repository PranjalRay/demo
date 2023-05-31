'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('SportSessions');
    if (!table.hasOwnProperty('reason')) {
      await queryInterface.addColumn('SportSessions', 'reason', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('SportSessions', 'reason');
  }
};
