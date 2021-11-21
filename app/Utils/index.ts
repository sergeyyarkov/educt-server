// eslint-disable-next-line import/prefer-default-export
export const generateRandomInt = ({ min, max }: { min: number; max: number }): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
