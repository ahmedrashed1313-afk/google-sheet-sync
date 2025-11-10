import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { google } from "googleapis";
import fs from "fs";

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// إعداد Google Sheets
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// معرف الشيت (Spreadsheet ID)
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// استقبال الرسائل من Twilio WhatsApp Webhook
app.post("/whatsapp", async (req, res) => {
  const { Body, From } = req.body;
  console.log(`📩 رسالة جديدة من ${From}: ${Body}`);

  // تسجيل الرسالة في Google Sheet
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:C",
      valueInputOption: "RAW",
      requestBody: {
        values: [[new Date().toLocaleString(), From, Body]],
      },
    });
    console.log("✅ تم حفظ الرسالة في Google Sheet");
  } catch (error) {
    console.error("❌ خطأ أثناء الكتابة في Google Sheet:", error);
  }

  // رد تلقائي للعميل
  res.set("Content-Type", "text/plain");
  res.send("📞 شكرًا لتواصلك! تم استلام رسالتك وسنعاود الاتصال قريبًا.");
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 السيرفر شغال على البورت ${PORT}`));
