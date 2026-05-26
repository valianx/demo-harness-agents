import { chromium } from "playwright";
import { writeFileSync } from "fs";
import { join } from "path";

const URL = process.argv[2] || "http://localhost:5173";
const TOTAL_SLIDES = 13;
const OUTPUT = join(process.cwd(), "presentation.pdf");

async function exportPDF() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const screenshots: Buffer[] = [];

  for (let i = 0; i < TOTAL_SLIDES; i++) {
    // Wait for controls to auto-hide (3s timeout + 0.5s animation)
    await page.waitForTimeout(4000);
    screenshots.push(await page.screenshot({ type: "png" }));
    console.log(`  Captured slide ${i + 1}/${TOTAL_SLIDES}`);
    if (i < TOTAL_SLIDES - 1) {
      await page.keyboard.press("ArrowRight");
    }
  }

  // Generate PDF with one image per page
  const pdfPage = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const imagesHtml = screenshots
    .map((buf) => {
      const b64 = buf.toString("base64");
      return `<div style="page-break-after:always;width:100vw;height:100vh;margin:0;padding:0;"><img src="data:image/png;base64,${b64}" style="width:100%;height:100%;object-fit:contain;"/></div>`;
    })
    .join("");

  await pdfPage.setContent(`<!DOCTYPE html><html><head><style>*{margin:0;padding:0;}@page{size:1920px 1080px;margin:0;}</style></head><body>${imagesHtml}</body></html>`, { waitUntil: "load" });

  const pdf = await pdfPage.pdf({
    width: "1920px",
    height: "1080px",
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    printBackground: true,
  });

  writeFileSync(OUTPUT, pdf);
  console.log(`PDF exported: ${OUTPUT} (${TOTAL_SLIDES} slides)`);

  await browser.close();
}

exportPDF().catch(console.error);
