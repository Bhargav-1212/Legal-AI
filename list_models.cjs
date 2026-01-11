const https = require('https');

const options = {
    hostname: 'integrate.api.nvidia.com',
    path: '/v1/models',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer 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',
        'Accept': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        try {
            const json = JSON.parse(data);
            if (json.data && Array.isArray(json.data)) {
                // Filter for 'gpt' or 'llama' or just list first 10
                console.log("Available Models:");
                json.data.forEach(m => console.log(m.id));
            } else {
                console.log("Unexpected format:", data.substring(0, 200));
            }
        } catch (e) {
            console.log("Parse Error:", data);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
