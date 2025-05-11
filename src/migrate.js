// migrate.js
require('dotenv').config();
require('reflect-metadata');

const mongoose = require('mongoose');
const AppDataSource = require('./data-source');

// Register your Mongoose models so mongoose.model('Category') etc. work:
require('./models/category');
require('./models/genre');
require('./models/user');
require('./models/film');

async function main() {
  // 1) Connect to Mongo
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('🗄️ Connected to MongoDB');

  // 2) Initialize SQLite / TypeORM
  await AppDataSource.initialize();
  console.log('🗄️ Connected to SQLite via TypeORM');

  // 3) Prepare repositories
  const categoryRepo = AppDataSource.getRepository('Category');
  const genreRepo    = AppDataSource.getRepository('Genre');
  const userRepo     = AppDataSource.getRepository('User');
  const filmRepo     = AppDataSource.getRepository('Film');

  // 4) Migrate Categories
  const categoryMap = new Map();
  const mongoCats = await mongoose.model('Category').find().lean();
  for (const c of mongoCats) {
    const saved = await categoryRepo.save({ localizationId: c.localizationId });
    categoryMap.set(String(c._id), saved.id);
  }
  console.log(`→ Migrated ${categoryMap.size} categories`);

  // 5) Migrate Genres
  const genreMap = new Map();
  const mongoGenres = await mongoose.model('Genre').find().lean();
  for (const g of mongoGenres) {
    const saved = await genreRepo.save({ localizationId: g.localizationId });
    genreMap.set(String(g._id), saved.id);
  }
  console.log(`→ Migrated ${genreMap.size} genres`);

  // 6) Migrate Users
  const userMap = new Map();
  const mongoUsers = await mongoose.model('User').find().lean();
  for (const u of mongoUsers) {
    const saved = await userRepo.save({
      username: u.username,
      password: u.password,
      forceChangePassword: u.forceChangePassword,
    });
    userMap.set(String(u._id), saved.id);
  }
  console.log(`→ Migrated ${userMap.size} users`);

  // 7) Migrate Films
  const filmMap = new Map();
  const mongoFilms = await mongoose.model('Film').find().lean();
  for (const f of mongoFilms) {
    const filmEntity = filmRepo.create({
      title:       f.title,
      isWatched:   f.isWatched,
      imageUrl:    f.imageUrl,
      addedBy:     { id: userMap.get(String(f.addedBy)) },
      genres:      (f.genres || []).map(_id => ({ id: genreMap.get(String(_id)) })),
      categories:  (f.categories || []).map(_id => ({ id: categoryMap.get(String(_id)) })),
      createdAt:   f.createdAt,
      updatedAt:   f.updatedAt,
    });
    const saved = await filmRepo.save(filmEntity);
    filmMap.set(String(f._id), saved.id);
  }
  console.log(`→ Migrated ${filmMap.size} films`);
  console.log('✅ Migration complete!');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Migration error:', err);
  process.exit(1);
});
