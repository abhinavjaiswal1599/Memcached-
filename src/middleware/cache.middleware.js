

const memcached = require('../config/memcached');
const { updateStats, getMetadata } = require('../utils/stats.util');

const cacheMiddleware = (key, ttl) => async (req, res, next) => {
    const cacheTTL = parseInt(ttl || process.env.CACHE_TTL) || 60;
    const cacheKey = `${key}_${req.params.id || 'default'}`;
    
    try {
        const data = await getCacheData(cacheKey);
        updateStats('totalRequests');
        
        if (data) {
            updateStats('hits');
            const responseTime = Date.now() - req.startTime;
            updateStats('responseTime', responseTime);
            
            return res.json({
                data,
                metadata: getMetadata(responseTime, true)
            });
        }

        updateStats('misses');
        req.cacheKey = cacheKey;
        req.cacheTTL = cacheTTL;
        next();
    } catch (err) {
        next(err);
    }
};

const getCacheData = async (key) => {
    return new Promise((resolve, reject) => {
        memcached.get(key, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

module.exports = cacheMiddleware;