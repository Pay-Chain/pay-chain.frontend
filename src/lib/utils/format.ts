/**
 * Format a number with commas and decimal places
 */
export function formatNumber(value: number | string, decimals = 2): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

/**
 * Format a currency value
 */
export function formatCurrency(value: number | string, currency = 'USD'): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(num);
}

/**
 * Shorten an address (0x1234...5678)
 */
export function shortenAddress(address: string, chars = 4): string {
    if (!address) return '';
    if (address.length <= chars * 2 + 3) return address;
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a date string
 */
export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', options || {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Format a date with time
 */
export function formatDateTime(dateStr: string): string {
    return formatDate(dateStr, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return formatDate(dateStr);
}

/**
 * Convert amount from smallest unit to display value
 */
export function fromSmallestUnit(amount: string | number, decimals: number): number {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    return value / Math.pow(10, decimals);
}

/**
 * Convert amount to smallest unit
 */
export function toSmallestUnit(amount: string | number, decimals: number): string {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    return Math.floor(value * Math.pow(10, decimals)).toString();
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}
