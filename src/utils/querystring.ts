import {stringify, StringifyOptions} from 'query-string/base';

export function stringifyWithDate(
  obj: {[key: string]: any},
  opts?: StringifyOptions,
): string {
  const newObj: typeof obj = {};
  for (const key in {...obj}) {
    const item = obj[key];
    if (isDate(item)) {
      newObj[key] = item.toISOString();
    } else {
      newObj[key] = item;
    }
  }
  return stringify(newObj, opts);
}
function isDate(a: any): a is Date {
  return a instanceof Date;
}
