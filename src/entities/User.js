// entities/User.js
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: true,
    },
    username: {
      type: 'varchar',
      unique: true,
      nullable: false,
    },
    password: {
      type: 'varchar',
      nullable: false,
    },
    forceChangePassword: {
      type: 'boolean',
      default: false,
    },
  },
});
