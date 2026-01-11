const pdf = require('pdf-parse');
const mammoth = require('mammoth');

const MAX_TEXT_LENGTH = 25000; // Safe limit for LLM context

const extractText = async (file) => {
    try {
        let text = '';
        const buffer = file.buffer;
        const mimeType = file.mimetype;

        if (mimeType === 'application/pdf') {
            const data = await pdf(buffer);
            text = data.text;
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ buffer: buffer });
            text = result.value;
        } else if (mimeType === 'text/plain') {
            text = buffer.toString('utf-8');
        } else {
            throw new Error('Unsupported file type');
        }

        // Clean up text
        text = text.replace(/\s+/g, ' ').trim();

        // Truncate if necessary
        if (text.length > MAX_TEXT_LENGTH) {
            console.warn(`Document truncated from ${text.length} to ${MAX_TEXT_LENGTH} characters.`);
            text = text.substring(0, MAX_TEXT_LENGTH) + "\n...[TRUNCATED]";
        }

        return text;
    } catch (error) {
        console.error("File extraction error:", error);
        throw new Error("Failed to extract text from file: " + error.message);
    }
};

module.exports = { extractText };
