import { NET_WORTH_COLORS, NET_WORTH_THRESHOLDS } from './constants';

export function parseNetWorth(value) {
  if (typeof value === 'number') {
    return value;
  }
  const number = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(number) ? number : 0;
}

export function getNetWorthLevel(netWorth) {
  if (netWorth > NET_WORTH_THRESHOLDS.high) {
    return 'high';
  }
  if (netWorth >= NET_WORTH_THRESHOLDS.medium) {
    return 'medium';
  }
  return 'low';
}

export function getNetWorthColor(netWorth) {
  return NET_WORTH_COLORS[getNetWorthLevel(netWorth)];
}
