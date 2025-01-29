require('dotenv').config(); 
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');
const { exec } = require('child_process');

console.log(process.env.AIRLIFT_PASSWORD)
console.log(process.env.AIRLIFT_URI)

const uploadImage = async (imagePath) => {
    // read the picture as binary
    const imageBuffer = fs.readFileSync(imagePath);

    // Erstelle die Header
    const headers = {
        'X-Airlift-Password': `${process.env.AIRLIFT_PASSWORD}`, // password for airlift instance
        'X-Airlift-Filename': path.basename(imagePath), // filename as header
        'Content-Type': 'application/octet-stream', // setting content type
    };

    // Sende den Request
    try {
        const response = await fetch(`https://${process.env.AIRLIFT_URI}/upload/file`, {
            method: 'POST',
            headers: headers,
            body: imageBuffer, // picture as binary data
        });

        if (!response.ok) {
            throw new Error('Fehler beim Hochladen des Bildes');
        }
         // parse response as json
         const responseData = await response.json();
         const copyText = `https://${responseData.URL}`
         exec(`echo ${copyText} | clip`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Fehler beim Kopieren in die Zwischenablage: ${error}`);
              return;
            }
            console.log('Text wurde in die Zwischenablage kopiert!');
          });        
        console.log('Bild erfolgreich hochgeladen!');
    } catch (error) {
        console.error('Fehler:', error);
    }
};

// setting picture path from argument
const imagePath = process.argv[2];

if (imagePath) {
    uploadImage(imagePath);
} else {
    console.log('Bitte den Pfad zum Bild angeben.');
}
