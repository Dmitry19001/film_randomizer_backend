const User = require('../models/user');

async function attachUsernames(films) {
  const filmArray = Array.isArray(films) ? films : [films];
  
  const userIds = [...new Set(filmArray.map(film => film.addedBy.toString()))];
  const users = await User.find({ '_id': { $in: userIds } });

  const usernameMap = users.reduce((acc, user) => {
    acc[user._id.toString()] = user.username;
    return acc;
  }, {});

  return filmArray.map(film => ({
    ...film.toObject(),
    addedBy: usernameMap[film.addedBy.toString()],
  }));
}

module.exports = { attachUsernames };
