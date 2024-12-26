const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();

const applyRoutes = require('./routeManager');
const { sleepUntilTokenRefresh } = require('./helpers/dropboxOAuth');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

// Apply routes
applyRoutes(app);

// Start token refresh monitoring
(async () => {
    console.log('Starting token refresh monitoring...');
    await sleepUntilTokenRefresh();
})();

const { checkAndUpdateIP } = require('./helpers/ipUploader');
const cron = require('cron');

checkAndUpdateIP();

// Run the IP update check every 10 minutes
const ipUpdateJob = new cron.CronJob('*/10 * * * *', async () => {
    console.log('Running IP update check...');
    await checkAndUpdateIP();
});

ipUpdateJob.start();
console.log('IP update Cron job started.');

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
