// helpers/filmHelpers.js

/**
 * Given a film or array of films (TypeORM entities or plain objects),
 * replaces the `addedBy` relation object with its username.
 *
 * @param {object|object[]} films
 * @returns {object|object[]}
 */
function attachUsernames(films) {
  const filmArray = Array.isArray(films) ? films : [films];

  const result = filmArray.map((film) => {
    // If it's a TypeORM entity, toJSON() will strip metadata
    const plain = typeof film.toJSON === 'function' ? film.toJSON() : { ...film };

    // If addedBy was loaded as a relation, it's an object with a .username
    if (plain.addedBy && typeof plain.addedBy === 'object') {
      plain.addedBy = plain.addedBy.username;
    }

    return plain;
  });

  return Array.isArray(films) ? result : result[0];
}

module.exports = { attachUsernames };
