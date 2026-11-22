import { env } from '../config/env';
import { SHEET_COLUMNS, SHEETS_API_URL, SHEETS_REQUEST_TIMEOUT_MS } from '../config/appConfig';
import { parseNetWorth } from '../utils/netWorth';

function buildUrl() {
  const range = encodeURIComponent(env.sheetRange);
  return `${SHEETS_API_URL}/${env.sheetId}/values/${range}?key=${env.sheetsApiKey}`;
}

function getColumnIndexes(headers) {
  const columns = Object.fromEntries(
    headers.map((header, index) => [header.trim().toLowerCase(), index]),
  );
  const missing = Object.values(SHEET_COLUMNS).filter((column) => !(column in columns));
  if (missing.length > 0) {
    throw new Error(`Google Sheet is missing column(s): ${missing.join(', ')}`);
  }
  return columns;
}

function toPerson(row, index, columns) {
  const cell = (column) => String(row[columns[column]] ?? '').trim();

  return {
    id: index,
    name: cell(SHEET_COLUMNS.name),
    photo: cell(SHEET_COLUMNS.photo),
    age: Number(cell(SHEET_COLUMNS.age)),
    country: cell(SHEET_COLUMNS.country),
    interest: cell(SHEET_COLUMNS.interest),
    netWorth: parseNetWorth(cell(SHEET_COLUMNS.netWorth)),
  };
}

async function fetchWithTimeout(url, signal) {
  const timeout = AbortSignal.timeout(SHEETS_REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: signal ? AbortSignal.any([signal, timeout]) : timeout });
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new Error('Google Sheets took too long to respond.', { cause: error });
    }
    throw error;
  }
}

export async function fetchPeople(signal) {
  const response = await fetchWithTimeout(buildUrl(), signal);

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Google Sheets request failed (${response.status})`);
  }

  const { values = [] } = await response.json();
  const [headers = [], ...rows] = values;
  const columns = getColumnIndexes(headers);

  return rows.map((row, index) => toPerson(row, index, columns)).filter((person) => person.name);
}
