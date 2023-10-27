const Data = require("./data");
const Population = require("./population");
const GeneticAlgorithm = require("./genetic_algorithm")


class Driver {
  static POPULATION_SIZE = 9;
  static MUTATION_RATE = 0.1;
  static CROSSOVER_RATE = 0.9;
  static TOURNAMENT_SELECTION_SIZE = 3;
  static NUMB_OF_ELITE_SCHEDULES = 1;
  scheduleNumb = 0;
  classNumb = 1;
  data;

  constructor() {
    this.data = new Data();
  }

  printAvailableData() {
    console.log("\n------ Available Lecturers ------");
    let i = 0;
    this.data.getInstructors().forEach((instructor) => {
      console.log(`${++i}: ${instructor.getName()}\n`);
    });

    console.log("\n------ Available Course ------");
    this.data.getCourses().forEach((course) => {
      console.log(`Course Title: ${course.getName()}\nMax # of Students: ${course.getMaxNumberOfStudents()}\nInstructor(s): ${course.getInstructors()}\n`);
    });

    console.log("\n------ Available Lecture Venues ------");
    this.data.getRooms().forEach((room) => {
      console.log(`Venue Title: ${room.getNumber()}\nMax Seating Capacity: ${room.getSeatingCapacity()}\n`);
    });

    console.log("\n------ Available Meeting Times ------");
    i = 0;
    this.data.getMeetingTimes().forEach((meetingTime) => {
      console.log(`${++i}: ${meetingTime.getTime()}`);
    });

    console.log("\n\n------ Available Classes ------");
    this.data.getDepts().forEach((dept) => {
      console.log(`Class Name: ${dept.getName()}\nCourses Offered: ${dept.getCourses()}\n`);
    });

    console.log("...........................................................................................");
    console.log("...........................................................................................");
  }
}

// Entry point
const driver = new Driver();
driver.printAvailableData();