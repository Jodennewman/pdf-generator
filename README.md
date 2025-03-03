# PDF Generator

A powerful tool for generating beautiful PDFs from HTML templates using JSON data.

## Project Structure

```
.
├── Version4.html              # Main HTML template
├── html-templates/           # Additional HTML templates for advanced use
├── template-generator.js     # Core script for generating HTML from JSON
├── html-to-pdf-puppeteer.js # PDF conversion script
├── textures/                # Assets for PDF styling
│   ├── themes/             # Theme-specific textures
│   └── logos/              # Logo assets
├── outputs/                 # Generated HTML files
└── pdfs/                   # Generated PDF files
```

## Requirements

- Node.js (v14 or higher)
- npm packages (see package.json)

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Place your JSON data in the `JSON Modules` directory

3. Run the generator:
```bash
node template-generator.js
```

4. Convert to PDF:
```bash
node html-to-pdf-puppeteer.js
```

## Button Interface

For easier use, we provide a simple HTML interface to access core features. To use it:

1. Start the server:
```bash
node server.js
```

2. Open `interface.html` in your browser to access the buttons:
- Generate HTML: Creates HTML files from your JSON data
- Convert to PDF: Converts existing HTML files to PDFs
- Generate & Convert: Does both operations in sequence

The interface provides a user-friendly way to trigger PDF generation without using the command line.

## Advanced Templates

The `html-templates` directory contains additional templates for different use cases:
- `basic.html`: Simple, clean layout
- `advanced.html`: Feature-rich template with more styling options
- `custom.html`: Template for custom styling

To use a different template:
1. Copy your chosen template to the root directory
2. Update the template path in `template-generator.js`

## Troubleshooting

1. **Missing textures**: Ensure all required assets are in the `textures` directory
2. **Path issues**: All paths are relative to the project root
3. **JSON errors**: Validate your JSON data before generation

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## System Requirements

### Node.js Installation (Required)
1. Visit [Node.js official website](https://nodejs.org/)
2. Download and install the LTS (Long Term Support) version for macOS
3. Verify installation by opening Terminal and running:
   ```bash
   node --version
   npm --version
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