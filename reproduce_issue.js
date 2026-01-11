
require('dotenv').config();
const { conductResearch } = require('./server/services/ai');

async function test() {
    console.log("Testing Legal Research...");
    try {
        const result = await conductResearch("What are the grounds for divorce in India?");
        console.log("Success:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Failed:", error.message);
    }
}

test();
