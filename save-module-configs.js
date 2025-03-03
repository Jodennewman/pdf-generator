const fs = require('fs');
const path = require('path');
const PDFTemplateGenerator = require('./template-generator.js');

// Define source directories
const directories = [
  './JSON Modules/Advanced Theory/Nuanced Hook/GPT',
  './JSON Modules/Advanced Theory/Nuanced Hook/Claude'
];

// Function to generate HTML from a module config
function generateModuleHTML(configPath) {
  try {
    const data = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(data);
    
    // Create generator instance
    const generator = new PDFTemplateGenerator(config);
    const html = generator.generateHTML();
    
    // Create output filename based on module number and LLM source
    const llmSource = configPath.includes('/GPT/') ? 'GPT' : 'Claude';
    const outputFileName = `module-${config.moduleInfo.moduleNumber}-${llmSource}.html`;
    const outputPath = path.join(__dirname, 'output', outputFileName);
    
    // Ensure output directory exists
    if (!fs.existsSync(path.join(__dirname, 'output'))) {
      fs.mkdirSync(path.join(__dirname, 'output'));
    }
    
    // Write HTML file
    fs.writeFileSync(outputPath, html);
    console.log(`Generated HTML: ${outputFileName}`);
    
  } catch (error) {
    console.error(`Error processing ${configPath}:`, error.message);
  }
}

// Process each directory
directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const filePath = path.join(dir, file);
        generateModuleHTML(filePath);
      }
    });
  } else {
    console.error(`Directory not found: ${dir}`);
  }
});

console.log('HTML generation complete!'); 