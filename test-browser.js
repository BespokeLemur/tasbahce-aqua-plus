import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BRAVE_PATH = "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe";
const APP_URL = "http://localhost:5173";
const SCREENSHOTS_DIR = "C:\\Users\\incey\\.gemini\\antigravity\\brain\\7edc47a4-a6fb-44bd-8ca7-c2e729b39d2f\\scratch";

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runTests() {
  console.log("🚀 Starting mobile fullpage test on localhost...");
  
  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setCacheEnabled(false);

  // Set mobile viewport
  console.log("Setting mobile viewport and navigating...");
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.goto(APP_URL, { waitUntil: 'networkidle2' });
  
  // Capture full page screenshot
  const screenshotPath = path.join(SCREENSHOTS_DIR, "debug_mobile_fullpage_fixed.png");
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Full page mobile screenshot saved: ${screenshotPath}`);

  await browser.close();
}

runTests().catch(err => {
  console.error("❌ Test error:", err);
  process.exit(1);
});
