// Traveller class to set which travellers to add in a ticket
export class Traveller {
  adult: boolean;
  adultCount?: number;
  senior: boolean;
  child: boolean;

  constructor(
    adult: boolean,
    adultCount: number = 1,
    senior: boolean,
    child: boolean,
  ) {
    this.adult = adult;
    this.adultCount = adultCount;
    this.senior = senior;
    this.child = child;
  }
}
