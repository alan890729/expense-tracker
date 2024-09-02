'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Records',
      Array.from({ length: 5 }).map((element, index) => {
        return {
          name: '排骨便當',
          date: '2024-09-02',
          amount: 100,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'Records',
      null
    )
  }
};
