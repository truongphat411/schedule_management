const Data = require("./data");
const Population = require("./population");
const GeneticAlgorithm = require("./genetic_algorithm");
const db = require('./config/db.config');
const util = require('util');


class Driver {
  constructor() {
    this.POPULATION_SIZE = 100;
    this.MUTATION_RATE = 0.1; // 0.01 - 0.1
    this.CROSSOVER_RATE = 0.9; // 0.7 - 0.9 ~ 1
    this.TOURNAMENT_SELECTION_SIZE = 3; // 2 - 5
    this.NUMB_OF_ELITE_SCHEDULES = 1; // 1 or 2
    this.scheduleNumb = 0;
    this.classNumb = 1;
    this.data;
  }

  getPOPULATION_SIZE(){
    return this.POPULATION_SIZE;
  }

  getMUTATION_RATE(){
    return this.MUTATION_RATE;
  }

  getCROSSOVER_RATE(){
    return this.CROSSOVER_RATE;
  }

  getTOURNAMENT_SELECTION_SIZE(){
    return this.TOURNAMENT_SELECTION_SIZE;
  }

  getNUMB_OF_ELITE_SCHEDULES(){
    return this.NUMB_OF_ELITE_SCHEDULES;
  }

  getscheduleNumb(){
    return this.scheduleNumb;
  }

  getclassNumb(){
    return this.classNumb;
  }



  async main(department_id, semester_id) {
    this.data = new Data();
    const driver = new Driver();
    await this.data.initialize(department_id, semester_id);
    var generationNumber = 0;
    const geneticAlgorithm = new GeneticAlgorithm(this.data,driver);
    var population = new Population(this.POPULATION_SIZE, this.data).sortByFitness();
    //this.printScheduleAsTable(population.getSchedules()[0], generationNumber);
    this.classNumb = 1;
    let lastSchedule = null;

    while (population.getSchedules()[0].getFitness() !== 1.0) {
      ++generationNumber;
      population = geneticAlgorithm.evolve(population).sortByFitness();
      this.scheduleNumb = 0;
      //this.printScheduleAsTable(population.getSchedules()[0], generationNumber);
      this.classNumb = 1;
    }

    if(population.getSchedules()[0].getFitness() === 1.0) {
      lastSchedule = population.getSchedules()[0].getClasses();
      await this.async_push_query(`
        DELETE FROM class 
        WHERE course_id IN (
          SELECT c.id 
          FROM course c 
          JOIN department_course dc ON c.id = dc.course_id
          WHERE c.semester_id = ? AND dc.department_id = ?
        );
        `, [department_id,semester_id]);
      for(let i of lastSchedule){
        await this.async_push_query("INSERT INTO class SET ?",{
          course_id: i.course.id,
          instructor_id: i.instructor.id,
          room_id: i.room.id,
          meeting_time_id: i.meetingTime.id,
          department_id: i.department.id
        });
      }
      console.log("success");
    }

    return lastSchedule;
  }

  async printScheduleAsTable (schedule , generation) {
      const classes = schedule.getClasses();
      console.log("\n                      ");
      console.log("Class # | Dept | Course (credits, max # of students) | Room (Capacity) |     Instructor (ID)     | Meeting Time (ID) ");
      console.log("  ");
		  console.log("------------------------------------------------------");
		  console.log("---------------------------------------------------------------");

      classes.forEach(x => {
        const listCourseName = [];
        const courses = this.data.getCourses();
        const listDepartmentName = [];
        const majors = this.data.getDepts();
        const listInstructorName = [];
        const instructor = this.data.getInstructors();
        for(let i of courses){
          var name = i.course_name;
          listCourseName.push(name);
        }
        for(let i of majors){
          var name = i.department_name;
          listDepartmentName.push(name);
        }
        for(let i of instructor){
          var name = i.instructor_name;
          listInstructorName.push(name);
        }
        const departmentIndex = listDepartmentName.indexOf(x.getDept().department_name);
        const coursesIndex = listCourseName.indexOf(x.getCourse().course_name);
        const roomsIndex = this.data.getRooms().indexOf(x.getRoom());
        const instructorsIndex = listInstructorName.indexOf(x.getInstructor().instructor_name);
        const meetingTimeIndex = this.data.getMeetingTimes().indexOf(x.getMeetingTime());
        console.log(`\n  ${this.classNumb.toString().padStart(2, ' ')}  |  ` +
      `${this.data.getDepts()[departmentIndex].department_name.toString().padStart(4, ' ')}  |  ` +
      `${(this.data.getCourses()[coursesIndex].course_name + " (" + this.data.getCourses()[coursesIndex].credits + ", " + 
      this.data.getCourses()[coursesIndex].maxNumberOfStudents).padEnd(21, ' ') + ")"}  |  ` +
      `${(this.data.getRooms()[roomsIndex].room_name + " ( " + this.data.getRooms()[roomsIndex].capacity).padEnd(10, ' ')+ ")"}  |  ` +
      `${(this.data.getInstructors()[instructorsIndex].instructor_name + 
        " (" + this.data.getInstructors()[instructorsIndex].id).padEnd(15, ' ')+ ")"}  |  ` +
     `${this.data.getMeetingTimes()[meetingTimeIndex].time} (${this.data.getMeetingTimes()[meetingTimeIndex].id})`);

      this.classNumb++;
      });

      if (schedule.getFitness() === 1) {
        console.log(`\n> Solution Found in ${generation + 1} generations\n`);
      }
      console.log("---------------------------------------------------------");
		  console.log("------------------------------------------------------");
  }


  async printAvailableData() {
    this.data = new Data();
    await this.data.initialize();
    console.log("\n------ Available Lecturers ------");
    let i = 0;
    this.data.getInstructors().forEach((instructor) => {
      console.log(`${++i}: ${instructor.getInstructorName()}\n`);
    });

    console.log("\n------ Available Course ------");
    this.data.getCourses().forEach((course) => {
      console.log(`Course Title: ${course.getCourseName()}\nMax # of Students: ${course.getMaxNumberOfStudents()}\nInstructor(s): ${course.getListInstructors()}\n`);
    });

    console.log("\n------ Available Lecture Venues ------");
    console.log('PhatNMT-room: ', this.data.getRoom());
    this.data.getRoom().forEach((room) => {
      console.log(`Venue Title: ${room.getRoomName()}\nMax Seating Capacity: ${room.getCapacity()}\n`);
    });

    console.log("\n------ Available Meeting Times ------");
    i = 0;
    this.data.getMeetingTimes().forEach((meetingTime) => {
      console.log(`Day: ${meetingTime.getDay()}\nStart time: ${meetingTime.getStartTime()}\nEnd time: ${meetingTime.getEndTime()}`);
    });

    console.log("\n\n------ Available Classes ------");
    this.data.getDepartment().forEach((dept) => {
      console.log(`Major Name: ${dept.getMajorName()}\nCourses Offered: ${dept.getListCourse()}\n`);
    });

    console.log("...........................................................................................");
    console.log("...........................................................................................");
  }

  async async_get_query(sql_query) {
    return util.promisify(db.query).call(db, sql_query);
  } 

  async async_push_query(sql_query, info) {
      return util.promisify(db.query).call(db, sql_query, info);
  }
  
}

// Entry point
// const driver = new Driver();
// driver.printAvailableData();

module.exports = Driver;