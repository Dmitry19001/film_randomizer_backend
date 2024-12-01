const { getDropboxClient } = require('./dropboxOAuth');
const fs = require('fs');
const axios = require('axios');

// Dropbox file path for storing the public IP
const DROPBOX_FILE_PATH = '/public_ip.txt';

// Function to get the current public IP
async function getPublicIP() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        console.error('Error fetching public IP:', error.message);
        throw error;
    }
}

// Function to read the IP stored in Dropbox
async function getStoredIP() {
    try {
        const dropbox = getDropboxClient();

        return new Promise((resolve, reject) => {
            dropbox({
                resource: 'files/download',
                parameters: { path: DROPBOX_FILE_PATH },
            }, (err, result, response) => {
                if (err) {
                    if (err.status === 409) {
                        // File doesn't exist, return null
                        resolve(null);
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(response.toString().trim());
                }
            });
        });
    } catch (error) {
        console.error('Error fetching stored IP from Dropbox:', error.message);
        throw error;
    }
}

// Function to upload or update the IP in Dropbox
async function updateStoredIP(newIP) {
    try {
        const dropbox = getDropboxClient();

        return new Promise((resolve, reject) => {
            const content = Buffer.from(newIP, 'utf-8');
            dropbox({
                resource: 'files/upload',
                parameters: { path: DROPBOX_FILE_PATH, mode: 'overwrite' },
                readStream: content,
            }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    } catch (error) {
        console.error('Error updating IP in Dropbox:', error.message);
        throw error;
    }
}

// Main function to check and upload IP
async function checkAndUpdateIP() {
    try {
        const currentIP = await getPublicIP();
        console.log(`Current public IP: ${currentIP}`);

        const storedIP = await getStoredIP();
        console.log(`Stored public IP: ${storedIP || 'None'}`);

        if (currentIP !== storedIP) {
            console.log(`IP has changed. Updating Dropbox with new IP: ${currentIP}`);
            await updateStoredIP(currentIP);
            console.log('Dropbox updated successfully.');
        } else {
            console.log('IP has not changed. No update needed.');
        }
    } catch (error) {
        console.error('Error in IP check and update process:', error.message);
    }
}

module.exports = { checkAndUpdateIP };
