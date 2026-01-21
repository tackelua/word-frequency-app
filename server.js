require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { parseFile } = require('./src/parsers');
const { analyzeWordFrequency } = require('./src/analyzer');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: Infinity }, // No file size limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'text/plain',
            'text/csv'
        ];

        const ext = path.extname(file.originalname).toLowerCase();
        const allowedExts = ['.pdf', '.docx', '.doc', '.txt', '.csv'];

        if (allowedExts.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`Unsupported file type. Allowed: ${allowedExts.join(', ')}`));
        }
    }
});

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user_words');
const feedbackRoutes = require('./src/routes/feedback');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/feedback', feedbackRoutes);

// Initialize DB
const { sequelize } = require('./src/models'); // This will sync tables

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Word Frequency Analyzer API' });
});

// File upload and analysis endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const fileName = req.file.originalname;

        // Parse file
        const parseStart = Date.now();
        console.log(`📄 Parsing file: ${fileName}...`);
        const text = await parseFile(filePath, req.file.mimetype);
        console.log(`✓ Parsed in ${((Date.now() - parseStart) / 1000).toFixed(2)}s`);

        if (!text || text.trim().length === 0) {
            // Clean up uploaded file
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: 'No text content found in file' });
        }

        // Analyze word frequency
        const analyzeStart = Date.now();
        console.log(`📊 Analyzing word frequency...`);
        const analysis = analyzeWordFrequency(text, {
            minLength: 3,  // Minimum 3 letters for meaningful vocabulary
            maxResults: Infinity,  // No limit on results
            caseSensitive: false,
            includeStopwords: false
        });
        console.log(`✓ Analyzed ${analysis.uniqueWords} unique words in ${((Date.now() - analyzeStart) / 1000).toFixed(2)}s`);

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        // Return results
        res.json({
            success: true,
            fileName,
            analysis
        });

    } catch (error) {
        console.error('Error processing file:', error);

        // Clean up file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            error: 'Failed to process file',
            message: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📊 Upload files to analyze word frequency`);
});
