import chromium from "@sparticuz/chromium-min";
import { NextRequest } from "next/server";
import puppeteer from "puppeteer-core";

export const maxDuration = 20;
export async function GET(request: NextRequest) {
  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
  const color = request.nextUrl.searchParams.get("color") ?? "";
  console.log(request.nextUrl.searchParams.get("color"));

  const browser = await puppeteer.launch({
    args: isLocal ? puppeteer.defaultArgs() : chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH ||
      (await chromium.executablePath(
        "https://ez-rest.s3.eu-north-1.amazonaws.com/scraper/chromium-v126.0.0-pack.tar",
      )),
    headless: chromium.headless,
  });

  const siteUrl = "https://zippystarter.com/tools/shadcn-ui-theme-generator";

  const context = browser.defaultBrowserContext();
  const page = await browser.newPage();

  await context.overridePermissions("https://zippystarter.com", [
    "clipboard-read",
    "clipboard-sanitized-write",
    "clipboard-write",
  ]);

  page.setDefaultTimeout(2000);
  await page.goto(siteUrl);
  const input = await page.$("#color-text");
  await input?.type("#" + color);
  await page.click(
    "xpath//html/body/div[1]/div/div/div/div[2]/div[2]/div/div/div[2]/div[3]/button[2]",
  );
  const dialogElement = await page.$('[role="dialog"]');
  const copyBtn = await dialogElement?.$("button");
  await copyBtn?.click();

  const clipboardText = await page.evaluate(() =>
    navigator.clipboard.readText(),
  );

  await browser.close();

  return Response.json({
    theme: clipboardText,
  });
}
