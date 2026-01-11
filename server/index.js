require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { extractText } = require('./services/fileProcessing');
const { analyzeDocument, conductResearch } = require('./services/ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// File Upload Config (Memory storage to avoid disk cleanup issues for now, max 5MB)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// API Routes

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. Analyze Document
app.post('/api/analyze-document', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log(`Processing file: ${req.file.originalname} (${req.file.size} bytes)`);

        // 1. Extract Text
        const text = await extractText(req.file);
        if (!text || text.length < 50) {
            return res.status(400).json({ error: "Could not extract sufficient text from file." });
        }

        // 2. Analyze with AI
        const analysis = await analyzeDocument(text);

        res.json(analysis);

    } catch (error) {
        console.error("Document Analysis Error:", error);
        require('fs').appendFileSync('server_errors.log', `[${new Date().toISOString()}] Analysis Error: ${error.message}\n${error.stack}\n`);
        const status = error.message.includes("API Key") ? 500 : 400;
        res.status(status).json({
            error: error.message || "Internal Server Error",
            details: "An error occurred during processing."
        });
    }
});

// 2. Legal Research
app.post('/api/legal-research', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return res.status(400).json({ error: "Invalid query provided" });
        }

        console.log(`Researching query: ${query.substring(0, 50)}...`);

        const result = await conductResearch(query);
        res.json(result);

    } catch (error) {
        console.error("Legal Research Error:", error);
        res.status(500).json({ error: error.message || "Failed to conduct research." });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Server Error:", err);
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: "File too large. Max size is 10MB." });
        }
    }
    res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
