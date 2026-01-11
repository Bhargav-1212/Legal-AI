
const fetch = require('node-fetch'); // Might need to install node-fetch or use built-in fetch if node version supports it.
// Node 18+ has fetch built-in. Check node version.
// The user environment is Node 22.16.0 (seen in error log). So global fetch is available.

async function testAPI() {
    console.log("Testing API at http://localhost:3000/api/legal-research...");
    try {
        const response = await fetch('http://localhost:3000/api/legal-research', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: "What are the grounds for divorce in India?" })
        });

        if (!response.ok) {
            console.error("API Error Status:", response.status);
            const text = await response.text();
            console.error("API Error Body:", text);
            return;
        }

        const data = await response.json();
        console.log("Success:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Request Failed:", error);
    }
}

testAPI();
