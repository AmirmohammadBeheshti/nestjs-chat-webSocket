export const getDayOfWeekName = (date: Date, locale = 'fa-IR') => {
  return date.toLocaleDateString(locale, { weekday: 'long' });
};
