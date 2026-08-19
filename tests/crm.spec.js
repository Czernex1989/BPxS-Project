const {
  test,
  expect,
} = require("@playwright/test");

const TEST_EMAIL =
  "playwright-user@bpxs.test";

const TEST_PASSWORD =
  "Playwright123!";

async function loginOrRegister(page) {
  await page.goto("http://localhost:3000");

  await page
    .getByLabel("E-mail:")
    .fill(TEST_EMAIL);

  await page
    .getByLabel("Hasło:")
    .fill(TEST_PASSWORD);

  await page
    .getByRole("button", {
      name: "Zaloguj się",
    })
    .click();

  const loginError =
    page.locator("#authMessage.error");

  const appView =
    page.locator("#appView");

  const loginResult =
    await Promise.race([
      appView
        .waitFor({
          state: "visible",
          timeout: 5000,
        })
        .then(() => "logged-in"),

      loginError
        .waitFor({
          state: "visible",
          timeout: 5000,
        })
        .then(() => "login-error"),
    ]);

  if (loginResult === "logged-in") {
    return;
  }

  await page
    .getByRole("button", {
      name: "Rejestracja",
    })
    .click();

  await page
    .getByLabel("Imię:")
    .fill("Playwright Tester");

  await page
    .getByLabel("E-mail:")
    .fill(TEST_EMAIL);

  await page
    .getByLabel("Hasło:")
    .fill(TEST_PASSWORD);

  await page
    .getByRole("button", {
      name: "Utwórz konto",
    })
    .click();

  await expect(appView).toBeVisible();
}

test(
  "zalogowany użytkownik wykonuje pełny CRUD klienta",
  async ({ page }) => {
    const clientName =
      `Playwright Client ${Date.now()}`;

    await loginOrRegister(page);

    await page
      .getByLabel("Nazwa firmy:")
      .fill(clientName);

    await page
      .getByLabel("Email:")
      .fill("playwright-client@test.pl");

    await page
      .getByLabel("Notatka:")
      .fill(
        "Klient dodany przez test Playwright"
      );

    await page
      .getByLabel("Status:")
      .selectOption("KONTAKT");

    await page
      .getByLabel("Priorytet:")
      .selectOption("NISKI");

    await page
      .getByRole("button", {
        name: "Dodaj klienta",
      })
      .click();

    let clientCard = page
      .locator(".client")
      .filter({
        hasText: clientName,
      });

    await expect(clientCard).toBeVisible({
      timeout: 30000,
    });

    await expect(
      clientCard
    ).toContainText("KONTAKT");

    await expect(
      clientCard
    ).toContainText(
      "Priorytet: NISKI"
    );

    await clientCard
      .getByRole("button", {
        name: "Edytuj",
      })
      .click();

    await page
      .getByLabel("Status:")
      .selectOption("ZAMKNIĘTY");

    await page
      .getByLabel("Priorytet:")
      .selectOption("WYSOKI");

    await page
      .getByRole("button", {
        name: "Zapisz zmiany",
      })
      .click();

    clientCard = page
      .locator(".client")
      .filter({
        hasText: clientName,
      });

    await expect(
      clientCard
    ).toContainText("ZAMKNIĘTY");

    await expect(
      clientCard
    ).toContainText(
      "Priorytet: WYSOKI"
    );

    page.once(
      "dialog",
      async (dialog) => {
        await dialog.accept();
      }
    );

    await clientCard
      .getByRole("button", {
        name: "Usuń",
      })
      .click();

    await expect(
      page
        .locator(".client")
        .filter({
          hasText: clientName,
        })
    ).toHaveCount(0);
  }
);