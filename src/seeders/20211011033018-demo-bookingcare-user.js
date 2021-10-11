'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //* email: DataTypes.STRING,
    //* firstName: DataTypes.STRING,
    //* lastName: DataTypes.STRING,
    //* address: DataTypes.STRING,
    //* gender: DataTypes.BOOLEAN,
    //* roleid: DataTypes.STRING
    return await queryInterface.bulkInsert('Users', [
      {
        email: 'kidohero@gmail.com',
        firstName: 'ki đô',
        lastName: 'hê rô',
        address: 'Đà Nẵng hihi',
        gender: 1,
        roleid: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
