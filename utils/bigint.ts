export function parseBigInt(str?: string): bigint | undefined {
  if (!str) {
    return undefined;
  }

  try {
    return BigInt(str);
  } catch {
    return undefined;
  }
}
