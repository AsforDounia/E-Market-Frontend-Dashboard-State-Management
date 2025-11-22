import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter to only accept images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (JPG, PNG, GIF, WebP)'));
    }
};

// Multer upload instance
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
    fileFilter: fileFilter,
});

// Process and save avatar image
export const processAvatar = async (file, userId) => {
    try {
        // Ensure uploads directory exists
        const uploadsDir = path.join(__dirname, '../uploads/avatars');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Generate unique filename
        const filename = `avatar-${userId}-${Date.now()}.webp`;
        const filepath = path.join(uploadsDir, filename);

        // Process image: resize and convert to WebP
        await sharp(file.buffer)
            .resize(400, 400, {
                fit: 'cover',
                position: 'center',
            })
            .webp({ quality: 90 })
            .toFile(filepath);

        // Return the relative URL path
        return `/uploads/avatars/${filename}`;
    } catch (error) {
        console.error('Error processing avatar:', error);
        throw new Error('Failed to process avatar image');
    }
};

// Delete old avatar file
export const deleteOldAvatar = (avatarUrl) => {
    try {
        if (!avatarUrl) return;

        const filename = path.basename(avatarUrl);
        const filepath = path.join(__dirname, '../uploads/avatars', filename);

        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    } catch (error) {
        console.error('Error deleting old avatar:', error);
        // Don't throw - this is not critical
    }
};
