/** Format price as NGN 70,000.00 */
export function formatNGN(amount: number | string): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (Number.isNaN(value)) return 'NGN 0.00';
  return `NGN ${value.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNaira(amount: number | string): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (Number.isNaN(value)) return '₦0';
  return `₦${value.toLocaleString('en-NG')}`;
}
