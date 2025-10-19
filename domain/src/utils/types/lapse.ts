export interface Lapse{
    checkIn: Date;
    checkOut: Date;
    lapseInDays(): number;
}

class LapseImpl implements Lapse{
    constructor(
        public readonly checkIn: Date,
        public readonly checkOut: Date
      ) {
        if (checkIn >= checkOut) {
          throw new Error('Check-in debe ser anterior a check-out');
        }
      }

    lapseInDays(): number {
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const timeDiff = this.checkOut.getTime() - this.checkIn.getTime();
        return Math.ceil(timeDiff / millisecondsPerDay);
    }
}