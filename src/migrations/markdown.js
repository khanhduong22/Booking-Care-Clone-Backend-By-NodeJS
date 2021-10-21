'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      contentHTML: {
        allowNull: false,

        type: Sequelize.TEXT('long'),
      },
      contentMarkdown: {
        allowNull: false,

        type: Sequelize.TEXT('long'),
      },
      description: {
        allowNull: true,
        allowNull: true,
        type: Sequelize.TEXT('long'),
      },

      allowNull: true,
      doctorId: {
        type: Sequelize.INTEGER,
      },
      allowNull: true,
      specialtyId: {
        type: Sequelize.INTEGER,
      },
      allowNull: true,
      clinicId: {
        type: Sequelize.INTEGER,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  },
};
