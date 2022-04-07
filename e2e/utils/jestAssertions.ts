const jestExpect = require('expect');

export const expectBoolean = (value: boolean, exp: boolean, optMsg: string = '') => {
  // Print msg if failed assertion
  if (value !== exp && optMsg.length > 0) {
    console.log(`WARNING: [${optMsg}] Value ${value} Expected ${exp}`)
  }
  jestExpect(value).toBe(exp);
};

export const expectNumber = (value: number, exp: number) => {
  jestExpect(value).toBe(exp);
};

export const expectGreaterThan = (value: number, exp: number) => {
  jestExpect(value).toBeGreaterThan(exp);
};
