'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column already exists
    const tableInfo = await queryInterface.describeTable('SportSessions');
    if (tableInfo && tableInfo.sportId) {
      console.log('Column already exists in SportSessions table');
      return;
    }

    // Add the column
    await queryInterface.addColumn('SportSessions', 'sportId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Sports',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('SportSessions', 'sportId');
  }
};
