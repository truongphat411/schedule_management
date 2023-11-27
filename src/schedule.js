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
      /// semester - 1 / course - 3 / group_students - 4
          this.data.getDepts().forEach(dept => {
            dept.getGroupStudents().forEach(group => {
              dept.getCourses().forEach(course => {
                const newClass = new Class(this.classNumb++, group, dept, course);
                const generateMeetingTime = this.data.getMeetingTimes()[Math.floor(Math.random() * this.data.getMeetingTimes().length)];
                const generateRoom = this.data.getRooms()[Math.floor(Math.random() * this.data.getRooms().length)];
                const generateInstructor = course.getInstructors()[Math.floor(Math.random() * course.getInstructors().length)];
                newClass.setMeetingTime(generateMeetingTime);
                newClass.setRoom(generateRoom);
                newClass.setInstructor(generateInstructor);
                this.classes.push(newClass);
                if(course.credits == 3){
                  const newClass = new Class(this.classNumb++, group, dept, course);
                  newClass.setMeetingTime(this.data.getMeetingTimes()[Math.floor(Math.random() * this.data.getMeetingTimes().length)]);
                  newClass.setRoom(this.data.getRooms()[Math.floor(Math.random() * this.data.getRooms().length)]);
                  newClass.setInstructor(generateInstructor);
                  this.classes.push(newClass);
                }
            });
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
          // if (x.getRoom().getSeatingCapacity() < x.getCourse().getMaxNumberOfStudents()) {
          //   this.numbOfConflicts++;
          // }
          this.classes.filter(y => this.classes.indexOf(y) >= this.classes.indexOf(x)).forEach(y => {
            if (x.getMeetingTime() === y.getMeetingTime() && x.getId() !== y.getId()) {
              if (x.getRoom() === y.getRoom()) {
                this.numbOfConflicts++;
              }
              if (x.getInstructor() === y.getInstructor()) {
                this.numbOfConflicts++;
              }
            }
            if(x.getInstructor() === y.getInstructor() && x.getId() !== y.getId()) {
              if (x.getRoom().getAreaId() !== y.getRoom().getAreaId()) {
                this.numbOfConflicts++;
              }
              if(x.getMeetingTime().getDaysOfTheWeek() === y.getMeetingTime().getDaysOfTheWeek()) {
                if(x.getMeetingTime().getSessionsDuringTheDay() !== y.getMeetingTime().getSessionsDuringTheDay()) {
                  this.numbOfConflicts++;
                }
                if(x.getMeetingTime() === y.getMeetingTime()){
                  this.numbOfConflicts++;
                }
                if(x.getRoom() !== y.getRoom()){
                  this.numbOfConflicts++;
                }
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