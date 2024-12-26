const { getDropboxClient } = require('./dropboxOAuth');
const fs = require('fs');
const axios = require('axios');
const { Readable } = require('stream');  // <-- Import or require the stream module

// Dropbox file path for storing the public IP
const DROPBOX_FILE_PATH = '/public_ip.txt';

// Function to get the current public IP
async function getPublicIP() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        console.error('Error fetching public IP:', error);
        throw error;
    }
}

// Function to read the IP stored in Dropbox
async function getStoredIP() {
    try {
        // Get Dropbox client
        const dropbox = getDropboxClient();

        // Read the IP from Dropbox
        return new Promise((resolve, reject) => {
            dropbox({
                resource: 'files/download',
                parameters: { path: DROPBOX_FILE_PATH },
            }, (err, result, response) => {
                if (err) {
                    if (err.status === 409) {
                        // File doesn't exist
                        return resolve(null);
                    }
                    return reject(err);
                    }              

                    let fileContent;
                    // If response.body is a string, that's the actual IP text
                    if (response && typeof response.body === 'string') {
                        fileContent = response.body.trim();
                    } else {
                        // Fallback in case of unexpected format
                        fileContent = JSON.stringify(response);
                    }
                    resolve(fileContent);
            });
        });
    } catch (error) {
        console.error('Error fetching stored IP from Dropbox:', error);
        throw error;
    }
}

// Convert your newIP (string) to a stream
function stringToStream(str) {
    return Readable.from(str);
}

async function updateStoredIP(newIP) {
    try {
        const dropbox = getDropboxClient();
        const contentStream = await stringToStream(newIP);

        return new Promise((resolve, reject) => {
            dropbox({
                resource: 'files/upload',
                parameters: {
                path: DROPBOX_FILE_PATH,
                mode: 'overwrite',
                },
                readStream: contentStream, // pass in the stream here
            }, (err, result) => {
                if (err) {
                return reject(err);
                }
                resolve(result);
            });
        });
    } catch (error) {
        console.error('Error updating IP in Dropbox:', error);
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

        // Check if the IP has changed
        if (currentIP !== storedIP) {
            console.log(`IP has changed. Updating Dropbox with new IP: ${currentIP}`);
            await updateStoredIP(currentIP);
            console.log('Dropbox updated successfully.');
        } else {
            console.log('IP has not changed. No update needed.');
        }
    } catch (error) {
        console.error('Error in IP check and update process:', error);
    }
}

module.exports = { checkAndUpdateIP };
