export const roundPrice = (
  price: number,
  roundPrecisionAmount = 2,
  minimumSupportedPrice = 1500,
): number => {
  const p = Math.floor(price);

  if (p < minimumSupportedPrice) {
    return minimumSupportedPrice;
  }

  const precision = p.toString().length - roundPrecisionAmount;

  return parseFloat(p.toPrecision(precision));
};
