
const express = require('express');
const router = express.Router();
const { getStats } = require('../utils/stats.util');
const { clearByPattern, getCacheData } = require('../services/cache.service');

router.get('/stats', (req, res) => {
    try {
        const statistics = getStats();
        res.json({ 
            success: true,
            statistics 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            error: 'Error fetching cache statistics' 
        });
    }
});

router.delete('/:pattern', async (req, res) => {
    try {
        const result = await clearByPattern(req.params.pattern);
        if (result.status === 'error') {
            return res.status(500).json({
                success: false,
                ...result
            });
        }
        res.json({
            success: true,
            ...result
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            error: 'Cache deletion failed',
            message: err.message 
        });
    }
});

router.get('/entry/:key', async (req, res) => {
    try {
        const data = await getCacheData(`user_${req.params.key}`);
        if (data) {
            res.json({
                success: true,
                data
            });
        } else {
            res.json({
                success: true,
                message: 'No cache entry found for this key'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Error fetching cache entry',
            message: err.message
        });
    }
});

module.exports = router;