const { chromium } = require("playwright");

const BASE_URL = "http://localhost:5173";

const USERS = [
  { username: "test", password: "test" },
  { username: "test2", password: "test2" },
  { username: "test3", password: "test3" },
  { username: "C-bear", password: "dora" },
];

(async () => {
  const browsers = await Promise.all(
    USERS.map(() => chromium.launch({ headless: false }))
  );
  const contexts = await Promise.all(
    browsers.map((browser) => browser.newContext())
  );
  const pages = await Promise.all(contexts.map((context) => context.newPage()));

  // Step 1: Log all users in
  for (let i = 0; i < USERS.length; i++) {
    const page = pages[i];
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', USERS[i].username);
    await page.fill('input[name="password"]', USERS[i].password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  }

  // Step 2: user1 creates the game
  const creatorPage = pages[0];
  await creatorPage.click("button#create-lobby");
  await creatorPage.waitForSelector("[data-lobby-code]"); // Assume lobby code gets rendered with this
  const lobbyCode = await creatorPage.$eval("[data-lobby-code]", (el) =>
    el.textContent.trim()
  );

  console.log("Lobby code:", lobbyCode);

  // Step 3: other users join the lobby
  for (let i = 1; i < USERS.length; i++) {
    const page = pages[i];
    await page.fill('input[name="lobby-code"]', lobbyCode);
    await page.click("button#join-lobby");
  }

  // Optional: wait so you can see it
  await new Promise((res) => setTimeout(res, 20000));

  // Cleanup
  // await Promise.all(browsers.map(b => b.close()));
})();
