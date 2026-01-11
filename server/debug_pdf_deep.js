const fs = require('fs');
const path = require('path');

console.log("--- Deep Debugging pdf-parse ---");

try {
    const pdfModule = require('pdf-parse');
    console.log("Type:", typeof pdfModule);
    console.log("Keys JSON:", JSON.stringify(Object.keys(pdfModule)));

    // Check possible default exports
    console.log("pdfModule.default:", pdfModule.default);
    console.log("Type of pdfModule.default:", typeof pdfModule.default);

    // Create a minimal valid PDF buffer
    // A minimal PDF header is needed for most parsers to not reject it immediately
    const minimalPdf = Buffer.from('%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]/Parent 2 0 R/Resources<<>>>>endobj xref 0 4 0000000000 65535 f 0000000010 00000 n 0000000060 00000 n 0000000120 00000 n trailer<</Size 4/Root 1 0 R>>startxref 178 %%EOF');

    const runTest = async (func, name) => {
        try {
            console.log(`Testing ${name}...`);
            if (typeof func !== 'function') {
                console.log(`${name} is NOT a function (it is ${typeof func})`);
                return;
            }
            const data = await func(minimalPdf);
            console.log(`${name} SUCCESS. Text content length: ${data.text ? data.text.length : 'undefined'}`);
        } catch (e) {
            console.log(`${name} FAILED:`, e.message);
        }
    };

    (async () => {
        await runTest(pdfModule, "Direct Export");
        if (pdfModule.default) {
            await runTest(pdfModule.default, "Default Export");
        }
    })();

} catch (e) {
    console.error("Require failed:", e);
}
