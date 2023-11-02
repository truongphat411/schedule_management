const app = require('./app');
const { logger } = require('./src/utils/logger');
const db = require('./src/config/db.config');
const Driver = require('./src/driver');
const util = require('util');

const PORT = process.env.PORT || 3000;

// const driver = new Driver();
// driver.main();


app.listen(PORT, () => {
    logger.info(`Running on PORT ${PORT}`);
});
