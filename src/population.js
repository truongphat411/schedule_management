const Schedule = require("./schedule");

class Population {
    constructor(size, data) {
        this.schedules = new Array(size);
        for (let i = 0; i < size; i++) {
          this.schedules[i] = new Schedule(data).initialize();
        }
    }

    getSchedules() {
        return this.schedules;
    }

    sortByFitness() {
        this.schedules.sort((schedule1, schedule2) => {
          let returnValue = 0;
    
          if (schedule1.getFitness() > schedule2.getFitness()) returnValue = -1;
          else if (schedule1.getFitness() < schedule2.getFitness()) returnValue = 1;
    
          return returnValue;
        });
    
        return this;
    }
}

module.exports = Population;