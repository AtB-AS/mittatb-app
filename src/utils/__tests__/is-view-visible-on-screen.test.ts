import {isViewVisibleOnScreen} from '../is-view-visible-on-screen';

describe('isViewVisibleOnScreen: view size <= window size, view located on top left (0,0)', () => {
  it(`window size 10 x 10, view size 0 x 0 located top left (0,0)`, async () => {
    const isVisible = isViewVisibleOnScreen(0, 0, 0, 0, 10, 10);
    expect(isVisible).toEqual(false);
  });

  for (let i = 1; i <= 10; i++) {
    it(`window size 10 x 10, view size ${i} x ${i} located top left (0,0)`, async () => {
      const isVisible = isViewVisibleOnScreen(i, i, 0, 0, 10, 10);
      expect(isVisible).toEqual(true);
    });
  }
});

describe('isViewVisibleOnScreen: view size > window size, view located on top left (0,0)', () => {
  for (let i = 11; i <= 20; i++) {
    it(`window size 10 x 10, view size ${i} x ${i} located top left (0,0)`, async () => {
      const isVisible = isViewVisibleOnScreen(i, i, 0, 0, 10, 10);
      expect(isVisible).toEqual(false);
    });
  }
});

describe('isViewVisibleOnScreen: view size <= window size, view positioned at center of the window (5,5)', () => {
  it(`window size 10 x 10, view size 0 x 0 located center (5,5)`, async () => {
    const isVisible = isViewVisibleOnScreen(0, 0, 5, 5, 10, 10);
    expect(isVisible).toEqual(false);
  });
  for (let i = 1; i <= 5; i++) {
    it(`window size 10 x 10, view size ${i} x ${i} located center (5,5)`, async () => {
      const isVisible = isViewVisibleOnScreen(i, i, 5, 5, 10, 10);
      expect(isVisible).toEqual(true);
    });
  }
  for (let i = 6; i <= 10; i++) {
    it(`window size 10 x 10, view size ${i} x ${i} located center (5,5)`, async () => {
      const isVisible = isViewVisibleOnScreen(i, i, 5, 5, 10, 10);
      expect(isVisible).toEqual(false);
    });
  }
});

describe('isViewVisibleOnScreen: view located below the window', () => {
  for (let i = 11; i <= 20; i++) {
    it(`window size 10 x 10, view size 5 x 5 located (${i},${i})`, async () => {
      const isVisible = isViewVisibleOnScreen(5, 5, i, i, 10, 10);
      expect(isVisible).toEqual(false);
    });
  }
});

describe('isViewVisibleOnScreen: located at negative coordinates', () => {
  for (let i = -1; i >= -10; i--) {
    it(`window size 10 x 10, view size 5 x 5, located at (${i}, ${i}) `, async () => {
      const isVisible = isViewVisibleOnScreen(0, 0, i, i, 10, 10);
      expect(isVisible).toEqual(false);
    });
  }
});

describe('isViewVisibleOnScreen: negative size ', () => {
  for (let i = -1; i >= -10; i--) {
    it(`window size 10 x 10, view size ${i} x ${i} located center (5,5)`, async () => {
      const isVisible = isViewVisibleOnScreen(i, i, 5, 5, 10, 10);
      expect(isVisible).toEqual(false);
    });
  }
});

describe('isViewVisibleOnScreen: negative size and position', () => {
  for (let i = -1; i >= -10; i--) {
    it(`window size 10 x 10, view size ${i} x ${i} located (${i},${i})`, async () => {
      const isVisible = isViewVisibleOnScreen(i, i, 5, 5, 10, 10);
      expect(isVisible).toEqual(false);
    });
  }
});
