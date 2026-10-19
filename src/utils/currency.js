/**
 * Centralized Currency Formatter
 * Supports configurable currency symbol / code via VUE_APP_CURRENCY (.env)
 * Default: '$' (or 'EGP' if configured)
 */

export const CURRENCY_SYMBOL =
  (typeof process !== 'undefined' && process.env && process.env.VUE_APP_CURRENCY) || '$';

/**
 * Cleanly parse any number or pre-formatted string (e.g. "11,000.00" from Laravel)
 * Strips commas so parseFloat does not truncate at the thousands comma separator
 * @param {number|string} value
 * @returns {number}
 */
export function parseNumericValue(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  const cleaned = String(value).replace(/,/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Format a number/string into localized currency display
 * @param {number|string} value
 * @param {boolean} includeSign - whether to prepend '+' for positive or '-' for negative
 * @param {string} [currency] - custom currency symbol, defaults to CURRENCY_SYMBOL
 * @returns {string} e.g. "+$5,000.00" or "-$150.50" or "+5,000.00 EGP"
 */
export function formatCurrency(value, includeSign = false, currency = CURRENCY_SYMBOL) {
  const num = parseNumericValue(value);
  if (isNaN(num)) {
    return isPrefixSymbol(currency) ? `${currency}0.00` : `0.00 ${currency}`;
  }

  const absFormatted = Math.abs(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const sign = num > 0 ? '+' : (num < 0 ? '-' : '');
  const prefix = isPrefixSymbol(currency);

  if (includeSign) {
    if (num === 0) {
      return prefix ? `${currency}${absFormatted}` : `${absFormatted} ${currency}`;
    }
    return prefix
      ? `${sign}${currency}${absFormatted}`
      : `${sign}${absFormatted} ${currency}`;
  }

  // Without forced sign
  return prefix
    ? `${currency}${absFormatted}`
    : `${absFormatted} ${currency}`;
}

function isPrefixSymbol(sym) {
  return ['$', '€', '£', '¥'].includes(sym);
}

export default {
  formatCurrency,
  CURRENCY_SYMBOL,
};
