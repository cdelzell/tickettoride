// automateLobby.mjs
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:5173';

const USERS = [
  { username: 'test', password: 'test', isHost: true },
  { username: 'test2', password: 'test2', isHost: false },
  { username: 'test3', password: 'test3', isHost: false },
  { username: 'C-bear', password: 'dora', isHost: false },
];

(async () => {
  let browser;
  try {
    // 1) Launch browser (with DevTools open so you can see errors)
    browser = await chromium.launch({
      headless: false,
      devtools: true,
    });

    // 2) Create 4 isolated contexts & pages
    const contexts = await Promise.all(USERS.map(() => browser.newContext()));
    const pages = await Promise.all(contexts.map((ctx) => ctx.newPage()));

    // 3) Log in each user (navigating to root `/`)
    for (let i = 0; i < USERS.length; i++) {
      const { username, password } = USERS[i];
      const page = pages[i];

      console.log(`→ [${username}] navigating to ${BASE}/`);
      await page.goto(`${BASE}/`, {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      });
      console.log(`  [${username}] landed on →`, page.url());

      // Wait for the login inputs to appear
      await page.waitForSelector('input[name="username"]', { timeout: 10000 });
      console.log(`→ [${username}] filling credentials`);
      await page.fill('input[name="username"]', username);
      await page.fill('input[name="password"]', password);
      await page.click('button:has-text("Log in")');

      // Wait for redirect to profile
      await page.waitForURL('**/profile', { timeout: 10000 });
      console.log(`✅ [${username}] logged in`);
    }

    // 4) Host creates the lobby
    const hostPage = pages.find((_, i) => USERS[i].isHost);
    console.log('→ Host clicking Make Game');
    await hostPage.click('button:has-text("Make Game")');

    const codeLocator = hostPage.locator('.lobby-code');
    await codeLocator.waitFor({ timeout: 10000 });
    const lobbyCode = (await codeLocator.innerText())
      .replace(/Lobby Code:\s*/, '')
      .trim();
    console.log('🛠️  Lobby code is →', lobbyCode);

    // 5) Other users join
    for (let i = 0; i < pages.length; i++) {
      if (USERS[i].isHost) continue;
      const page = pages[i];
      const user = USERS[i].username;

      console.log(`→ [${user}] navigating to Join Game`);
      await page.goto(`${BASE}/profile`, { waitUntil: 'domcontentloaded' });
      await page.click('button:has-text("Join Game")');
      await page.waitForURL('**/join_game', { timeout: 10000 });

      await page.fill('input[placeholder="Enter lobby code"]', lobbyCode);
      await page.click('button:has-text("Join Game")');
      await page.waitForURL('**/lobby', { timeout: 10000 });

      console.log(`✅ [${user}] joined lobby`);
    }

    console.log('\n🎉 Automation complete — browser windows remain open.');
    // Keep the process alive so you can interact
    await new Promise(() => {});
  } catch (err) {
    console.error('🔥 Automation error:', err);
    console.log('Browser windows remain open for inspection.');
    await new Promise(() => {});
  }
})();
