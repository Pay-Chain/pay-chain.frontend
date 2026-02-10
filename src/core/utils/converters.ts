import { parseUnits, formatUnits } from 'viem';

/**
 * Sanitizes a number string by removing all non-numeric characters except for a single decimal point.
 * @param value The string to sanitize.
 * @returns The sanitized number string.
 */
export function sanitizeNumber(value: string): string {
  // Remove all characters that are not digits or decimal points
  let sanitized = value.replace(/[^0-9.]/g, '');

  // Ensure only one decimal point exists
  const parts = sanitized.split('.');
  if (parts.length > 2) {
    sanitized = `${parts[0]}.${parts.slice(1).join('')}`;
  }

  return sanitized;
}

/**
 * Converts a string amount to a BigInt representation based on decimals.
 * @param amount The amount string (e.g., "1.5").
 * @param decimals The number of decimals (e.g., 18).
 * @returns The BigInt representation.
 */
export function toBigInt(amount: string, decimals: number): bigint {
  if (!amount) return BigInt(0);
  try {
    return parseUnits(amount, decimals);
  } catch (error) {
    console.error('Error parsing units:', error);
    return BigInt(0);
  }
}

/**
 * Converts a BigInt amount to a string representation based on decimals.
 * @param amount The BigInt amount.
 * @param decimals The number of decimals (e.g., 18).
 * @returns The string representation.
 */
export function fromBigInt(amount: bigint, decimals: number): string {
  try {
    return formatUnits(amount, decimals);
  } catch (error) {
    console.error('Error formatting units:', error);
    return '0';
  }
}
