export const onlyUniques = <T>(value: T, index: number, self: T[]) =>
  self.indexOf(value) === index;

export const onlyUniquesBasedOnField =
  <T>(field: keyof T) =>
  (element: T, index: number, array: T[]) =>
    array.findIndex((el) => el[field] === element[field]) === index;
