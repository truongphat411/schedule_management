const Class = require("./models/class.model")


class Schedule{
    constructor(data) {
        this.classes = [];
        this.isFitnessChanged = true;
        this.fitness = -1;
        this.classNumb = 0;
        this.numbOfConflicts = 0;
        this.data = data;
    }

    getData(){
        return this.data;
    }

    initialize(){
        const depts = this.data.getDepts();
        for(let i = 0;i < depts.length;i++) {
          const dept = depts[i];
          const groupStudents = dept.getGroupStudents();
          for(let j = 0; j < groupStudents.length; j++) {
              const group = groupStudents[j];
              const courses = dept.getCourses();
              for (let k = 0; k < courses.length; k++) {
                const course = courses[k];
                const newClass = new Class(this.classNumb++, group, dept, course);
                const generateMeetingTime = this.data.getMeetingTimes()[Math.floor(Math.random() * this.data.getMeetingTimes().length)];
                const generateRoom = this.data.getRooms()[Math.floor(Math.random() * this.data.getRooms().length)];
                const generateInstructor = course.getInstructors()[Math.floor(Math.random() * course.getInstructors().length)];
                newClass.setMeetingTime(generateMeetingTime);
                newClass.setRoom(generateRoom);
                newClass.setInstructor(generateInstructor);
                this.classes.push(newClass);
              }
          }
        }
        return this;
    }
    getNumberOfConflicts() {
        return this.numbOfConflicts;
    }

    getClasses() {
        this.isFitnessChanged = true;
        return this.classes;
    }

    getFitness() {
        if (this.isFitnessChanged === true) {
          this.fitness = this.calculateFitness();
          this.isFitnessChanged = false;
        }
    
        return this.fitness;
    }

    calculateFitness() {
        this.numbOfConflicts = 0;

        this.classes.forEach(x => {
          this.classes.filter(y => this.classes.indexOf(y) >= this.classes.indexOf(x)).forEach(y => {
            if (x.getMeetingTime() === y.getMeetingTime() && x.getId() !== y.getId()) {
              if (x.getRoom() === y.getRoom()) {
                this.numbOfConflicts++;
              }
              if (x.getInstructor() === y.getInstructor()) {
                this.numbOfConflicts++;
              }
            }
          });
        });
        return 1 / (this.numbOfConflicts + 1);
    }

    toString() {
      let returnValue = '';
      for (let x = 0; x < this.classes.length - 1; x++) {
          returnValue += this.classes[x] + ', ';
      }
      returnValue += this.classes[this.classes.length - 1];
      return returnValue;
  }
}

module.exports = Schedule;