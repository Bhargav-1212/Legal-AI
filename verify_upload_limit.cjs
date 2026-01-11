const fs = require('fs');
const http = require('http');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'large_test_file.txt');
const FILE_SIZE = 7 * 1024 * 1024; // 7MB

// Create a 7MB dummy file
console.log(`Creating ${FILE_SIZE} bytes dummy file at ${FILE_PATH}...`);
const buffer = Buffer.alloc(FILE_SIZE, 'a');
fs.writeFileSync(FILE_PATH, buffer);

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

const postDataHead = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="large_test_file.txt"\r\nContent-Type: text/plain\r\n\r\n`;
const postDataTail = `\r\n--${boundary}--`;

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/analyze-document',
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(postDataHead) + FILE_SIZE + Buffer.byteLength(postDataTail)
    }
};

console.log('Sending upload request...');

const req = http.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => { responseBody += chunk; });
    res.on('end', () => {
        console.log(`\nStatus: ${res.statusCode}`);
        console.log(`Response: ${responseBody.substring(0, 500)}`);

        // Cleanup
        try { fs.unlinkSync(FILE_PATH); } catch (e) { }

        if (res.statusCode === 200) {
            console.log("SUCCESS: 7MB file accepted.");
        } else {
            console.log("FAILURE: Upload rejected.");
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    try { fs.unlinkSync(FILE_PATH); } catch (e) { }
});

req.write(postDataHead);
// Write large file in chunks to avoid memory issues in script
const stream = fs.createReadStream(FILE_PATH);
stream.pipe(req, { end: false });
stream.on('end', () => {
    req.write(postDataTail);
    req.end();
});
