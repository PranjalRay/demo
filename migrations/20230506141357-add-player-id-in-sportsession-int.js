'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column already exists
    const tableInfo = await queryInterface.describeTable('SportSessions');
    if (tableInfo && tableInfo.playerId) {
      console.log('Column already exists in SportSessions table');
      return;
    }

    // Add the column
    await queryInterface.addColumn('SportSessions', 'playerId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Players',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('SportSessions', 'playerId');
  }
};
