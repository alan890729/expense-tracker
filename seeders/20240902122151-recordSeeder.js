'use strict';

const arrayLength = 250
const templateArr = Array.from({ length: arrayLength })
const itemArr = ['油漆', '機車加油', '艾爾登法環', '牛丼', '某項費用']
const amountArr = [200, 100, 1790, 180, 100]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Records',
      templateArr.map((element, index) => {
        return {
          name: itemArr[index % 5],
          date: '2024-09-02',
          amount: amountArr[index % 5],
          categoryId: (index % 5) + 1,
          userId: index < (templateArr.length / 2) ? 1 : 2,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'Records',
      null
    )
  }
};
