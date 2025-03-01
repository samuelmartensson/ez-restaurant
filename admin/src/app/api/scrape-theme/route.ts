import chromium from "@sparticuz/chromium-min";
import { NextRequest } from "next/server";
import puppeteer from "puppeteer-core";

export const maxDuration = 30;
export async function GET(request: NextRequest) {
  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
  const color = request.nextUrl.searchParams.get("color") ?? "";

  const browser = await puppeteer.launch({
    args: isLocal ? puppeteer.defaultArgs() : chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH ||
      (await chromium.executablePath(
        "https://ez-rest.s3.eu-north-1.amazonaws.com/scraper/chromium-v131.0.1-pack.tar",
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
  await page.evaluate(() => {
    localStorage.setItem(
      "config",
      JSON.stringify({
        theme: "violet",
        radius: 0.5,
        saturationRange: [100],
        lightnessRange: [100],
        colors: {
          light: {
            background: {
              h: 262.1,
              s: 100,
              l: 95,
            },
            foreground: {
              h: 262.1,
              s: 5,
              l: 0,
            },
            primary: {
              h: 262.1,
              s: 88.3,
              l: 57.8,
            },
            secondary: {
              h: 262.1,
              s: 30,
              l: 70,
            },
            border: {
              h: 262.1,
              s: 30,
              l: 50,
            },
            input: {
              h: 262.1,
              s: 30,
              l: 18,
            },
            card: {
              h: 262.1,
              s: 50,
              l: 90,
            },
            cardForeground: {
              h: 262.1,
              s: 5,
              l: 10,
            },
            muted: {
              h: 224.10000000000002,
              s: 30,
              l: 85,
            },
            mutedForeground: {
              h: 262.1,
              s: 5,
              l: 35,
            },
            accent: {
              h: 224.10000000000002,
              s: 30,
              l: 80,
            },
            accentForeground: {
              h: 262.1,
              s: 5,
              l: 10,
            },
            ring: {
              h: 262.1,
              s: 88.3,
              l: 57.8,
            },
            popover: {
              h: 262.1,
              s: 100,
              l: 95,
            },
            popoverForeground: {
              h: 262.1,
              s: 100,
              l: 0,
            },
            destructive: {
              h: 0,
              s: 100,
              l: 30,
            },
            destructiveForeground: {
              h: 262.1,
              s: 5,
              l: 90,
            },
          },
          dark: {
            background: {
              h: 262.1,
              s: 50,
              l: 5,
            },
            foreground: {
              h: 262.1,
              s: 5,
              l: 90,
            },
            primary: {
              h: 262.1,
              s: 88.3,
              l: 57.8,
            },
            secondary: {
              h: 262.1,
              s: 30,
              l: 10,
            },
            border: {
              h: 262.1,
              s: 30,
              l: 18,
            },
            input: {
              h: 262.1,
              s: 30,
              l: 18,
            },
            card: {
              h: 262.1,
              s: 50,
              l: 0,
            },
            cardForeground: {
              h: 262.1,
              s: 5,
              l: 90,
            },
            muted: {
              h: 224.10000000000002,
              s: 30,
              l: 15,
            },
            mutedForeground: {
              h: 262.1,
              s: 5,
              l: 60,
            },
            accent: {
              h: 224.10000000000002,
              s: 30,
              l: 15,
            },
            accentForeground: {
              h: 262.1,
              s: 5,
              l: 90,
            },
            ring: {
              h: 262.1,
              s: 88.3,
              l: 57.8,
            },
            popover: {
              h: 262.1,
              s: 50,
              l: 5,
            },
            popoverForeground: {
              h: 262.1,
              s: 5,
              l: 90,
            },
            destructive: {
              h: 0,
              s: 100,
              l: 30,
            },
            destructiveForeground: {
              h: 262.1,
              s: 5,
              l: 90,
            },
          },
        },
      }),
    );
  });
  await page.reload();

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
