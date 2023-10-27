const Driver = require("./driver");
const Schedule = require("./schedule");
const Population = require("./population");

class GeneticAlgorithm {
  constructor(data) {
    this.data = data;
  }

  evolve(population) {
    return this.mutatePopulation(this.crossoverPopulation(population));
  }

  crossoverPopulation(population) {
    const crossoverPopulation = new Population(population.getSchedules().length, this.data);

    for (let x = 0; x < Driver.NUMB_OF_ELITE_SCHEDULES; x++) {
      crossoverPopulation.getSchedules()[x] = population.getSchedules()[x];
    }

    for (let x = Driver.NUMB_OF_ELITE_SCHEDULES; x < population.getSchedules().length; x++) {
      if (Driver.CROSSOVER_RATE > Math.random()) {
        const schedule1 = selectTournamentPopulation(population).sortByFitness().getSchedules()[0];
        const schedule2 = selectTournamentPopulation(population).sortByFitness().getSchedules()[0];
        crossoverPopulation.getSchedules()[x] = crossoverSchedule(schedule1, schedule2);
      } else {
        crossoverPopulation.getSchedules()[x] = population.getSchedules()[x];
      }
    }
    // population.getSchedules().forEach((schedule, x) => {
    //   if (x < Driver.NUMB_OF_ELITE_SCHEDULES) {
    //     crossoverPopulation.getSchedules()[x] = schedule;
    //   } else {
    //     if (Driver.CROSSOVER_RATE > Math.random()) {
    //       const schedule1 = this.selectTournamentPopulation(population).sortByFitness().getSchedules()[0];
    //       const schedule2 = this.selectTournamentPopulation(population).sortByFitness().getSchedules()[0];
    //       crossoverPopulation.getSchedules()[x] = this.crossoverSchedule(schedule1, schedule2);
    //     } else {
    //       crossoverPopulation.getSchedules()[x] = schedule;
    //     }
    //   }
    // });
    return crossoverPopulation;
  }

  crossoverSchedule(schedule1, schedule2) {
    const crossoverSchedule = new Schedule(this.data).initialize();
    for (let x = 0; x < crossoverSchedule.getClasses().length; x++) {
      if (Math.random() > 0.5) {
        crossoverSchedule.getClasses()[x] = schedule1.getClasses()[x];
      } else {
        crossoverSchedule.getClasses()[x] = schedule2.getClasses()[x];
      }
    }

    // crossoverSchedule.getClasses().forEach((cls, x) => {
    //   if (Math.random() > 0.5) {
    //     crossoverSchedule.getClasses()[x] = schedule1.getClasses()[x];
    //   } else {
    //     crossoverSchedule.getClasses()[x] = schedule2.getClasses()[x];
    //   }
    // });
    return crossoverSchedule;
  }

  mutatePopulation(population) {
    const mutatePopulation = new Population(population.getSchedules().length, this.data);
    const schedules = mutatePopulation.getSchedules();

    for (let x = 0; x < Driver.NUMB_OF_ELITE_SCHEDULES; x++) {
      schedules[x] = population.getSchedules()[x];
    }

    for (let x = Driver.NUMB_OF_ELITE_SCHEDULES; x < population.getSchedules().length; x++) {
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
    const schedule = new Schedule(this.data).initialize();

    for (let x = 0; x < mutateSchedule.getClasses().length; x++) {
      if (Driver.MUTATION_RATE > Math.random()) {
        mutateSchedule.getClasses()[x] = schedule.getClasses()[x];
      }
    }

    // mutateSchedule.getClasses().forEach((cls, x) => {
    //   if (Driver.MUTATION_RATE > Math.random()) {
    //     mutateSchedule.getClasses()[x] = schedule.getClasses()[x];
    //   }
    // });
    return mutateSchedule;
  }

  selectTournamentPopulation(population) {
    const tournamentPopulation = new Population(Driver.TOURNAMENT_SELECTION_SIZE, this.data);

    for (let x = 0; x < Driver.TOURNAMENT_SELECTION_SIZE; x++) {
      const randomIndex = Math.floor(Math.random() * population.getSchedules().length);
      tournamentPopulation.getSchedules()[x] = population.getSchedules()[randomIndex];
    }

    // tournamentPopulation.getSchedules().forEach((schedule, x) => {
    //   tournamentPopulation.getSchedules()[x] = population.getSchedules()[Math.floor(Math.random() * population.getSchedules().length)];
    // });
    return tournamentPopulation;
  }
}

module.exports = GeneticAlgorithm;
