const pdf = require('pdf-parse');
console.log('Type of pdf:', typeof pdf);
console.log('Value of pdf:', pdf);

try {
    // Mock buffer
    const buffer = Buffer.from('test');
    const result = pdf(buffer).catch(e => console.log("Promise rejected (expected for mock data):", e.message));
    console.log('Function call successful (promise returned)');
} catch (e) {
    console.log('Function call failed:', e.message);
}
