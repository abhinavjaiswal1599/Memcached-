let stats = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
    averageResponseTime: 0
};

const updateStats = (type, value) => {
    switch (type) {
        case 'hits':
            stats.hits++;
            break;
        case 'misses':
            stats.misses++;
            break;
        case 'totalRequests':
            stats.totalRequests++;
            break;
        case 'responseTime':
            stats.averageResponseTime = 
                (stats.averageResponseTime * (stats.totalRequests - 1) + value) 
                / stats.totalRequests;
            break;
    }
};

const getStats = () => ({
    ...stats,
    missRate: (stats.misses / stats.totalRequests * 100).toFixed(2) + '%',
    hitRate: (stats.hits / stats.totalRequests * 100).toFixed(2) + '%',
    averageResponseTime: stats.averageResponseTime.toFixed(2) + 'ms'
});

const getMetadata = (responseTime, cached) => ({
    cached,
    responseTime,
    hitRate: (stats.hits / stats.totalRequests * 100).toFixed(2) + '%'
});

module.exports = {
    updateStats,
    getStats,
    getMetadata
};