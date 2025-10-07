import {calculateCarnetData} from '../calculate-carnet-data';

describe('Carnet footer: 10 tickets', () => {
  for (let i = 0; i <= 10; i++) {
    it(`10 tickets, ${i} used, not active.`, async () => {
      const carnetData = calculateCarnetData(false, 10, i);
      expect(carnetData.accessesRemaining).toEqual(10 - i);
      expect(carnetData.multiCarnetArray.length).toEqual(0);
      expect(carnetData.unusedArray.length).toEqual(10 - i);
      expect(carnetData.usedArray.length).toEqual(i);
    });
  }

  for (let i = 1; i <= 10; i++) {
    it(`10 tickets, ${i} used, active.`, async () => {
      const carnetData = calculateCarnetData(true, 10, i);
      expect(carnetData.accessesRemaining).toEqual(10 - i);
      expect(carnetData.multiCarnetArray.length).toEqual(0);
      expect(carnetData.unusedArray.length).toEqual(10 - i);
      expect(carnetData.usedArray.length).toEqual(i - 1);
    });
  }
});

describe('Carnet footer: 30 tickets, not active', () => {
  for (let i = 0; i < 10; i++) {
    it(`30 tickets, ${i} used, not active.`, async () => {
      const carnetData = calculateCarnetData(false, 30, i);
      expect(carnetData.accessesRemaining).toEqual(30 - i);
      expect(carnetData.multiCarnetArray.length).toEqual(2);
      expect(carnetData.unusedArray.length).toEqual(10 - i);
      expect(carnetData.usedArray.length).toEqual(i);
    });
  }
  it(`30 tickets, 10 used, not active.`, async () => {
    const carnetData = calculateCarnetData(false, 30, 10);
    expect(carnetData.accessesRemaining).toEqual(20);
    expect(carnetData.multiCarnetArray.length).toEqual(1);
    expect(carnetData.unusedArray.length).toEqual(10);
    expect(carnetData.usedArray.length).toEqual(0);
  });
  it(`30 tickets, 11 used, not active.`, async () => {
    const carnetData = calculateCarnetData(false, 30, 11);
    expect(carnetData.accessesRemaining).toEqual(19);
    expect(carnetData.multiCarnetArray.length).toEqual(1);
    expect(carnetData.unusedArray.length).toEqual(9);
    expect(carnetData.usedArray.length).toEqual(1);
  });
});

describe('Carnet footer: 30 tickets, active', () => {
  for (let i = 1; i < 10; i++) {
    it(`30 tickets, ${i} used, active.`, async () => {
      const carnetData = calculateCarnetData(true, 30, i);
      expect(carnetData.accessesRemaining).toEqual(30 - i);
      expect(carnetData.multiCarnetArray.length).toEqual(2);
      expect(carnetData.unusedArray.length).toEqual(10 - i);
      expect(carnetData.usedArray.length).toEqual(i - 1);
    });
  }
  it(`30 tickets, 10 used, active.`, async () => {
    const carnetData = calculateCarnetData(true, 30, 10);
    expect(carnetData.accessesRemaining).toEqual(20);
    expect(carnetData.multiCarnetArray.length).toEqual(2);
    expect(carnetData.unusedArray.length).toEqual(0);
    expect(carnetData.usedArray.length).toEqual(9);
  });
  it(`30 tickets, 11 used, active.`, async () => {
    const carnetData = calculateCarnetData(true, 30, 11);
    expect(carnetData.accessesRemaining).toEqual(19);
    expect(carnetData.multiCarnetArray.length).toEqual(1);
    expect(carnetData.unusedArray.length).toEqual(9);
    expect(carnetData.usedArray.length).toEqual(0);
  });
});

describe('Carnet footer: Padded when not divisible by 10', () => {
  it(`13 tickets, 1 used, not active.`, async () => {
    const carnetData = calculateCarnetData(false, 13, 1);
    expect(carnetData.accessesRemaining).toEqual(12);
    expect(carnetData.multiCarnetArray.length).toEqual(1);
    expect(carnetData.unusedArray.length).toEqual(2);
    expect(carnetData.usedArray.length).toEqual(8);
  });

  it(`13 tickets, 3 used, not active.`, async () => {
    const carnetData = calculateCarnetData(false, 13, 3);
    expect(carnetData.accessesRemaining).toEqual(10);
    expect(carnetData.multiCarnetArray.length).toEqual(0);
    expect(carnetData.unusedArray.length).toEqual(10);
    expect(carnetData.usedArray.length).toEqual(0);
  });

  it(`13 tickets, 3 used, active.`, async () => {
    const carnetData = calculateCarnetData(true, 13, 3);
    expect(carnetData.accessesRemaining).toEqual(10);
    expect(carnetData.multiCarnetArray.length).toEqual(1);
    expect(carnetData.unusedArray.length).toEqual(0);
    expect(carnetData.usedArray.length).toEqual(9);
  });
});

// School ticket
describe('Carnet footer: School tickets', () => {
  it('2 tickets, 1 used, not active.', async () => {
    const carnetData = calculateCarnetData(false, 2, 1);
    expect(carnetData.accessesRemaining).toEqual(1);
    expect(carnetData.unusedArray.length).toEqual(1);
    expect(carnetData.usedArray.length).toEqual(1);
    expect(carnetData.multiCarnetArray.length).toEqual(0);
  });
});

// These states are invalid, but we shouldn't crash if it happends. Make sure we
// handle it gracefully.
describe('Carnet footer: Invalid state', () => {
  it(`10 tickets, 0 used, active.`, async () => {
    const carnetData = calculateCarnetData(true, 10, 1);
    expect(typeof carnetData.accessesRemaining).toEqual('number');
    expect(typeof carnetData.multiCarnetArray.length).toEqual('number');
    expect(typeof carnetData.unusedArray.length).toEqual('number');
    expect(typeof carnetData.usedArray.length).toEqual('number');
  });
});
