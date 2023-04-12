export const cTo = (theClass) => {
  const originalClass = theClass || {};
  const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(originalClass));
  return keys.reduce((classAsObj, key) => {
    classAsObj[key] = originalClass[key];
    return classAsObj;
  }, {});
};
