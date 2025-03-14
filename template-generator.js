const fs = require('fs');
const path = require('path');
const TextureManager = require('./texture-config');

class PDFTemplateGenerator {
  constructor(templateConfig, sourcePath) {
    // Validate required structure
    const requiredFields = [
      'moduleInfo.moduleNumber',
      'moduleInfo.sectionName',
      'moduleInfo.moduleTitle',
      'overview.quote',
      'overview.introText',
      'keyTerms',
      'actionPlan',
      'takeaways',
      'proTips',
      'finalWords',
      'theme.mode'  // Theme must be specified in JSON
    ];

    for (const field of requiredFields) {
      const value = field.split('.').reduce((obj, key) => obj?.[key], templateConfig);
      if (!value) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    this.config = {
      ...templateConfig,
    };

    // Calculate the output path based on module structure
    const moduleNum = templateConfig.moduleInfo.moduleNumber.toString().replace('.', '').padStart(4, '0');
    const parsedFile = path.parse(templateConfig.moduleInfo.moduleTitle);
    
    // Check if filename already starts with a module number pattern (e.g., M01, Module01, 01_, etc.)
    const hasModulePrefix = /^(?:M|Module|VS)?[0-9]{2,4}[_-]/.test(parsedFile.name);
    const baseFileName = hasModulePrefix ? 
      parsedFile.name : 
      `VS${moduleNum}_${parsedFile.name}`;

    // Get the actual path of the JSON file relative to outputs directory
    const relativeToOutputs = path.relative(outputBaseDir, path.dirname(sourcePath));
    
    // Calculate how many levels deep we are from the outputs directory
    const dirLevels = relativeToOutputs.split('/').filter(Boolean).length;
    // Add one level to get out of the outputs directory
    this.texturesPath = '../'.repeat(dirLevels - 1);

    this.themeVariants = {
      light: {
        peach: {
          primaryColor: '#264653',
          secondaryColor: '#e9c46a',
          textColor: '#264653',
          lightText: '#fff7e4',
          // ... other color mappings
        },
        dark: {
          primaryColor: '#1a1a1a',
          secondaryColor: '#4a4a4a',
          textColor: '#333',
          lightText: '#fff7e4',
          // ... dark theme colors
        }
      }
    };
    this.textureManager = new TextureManager(this.config.theme.mode, this.config.theme.variant);
  }

  calculateTexturesPath(modulePath) {
    // Normalize the path to use forward slashes
    const normalizedPath = modulePath.replace(/\\/g, '/');
    
    // Split the path into segments and count the levels after 'outputs'
    const segments = normalizedPath.split('/');
    const outputsIndex = segments.findIndex(segment => segment === 'outputs');
    
    // Count how many segments are after 'outputs'
    // For example:
    // "outputs/Basic_Theory/04-Algorithmic-Reality/file.html" -> 2 levels (needs ../../../)
    // "outputs/Posting_Scheduling/file.html" -> 1 level (needs ../../)
    const levelsAfterOutputs = segments.slice(outputsIndex + 1, -1).length;
    
    // Add one ../ for each level after outputs, plus one more to get to the root where textures is
    return '../'.repeat(levelsAfterOutputs + 2);
  }

  determineContentType(config) {
    // Keywords that indicate technical/theoretical content
    const technicalKeywords = ['data', 'metrics', 'analysis', 'theory', 'algorithm', 'research'];
    // Keywords that indicate creative/strategic content
    const creativeKeywords = ['creative', 'strategy', 'engagement', 'hooks', 'storytelling'];
    
    const content = JSON.stringify(config).toLowerCase();
    const isTechnical = technicalKeywords.some(word => content.includes(word));
    const isCreative = creativeKeywords.some(word => content.includes(word));
    
    return isTechnical ? 'technical' : isCreative ? 'creative' : 'neutral';
  }

  getThemeMode(contentType) {
    return contentType === 'technical' ? 'dark' : 'light';
  }

  getHueVariation(contentType) {
    // Return hue adjustment in degrees
    switch(contentType) {
      case 'technical':
        return { primary: -10, secondary: 10 }; // Cooler primary, warmer secondary
      case 'creative':
        return { primary: 10, secondary: -10 }; // Warmer primary, cooler secondary
      default:
        return { primary: 0, secondary: 0 }; // No variation
    }
  }

  generateHTML() {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        ${this.generateHead()}
      </head>
      <body>
        <div class="container ${this.config.theme.mode} ${this.config.theme.variant}">
          ${this.generateContent()}
        </div>
        ${this.generateScripts()}
      </body>
      </html>
    `.trim();
  }

  generateHead() {
    const themeFolder = this.config.theme.mode === 'light' ? '/Light' : '/Dark';
    const colors = this.config.theme.mode === 'light' ? {
      text: '#264653',
      lightText: '#fff7e4'
    } : {
      text: '#fff7e4',
      lightText: '#264653'
    };
    return `
      <head>
        <meta charset="UTF-8">
        <title>${this.config.moduleInfo.moduleTitle}</title>
        
        <!-- FONTS -->
        <link href="https://fonts.cdnfonts.com/css/lebron-slab" rel="stylesheet">
        <link href="https://fonts.cdnfonts.com/css/neue-haas-grotesk-display-pro" rel="stylesheet">
        
        <!-- Fitty -->
         <script src="https://cdn.jsdelivr.net/npm/fitty@2.3.7/dist/fitty.min.js"></script>

        <style>
    /* RESET */
    * {
      margin: 0; 
      padding: 0; 
      box-sizing: border-box;
    }
    body {
      font-family: 'Neue Haas Grotesk Display Pro', Arial, sans-serif;
      background-color:${themeFolder === '/Dark' ? 'rgb(8, 20, 27)' : 'rgb(223, 178, 153)'};
      color: ${colors.text};
      padding: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
    }

    .container {
      width: 235mm;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      overflow: hidden;
      grid-template-rows:
        repeat(4, 69.25666667px)
        repeat(16, auto);
      gap: 0;
      background-image: 
        url('${this.texturesPath}textures/themes${themeFolder}/Peachy.jpg'), linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0) 50%,
          rgba(0, 0, 0, 0.50) 100%
        );
      background-size: cover;
      background-blend-mode: darken;
      background-position: ${themeFolder === '/Dark' ? 'top' : 'bottom'};
      padding: 0 70px 20px 70px;
      position: relative;
      counter-reset: takeaway-counter;
      color: ${colors.text};
    }

    /* LOGO pinned top-left */
    .logo {
      grid-column: 1 / 1;
      grid-row: 1 / 1;
      width: 13mm;
      height: 13mm;
      background-image: url('${this.texturesPath}textures/logos/RoundedWorking01.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      position: relative;
      top: 18px;
      left: -59px;
      z-index: 10;
      filter: drop-shadow(-3px 3px 2px rgba(113,59,5,0.45));
    }

    /* ===== TITLE (Rows 1-3) EXACT as old code ===== */
    .title-container {
      grid-column: 1 / 13;
      grid-row: 1 / 4; 
      display: grid;
      grid-template-columns: 2fr 1fr;
    }
    .title-left {
      background-color: #264653;
      background-image: url('${this.texturesPath}textures/themes${themeFolder}/DARKBLUE2.jpg');
      background-size: 100% auto;
      background-position: bottom;
      padding: 15px;
      text-wrap: pretty;
      border-top-left-radius: 45px;
      color: ${colors.lightText};
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      position: relative;
    }
    .title-left .course-name {
      position: absolute;
      top: 10px;
      left: 0;
      right: 0;
      font-size: 0.7rem;
      font-weight: 300;
      opacity: 0.5;
      text-align: center;
      text-transform: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: max-content;  /* Give it a specific width */
      margin: 0 auto;  /* Center horizontally */
    }
    .title-left .course-name::after {
      content: '';
      display: inline-block;
      width: 100%;
    }
    .title-left .module-number {
      margin-top: 10px;
    }
    .title-left h1 {
        
      font-size: clamp(2rem, 5vw, 3.3rem);
      font-weight: 600;
      margin-top: 0.7rem;
      margin-bottom: 0;
      line-height: 1.0;
      max-height: 2.4em;
      overflow: hidden;
      display: -webkit-box;
      word-break: break-word;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      
    }
    .title-right {
      background-color: ${this.config.theme.mode === 'light' ? 'rgba(200, 167, 159, 0.3)' : 'rgba(68, 214, 202, 0.27)'};
      background-image: url('${this.texturesPath}textures/themes${themeFolder}/VerticalBG.jpg');
      background-size: 150% auto;
      background-blend-mode: ${this.config.theme.mode === 'light' ? 'lighten' : 'color-burn'};
      padding: 15px 10px;   /* Increased vertical padding */
      border-bottom-right-radius: 45px;
      color: #fff;
      text-shadow: -2px 2px 2px rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 5px;  /* Increased gap */
      justify-content: center;  /* Center vertically */
      height: 100%;  /* Take full height */
    }
    .course-logo {
      width: 100%;
      height: 40px;
      display: block;
      margin-left: auto;
      margin-right: auto;
      margin-top: -8px;
      margin-bottom: 3px;
      background-image: url('${this.texturesPath}textures/themes${themeFolder}/WordMark.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: 50% 0%;
      border-radius: 10px;
      filter: drop-shadow(2px -2px 2px rgba(255,255,255,0.2)) drop-shadow(-2px 2px 2px rgba(0,0,0,0.3));
      border-bottom: 3px double ${this.config.theme.mode === 'light' ? 'rgb(70, 77, 86)' : 'rgb(255, 234, 223)'};
      padding: 27px;
    }
    .location-path {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;  /* Slightly more gap between items */
      text-align: center;
      color: #fff7e4;
    }
    .path-main {
      font-size: 0.7rem;
      font-weight: 600;
    }
    .path-sub {
      font-size: 0.9rem;  /* Slightly larger */
      font-weight: 600;
      opacity: 0.9;
    }
    .path-current {
      font-size: 1rem;  /* Larger current section */
      font-weight: 600;
      opacity: 1;
    }
    .path-arrow {
      font-size: 0.6rem;
      opacity: 0.7;
      line-height: 1;
      margin: -1px 0;  /* Slightly reduced negative margin */
    }

    /* ===== ROW 4: Mustard (left) + Blue block (right) as old code ===== */
    .mustard-block-intro {
      grid-row: 4 / 5;
      grid-column: 1 / 7;
      background-color: #e9c46a;
      background-image: url('${this.texturesPath}textures/themes${themeFolder}/Artboard 6.jpg');
      background-size: cover;
      margin: 3px;
      padding: 5px 10px;
      color: ${colors.text};
      border-radius: 0;
      height:50%;
    }
    .mustard-block-intro h2 {
      font-size: 1.3rem;
      font-weight: 500;
      margin: 0;
      padding: 3px 5px 11px 0;
      font-family: 'Neue Haas Grotesk Display Pro', sans-serif;
    }

    .blue-block {
      grid-column: 7 / 13;
      grid-row: 4 / 5;
      background-color: #264653;
      background-image: url('${this.texturesPath}textures/themes${themeFolder}/DARKBLUE2.jpg');
      background-size: 100% auto;
      filter: brightness(1.25);
      background-position: bottom;
      padding: 20px;
      color: ${colors.lightText};
      border-radius: 0;
      border-top-right-radius: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .blue-block::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('${this.texturesPath}textures/themes${themeFolder}/DARKBLUE2.jpg');
  background-size: 120% auto;
  background-position: bottom;  /* Change to top since we're flipping */
  transform: scaleY(-1);
  border-bottom-right-radius: 45px;
  z-index: -1

    }

    .blue-block h3 {
      font-style: italic;
      font-weight: 600;
      text-align: center;
      margin: 0;
      margin-left: -5px;
      width: 100%;
      line-height: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;  /* Limit to 2 lines */
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* ===== ROWS 5..8 LOCKED => Key Terms & Action Plan side by side ===== */

    /* INTRO (Row 5, col 1-7) with slightly smaller first-letter so row height is ~11px less. */
    .intro {
      grid-row: 4 / 6; 
      grid-column: 1 / 7;
      position: relative;
      text-align: justify;
      color: ${colors.text};
      padding: 0 5px;
      padding-right: 20px;
      margin-top: 10%;
    }
    .intro::first-letter {
      font-family: 'Lebron Slab', serif; 
      font-weight: 300;
      color: ${colors.text};
      initial-letter: 2 1; /* slightly smaller to reduce row height ~11px */
      margin-right: 0.4em;
      margin-top: 8.5%;
      background-image: url('${this.texturesPath}textures/themes${themeFolder}/SomethingGeometric.png');
      background-size: auto 190%;
      background-position: 18% 50%;
      border-top-left-radius: 1.5em;
      border-bottom-right-radius: 1.5em;
      padding: 0.8em 0.4em 0.8rem 0.8rem;
    }
    .intro p {
      font-family: 'Neue Haas Grotesk Display Pro', sans-serif;
      font-size: 1rem;
      line-height: 1.3;
    }

    /* Key Terms in Rows 5..8, left side => col 1..7, spanning 4 locked rows if needed. */
    .key-terms {
      grid-row: 7 / 9;
      grid-column: 1 / 7;
      background-image: linear-gradient(to bottom, 
        ${this.config.theme.mode === 'light' 
          ? 'rgba(190, 104, 100, 0.5)' 
          : 'rgba(38, 70, 83, 0.5)'}, 
        rgba(255, 255, 255, 0)
      );
      /*   background-image: url('../textures/themes${themeFolder}/Artboard 1.jpg');
      background-size: auto 150%;
      background-position: 50% 20%;
      /* Add saturation filter */
     /* filter: saturate(0.6); */
      color: ${colors.text};
      padding: 15px 20px;
      border-top-left-radius: 45px;
      margin-top: 10px;
      font-family: 'Neue Haas Grotesk Display Pro', sans-serif;
      margin-right: 2.5px;
    }
    .key-terms h2 {
      color: ${colors.text};
      padding: 5px 5px;
      margin-bottom: 10px;
      background-image: url('${this.texturesPath}textures/themes${themeFolder}/Artboard 6.jpg');
      background-size: 100% auto;
      
      font-size: 1.3rem;
      font-weight: 500;
      font-family: 'Neue Haas Grotesk Display Pro', sans-serif;
    }

    /* New term layout */
    .term-container {
      margin-bottom: 5px;
    }

    .key-terms .term-word {
      float: left;
      font-size: 1.7rem;
      font-weight: 800;
      line-height: 1;
      padding: 5px;
      margin: 0 2px 2px 0;
      background: rgba(124, 124, 124, 0.15);
      border-radius: 12px;
      width: min-content;
      color: ${colors.text};
    }

    .key-terms .term-definition {
      font-size: 0.95rem;
      line-height: 1.3;
      opacity: 0.9;
      color: ${colors.text};
    }

    /* Clear the float before the next term starts */
    .term-container::after {
      content: '';
      display: block;
      clear: both;
    }

    /* ACTION PLAN from row 5..8, right side => col 7..13, so it won't push Key Terms down. */
    .action-plan {
      grid-row: 5 / 9;  /* Same as Key Terms */
      grid-column: 7 / 13;
      margin-top: 3px;
      display: flex;
      flex-direction: column;
    }

    /* Title for Action Plan in a separate mustard block. */
    .action-plan-title {
      background-color: #e9c46a;
      background-image: url('${this.texturesPath}textures/themes${themeFolder}/yellowGeom-2.png');
      background-size: cover;
      color: ${colors.text};
      stroke-width: 10px;
      text-shadow: 1 1 6px rgba(0, 0, 0, 0.5);
      margin: 3px;
      padding: 15px 10px;  /* Increased padding */
      border-radius: 0;
      border-bottom-right-radius: 45px;
      border-top-left-radius: 45px;
    }
    .action-plan-title h2 {
      font-size: 1.8rem;
      text-transform: uppercase;
      margin-top: 0px;
      letter-spacing: 1px;
      font-weight: 700;
      text-align: center;
    }

    /* Body of Action Plan => new background image with your specs */
    .action-plan-body {
      flex-grow: 1;  /* This will make it fill available space */
      background-image: url('${this.texturesPath}textures/themes${themeFolder}/yellowGeom-2.png');
      background-size: auto 140%;
      background-position: 50% 0%;
      margin-left: 2.5px;
      padding: 5px 15px;  /* Increased padding */
      display: flex;
      font-size: 1.2rem;
      font-weight: 500;
      text-wrap: balance;
      flex-direction: column;
      justify-content: space-evenly;  /* Spread items evenly */
      color: ${colors.text};
    }
    .action-plan-body ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .action-plan-body li {
      margin: 25px 0;  /* Increased margins */
      padding: 20px 20px 20px 60px;  /* Increased padding */
      position: relative;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      font-size: 1.1rem;
      line-height: 1.4;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .action-plan-body li::before {
      content: "";
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
      width: 20px;
      height: 20px;
      background: rgba(255, 255, 255, 0.45);
      border-radius: 4px;
      border: 2px solid rgba(255, 255, 255, 0.55);
    }

    /* ===== ROW 9..14 => auto for the rest ===== */

    /* CARDINAL SINS (Row 9 => full width) => heading bar + body. */
    .cardinal-sins-heading {
      grid-row: 9 / 10;
      grid-column: 1 / 13;
      background-color: #264653;
      color: #fff7e4;
      padding: 10px 15px;
      border-top-right-radius: 35px;
      margin-top: 10px;
    }
    .cardinal-sins-heading h2 {
      margin: 0;
      font-size: 1.4rem;
    }
    .cardinal-sins-body {
      grid-row: 9 / 10;
      grid-column: 1 / 13;
      background-color: transparent;
      margin-top: 40px;
      padding: 10px 15px;
      line-height: 1.4;
      color: #fff;
    }

    /* CARDINAL VIRTUES (Row 10 => full width) => heading + body. */
    .cardinal-virtues-heading {
      grid-row: 10 / 11;
      grid-column: 1 / 13;
      background-color: #264653;
      color: #fff;
      padding: 10px 15px;
      border-top-right-radius: 35px;
      margin-top: 10px;
    }
    .cardinal-virtues-heading h2 {
      margin: 0;
      font-size: 1.4rem;
    }
    .cardinal-virtues-body {
      grid-row: 10 / 11;
      grid-column: 1 / 13;
      background-color: transparent;
      margin-top: 40px;
      padding: 10px 15px;
      line-height: 1.4;
    }

    /* PRO TIP in row 11 => narrower columns 4..10, truly centered horizontally. */
    .protip-block {
      grid-row: 11 / 12;
      grid-column: 2 / 12;
      background-color: #fefefe;
      background-image: url('${this.texturesPath}textures/themes${themeFolder}/protip.jpg');
      background-size: cover;
      border-radius: 1.1rem;
      color: #fff7e4;
      padding: 20px 25px;
      margin: -2px 0px -5px 0px;
      text-align: left;
      position: relative;
      transform: rotate(-1deg);  /* Slight tilt */
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);  /* Deeper shadow */
    }

    .protip-block::before {
      content: "!";
      position: absolute;
      left: -15px;
      top: 50%;
      transform: translateY(-50%);
      background: #e9c46a;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      font-weight: bold;
      box-shadow: 0 3px 8px rgba(0,0,0,0.15);
    }

    .protip-block h2 {
      font-size: 1.3rem;
      font-weight: bold;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding-left: 25px;  /* Make room for the ! */
    }

    .protip-block p {
      line-height: 1.4;
      font-size: 1.1rem;
      padding-left: 25px;  /* Make room for the ! */
    }

    /* BOTTOM TABLE (Row 12 => full width). 
       We'll shift it down to row 12 if you want. If you prefer row 11, reorder. */
    .bottom-table {
      grid-row: 12 / 13;
      grid-column: 2 / 12;
      padding: 7px;
      background-color: #264653;
      color: #fff;
      border-top-right-radius: 35px;
      border-bottom-left-radius: 35px;
      margin-top: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    table thead th {
      background-color: rgba(255,255,255,0.1);
      color: #fff;
      padding: 7px;
      text-align: left;
    }
    table tbody td {
      padding: 7px;
      border-bottom: 1px solid rgba(255,255,255,0.2);
    }

    /* FINAL WORDS => row 13, with a mustard rectangle background. */
    .final-words {
      grid-row: 99;  /* Force to end by using a high row number */
      grid-column: 2 / 12;
      order: 999;    /* Flexbox/Grid order as backup */
      color: #fff7e4;
      margin-top: 15px;
      margin-bottom: 50px;  /* Add space before footer */
      padding: 15px;
      border-radius: 0;
      border-top-left-radius: 45px;
      border-top-right-radius: 45px;
      text-align: center;
    }
    .final-words h2 {
      font-size: 1.3rem;
      font-weight: 400;
      margin-bottom: 5px;
    }
    .final-words h1 {
      font-size: 2.2rem;
      margin-bottom: 8px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .final-words p {
      line-height: 1.4;
      font-size: 1rem;
    }

    /* FOOTER => row 14 => simple dark color, white text, some breathing room. */
    .footer {
      grid-row: 100; /* Footer after final words */
      grid-column: 1 / -1;
      order: 1000;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 40px;
      color: #fff7e4;
      font-weight: 100;
      letter-spacing: 3px;
      font-size: 0.9rem;
      z-index: 10; /* Ensure it stays on top */
    }
    .bottom-right-image {
      width: 40mm;
      height: auto;
      margin-right: 10px;
    }
    .bottom-right-image img {
      width: 100%;
      height: auto;
      display: block;
    }

    /* RESPONSIVE */
    

    /* Replace the cardinal sections with these new styles */
    .takeaway-block-left {
      grid-column: 1 / 9;  /* 2/3 width */
      grid-row: auto;
      background-color: #f4a261;
      background-image: url('${this.texturesPath}textures/themes${themeFolder}/Artboard 10.jpg');
      background-size: 100% auto;
      padding: 30px;
      color: #fff7e4;
      border-bottom-left-radius: 70px;
      margin-top: 10px;
    }

    .takeaway-summary-right {
      grid-column: 9 / 13;
      grid-row: auto;
      background-color: #e9c46a;
      background-image: url('${this.texturesPath}textures/themes${themeFolder}/Artboard 1.jpg');
      background-size: auto 190%;
      background-position: 70% 50%;
      font-weight: 500;
      padding: 20px;
      color: #fff7e4;
      border-top-right-radius: 20px;
      margin-top: 10px;
    }

    /* Remove any conflicting styles */
    .takeaway-summary-right::before {
      display: none;
    }

    .takeaway-summary-right ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .takeaway-summary-right li {
      margin: 4px 0;
      padding: 6px 12px 6px 25px;
      position: relative;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 6px;
      font-size: 1rem;
      line-height: 1.3;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .takeaway-block-right {
      grid-column: 5 / 13;  /* 2/3 width, but on right */
      grid-row: auto;
      background-color: #264653;
      background-image: url('${this.texturesPath}textures/themes${themeFolder}/DARKBLUE2.jpg');
      background-size: 100% auto;
      padding: 20px;
      color: ${colors.lightText};
      border-bottom-right-radius: 35px;
      margin-top: 10px;
    }

    .takeaway-summary-left {
      grid-column: 1 / 5;  /* 1/3 width, but on left */
      grid-row: auto;
      background-color: #e9c46a;
      background-image: url('${this.texturesPath}textures/themes${themeFolder}/Main5.jpg');
      background-size:auto 190%;
      background-position: 100% 50%;
      transform: scaleX(-1);  /* Flip the background */
      font-weight: 500;
      padding: 20px;
      color: #fff7e4;
      border-top-right-radius: 20px;
      margin-top: 10px;
    }

    /* Flip the content back */
    .takeaway-summary-left ul {
      transform: scaleX(-1);  /* Flip content back to normal */
    }

    .takeaway-block-left h2,
    .takeaway-block-right h2 {
      font-size: 1.8rem;
      margin-bottom: 12px;
      font-weight: 600;
    }

    .takeaway-block-left p,
    .takeaway-block-right p {
      font-size: 1.1rem;
      line-height: 1.4;
    }

    .takeaway-summary-left,
    .takeaway-summary-right {
      padding: 15px 12px;
      display: flex;
      align-items: center;
    }

    .takeaway-summary-left ul,
    .takeaway-summary-right ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .takeaway-summary-left li,
    .takeaway-summary-right li {
      margin: 4px 0;
      padding: 6px 12px 6px 25px;
      position: relative;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 6px;
      font-size: 1rem;
      line-height: 1.3;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .takeaway-summary-left li::before,
    .takeaway-summary-right li::before {
      content: "";
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
      width: 8px;
      height: 8px;
      background: rgba(255, 255, 255, 0.45);
      border-radius: 2px;
      border: 1px solid rgba(255, 255, 255, 0.55);
    }

    /* New header style */
    .takeaway-header {
      grid-column: 1 / 13;
      text-align: center;
      margin: 20px 0 10px 0;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .takeaway-header h2 {
      font-size: 1.8rem;
      font-weight: 600;
      color: #264653;
      padding: 0 20px;
      position: relative;
      display: inline-block;
    }

    .takeaway-header h2::before,
    .takeaway-header h2::after {
      content: "";
      position: absolute;
      top: 50%;
      width: 60px;
      height: 2px;
      background: #264653;
      opacity: 0.3;
    }

    .takeaway-header h2::before {
      right: 100%;
    }

    .takeaway-header h2::after {
      left: 100%;
    }

    /* Add numbers to takeaway blocks */
    .takeaway-block-left,
    .takeaway-block-right {
      position: relative;
    }

    .takeaway-block-left::after,
    .takeaway-block-right::after {
      position: absolute;
      top: 20px;
      font-size: 5rem;
      font-weight: 700;
      opacity: 0.15;
      color: #fff;
      line-height: 1;
      z-index: 1;
      counter-increment: takeaway-counter;  /* Increment the counter */
      content: "0" counter(takeaway-counter);  /* Use the counter value */
      right: 20px;
    }

    /* Ensure content stays above the number */
    .takeaway-block-left h2,
    .takeaway-block-left p,
    .takeaway-block-right h2,
    .takeaway-block-right p {
      position: relative;
      z-index: 2;
    }

    /* Add to your existing styles */
    .table-container {
      grid-column: 2 / 12;
      margin: 20px 0;
      background-image: url('${this.texturesPath}textures/themes${themeFolder}/DARKBLUE2.jpg');
      background-size: cover;
      background-position: bottom;
      border-radius: 35px;
      padding: var(--table-padding, 25px);
      color: #fff7e4;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
      page-break-inside: avoid;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: auto;
      min-height: 150px;
    }
  

    .table-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.1),
        rgba(0, 0, 0, 0.2)
      );
      z-index: 1;
    }

    .table-title {
      font-size: 1.4rem;
      margin: 0 0 15px 0;
      color: #fff7e4;
      text-align: center;
      position: relative;
      z-index: 2;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .styled-table {
      width: 100%;
      height: auto;
      border-collapse: separate;
      border-spacing: 0;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      z-index: 2;
      flex-grow: 1;
    }

    .styled-table thead th {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      padding: 12px 15px;
      text-align: left;
      font-weight: 600;
      font-size: 1.1rem;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      margin-bottom: 10px;
      border-spacing: 0 10px;
      position: relative;
    }

    .styled-table thead th::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -10px;
      width: 100%;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    }

    .styled-table tbody td {
      padding: 12px 15px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      font-size: 1rem;
      transition: background-color 0.3s ease;
      color: rgba(255, 255, 255, 0.9);
    }

    .styled-table tbody tr:last-child td {
      border-bottom: none;
    }

    .styled-table tbody tr:nth-child(even) {
      background: rgba(255, 255, 255, 0.03);
    }

    /* Hover effect */
    .styled-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .table-container {
        grid-column: 1 / 13;
        margin: 15px 0;
        padding: 15px;
      }
      
      .styled-table {
        font-size: 0.9rem;
      }
      
      .styled-table th,
      .styled-table td {
        padding: 8px 10px;
      }
    }

    /* Add to your existing styles */
    .two-word-summary {
      grid-column: 1 / 13;
      text-align: center;
      margin: 40px 0 20px 0;
      padding: 20px;
      background: linear-gradient(to bottom, #19333d3c, #26465300);
      border-radius: 35px;
    }
    
    .summary-intro {
      font-size: 1.2rem;
      color: #fff7e4;
      margin-bottom: 10px;
      font-style: italic;
      font-weight: 500;
      filter: drop-shadow(-1px -1px 3px rgba(0, 0, 0, 0.8));
      opacity: 0.8;
    }
    
    .two-word-summary h1 {
      font-size: 3.5rem;
      font-weight: 700;
      color: #fff7e4;
      margin: 0;
      letter-spacing: 2px;
      text-shadow: 2px 2px 0px rgba(0,0,0,0.2);
    }

    /* Grid Ordering */
    .final-words {
      grid-row: 99;  /* Force to end by using a high row number */
      grid-column: 2 / 12;
      order: 999;    /* Flexbox/Grid order as backup */
    }

    .footer {
      grid-row: 100; /* Footer after final words */
      grid-column: 1 / -1;
      order: 1000;
    }

  </style>
      </head>
    `;
  }

  generateTakeawayBlock(takeaway, index) {
    return `
      <!-- Add takeaway header before first block -->
      ${index === 0 ? `
        <div class="takeaway-header">
          <h2>Key Takeaways</h2>
        </div>
      ` : ''}
      ${index % 2 === 0 ? `
      <!-- First Takeaway Set -->
      <div class="takeaway-block-left">
        <h2>${takeaway.mainContent.title}</h2>
        <p>${takeaway.mainContent.text}</p>
      </div>
      <div class="takeaway-summary-right">
        <ul>
          ${takeaway.summaryPoints.map(point => `
            <li>
              <div class="point">
                ${point}
                <div class="point-marker">
                  <div class="marker-inner"></div>
                </div>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
      ` : `
      <!-- Second Takeaway Set -->
      <div class="takeaway-summary-left">
        <ul>
          ${takeaway.summaryPoints.map(point => `
            <li>
              <div class="point">
                ${point}
                <div class="point-marker">
                  <div class="marker-inner"></div>
                </div>
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
      <div class="takeaway-block-right">
        <h2>${takeaway.mainContent.title}</h2>
        <p>${takeaway.mainContent.text}</p>
      </div>
      `}
    `;
  }

  generateContent() {
    try {
      const paths = this.getModulePaths();
      return `
        <!-- LOGO -->
        <div class="logo"></div>
        
        <!-- Title Container -->
        <div class="title-container">
          <div class="title-left">
            <div class="module-number" style="font-weight: 400; font-size: 0.8rem;">${this.config.moduleInfo.sectionName}:</div>
            <div class="module-number">Module ${this.config.moduleInfo.moduleNumber}</div>
            <h1>${this.config.moduleInfo.moduleTitle.split('/').pop().replace(/\.\w+$/, '')}</h1>
          </div>
          <div class="title-right">
            <div class="course-logo"></div>
            <div class="location-path">
              <span class="path-main">${paths.main}</span>
              <span class="path-arrow">↓</span>
              <span class="path-sub">${paths.sub}</span>
              <span class="path-arrow">↓</span>
              <span class="path-current">${paths.current}</span>
            </div>
          </div>
        </div>

        <!-- KEY TERMS -->
        <div class="key-terms">
          <h2>Key Terms</h2>
          ${this.config.keyTerms.map(term => `
            <div class="term-container">
              <div class="term-word">${term.term}</div>
              <div class="term-definition">${term.definition}</div>
            </div>
          `).join('')}
        </div>

        <!-- ACTION PLAN -->
        ${this.generateActionPlan()}

        <!-- TAKEAWAYS -->
        ${this.generateTakeaways()}
        ${this.config.tables ? this.config.tables.map(table => this.generateTable(table)).join('') : ''}
        ${this.generateProTips()}
        
        <!-- OVERVIEW -->
        <div class="mustard-block-intro">
          <h2>Module Overview</h2>
        </div>

        <!-- Blue Block Quote -->
        <div class="blue-block">
          <h3 data-fitty>${this.config.overview.quote}</h3>
        </div>

        <!-- Intro Text -->
        <div class="intro">
          <p>
            <span class="first-letter">${this.config.overview.introText.charAt(0)}</span>
            ${this.config.overview.introText.slice(1)}
          </p>
        </div>

        <!-- FINAL WORDS -->
        ${this.generateFinalWords()}

        ${this.generateFooter()}
      `;
    } catch (error) {
      console.error('Error in generateContent:', error);
      return `
        <div class="error-message">
          Error generating content. Please check JSON structure.
        </div>
      `;
    }
  }

  generateProTips() {
    if (!this.config.proTips) return '';
    return `
      <div class="protip-block">
        <h2>Pro Tip</h2>
        <p>${this.config.proTips[0].text}</p>
      </div>
    `;
  }

  generateTable(tableData) {
    return `
      <!-- Example Table -->
      <div class="table-container">
        <h3 class="table-title">${tableData.title}</h3>
        <table class="styled-table">
          <colgroup>
            ${tableData.headers.map(() => `<col width="${100/tableData.headers.length}%">`).join('')}
          </colgroup>
          <thead>
            <tr>
              ${tableData.headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${tableData.rows.map(row => `
              <tr>
                ${row.map(cell => `<td>${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  generateFinalWords() {
    return `
      <div class="final-words">
        <h2>${this.config.finalWords.reminder}</h2>
        <h1>${this.config.finalWords.emphasis}</h1>
        <p>${this.config.finalWords.description}</p>
      </div>
    `;
  }

  generateFooter() {
    return `
      <div class="footer">
        <div>© Clash Creation LTD. All Rights Reserved</div>
        <div class="bottom-right-image">
          <img src='${this.texturesPath}textures/logos/Logo-One-Line-Light-for-Dark.png' alt="Clash Logo">
        </div>
      </div>
    `;
  }

  getBaseStyles() {
    return `
      body { font-family: Arial, sans-serif; }
      .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
      /* Add more base styles as needed */
    `;
  }

  getThemeStyles(theme) {
    return `
      .container { color: ${theme.textColor}; }
      /* Add more theme-specific styles */
    `;
  }

  getLayoutStyles() {
    return `
      .takeaway-block-left, .takeaway-block-right {
        padding: 20px;
        margin: 10px 0;
      }
      /* Add more layout styles */
    `;
  }

  generateScripts() {
    return `
      <script>
        // Initialize Fitty
        document.addEventListener('DOMContentLoaded', function() {
          fitty('[data-fitty]', {
            minSize: 12,
            maxSize: 100,
            multiLine: true,
            maxHeight: 100  // Adjust this value to control maximum height
          });
        });
      </script>
    `;
  }

  generateActionPlan() {
    return `
      <div class="action-plan">
        <div class="action-plan-title">
          <h2><u>Action</u> Plan:</h2>
        </div>
        <div class="action-plan-body">
          <ul>
            ${this.config.actionPlan.map(item => `
              <li>
                <div class="action-item">
                  ${item}
                  <div class="action-marker">
                    <div class="marker-inner"></div>
                  </div>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  generateTakeaways() {
    return this.config.takeaways.map((takeaway, index) => {
      return this.generateTakeawayBlock(takeaway, index);
    }).join('\n');
  }

  getModulePaths() {
    const fullPath = this.config.moduleInfo.moduleTitle;
    return {
      main: 'Advanced Theory',
      sub: 'Nuanced Hooks',
      current: fullPath.replace(/^.*[\\/]/, '').replace(/\.\w+$/, '')
    };
  }
}

const sourceDir = './JSON Modules';
const outputBaseDir = './outputs';

async function generateAllModules() {
  console.log('Starting generation process...');
  
  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
      
    for (const file of files) {
      const sourcePath = path.join(dir, file);
      const stat = fs.statSync(sourcePath);
      
      if (stat.isDirectory()) {
        const relativeDir = path.relative(sourceDir, sourcePath);
        const outputDir = path.join(outputBaseDir, relativeDir);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        processDirectory(sourcePath);
      } else if (file.endsWith('.json') && !file.startsWith('._')) {
        try {
          const config = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
          
          // Format module number with leading zeros and remove periods
          const moduleNum = config.moduleInfo.moduleNumber.toString().replace('.', '').padStart(4, '0');
          const parsedFile = path.parse(file);
          
          // Check if filename already starts with a module number pattern (e.g., M01, Module01, 01_, etc.)
          const hasModulePrefix = /^(?:M|Module|VS)?[0-9]{2,4}[_-]/.test(parsedFile.name);
          const baseFileName = hasModulePrefix ? 
            parsedFile.name : 
            `VS${moduleNum}_${parsedFile.name}`;
          
          // Generate light version
          const lightConfig = { ...config, theme: { mode: 'light' }};
          const lightGenerator = new PDFTemplateGenerator(lightConfig, sourcePath);
          const lightHtml = lightGenerator.generateHTML();
          
          // Generate dark version
          const darkConfig = { ...config, theme: { mode: 'dark' }};
          const darkGenerator = new PDFTemplateGenerator(darkConfig, sourcePath);
          const darkHtml = darkGenerator.generateHTML();
          
          const relativeDir = path.relative(sourceDir, dir);
          const outputDir = path.join(outputBaseDir, relativeDir);
          const lightOutputPath = path.join(outputDir, `${baseFileName}-light.html`);
          const darkOutputPath = path.join(outputDir, `${baseFileName}-dark.html`);
          
          fs.writeFileSync(lightOutputPath, lightHtml);
          fs.writeFileSync(darkOutputPath, darkHtml);
          console.log(`Generated light version: ${lightOutputPath}`);
          console.log(`Generated dark version: ${darkOutputPath}`);
        } catch (error) {
          console.error(`Error processing ${sourcePath}:`, error);
        }
      }
    }
  }
  
  processDirectory(sourceDir);
}

// Run the generator
generateAllModules().catch(console.error); 