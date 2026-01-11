
const fs = require('fs');
const path = require('path');
const http = require('http');

// Create a dummy text file
const filePath = path.join(__dirname, 'test_doc.txt');
fs.writeFileSync(filePath, 'This is a test legal document for analysis under Indian Law. It involves a contract dispute.');

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

const postDataStart = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="file"; filename="test_doc.txt"`,
    `Content-Type: text/plain`,
    '',
    fs.readFileSync(filePath, 'utf8'),
    ''
].join('\r\n');

const postDataEnd = `\r\n--${boundary}--`;

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/analyze-document',
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(postDataStart) + Buffer.byteLength(postDataEnd)
    }
};

console.log("Sending request to http://localhost:3000/api/analyze-document...");

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('BODY:', data);
        fs.unlinkSync(filePath); // Cleanup
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
    fs.unlinkSync(filePath); // Cleanup
});

req.write(postDataStart);
req.write(postDataEnd);
req.end();
