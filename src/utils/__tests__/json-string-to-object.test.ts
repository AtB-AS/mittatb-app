import {jsonStringToObject} from '../object';

describe('jsonStringToObject', () => {
  it('Should return undefined for invalid JSON', async () => {
    const result = jsonStringToObject('invalid json');
    expect(result).toBeUndefined();
  });
  it('Should return undefined for empty string', async () => {
    const result = jsonStringToObject('');
    expect(result).toBeUndefined();
  });
  it('Should return undefined for null', async () => {
    const result = jsonStringToObject(null);
    expect(result).toBeUndefined();
  });
  it('Should return undefined for undefined', async () => {
    const result = jsonStringToObject(undefined);
    expect(result).toBeUndefined();
  });
  it('Should return undefined for number', async () => {
    const result = jsonStringToObject(123);
    expect(result).toBeUndefined();
  });
  it('Should return undefined for array', async () => {
    const result = jsonStringToObject([1, 2, 3]);
    expect(result).toBeUndefined();
  });
  it('Should return undefined for boolean', async () => {
    const result = jsonStringToObject(false);
    expect(result).toBeUndefined();
    const resultTrue = jsonStringToObject(true);
    expect(resultTrue).toBeUndefined();
  });
  it('Should return parsed object for valid JSON', async () => {
    const result = jsonStringToObject('{"key": "value"}');
    expect(result).toEqual({key: 'value'});
  });
});
