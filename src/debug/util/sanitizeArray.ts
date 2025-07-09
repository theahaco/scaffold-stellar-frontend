export const sanitizeArray = (array: unknown[]) => {
  return array.filter((i) => Boolean(i));
};
