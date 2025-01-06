

const memcached = require('../config/memcached');
const { fetchUser } = require('./mockDB.service');

const setCacheData = async (key, value, ttl) => {
    const lifetime = parseInt(ttl) || 60;
    
    return new Promise((resolve, reject) => {
        memcached.set(key, value, lifetime, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};

const getCacheData = async (key) => {
    return new Promise((resolve, reject) => {
        memcached.get(key, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
};

const clearByPattern = async (pattern) => {
    try {
        const key = `user_${pattern}`;
        
        return new Promise((resolve) => {
            memcached.del(key, (err) => {
                if (err) {
                    resolve({ 
                        status: 'error',
                        message: `Failed to delete key: ${key}`,
                        error: err.message 
                    });
                }
                resolve({ 
                    status: 'success',
                    message: `Successfully deleted cache for key: ${key}`
                });
            });
        });
    } catch (err) {
        return { 
            status: 'error',
            message: 'Cache deletion failed',
            error: err.message 
        };
    }
};

const batchProcess = async (userIds) => {
    const results = [];

    for (const id of userIds) {
        const cacheKey = `user_${id}`;
        try {
            const cachedData = await getCacheData(cacheKey);

            if (cachedData) {
                results.push({ id, data: cachedData, cached: true });
            } else {
                const user = await fetchUser(id);
                await setCacheData(cacheKey, user, 60);
                results.push({ id, data: user, cached: false });
            }
        } catch (err) {
            results.push({ id, error: err.message });
        }
    }

    return results;
};

module.exports = {
    setCacheData,
    getCacheData,
    clearByPattern,
    batchProcess
};