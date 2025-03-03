const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'JSON Modules', 'Advanced Theory', 'Nuanced Hook', 'GPT'),
  path.join(__dirname, 'JSON Modules', 'Advanced Theory', 'Nuanced Hook', 'Claude')
];

const themeConfig = {
  "mode": "light",
  "variant": "peach",
  "texturePaths": {
    "header": "/textures/peach/header.jpg",
    "body": "/textures/peach/body.jpg"
  }
};

directories.forEach(dir => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    if (file.endsWith('.json') && !file.startsWith('._')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix any trailing commas (common JSON error)
      content = content.replace(/,(\s*[}\]])/g, '$1');
      
      try {
        const json = JSON.parse(content);
        json.theme = themeConfig;
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
        console.log(`Updated ${file}`);
      } catch (e) {
        console.error(`Error in ${file}:`, e.message);
      }
    }
  });
}); 