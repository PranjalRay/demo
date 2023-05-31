'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('CancelSessions', 'sportId', {
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
    await queryInterface.removeColumn('CancelSessions', 'sportId');
  }
};
