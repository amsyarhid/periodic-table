function required(name) {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error('Missing environment variable: ${name}');
  }
  return value;
}

export const env = {
  googleClientId: required('VITE_GOOGLE_CLIENT_ID'),
  sheetsApiKey: required('VITE_SHEETS_API_KEY'),
  sheetId: required('VITE_SHEET_ID'),
  sheetRange: import.meta.env.VITE_SHEET_RANGE || 'Data!A1:F',
};