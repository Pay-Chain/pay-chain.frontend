import { isAddress } from 'viem';

/**
 * Validates a blockchain address based on the chain type.
 * @param address The address string to validate.
 * @param chainType The type of blockchain (e.g., 'EVM', 'SVM').
 * @returns true if valid, or an error message string if invalid.
 */
export function validateAddress(address: string, chainType: string): true | string {
  if (!address) return 'Address is required';

  const type = chainType.toUpperCase();

  switch (type) {
    case 'EVM':
      return validateEVMAddress(address);
    case 'SVM':
      return validateSVMAddress(address);
    default:
      // Fallback: just check non-empty
      return address.length > 0 ? true : 'Invalid address';
  }
}

/**
 * Validates an EVM address (Ethereum, Polygon, BSC, Base, etc.)
 * Must be 0x-prefixed, 42 chars, valid hex.
 */
function validateEVMAddress(address: string): true | string {
  if (!address.startsWith('0x')) {
    return 'EVM address must start with 0x';
  }
  if (address.length !== 42) {
    return 'EVM address must be 42 characters';
  }
  if (!isAddress(address)) {
    return 'Invalid EVM address';
  }
  return true;
}

/**
 * Validates a Solana (SVM) address.
 * Base58 encoded, typically 32-44 characters.
 */
function validateSVMAddress(address: string): true | string {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
  if (!base58Regex.test(address)) {
    return 'Invalid Solana address (must be Base58)';
  }
  if (address.length < 32 || address.length > 44) {
    return 'Solana address must be 32-44 characters';
  }
  return true;
}

/**
 * Sanitizes a number string, limiting decimal places to a max.
 * @param value The input string.
 * @param maxDecimals Maximum decimal places allowed.
 * @returns Sanitized string with limited decimals.
 */
export function sanitizeNumberWithDecimals(value: string, maxDecimals: number): string {
  // Remove all characters that are not digits or decimal points
  let sanitized = value.replace(/[^0-9.]/g, '');

  // Ensure only one decimal point exists
  const parts = sanitized.split('.');
  if (parts.length > 2) {
    sanitized = `${parts[0]}.${parts.slice(1).join('')}`;
  }

  // Limit decimal places
  if (parts.length === 2 && parts[1].length > maxDecimals) {
    sanitized = `${parts[0]}.${parts[1].slice(0, maxDecimals)}`;
  }

  return sanitized;
}

/**
 * Formats a plain number string with thousand separators (ID locale: dot).
 * Example: "5000000" → "5.000.000", "1234.56" → "1.234,56"
 * @param value Raw number string (with dot as decimal separator).
 * @returns Formatted string with dots as thousand separators and comma as decimal.
 */
export function formatMoneyDisplay(value: string): string {
  if (!value) return '';

  const parts = value.split('.');
  const intPart = parts[0];
  const decPart = parts[1];

  // Add thousand separators to integer part
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  if (decPart !== undefined) {
    return `${formatted},${decPart}`;
  }
  return formatted;
}

/**
 * Strips thousand-separator formatting back to a plain number string.
 * "5.000.000,50" → "5000000.50"
 * @param formatted The formatted display string.
 * @returns Plain number string with dot as decimal separator.
 */
export function stripMoneyFormat(formatted: string): string {
  // Replace thousand dots with nothing, then replace decimal comma with dot
  return formatted.replace(/\./g, '').replace(',', '.');
}
