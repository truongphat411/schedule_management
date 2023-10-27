const Data = require("./data");
const Population = require("./population");
const GeneticAlgorithm = require("./genetic_algorithm");
const Department = require("./models/department.model");


class Driver {
  constructor() {
    this.POPULATION_SIZE = 9;
    this.MUTATION_RATE = 0.1;
    this.CROSSOVER_RATE = 0.9;
    this.TOURNAMENT_SELECTION_SIZE = 3;
    this.NUMB_OF_ELITE_SCHEDULES = 1;
    this.scheduleNumb = 0;
    this.classNumb = 1;
    this.data;
  }

  async main() {
    this.data = new Data();
    await this.data.initialize();
    var generationNumber = 0;
    const geneticAlgorithm = new GeneticAlgorithm(this.data);
    const population = new Population(this.POPULATION_SIZE, this.data).sortByFitness();
    this.classNumb = 1;
    population.getSchedules().forEach(schedule => {
      console.log(`     ${this.scheduleNumb++}     | ${schedule.toString()}  | ` +
          `${schedule.getFitness().toFixed(5)}  |   ${schedule.getNumberOfConflicts()}`);
    });
    this.printScheduleAsTable(population.getSchedules()[0], generationNumber);
    this.classNumb = 1;

    while (population.getSchedules()[0].getFitness() !== 1.0) {
      ++generationNumber;
      console.log(`> Generation # ${++generationNumber}`);
      console.log('     Schedule # |                                   ');
      console.log('Classes [dept,class,room,instructor,meeting.time]    ');
      console.log('                              | Fitness | Conflicts');
      console.log('......................................................................');
      console.log('...........................................................................');
  
      population = geneticAlgorithm.evolve(population).sortByFitness();
      this.scheduleNumb = 0;
      this.printScheduleAsTable(population.getSchedules()[0], generationNumber);
      this.classNumb = 1;
  }


  }

  async printScheduleAsTable (schedule , generation) {
      const classes = schedule.getClasses();
      console.log("\n                      ");
      console.log("Class # | Dept | Course (credits, max # of students) | Room (Capacity) |     Instructor (ID)     | Meeting Time (ID) ");
      console.log("  ");
		  console.log("------------------------------------------------------");
		  console.log("---------------------------------------------------------------");

      classes.forEach(x => {
        console.log('PhatNMT-listdepartment: ',this.data.getDepts());
        console.log('PhatNMT-listcourse: ',this.data.getCourses());
        console.log('PhatNMT-major: ',x.getDept());
        console.log('PhatNMT-course: ',x.getCourse());
        console.log('PhatNMT-room: ',x.getRoom());
        console.log('PhatNMT-instructor: ',x.getInstructor());
        console.log('PhatNMT-meetingtime: ',x.getMeetingTime());
        const majorIndex = this.data.getDepts().indexOf(x.getDept());
        const coursesIndex = this.data.getCourses().indexOf(x.getCourse());
        const roomsIndex = this.data.getRooms().indexOf(x.getRoom());
        const instructorsIndex = this.data.getInstructors().indexOf(x.getInstructor());
        const meetingTimeIndex = this.data.getMeetingTimes().indexOf(x.getMeetingTime());
      //  const deptName = "";
      //   for (let i = 0; i < this.data.getDepts().length; i++) {
      //     const course = this.data.getCourses()[coursesIndex];
      //     var dept = new Department();
      //     dept = this.data.getDepts()[i];
      //     const foundCourse = dept.getCourses().find(c => c.equals(course));
      //     if (foundCourse) {
      //         deptName = dept.getMajorName();
      //         break;
      //     }
      // }
        //console.log("                     ");
        console.log(`\n  ${this.classNumb.toString().padStart(2, ' ')}  |  ` +
      `${this.data.getDepts()[majorIndex].getMajorName().toString().padStart(4, ' ')}  |  ` +
      `${(this.data.getCourses()[coursesIndex].getCourseName() + " (" + this.data.getCourses()[coursesIndex].getCredits() + ", " + this.data.getCourses()[coursesIndex].getMaxNumberOfStudents()).padEnd(21, ' ')}  |  ` +
      `${(this.data.getRooms()[roomsIndex].getRoomName() + "(" + this.data.getRooms[roomsIndex].getSeatingCapacity()).padEnd(10, ' ')}  |  ` +
      `${(this.data.getInstructors()[instructorsIndex].getName() + " (" + this.data.getInstructors()[instructorsIndex].getId()).padEnd(15, ' ')}  |  ` +
     `${this.data.getMeetingTimes()[meetingTimeIndex].getTime()} (${data.meetingTimes()[meetingTimeIndex].getId()})`);

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
}

// // Entry point
// const driver = new Driver();
// driver.printAvailableData();

module.exports = Driver;