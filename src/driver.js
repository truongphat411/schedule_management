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
      console.log('PhatNMT-log: ',generationNumber);
      this.classNumb = 1;
    }

    if(population.getSchedules()[0].getFitness() === 1.0) {
      lastSchedule = population.getSchedules()[0].getClasses();
      // await this.async_push_query(`
      //   DELETE FROM class 
      //   WHERE course_id IN (
      //     SELECT c.id 
      //     FROM course c 
      //     JOIN department_course dc ON c.id = dc.course_id
      //     WHERE c.semester_id = ? AND dc.department_id = ?
      //   );
      //   `, [department_id,semester_id]);
      // for(let i of lastSchedule){
      //   await this.async_push_query("INSERT INTO class SET ?",{
      //     course_id: i.course.id,
      //     instructor_id: i.instructor.id,
      //     room_id: i.room.id,
      //     meeting_time_id: i.meetingTime.id,
      //     department_id: i.department.id,
      //     group_students_id: i.group_students.id,
      //     semester_id: semester_id
      //   });
      //}
      console.log("success");
    }

    return lastSchedule;
  }

  async async_get_query(sql_query) {
    return util.promisify(db.query).call(db, sql_query);
  } 

  async async_push_query(sql_query, info) {
      return util.promisify(db.query).call(db, sql_query, info);
  }
  
}

module.exports = Driver;