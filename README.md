# PDF Template Generator

This repository contains tools to generate PDFs from HTML templates using JSON data.

## System Requirements

### Node.js Installation (Required)
1. Visit [Node.js official website](https://nodejs.org/)
2. Download and install the LTS (Long Term Support) version for macOS
3. Verify installation by opening Terminal and running:
   ```bash
   node --version
   npm --version
   ```

## Project Structure

```
.
├── Version4.html          # Original HTML template
├── template-generator.js  # Script to generate HTML from JSON
├── html-to-pdf-puppeteer.js # Script to convert HTML to PDF
├── json/                 # Directory for JSON input files
├── outputs/              # Generated HTML files
└── pdfs/                # Final PDF outputs
```

## Workflow

1. **Prepare JSON Data**
   - Place your JSON data files in the `json/` directory
   - Each JSON file should follow the template structure

2. **Generate HTML from JSON**
   ```bash
   node template-generator.js
   ```
   This will:
   - Read JSON files from the `json/` directory
   - Generate HTML files in the `outputs/` directory
   - Use Version4.html as the template

3. **Convert HTML to PDF**
   ```bash
   node html-to-pdf-puppeteer.js
   ```
   This will:
   - Process all HTML files in the `outputs/` directory
   - Generate PDFs in the `pdfs/` directory
   - Maintain folder structure
   - Skip already processed files (unless modified)

## First Time Setup

1. Clone this repository:
   ```bash
   git clone [repository-url]
   cd [repository-name]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Dependencies

The project requires the following npm packages:
- puppeteer (for PDF generation)
- Any additional dependencies listed in package.json

## Notes

- The system tracks processed files using `singleTallPDF-config.json`
- PDFs are generated as single tall pages without breaks
- Generated PDFs maintain high quality with 2x device scale factor
- The output PDF dimensions are optimized for standard viewing

## Troubleshooting

If you encounter any issues:
1. Ensure Node.js is properly installed
2. Check that all dependencies are installed
3. Verify JSON files are properly formatted
4. Check file permissions in output directories

## Support

For issues or questions, please:
1. Check the existing issues in the repository
2. Create a new issue with detailed information about your problem

---

*Note: This project is designed for macOS but can be adapted for other operating systems with appropriate modifications.* 