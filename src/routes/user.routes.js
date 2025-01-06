const express = require('express');
const router = express.Router();
const cacheMiddleware = require('../middleware/cache.middleware');
const { fetchUser } = require('../services/mockDB.service');
const { setCacheData, batchProcess } = require('../services/cache.service');
const { updateStats, getMetadata } = require('../utils/stats.util');

router.get('/:id', cacheMiddleware('user'), async (req, res, next) => {
    try {
        const user = await fetchUser(req.params.id);
        await setCacheData(req.cacheKey, user, req.cacheTTL);

        const responseTime = Date.now() - req.startTime;
        updateStats('responseTime', responseTime);

        res.json({
            data: user,
            metadata: getMetadata(responseTime, false)
        });
    } catch (err) {
        next(err);
    }
});

router.post('/batch', async (req, res) => {
    const result = await batchProcess([1, 2, 3]);
    res.json({ results: result });
});

module.exports = router;