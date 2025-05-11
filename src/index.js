// index.js
const express = require('express');
require('dotenv').config();

const { CronJob } = require('cron');
const applyRoutes = require('./routeManager');
const { sleepUntilTokenRefresh } = require('./helpers/dropboxOAuth');
const { checkAndUpdateIP } = require('./helpers/ipUploader');

// Import and initialize TypeORM
const AppDataSource = require('./data-source');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize SQLite/TypeORM, then start everything
AppDataSource.initialize()
  .then(() => {
    console.log('✅ SQLite connected via TypeORM');

    app.use(express.json());

    // Mount routes (they should now use TypeORM repos under the hood)
    applyRoutes(app);

    // Start Dropbox OAuth token refresher
    (async () => {
      console.log('🔄 Starting token refresh monitoring...');
      await sleepUntilTokenRefresh();
    })();

    // Run an immediate IP check, then schedule every 10min
    checkAndUpdateIP();
    const ipUpdateJob = new CronJob('*/10 * * * *', async () => {
      console.log('🔄 Running IP update check...');
      await checkAndUpdateIP();
    });
    ipUpdateJob.start();
    console.log('🕑 IP update Cron job started.');

    // Launch HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  });
