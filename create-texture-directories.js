const fs = require('fs');
const path = require('path');

const baseDir = './textures';

// Current textures from Version4.html
const directoryStructure = {
  themes: {
    peach: {
      main: [
        'Peachy.jpg',              // Main container background
        'DARKBLUE2.jpg',          // Title-left and blue-block background
        'VerticalBG.jpg',         // Title-right background
      ],
      alt: [
        'Artboard 6.jpg',         // Mustard-block-intro background
        'SomethingGeometric.png', // Intro first-letter background
        'yellowGeom-2.png',       // Action plan background
        'Artboard 1.jpg',         // Key terms background
        'Artboard 5.jpg',         // Pro tip background
        'Artboard 10.jpg',        // Takeaway blocks
        'AndThis.png',            // Summary sections
        'DaCops.png'              // Alternative summary background
      ]
    },
    blue: {
      main: ['main-bg.jpg', 'header-bg.jpg', 'title-bg.jpg'],
      alt: ['alt-1.jpg', 'alt-2.jpg', 'alt-3.jpg']
    },
    dark: {
      main: ['main-bg.jpg', 'header-bg.jpg', 'title-bg.jpg'],
      alt: ['alt-1.jpg', 'alt-2.jpg', 'alt-3.jpg']
    }
  },
  components: {
    takeaways: ['takeaway-1.jpg', 'takeaway-2.jpg', 'takeaway-3.jpg'],
    protips: ['protip-1.jpg', 'protip-2.jpg', 'protip-3.jpg'],
    keyterms: ['keyterms-1.jpg', 'keyterms-2.jpg'],
    actionplan: ['action-1.jpg', 'action-2.jpg']
  },
  shared: {
    overlays: ['noise.png', 'grain.png'],
    logos: [
      'RoundedWorking01.png',     // Top-left logo
      'WordMark.png',             // Course logo
      'Logo-One-Line-Light-for-Dark.png'  // Footer logo
    ]
  }
};

// Copy function to copy files from source to new structure
async function copyTextures() {
  const sourceBase = '/Users/jodennewman/Pictures/00–Clash Creation Assets';
  
  const sourceMap = {
    'Peachy.jpg': '/001-Textures/PDF BGs/Peachy.jpg',
    'DARKBLUE2.jpg': '/001-Textures/PDF BGs/DARKBLUE2.jpg',
    'VerticalBG.jpg': '/001-Textures/PDF BGs/VerticalBG.jpg',
    'Artboard 6.jpg': '/001-Textures/PDF BGs/Artboard 6.jpg',
    'SomethingGeometric.png': '/001-Textures/PDF BGs/SomethingGeometric.png',
    'yellowGeom-2.png': '/001-Textures/PDF BGs/yellowGeom-2.png',
    'Artboard 1.jpg': '/001-Textures/PDF BGs/Artboard 1.jpg',
    'Artboard 5.jpg': '/001-Textures/PDF BGs/Artboard 5.jpg',
    'Artboard 10.jpg': '/001-Textures/PDF BGs/Artboard 10.jpg',
    'AndThis.png': '/001-Textures/PDF BGs/AndThis.png',
    'DaCops.png': '/001-Textures/PDF BGs/DaCops.png',
    'RoundedWorking01.png': '/Logos:banners/PeachRebrand/Finals/RoundedWorking01.png',
    'WordMark.png': '/Logos:banners/Vertical Shortcut/WordMark.png',
    'Logo-One-Line-Light-for-Dark.png': '/Logos:banners/PeachRebrand/WordMark-and-Symbol/Logo-One-Line-Light-for-Dark.png'
  };

  function copyFile(filename, targetDir) {
    const sourcePath = path.join(sourceBase, sourceMap[filename]);
    const targetPath = path.join(targetDir, filename);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${filename}`);
    } else {
      console.log(`Source file not found: ${sourcePath}`);
    }
  }

  // Create directories and copy files
  Object.entries(directoryStructure).forEach(([category, content]) => {
    Object.entries(content).forEach(([theme, sections]) => {
      Object.entries(sections).forEach(([section, files]) => {
        const targetDir = path.join(baseDir, category, theme, section);
        fs.mkdirSync(targetDir, { recursive: true });
        
        files.forEach(file => {
          copyFile(file, targetDir);
        });
      });
    });
  });
}

// Create directory structure and copy files
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
  console.log(`Created base directory: ${baseDir}`);
}

copyTextures().then(() => {
  console.log('Texture directory structure created and files copied successfully!');
}).catch(err => {
  console.error('Error:', err);
}); 