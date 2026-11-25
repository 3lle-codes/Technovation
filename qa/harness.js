const { chromium } = require('playwright');

const pages = ['index.html','journey.html','timeline.html','immigration.html','ice.html','language.html','pronunciation.html','communities.html','community-circle.html','profile.html'];
const widths = [320,390,768,1024,1440,1920];
const base = 'http://127.0.0.1:4173';

(async () => {
  const browser = await chromium.launch({ headless:true });
  let failures = 0;
  for (const width of widths) {
    for (const page of pages) {
      const context = await browser.newContext({ viewport:{ width, height:width <= 390 ? 844 : 900 } });
      const browserPage = await context.newPage();
      const errors = [];
      browserPage.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      browserPage.on('pageerror', error => errors.push(error.message));
      browserPage.on('requestfailed', request => errors.push(`failed ${request.url()}: ${request.failure()?.errorText}`));
      await browserPage.goto(`${base}/${page}`, { waitUntil:'networkidle' });

      const overflow = await browserPage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 0) {
        console.log(`FAIL overflow ${page} ${width}px ${overflow}px`);
        failures++;
      }

      const header = await browserPage.evaluate(() => {
        const headerElement = document.querySelector('.site-header');
        const brand = document.querySelector('.brand');
        const container = document.querySelector('.container, .wrap');
        if (!headerElement || !brand) return null;
        const brandBox = brand.getBoundingClientRect();
        return {
          centerDelta:Math.abs((brandBox.left + brandBox.width / 2) - innerWidth / 2),
          containerLeft:container ? container.getBoundingClientRect().left : null
        };
      });
      if (header && header.centerDelta > 1) {
        console.log(`FAIL header-center ${page} ${width}px delta=${header.centerDelta.toFixed(2)}px`);
        failures++;
      }

      if (errors.length) {
        console.log(`FAIL errors ${page} ${width}px ${errors.join(' | ')}`);
        failures++;
      }

      await browserPage.screenshot({ path:`qa/${page.replace('.html','')}-${width}.png`, fullPage:true });
      await context.close();
    }
  }

  for (const width of [390,1440]) {
    const context = await browser.newContext({ viewport:{ width, height:900 } });
    const page = await context.newPage();
    await page.goto(`${base}/index.html`, { waitUntil:'networkidle' });
    await page.click('.menu-toggle');
    if (await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth > 0)) {
      console.log(`FAIL state menu-open ${width}px`);
      failures++;
    }
    await page.screenshot({ path:`qa/menu-${width}.png`, fullPage:true });
    for (const lang of ['es','ko','zh']) {
      await page.click(`.nav-language-option[data-v="${lang}"]`);
      if (await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth > 0)) {
        console.log(`FAIL state language-${lang} ${width}px`);
        failures++;
      }
    }
    await context.close();

    for (const state of [
      { name:'journey-task', url:'/journey.html', action:'[data-a="toggleTask"]' },
      { name:'language-quiz', url:'/language.html', action:null },
      { name:'communities-results', url:'/communities.html', action:null }
    ]) {
      const stateContext = await browser.newContext({ viewport:{ width, height:900 } });
      const statePage = await stateContext.newPage();
      await statePage.goto(`${base}${state.url}`, { waitUntil:'networkidle' });
      if (state.action) await statePage.click(state.action);
      if (await statePage.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth > 0)) {
        console.log(`FAIL state ${state.name} ${width}px`);
        failures++;
      }
      await statePage.screenshot({ path:`qa/${state.name}-${width}.png`, fullPage:true });
      await stateContext.close();
    }
  }
  await browser.close();
  console.log(failures ? `QA FAILURES: ${failures}` : 'QA PASS');
  process.exitCode = failures ? 1 : 0;
})();
