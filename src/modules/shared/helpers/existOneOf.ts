export const existOneOf = (
  obj: Record<string, any>,
  keys: string[],
): boolean => {
  for (const k of keys) {
    if (obj[k] !== undefined) {
      return true;
    }
  }
  return false;
};
