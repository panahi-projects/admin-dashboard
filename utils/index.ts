export const extractNumber = (str: string): number => {
  if (!str) return 0;
  // Match the first sequence of digits in the string
  const match = str.match(/\d+/);
  return match ? Number(match[0]) : 0;
};
