const textureConfig = {
  // Base theme variants
  themes: {
    light: {
      peach: {
        primary: '#264653',
        secondary: '#e9c46a',
        accent: '#f4a261'
      },
      blue: {
        primary: '#1d3557',
        secondary: '#457b9d',
        accent: '#a8dadc'
      },
      green: {
        primary: '#2d6a4f',
        secondary: '#74c69d',
        accent: '#95d5b2'
      }
      // Add more color themes...
    },
    dark: {
      midnight: {
        primary: '#0a1128',
        secondary: '#1c2541',
        accent: '#3a506b'
      },
      // Add more dark themes...
    }
  },

  // Texture patterns for different components
  textures: {
    takeaways: {
      left: [
        '/textures/geometric/geo-1.jpg',
        '/textures/geometric/geo-2.jpg',
        '/textures/waves/wave-1.jpg',
        '/textures/dots/dots-1.jpg'
      ],
      right: [
        '/textures/lines/lines-1.jpg',
        '/textures/gradient/grad-1.jpg',
        '/textures/abstract/abs-1.jpg'
      ]
    },
    proTips: [
      '/textures/special/tip-1.jpg',
      '/textures/special/tip-2.jpg',
      '/textures/special/tip-3.jpg',
      '/textures/special/tip-4.jpg'
    ],
    headers: [
      '/textures/headers/header-1.jpg',
      '/textures/headers/header-2.jpg'
    ],
    backgrounds: [
      '/textures/backgrounds/bg-1.jpg',
      '/textures/backgrounds/bg-2.jpg'
    ]
  },

  // Recommended texture combinations
  combinations: {
    peach: {
      takeaway1: {
        left: 'geometric/geo-1.jpg',
        right: 'lines/lines-1.jpg',
        proTip: 'special/tip-1.jpg'
      },
      takeaway2: {
        left: 'waves/wave-1.jpg',
        right: 'gradient/grad-1.jpg',
        proTip: 'special/tip-2.jpg'
      }
      // More combinations...
    }
  }
};

// Add color variations for pro tip boxes
const proTipColors = {
  peach: [
    { bg: '#e9c46a', hueRotate: '0deg' },    // Original
    { bg: '#e9a46a', hueRotate: '330deg' },  // Warmer
    { bg: '#e9d46a', hueRotate: '30deg' },   // Yellower
    { bg: '#c4e96a', hueRotate: '60deg' },   // Green tint
  ],
  blue: [
    { bg: '#457b9d', hueRotate: '0deg' },    // Original
    { bg: '#45919d', hueRotate: '30deg' },   // Cyan shift
    { bg: '#45649d', hueRotate: '-30deg' },  // Purple shift
    { bg: '#457b7b', hueRotate: '180deg' },  // Teal shift
  ]
};

class TextureManager {
  constructor(theme, variant) {
    this.theme = theme;
    this.variant = variant;
    this.usedTextures = new Set();
  }

  getRandomTexture(category, subcategory = null) {
    const textures = subcategory ? 
      textureConfig.textures[category][subcategory] :
      textureConfig.textures[category];
    
    // Filter out recently used textures
    const availableTextures = textures.filter(t => !this.usedTextures.has(t));
    
    if (availableTextures.length === 0) {
      this.usedTextures.clear(); // Reset if all textures were used
      return textures[0];
    }

    const texture = availableTextures[Math.floor(Math.random() * availableTextures.length)];
    this.usedTextures.add(texture);
    return texture;
  }

  getTextureSet(componentType) {
    switch(componentType) {
      case 'takeaway':
        return {
          left: this.getRandomTexture('takeaways', 'left'),
          right: this.getRandomTexture('takeaways', 'right'),
          proTip: this.getRandomTexture('proTips')
        };
      // Add other component types...
    }
  }

  // Get a harmonious combination based on theme and index
  getThemeCombination(index = 0) {
    return textureConfig.combinations[this.variant]?.[`takeaway${index}`] || 
           this.getTextureSet('takeaway');
  }

  getProTipStyle(theme) {
    const colors = proTipColors[theme] || proTipColors.peach;
    const colorVariant = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      backgroundColor: colorVariant.bg,
      filter: `hue-rotate(${colorVariant.hueRotate})`
    };
  }
}

// Export the TextureManager class
module.exports = TextureManager; 