const app = require('./app');
const { logger } = require('./src/utils/logger');
const db = require('./src/config/db.config');
const Data = require('./src/data');

const PORT = process.env.PORT || 3000;
async function main(){
    const data = new Data();
    await data.initialize();
    console.log('///// Room /////');
    console.log('Room: ', data.getRoom());
    console.log('///// Meeting Time /////');
    console.log('Meeting Time: ', data.getMeetingTimes());
    console.log('///// Instructor /////');
    console.log('Instructor: ', data.getInstructors());
    console.log('///// Course /////');
    console.log('Course: ', data.getCourses());
    console.log('///// Department /////');
    console.log('Department: ', data.getDepartment());
}

main();



app.listen(PORT, () => {
    logger.info(`Running on PORT ${PORT}`);
});
