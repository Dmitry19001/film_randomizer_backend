// entities/FilmHub.js
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'FilmHub',
  tableName: 'film_hubs',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
      nullable: false,
    },
    room_password: {
      type: 'varchar',
      nullable: false,
    },
    date_created: {
      type: 'datetime',
      createDate: true,
    },
    date_modified: {
      type: 'datetime',
      updateDate: true,
    },
  },
  relations: {
    creator: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'creator_id' },
      nullable: false,
    },
    users: {
      type: 'many-to-many',
      target: 'User',
      joinTable: {
        name: 'film_hub_users',
        joinColumn: { name: 'film_hub_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
      },
    },
    currentChosenFilm: {
      type: 'many-to-one',
      target: 'Film',
      joinColumn: { name: 'current_chosen_film' },
      nullable: true,
    },
  },
});
