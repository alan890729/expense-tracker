'use strict';
const categoryRawData = require('../jsons/categoryIcons.json').CATEGORY
const initCategoryData = Object.keys(categoryRawData).map(name => {
  return {
    name,
    createdAt: new Date(),
    updatedAt: new Date()
  }
})

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Categories',
      initCategoryData
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'Categories',
      null
    )
  }
};
