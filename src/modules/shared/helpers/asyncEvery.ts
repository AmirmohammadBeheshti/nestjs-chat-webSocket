export const asyncEvery = async <T>(
  array: T[],
  callback: (value: T, index: number, a: T[]) => Promise<boolean>,
): Promise<boolean> => {
  for (let i = 0; i < array.length; i++) {
    const result = await callback(array[i], i, array);
    if (!result) {
      return result;
    }
  }

  return true;
};
