const Schedule = require("./schedule");
const Population = require("./population");

class GeneticAlgorithm {
  constructor(data, driver) {
    this.data = data;
    this.driver = driver;
  }

  evolve(population) {
    return this.mutatePopulation(this.crossoverPopulation(population));
  }

  crossoverPopulation(population) {
    var crossoverPopulation = new Population(population.getSchedules().length, this.data);

    for (let x = 0; x < this.driver.getNUMB_OF_ELITE_SCHEDULES; x++) {
      crossoverPopulation.getSchedules()[x] = population.getSchedules()[x];
    }

    for (let x = this.driver.getNUMB_OF_ELITE_SCHEDULES; x < population.getSchedules().length; x++) {
      if (this.driver.getCROSSOVER_RATE > Math.random()) {
        const schedule1 = selectTournamentPopulation(population).sortByFitness().getSchedules()[0];
        const schedule2 = selectTournamentPopulation(population).sortByFitness().getSchedules()[0];
        crossoverPopulation.getSchedules()[x] = crossoverSchedule(schedule1, schedule2);
      } else {
        crossoverPopulation.getSchedules()[x] = population.getSchedules()[x];
      }
    }
    return crossoverPopulation;
  }

  crossoverSchedule(schedule1, schedule2) {
    var crossoverSchedule = new Schedule(this.data).initialize();
    for (let x = 0; x < crossoverSchedule.getClasses().length; x++) {
      if (Math.random() > 0.5) {
        crossoverSchedule.getClasses()[x] = schedule1.getClasses()[x];
      } else {
        crossoverSchedule.getClasses()[x] = schedule2.getClasses()[x];
      }
    }
    return crossoverSchedule;
  }

  mutatePopulation(population) {
    var mutatePopulation = new Population(population.getSchedules().length, this.data);
    var schedules = mutatePopulation.getSchedules();

    for (let x = 0; x < this.driver.getNUMB_OF_ELITE_SCHEDULES; x++) {
      schedules[x] = population.getSchedules()[x];
    }

    for (let x = this.driver.getNUMB_OF_ELITE_SCHEDULES; x < population.getSchedules().length; x++) {
      schedules[x] = mutateSchedule(population.getSchedules()[x]);
    }

    // schedules.forEach((schedule, x) => {
    //   if (x < Driver.NUMB_OF_ELITE_SCHEDULES) {
    //     schedules[x] = population.getSchedules()[x];
    //   } else {
    //     schedules[x] = this.mutateSchedule(population.getSchedules()[x]);
    //   }
    // });
    return mutatePopulation;
  }

  mutateSchedule(mutateSchedule) {
    var schedule = new Schedule(this.data).initialize();

    for (let x = 0; x < mutateSchedule.getClasses().length; x++) {
      if (this.driver.getMUTATION_RATE > Math.random()) {
        mutateSchedule.getClasses()[x] = schedule.getClasses()[x];
      }
    }
    return mutateSchedule;
  }

  selectTournamentPopulation(population) {
    var tournamentPopulation = new Population(this.driver.getTOURNAMENT_SELECTION_SIZE, this.data);

    for (let x = 0; x < this.driver.getTOURNAMENT_SELECTION_SIZE; x++) {
      var randomIndex = Math.floor(Math.random() * population.getSchedules().length);
      tournamentPopulation.getSchedules()[x] = population.getSchedules()[randomIndex];
    }
    return tournamentPopulation;
  }
}

module.exports = GeneticAlgorithm;
