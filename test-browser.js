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
  console.log("🚀 Starting visible browser tests on Brave...");
  console.log(`Using Brave at: ${BRAVE_PATH}`);
  
  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: false, // VISIBLE MODE!
    slowMo: 100, // Slows down actions by 100ms so you can watch
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set PC viewport
  console.log("\n🖥️ Loading Home Page...");
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto(APP_URL, { waitUntil: 'networkidle2' });
  
  const title = await page.title();
  console.log(`Page title: "${title}"`);
  
  // Wait a bit to look at the Home page
  await new Promise(r => setTimeout(r, 2000));

  // Click Digital Menu
  console.log("\n🍔 Navigating to Digital Menu...");
  await page.waitForSelector('button');
  const buttons = await page.$$('button');
  let menuBtn = null;
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes("Dijital Menüyü Aç") || text.includes("Menüyü Görüntüle")) {
      menuBtn = btn;
      break;
    }
  }

  if (menuBtn) {
    await menuBtn.click();
    console.log("Viewing Menu items...");
    await new Promise(r => setTimeout(r, 3000)); // Let the user look at the menu
  } else {
    console.log("❌ Could not find menu button!");
  }

  // Open Admin Login
  console.log("\n🔐 Opening Admin Panel...");
  // Go back home first
  await page.goto(APP_URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  console.log("Clicking footer link to open secret admin panel...");
  await page.evaluate(() => {
    const spans = Array.from(document.querySelectorAll('span'));
    const link = spans.find(s => s.textContent.includes('Personel Giriş Paneli'));
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 2000)); // Wait on login screen

  // Enter credentials
  console.log("Typing admin credentials...");
  const inputElements = await page.$$('input');
  
  let usernameInput = null;
  let passwordInput = null;
  for (const input of inputElements) {
    const placeholder = await page.evaluate(el => el.placeholder, input);
    if (placeholder.includes("Kullanıcı adı")) {
      usernameInput = input;
    } else if (placeholder.includes("••••••")) {
      passwordInput = input;
    }
  }

  if (usernameInput && passwordInput) {
    await usernameInput.type('admin');
    await new Promise(r => setTimeout(r, 500));
    await passwordInput.type('123');
    await new Promise(r => setTimeout(r, 1000));
    
    // Click submit
    console.log("Submitting login form...");
    const submitBtn = await page.$('button[type="submit"]');
    await submitBtn.click();
    
    // Wait and check dashboard
    await new Promise(r => setTimeout(r, 5000)); // Let the user inspect the dashboard for 5 seconds!
    
    const bodyText = await page.evaluate(() => document.body.textContent);
    if (bodyText.includes("Ahmet") || bodyText.includes("Yönetici")) {
      console.log("✅ Admin Login Successful!");
    } else {
      console.log("❌ Admin Login Failed!");
    }
  } else {
    console.log("❌ Login inputs not found!");
  }

  console.log("Closing browser...");
  await browser.close();
  console.log("\n🎉 Visible tests completed successfully!");
}

runTests().catch(err => {
  console.error("❌ Test error:", err);
  process.exit(1);
});
