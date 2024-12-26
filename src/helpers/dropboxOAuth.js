const dropboxV2Api = require('dropbox-v2-api');
const fs = require('fs');
require('dotenv').config();

// Dropbox app credentials
const client_id = process.env.DROPBOX_APP_KEY;
const client_secret = process.env.DROPBOX_APP_SECRET;
const redirect_uri = process.env.DROPBOX_APP_REDIRECT_URI;

// Create Dropbox instance
const dropbox = dropboxV2Api.authenticate({
    client_id,
    client_secret,
    redirect_uri,
    token_access_type: 'offline', // Requesting long-lived refresh token
});

// File to store tokens
const TOKEN_FILE = './dropbox_tokens.json';

// Step 1: Generate Authorization URL
function generateAuthUrl() {
    const authUrl = dropbox.generateAuthUrl();
    console.log(`Visit this URL to authorize the app: ${authUrl}`);
    return authUrl;
}

// Exchange authorization code for tokens
async function exchangeCodeForTokens() {
    const code = process.env.DROPBOX_APP_CODE;

    if (!code) {
        console.error('Authorization code not provided in the environment variables.');
        return;
    }

    return new Promise((resolve, reject) => {
        dropbox.getToken(code, (err, result) => {
            if (err) {
                reject(err);
            } else {
                console.log('Access token obtained:', result);

                const tokens = {
                    access_token: result.access_token,
                    refresh_token: result.refresh_token,
                    expires_in: result.expires_in,
                    scope: result.scope,
                    obtained_at: Date.now(),
                };

                // Save tokens to file
                fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
                console.log('Tokens saved successfully!', tokens);
                resolve(tokens);
            }
        });
    });
}

// Refresh token function
async function refreshToken() {
    try {
        const tokens = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
        const refresh_token = tokens.refresh_token;

        return new Promise((resolve, reject) => {
            const dropbox = dropboxV2Api.authenticate({
                client_id: process.env.DROPBOX_APP_KEY,
                client_secret: process.env.DROPBOX_APP_SECRET,
                refresh_token,
            });

            dropbox.refreshToken(refresh_token, (err, result) => {
                if (err) {
                    console.error('Error refreshing token:', err.message);
                    reject(err);
                } else {
                    // Update the access token and expiration details
                    tokens.access_token = result.access_token;
                    tokens.expires_in = result.expires_in;
                    tokens.obtained_at = Date.now();

                    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
                    resolve(tokens);
                }
            });
        });
    } catch (err) {
        console.error('Error reading or refreshing token:', err.message);
    }
}

// Sleep function to wait until token needs refreshing
async function sleepUntilTokenRefresh() {
    try {
        const tokens = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));

        // Calculate expiration details
        const expirationTime = tokens.obtained_at + tokens.expires_in * 1000;
        const now = Date.now();
        const timeUntilExpiration = expirationTime - now;

        if (timeUntilExpiration > 5 * 60 * 1000) {
            const sleepTime = timeUntilExpiration - 5 * 60 * 1000; // 5 minutes before expiration
            console.log(`Token is valid. Refresh scheduled in ${Math.ceil(sleepTime / 1000 / 60)} minutes.`);
            await new Promise(resolve => setTimeout(resolve, sleepTime));
        } else {
            console.log('Token is close to expiring or already expired. Refreshing now.');
        }

        // Refresh the token
        await refreshToken();

        // Re-run the function to schedule the next refresh
        sleepUntilTokenRefresh();
    } catch (err) {
        console.error('Error in token refresh scheduling:', err.message);
    }
}

// Get Dropbox Client with Refreshed Token
function getDropboxClient() {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
    // Just pass the short-lived token directly as `token`
    return dropboxV2Api.authenticate({
      token: tokens.access_token
    });
  }

module.exports = { exchangeCodeForTokens, generateAuthUrl, getDropboxClient, refreshToken, sleepUntilTokenRefresh};
