/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export const sanitizeArray = (array: any[]) => {
  return array.filter((i) => Boolean(i));
};
