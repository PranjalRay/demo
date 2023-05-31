'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('CancelSessions');
    if (!table.hasOwnProperty('sportSessionId')) {
      await queryInterface.addColumn('CancelSessions', 'sportSessionId', {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'SportSessions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('CancelSessions', 'sportSessionId');
  }
};
