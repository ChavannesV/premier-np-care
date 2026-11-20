// Run after `npm run dev` (no email is sent):
//   npm run smoke
//   SMOKE_EDITOR_WRITES=1 npm run smoke  # also edit, publish locally, and restore
//
// BASE_URL defaults to http://127.0.0.1:3000. PLAYWRIGHT_CHANNEL defaults to
// chrome; set it to chromium to use Playwright's downloaded browser instead.
// The optional write check requires a loopback URL and Keystatic local mode.
// Do not edit insurance.json or page-home.json concurrently with the write check.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = new URL(process.env.BASE_URL ?? "http://127.0.0.1:3000");
const writeChecks = process.env.SMOKE_EDITOR_WRITES === "1";
const channel = process.env.PLAYWRIGHT_CHANNEL ?? "chrome";
const routes = ["/", "/about", "/services", "/how-it-works", "/contact"];
const editorTests = [
  { id: "insurance", file: "insurance", field: "summary", label: "Insurance summary", marker: "Local smoke test coverage", exact: true },
  { id: "homePage", file: "page-home", field: "heroTitle", label: "Hero title", marker: "Local smoke test headline", exact: false },
];
const runtimeErrors = [];

if (writeChecks) {
  assert(
    ["localhost", "127.0.0.1", "[::1]"].includes(baseUrl.hostname),
    "Editor write checks only run against a loopback address.",
  );
}

function check(condition, description) {
  assert(condition, description);
  console.log(`PASS ${description}`);
}

async function until(test, description, timeout = 20_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await test()) return;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Timed out: ${description}`);
}

function watch(page) {
  page.on("pageerror", (error) => runtimeErrors.push(`${page.url()}: ${error.message}`));
}

async function visit(page, path) {
  const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: "load" });
  check(response?.status() === 200, `${path} returns 200`);
  return response;
}

async function publicPages(browser) {
  const practice = JSON.parse(await readFile(new URL("../src/content/data/practice.json", import.meta.url), "utf8"));
  const provider = JSON.parse(await readFile(new URL("../src/content/data/provider.json", import.meta.url), "utf8"));
  for (const [name, viewport] of Object.entries({
    desktop: { width: 1440, height: 900 },
    mobile: { width: 390, height: 844 },
  })) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    try {
      const page = await context.newPage();
      watch(page);
      for (const path of routes) {
        await visit(page, path);
        check(await page.locator("h1").count() === 1, `${name} ${path} has one heading`);
        check((await page.title()).trim().length > 0, `${name} ${path} has a document title`);
        await page.locator("img").evaluateAll((images) => {
          for (const image of images) image.loading = "eager";
        });
        await page.waitForFunction(() => [...document.images].every((image) => image.complete));
        const brokenImages = await page.locator("img").evaluateAll((images) =>
          images.filter((image) => image.naturalWidth === 0).map((image) => image.currentSrc),
        );
        check(brokenImages.length === 0, `${name} ${path} images load (${brokenImages.join(", ")})`);
        check(await page.locator("img:not([alt])").count() === 0, `${name} ${path} images have alt attributes`);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        check(overflow <= 1, `${name} ${path} fits the viewport`);
        if (name === "desktop" && path === "/") {
          const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((text) => JSON.parse(text));
          const practiceSchema = schemas.find((schema) => schema["@type"] === "MedicalBusiness");
          check(practiceSchema?.name === practice.name, "Search structured data uses the saved practice name");
          check(practiceSchema.provider?.name?.includes(provider.name), "Search structured data uses the saved provider name");
          check(practiceSchema.address?.streetAddress === practice.address.street &&
            practiceSchema.address?.postalCode === practice.address.postalCode,
          "Search structured data uses the saved practice address");
        }
      }

      if (name === "mobile") {
        await page.getByRole("button", { name: "Open navigation", exact: true }).click();
        const navigation = page.getByRole("navigation", { name: "Mobile navigation", exact: true });
        await navigation.waitFor();
        check(await navigation.locator('a[href="/services"]').isVisible(), "Mobile menu shows service link");
        await navigation.locator('a[href="/services"]').click();
        await page.waitForURL(new URL("/services", baseUrl).href);
        await navigation.waitFor({ state: "hidden" });
        check(true, "Mobile menu navigates and closes");
      }
    } finally {
      await context.close();
    }
  }
}

async function editorPage(browser) {
  const redirect = await fetch(new URL("/admin", baseUrl), { redirect: "manual" });
  check(
    [307, 308].includes(redirect.status) &&
      new URL(redirect.headers.get("location") ?? "", baseUrl).pathname === "/keystatic",
    "/admin redirects to /keystatic",
  );
  const robots = await (await fetch(new URL("/robots.txt", baseUrl))).text();
  for (const path of ["/admin", "/keystatic", "/api/keystatic"]) {
    check(robots.split(/\r?\n/).some((line) => line.trim() === `Disallow: ${path}`), `robots.txt excludes ${path}`);
  }

  const context = await browser.newContext({ reducedMotion: "reduce" });
  try {
    const page = await context.newPage();
    watch(page);
    const response = await visit(page, "/admin");
    await page.getByRole("link", { name: "Dashboard", exact: true })
      .or(page.getByRole("button", { name: "Log in with GitHub", exact: true })).first().waitFor();
    check((response.headers()["x-robots-tag"] ?? "").includes("noindex"), "Editor sends a noindex header");
    check(await page.locator('meta[name="robots"][content*="noindex"]').count() > 0, "Editor has noindex metadata");
    check(await page.locator("#main-content").count() === 0, "Editor has no public site layout");
    check(await page.getByRole("navigation", { name: "Primary navigation", exact: true }).count() === 0, "Editor has no public navigation");
    check(await page.locator("footer").count() === 0, "Editor has no public footer");

    if (writeChecks) {
      for (const test of editorTests) await saveAndRestore(page, context, test);
    }
    else console.log("SKIP editor mutations (run SMOKE_EDITOR_WRITES=1 npm run smoke in local development)");
  } finally {
    await context.close();
  }
}

async function saveAndRestore(page, context, test) {
  const file = new URL(`../src/content/data/${test.file}.json`, import.meta.url);
  const original = await readFile(file, "utf8");
  const originalData = JSON.parse(original);
  const practice = JSON.parse(await readFile(new URL("../src/content/data/practice.json", import.meta.url), "utf8"));
  const provider = JSON.parse(await readFile(new URL("../src/content/data/provider.json", import.meta.url), "utf8"));
  const values = {
    practiceName: practice.name,
    providerName: [provider.name, provider.credentials].filter(Boolean).join(", "),
    providerFirstName: provider.name.split(/\s+/)[0],
    minimumAge: String(practice.minimumAge),
    serviceArea: practice.serviceArea,
  };
  const originalRendered = originalData[test.field].replace(/\{(\w+)\}/g, (token, key) => values[key] ?? token);
  const marker = `${test.marker} ${Date.now()}`;
  let saved = false;
  try {
    await visit(page, `/keystatic/singleton/${test.id}`);
    const input = page.getByRole("textbox", { name: new RegExp(`^${test.label}`) });
    await input.waitFor();
    check(await input.inputValue() === originalData[test.field], `Local editor reads ${test.file}.json`);

    // Empty required fields must be rejected without touching the file.
    await input.fill("");
    const save = page.getByRole("button", { name: "Save", exact: true });
    if (await save.isEnabled()) await save.click();
    await until(async () =>
      await save.isDisabled() || await input.getAttribute("aria-invalid") === "true",
    "required field validation");
    check(await readFile(file, "utf8") === original, `Empty ${test.label} is not saved`);

    await input.fill(marker);
    await save.click();
    await until(async () => JSON.parse(await readFile(file, "utf8"))[test.field] === marker, "editor save reaches disk");
    saved = true;
    await page.getByText("Unsaved", { exact: true }).waitFor({ state: "hidden" });
    check(true, `Editor Save writes ${test.label} to JSON`);

    const publicPage = await context.newPage();
    watch(publicPage);
    await visit(publicPage, "/");
    await publicPage.getByText(marker, { exact: test.exact }).first().waitFor();
    check(true, `Saved ${test.label} appears on the public homepage`);
    await publicPage.close();

    await input.fill(originalData[test.field]);
    await save.click();
    await until(async () => JSON.parse(await readFile(file, "utf8"))[test.field] === originalData[test.field], "editor restores original field");
    await page.getByText("Unsaved", { exact: true }).waitFor({ state: "hidden" });
    check(true, `Editor restores the original ${test.label}`);
  } finally {
    // Preserve exact original formatting, even when a browser assertion fails.
    // Refuse to overwrite unrelated content changed concurrently by a human.
    const current = JSON.parse(await readFile(file, "utf8"));
    const comparable = { ...current, [test.field]: originalData[test.field] };
    assert.deepEqual(comparable, originalData, `${test.id} changed concurrently; restore manually to avoid losing another edit.`);
    assert([originalData[test.field], marker].includes(current[test.field]), `${test.label} changed concurrently; not overwriting it.`);
    await writeFile(file, original);
    console.log(`PASS Original ${test.id} file restored${saved ? " after local editing" : ""}`);
  }
  const restoredPage = await context.newPage();
  watch(restoredPage);
  try {
    await visit(restoredPage, "/");
    await restoredPage.getByText(originalRendered, { exact: test.exact }).first().waitFor();
    check(await restoredPage.getByText(marker, { exact: test.exact }).count() === 0, `Homepage shows original ${test.label} after restoration`);
  } finally {
    await restoredPage.close();
  }
}

const browser = await chromium.launch({ headless: true, ...(channel === "chromium" ? {} : { channel }) });
try {
  await publicPages(browser);
  await editorPage(browser);
  check(runtimeErrors.length === 0, `No browser runtime errors${runtimeErrors.length ? `: ${runtimeErrors.join(" | ")}` : ""}`);
  console.log("All smoke checks passed.");
} finally {
  await browser.close();
}
