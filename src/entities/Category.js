// entities/Category.js
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Category',
  tableName: 'categories',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: true,
    },
    localizationId: {
      type: 'varchar',
      unique: true,
      nullable: false,
    },
  },
});
