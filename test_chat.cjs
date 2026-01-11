const https = require('https');

const data = JSON.stringify({
    model: "meta/llama-3.1-70b-instruct",
    messages: [{ role: "user", content: "Hello" }],
    temperature: 0.5,
    max_tokens: 100
});

const options = {
    hostname: 'integrate.api.nvidia.com',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log("Sending request to /v1/chat/completions...");
const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Body: ${body}`);
    });
});

req.on('error', (e) => {
    console.error(`Problem: ${e.message}`);
});

req.write(data);
req.end();
