const app = require('./app');
const { logger } = require('./src/utils/logger');
const db = require('./src/config/db.config');
const Course = require('./src/models/course.model');

const PORT = process.env.PORT || 3000;

async function getCourse(){
    // const result = await db.query(`SELECT * FROM course`)
    const result = await db.async_get_query("SELECT * FROM course");
    const courses = [];
    for(let i of result){
        const course = new Course();
        course.course_name = i.course_name;
        course.credits = (await db.async_get_query("SELECT * FROM course")).map();
        for(j of course.credits)
        courses.push(course);
    }
    console.log('Data: ', courses);
    return courses;
}

getCourse();

app.listen(PORT, () => {
    logger.info(`Running on PORT ${PORT}`);
});
