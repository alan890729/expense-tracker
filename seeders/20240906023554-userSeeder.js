'use strict';
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userData = await Promise.all(
      Array.from({ length: 2 }).map(async (value, i) => {
        const password = await bcrypt.hash(`user${i + 1}`, 10)
        return {
          name: `user${i + 1}`,
          email: `user${i + 1}@example.com`,
          password,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    )

    await queryInterface.bulkInsert(
      'Users',
      userData
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'Users',
      null
    )
  }
};
