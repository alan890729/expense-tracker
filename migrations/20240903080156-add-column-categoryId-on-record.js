'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Records',
      'categoryId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'id'
        },
        onDelete: 'SET NULL', // 但是新增一筆支出用戶一定要選擇一個category，只是之後如果要做可以編輯category的功能，category被刪掉後支出還是要存在
        onUpdate: 'CASCADE'
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Records',
      'categoryId'
    )
  }
};
