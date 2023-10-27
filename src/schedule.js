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

    // initialize(){
    //     console.log('PhatNMT-log: ', this.data.getDepartment())
    //     this.data.getDepartment().foreach(dept => {
    //         dept.getListCourse().foreach(course => {
    //             const newClass = new Class(this.classNumb++, dept, course);
    //             newClass.setMeetingTime(this.data.getMeetingTimes()[Math.floor(Math.random() * this.data.getMeetingTimes().length)]);
    //             newClass.setRoom(data.getRoom()[Math.floor(Math.random() * this.data.getRooms().length)]);
    //             newClass.setInstructor(course.getInstructors()[Math.floor(Math.random() * course.getInstructors().length)]);
    //             this.classes.push(newClass);
    //         });
    //     });
    //     return this;
    // }

    initialize() {      
      this.data.getDepts().forEach(dept => {
          dept.getCourses().forEach(course => {
              const newClass = new Class(this.classNumb++, dept, course);
              newClass.setMeetingTime(this.data.getMeetingTimes()[Math.floor(Math.random() * this.data.getMeetingTimes().length)]);
              newClass.setRoom(this.data.getRooms()[Math.floor(Math.random() * this.data.getRooms().length)]);
              newClass.setInstructor(this.data.getInstructors()[Math.floor(Math.random() * this.data.getInstructors().length)]);
              this.classes.push(newClass);
          });
      });
  
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
          if (x.getRoom().getSeatingCapacity() < x.getCourse().getMaxNumberOfStudents()) {
            this.numbOfConflicts++;
          }
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