const jestExpect = require('expect');

export const expectBoolean = (value: boolean, exp: boolean) => {
  jestExpect(value).toBe(exp);
};

export const expectNumber = (value: number, exp: number) => {
  jestExpect(value).toBe(exp);
};

export const expectGreaterThan = (value: number, exp: number) => {
  jestExpect(value).toBeGreaterThan(exp);
};
