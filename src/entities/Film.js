// entities/Film.js
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Film',
  tableName: 'films',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: true,
    },
    title: {
      type: 'varchar',
      nullable: false,
    },
    isWatched: {
      type: 'boolean',
      default: false,
    },
    imageUrl: {
      type: 'varchar',
      nullable: true,
    },
    createdAt: {
      type: 'datetime',
      createDate: true,
    },
    updatedAt: {
      type: 'datetime',
      updateDate: true,
    },
  },
  relations: {
    genres: {
      type: 'many-to-many',
      target: 'Genre',
      joinTable: true,
      cascade: true,
    },
    categories: {
      type: 'many-to-many',
      target: 'Category',
      joinTable: true,
      cascade: true,
    },
    addedBy: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: true,
      nullable: false,
    },
  },
});
