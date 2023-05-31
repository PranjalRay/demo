'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SportSessions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      teamA: {
        type: Sequelize.STRING,
        allowNull: false
      },
      teamB: {
        type: Sequelize.STRING,
        allowNull: false
      },
      additionalPlayers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      venue: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sportId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Sports',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SportSessions');
  }
};
