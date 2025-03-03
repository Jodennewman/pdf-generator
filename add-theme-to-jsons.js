const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'JSON Modules', 'Advanced Theory', 'Nuanced Hook', 'GPT'),
  path.join(__dirname, 'JSON Modules', 'Advanced Theory', 'Nuanced Hook', 'Claude')
];

const themeConfig = {
  "theme": {
    "mode": "light",
    "variant": "peach",
    "texturePaths": {
      "header": "/textures/peach/header.jpg",
      "body": "/textures/peach/body.jpg"
    }
  }
};

directories.forEach(dir => {
  console.log(`Checking directory: ${dir}`);
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      // Skip macOS metadata files and only process actual JSON files
      if (file.endsWith('.json') && !file.startsWith('._')) {
        const filePath = path.join(dir, file);
        console.log(`Processing file: ${filePath}`);
        
        try {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          console.log(`File content length: ${fileContent.length}`);
          
          // Try to parse JSON
          let jsonContent;
          try {
            jsonContent = JSON.parse(fileContent);
          } catch (parseError) {
            console.error(`Error parsing JSON in file ${file}:`);
            console.error(`First 100 characters of file: ${fileContent.substring(0, 100)}`);
            console.error(parseError);
            return;
          }
          
          // Add theme if it doesn't exist
          if (!jsonContent.theme) {
            jsonContent.theme = themeConfig.theme;
            
            // Write back to file with pretty formatting
            fs.writeFileSync(
              filePath, 
              JSON.stringify(jsonContent, null, 2),
              'utf8'
            );
            console.log(`Added theme to: ${file}`);
          } else {
            console.log(`Theme already exists in: ${file}`);
          }
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
        }
      }
    });
  } else {
    console.error(`Directory not found: ${dir}`);
  }
}); 