require('dotenv').config();
const express = require('express');
const errorMiddleware = require('./middleware/error.middleware');
const timerMiddleware = require('./middleware/timer.middleware');
const cacheRoutes = require('./routes/cache.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(express.json());
app.use(timerMiddleware);
app.use('/cache', cacheRoutes);
app.use('/users', userRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));