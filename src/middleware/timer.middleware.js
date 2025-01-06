const timerMiddleware = (req, res, next) => {
    req.startTime = Date.now();
    next();
};

module.exports = timerMiddleware;