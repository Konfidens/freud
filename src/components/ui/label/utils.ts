// Takes an array of id's and returns them as a space separated string.
// If all params are undefined, it will return undefined instead.
// Examples
// ['hey', 'ho', 'lets', 'go'] => 'hey ho lets go'
// ['hey', undefined, 'lets', undefined] => 'hey lets'
// [undefined, undefined] => undefined
export const getAriaDescribedBy = (
  ids: Array<string | undefined>,
): string | undefined => {
  const result = ids.filter((elem) => elem).join(' ');
  return result === '' ? undefined : result;
};
