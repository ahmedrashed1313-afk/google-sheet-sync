import { google } from 'googleapis';

const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

async function run() {
  const now = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'الورقة1!A:G',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[now, 'GitHub Actions run', 'WhatsApp Sync']] },
  });
  console.log('✅ Row appended to Google Sheets');
}

run()
  .then(() => process.exit(0))
  .catch(err => { console.error(err); process.exit(1); });