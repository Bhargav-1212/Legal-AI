const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function extractText(buffer) {
    try {
        // Load the document
        // converting buffer to Uint8Array if needed
        const data = new Uint8Array(buffer);
        const loadingTask = pdfjsLib.getDocument({ data: data });
        const doc = await loadingTask.promise;
        const numPages = doc.numPages;
        console.log(`Document loaded with ${numPages} pages.`);

        let fullText = '';

        for (let i = 1; i <= numPages; i++) {
            const page = await doc.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }

        return fullText;
    } catch (e) {
        console.error("PDFJS Error:", e);
        throw e;
    }
}

// Test with dummy PDF
const minimalPdf = Buffer.from('%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]/Parent 2 0 R/Resources<<>>>>endobj xref 0 4 0000000000 65535 f 0000000010 00000 n 0000000060 00000 n 0000000120 00000 n trailer<</Size 4/Root 1 0 R>>startxref 178 %%EOF');

extractText(minimalPdf).then(text => {
    console.log("Extracted Text:", text);
}).catch(err => {
    console.error("Test Failed:", err);
});
