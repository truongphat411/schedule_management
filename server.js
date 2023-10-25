const app = require('./app');
const { logger } = require('./src/utils/logger');
const { getCourse } = require('./src/data');


const PORT = process.env.PORT || 3000;

getCourse();

app.listen(PORT, () => {
    logger.info(`Running on PORT ${PORT}`);
});
