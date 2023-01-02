export const parseBoolean = (str: string | undefined | null) => {
  if (str === 'true') return true;
  if (str === 'false') return false;
  return undefined;
};
