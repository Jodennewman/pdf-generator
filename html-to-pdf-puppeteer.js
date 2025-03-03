#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// 1. Paths to input/output directories
const sourceDir = path.join(__dirname, 'outputs');
const outputDir = path.join(__dirname, 'pdfs');

// 2. Path to config file that stores last modification times
const configFilePath = path.join(__dirname, 'singleTallPDF-config.json');

// Load existing config, or start fresh if no file
let config = {};
if (fs.existsSync(configFilePath)) {
  try {
    config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
  } catch (err) {
    console.error('Error reading/parsing config file. Starting with empty config.');
    config = {};
  }
}

/**
 * Recursively list all .html files under a directory
 * @param {string} dir - directory to search
 * @returns {string[]} array of absolute file paths
 */
function getAllHtmlFiles(dir) {
  const results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...getAllHtmlFiles(fullPath));
    } else if (file.toLowerCase().endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Convert one HTML file to a single tall PDF with the same subpath in outputDir
 * @param {string} htmlPath - absolute path to .html file
 */
async function convertToSingleTallPDF(htmlPath) {
  // 1) Determine relative path from sourceDir
  const relativePath = path.relative(sourceDir, htmlPath);

  // 2) Build the output PDF path in mirrored structure
  const pdfPath = path.join(
    outputDir,
    relativePath.replace(/\.html?$/i, '.pdf')
  );

  // Ensure the output subfolder exists
  const pdfDirPath = path.dirname(pdfPath);
  if (!fs.existsSync(pdfDirPath)) {
    fs.mkdirSync(pdfDirPath, { recursive: true });
  }

  // 3) Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // 4) Navigate to the local HTML file
    const fileUrl = 'file://' + htmlPath;

    // Set a higher device scale factor for better image quality


    // Ensure images load fully before PDF generation
    await page.goto(fileUrl, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    // 5) Measure the total scroll height
    const scrollHeight = await page.evaluate(() => {
      return document.documentElement.scrollHeight;
    });
    
    const pxToMm = 25.4 / 96;   // at 96 DPI, 1 px ~ 0.26458 mm
    const heightInMm = scrollHeight * pxToMm;

    await page.setViewport({
      width: 790,
      height: scrollHeight,
      deviceScaleFactor: 2  // Increase this for higher quality (1 is default)
    });
    // Optional small delay for final rendering
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 300)));

    // After page.goto() and before page.pdf()
    await page.addStyleTag({
      content: `
        * {
          filter: none !important;
          -webkit-filter: none !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }
      `
    });

    // 7) Create a single tall PDF
    //    - Width '1200px' matches the viewport
    //    - Height is dynamic based on scrollHeight
    //    - This ensures no page breaks
    await page.pdf({
      path: pdfPath,
      printBackground: true,
      width: '230mm',
      height: `${heightInMm}mm`,
      omitBackground: true,
      scale: 1,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    console.log(`✓ Created PDF: ${pdfPath}`);
  } catch (err) {
    console.error(`Error converting ${htmlPath}:`, err);
  } finally {
    await browser.close();
  }
}

/**
 * Main process
 */
(async () => {
  // Get all .html files in the sourceDir
  const allHtmlFiles = getAllHtmlFiles(sourceDir);
  if (!allHtmlFiles.length) {
    console.log('No .html files found in:', sourceDir);
    return;
  }

  console.log(`Found ${allHtmlFiles.length} HTML file(s).`);
  for (const htmlFile of allHtmlFiles) {
    try {
      const { mtimeMs } = fs.statSync(htmlFile);

      // Check config to see if it was processed and not updated
      if (config[htmlFile] && config[htmlFile] >= mtimeMs) {
        // Already processed, skip
        console.log(`Skipping (no change): ${htmlFile}`);
        continue;
      }

      console.log(`Converting: ${htmlFile}`);
      await convertToSingleTallPDF(htmlFile);

      // Update the timestamp in config
      config[htmlFile] = mtimeMs;
      // Save config
      fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
    } catch (err) {
      console.error(`Error processing ${htmlFile}:`, err);
    }
  }

  console.log('All done!');
})();