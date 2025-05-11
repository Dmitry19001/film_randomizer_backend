// entities/Genre.js
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Genre',
  tableName: 'genres',
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
