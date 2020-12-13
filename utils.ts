export const gcd = (a: number, b: number): number => {
  if (a === 0) return b;
  return gcd(b % a, a);
};

export function lcm(a: number, b: number) {
  return !a || !b ? 0 : Math.abs((a * b) / gcd(a, b));
}
