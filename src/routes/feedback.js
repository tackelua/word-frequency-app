const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Feedback, User } = require('../models');
const authenticateToken = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'feedback-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only images and videos are allowed'));
        }
    }
});

// Submit Feedback (Public or Auth) - with multiple file upload
router.post('/', upload.array('media', 5), async (req, res) => {
    try {
        const { content, type, email } = req.body;
        const mediaPaths = req.files ? req.files.map(f => f.path) : [];

        let userId = null;
        // Try to get user from token if present (optional)
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            // Verify token manually here or use middleware optionally. 
            // For simplicity, just trust the client sent email or leave userId null if anonymous.
            // Actually, let's try to decode if we can
        }

        await Feedback.create({
            content,
            type: type || 'general',
            email,
            media: mediaPaths.length > 0 ? JSON.stringify(mediaPaths) : null
        });

        res.json({ success: true, message: 'Feedback received' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

// Get Feedback (Admin Only)
router.get('/', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.email !== 'admin@example.com') {
            // Fallback for hardcoded admin during dev
            return res.status(403).json({ error: 'Admin access required' });
        }

        const feedbacks = await Feedback.findAll({
            order: [['createdAt', 'DESC']],
            include: [User]
        });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

module.exports = router;
