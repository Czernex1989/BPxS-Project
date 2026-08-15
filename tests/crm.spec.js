const { test, expect } = require("@playwright/test");

test("pełny CRUD klienta w Mini CRM", async ({ page }) => {
  const clientName = `Playwright Client ${Date.now()}`;

  await page.goto("http://localhost:3000");

  await page.getByLabel("Nazwa firmy:").fill(clientName);
  await page.getByLabel("Email:").fill("playwright@test.pl");

  await page
    .getByLabel("Notatka:")
    .fill("Klient dodany przez test Playwright");

  await page
    .getByLabel("Status:")
    .selectOption("KONTAKT");

  await page
    .getByLabel("Priorytet:")
    .selectOption("NISKI");

  await page
    .getByRole("button", { name: "Dodaj klienta" })
    .click();

  let clientCard = page
    .locator(".client")
    .filter({ hasText: clientName });

  await expect(clientCard).toBeVisible();
  await expect(clientCard).toContainText("KONTAKT");
  await expect(clientCard).toContainText("Priorytet: NISKI");

  await clientCard
    .getByRole("button", { name: "Edytuj" })
    .click();

  await page
    .getByLabel("Status:")
    .selectOption("ZAMKNIĘTY");

  await page
    .getByLabel("Priorytet:")
    .selectOption("WYSOKI");

  await page
    .getByRole("button", { name: "Zapisz zmiany" })
    .click();

  clientCard = page
    .locator(".client")
    .filter({ hasText: clientName });

  await expect(clientCard).toContainText("ZAMKNIĘTY");
  await expect(clientCard).toContainText("Priorytet: WYSOKI");

  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });

  await clientCard
    .getByRole("button", { name: "Usuń" })
    .click();

  await expect(clientCard).toHaveCount(0);
});