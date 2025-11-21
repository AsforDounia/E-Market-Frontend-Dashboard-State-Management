import express from 'express';
import { authenticate, authorize } from '../../../middlewares/auth.js';
import { getPerformanceStats, resetCacheStats, clearAllCache } from '../../../controllers/performanceController.js';

const performanceRoutes = express.Router();

// Test endpoint (no auth required)
performanceRoutes.get('/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Performance routes are working',
        timestamp: new Date()
    });
});

// Protected admin routes
performanceRoutes.get('/stats', authenticate, authorize('admin'), getPerformanceStats);
performanceRoutes.post('/cache/reset', authenticate, authorize('admin'), resetCacheStats);
performanceRoutes.post('/cache/clear', authenticate, authorize('admin'), clearAllCache);

export default performanceRoutes;