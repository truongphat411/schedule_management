const app = require('./app');
const { logger } = require('./src/utils/logger');
const db = require('./src/config/db.config');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Running on PORT ${PORT}`);
});