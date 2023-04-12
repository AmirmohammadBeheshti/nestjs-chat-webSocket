export const clean = <T>(object: T): T => {
  Object.entries(object).forEach(([k, v]: [any, any]) => {
    if (v && typeof v === 'object') {
      clean(v);
    }
    if (
      (v && typeof v === 'object' && !Object.keys(v).length) ||
      v === null ||
      v === undefined
    ) {
      if (Array.isArray(object)) {
        (<Array<any>>object).splice(k, 1);
      } else {
        delete object[k];
      }
    }
  });
  return object;
};
