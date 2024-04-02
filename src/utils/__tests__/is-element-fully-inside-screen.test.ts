import {isElementFullyInsideScreen} from '../is-element-fully-inside-screen';

describe('isElementFullyInsideScreen: element size <= window size, element located on top left (0,0)', () => {
  it(`window size 10 x 10, element size 0 x 0 located top left (0,0)`, async () => {
    const isVisible = isElementFullyInsideScreen(0, 0, 0, 0, 10, 10);
    expect(isVisible).toEqual(false);
  });

  for (let i = 1; i <= 10; i++) {
    it(`window size 10 x 10, element size ${i} x ${i} located top left (0,0)`, async () => {
      const isVisible = isElementFullyInsideScreen(i, i, 0, 0, 10, 10);
      expect(isVisible).toEqual(true);
    });
  }
});

describe('isElementFullyInsideScreen: element size > window size, element located on top left (0,0)', () => {
  for (let i = 11; i <= 20; i++) {
    it(`window size 10 x 10, element size ${i} x ${i} located top left (0,0)`, async () => {
      const isVisible = isElementFullyInsideScreen(i, i, 0, 0, 10, 10);
      expect(isVisible).toEqual(false);
    });
  }
});

describe('isElementFullyInsideScreen: element size <= window size, element positioned at center of the window (5,5)', () => {
  it(`window size 10 x 10, element size 0 x 0 located center (5,5)`, async () => {
    const isVisible = isElementFullyInsideScreen(0, 0, 5, 5, 10, 10);
    expect(isVisible).toEqual(false);
  });
  for (let i = 1; i <= 5; i++) {
    it(`window size 10 x 10, element size ${i} x ${i} located center (5,5)`, async () => {
      const isVisible = isElementFullyInsideScreen(i, i, 5, 5, 10, 10);
      expect(isVisible).toEqual(true);
    });
  }
  for (let i = 6; i <= 10; i++) {
    it(`window size 10 x 10, element size ${i} x ${i} located center (5,5)`, async () => {
      const isVisible = isElementFullyInsideScreen(i, i, 5, 5, 10, 10);
      expect(isVisible).toEqual(false);
    });
  }
});

describe('isElementFullyInsideScreen: element located below the window', () => {
  for (let i = 11; i <= 20; i++) {
    it(`window size 10 x 10, element size 5 x 5 located (${i},${i})`, async () => {
      const isVisible = isElementFullyInsideScreen(5, 5, i, i, 10, 10);
      expect(isVisible).toEqual(false);
    });
  }
});

describe('isElementFullyInsideScreen: located at negative coordinates', () => {
  for (let i = -1; i >= -10; i--) {
    it(`window size 10 x 10, element size 5 x 5, located at (${i}, ${i}) `, async () => {
      const isVisible = isElementFullyInsideScreen(0, 0, i, i, 10, 10);
      expect(isVisible).toEqual(false);
    });
  }
});

describe('isElementFullyInsideScreen: negative size ', () => {
  for (let i = -1; i >= -10; i--) {
    it(`window size 10 x 10, element size ${i} x ${i} located center (5,5)`, async () => {
      const isVisible = isElementFullyInsideScreen(i, i, 5, 5, 10, 10);
      expect(isVisible).toEqual(false);
    });
  }
});

describe('isElementFullyInsideScreen: negative size and position', () => {
  for (let i = -1; i >= -10; i--) {
    it(`window size 10 x 10, element size ${i} x ${i} located (${i},${i})`, async () => {
      const isVisible = isElementFullyInsideScreen(i, i, 5, 5, 10, 10);
      expect(isVisible).toEqual(false);
    });
  }
});
