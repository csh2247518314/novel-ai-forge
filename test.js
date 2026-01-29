const { chromium } = require('playwright');

async function testApp() {
  console.log('Starting browser test...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Collect console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });
  
  // Collect page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });
  
  try {
    // Navigate to the app
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    // Wait for the app to load
    console.log('Waiting for page to load...');
    await page.waitForTimeout(5000);
    
    // Check page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check for main elements
    const hasHeader = await page.locator('header').count() > 0;
    console.log('Has header:', hasHeader);
    
    const hasMainContent = await page.locator('main').count() > 0;
    console.log('Has main content:', hasMainContent);
    
    // Report console errors
    const errors = consoleMessages.filter(m => m.type === 'error');
    if (errors.length > 0) {
      console.log('\nConsole errors:');
      errors.forEach(e => console.log('  -', e.text));
    } else {
      console.log('\nNo console errors detected');
    }
    
    // Report page errors
    if (pageErrors.length > 0) {
      console.log('\nPage errors:');
      pageErrors.forEach(e => console.log('  -', e));
    } else {
      console.log('No page errors detected');
    }
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testApp();
