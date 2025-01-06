const Memcached = require('memcached');

const memcached = new Memcached(process.env.MEMCACHED_SERVER, {
    retry: 10000,
    retries: 5,
    poolSize: 10,
    timeout: 5000
});

module.exports = memcached;