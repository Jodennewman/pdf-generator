# PDF Generator

A powerful tool for generating beautiful PDFs from HTML templates using JSON data.

## Quick Start

1. **Navigate to the Project Directory**
   ```bash
   cd /path/to/your/project
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Server**
   ```bash
   node server.js
   ```
   The interface will automatically open in your default browser.

4. **Use the Interface**
   - Click "Generate HTML Files" to create HTML from your JSON data
   - Click "Convert to PDF" to convert HTML files to PDFs
   - Click "Generate & Convert" to do both operations in sequence

## Project Structure

```
.
├── template-generator.js     # Core script for generating HTML from JSON
├── html-to-pdf-puppeteer.js # PDF conversion script
├── server.js                # Web server for the interface
├── interface.html           # User interface
├── JSON Modules/            # Your JSON data files
├── textures/               # Assets for PDF styling
│   ├── themes/            # Theme-specific textures
│   └── logos/             # Logo assets
├── outputs/               # Generated HTML files
└── pdfs/                 # Generated PDF files
```

## Requirements

- Node.js (v14 or higher)
- Modern web browser
- npm packages (installed via npm install):
  - express
  - puppeteer
  - open

## Command Line Usage

If you prefer using the command line directly:

1. **Generate HTML Files**
   ```bash
   node template-generator.js
   ```

2. **Convert to PDF**
   ```bash
   node html-to-pdf-puppeteer.js
   ```

## How It Works

1. The system reads JSON files from the `JSON Modules` directory
2. Generates HTML files in the `outputs` directory, maintaining folder structure
3. Converts HTML files to PDFs in the `pdfs` directory
4. Tracks processed files to avoid unnecessary regeneration

## Troubleshooting

1. **Server won't start**
   - Ensure port 3000 is available
   - Check Node.js installation with `node --version`
   - Verify all dependencies are installed

2. **Missing textures**
   - Ensure all required assets are in the `textures` directory
   - Check file paths in generated HTML

3. **PDF conversion issues**
   - Check console output for detailed error messages
   - Ensure Puppeteer is properly installed
   - Verify HTML files exist in outputs directory

## Notes

- PDFs are generated as single tall pages without breaks
- High-quality output with 2x device scale factor
- The system tracks processed files to avoid duplicate work
- Real-time logging of all operations in the server console

## Support

For issues or questions:
1. Check the console output for error messages
2. Verify file permissions in output directories
3. Create an issue with detailed information about your problem

---

*Note: This project is designed for macOS but can be adapted for other operating systems with appropriate modifications.* 