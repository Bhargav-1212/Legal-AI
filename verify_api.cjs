const http = require('http');

function postRequest(path, data) {
    const postData = JSON.stringify(data);
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => { responseBody += chunk; });
        res.on('end', () => {
            console.log(`\n[POST ${path}] Status: ${res.statusCode}`);
            console.log(`Response: ${responseBody}`);
        });
    });

    req.on('error', (e) => {
        console.error(`[POST ${path}] Error: ${e.message}`);
    });

    req.write(postData);
    req.end();
}

function getRequest(path) {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => { responseBody += chunk; });
        res.on('end', () => {
            console.log(`\n[GET ${path}] Status: ${res.statusCode}`);
            console.log(`Response: ${responseBody}`);

            // Trigger POST test after GET success
            postRequest('/api/legal-research', { query: "Is online betting legal in India?" });
        });
    });

    req.on('error', (e) => {
        console.error(`[GET ${path}] Error: ${e.message}`);
    });

    req.end();
}

console.log("Starting verification...");
getRequest('/api/health');
