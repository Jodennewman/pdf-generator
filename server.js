const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Serve the interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'interface.html'));
});

// Generate HTML
app.post('/generate-html', (req, res) => {
    const template = req.body.template || 'Version4.html';
    exec(`node template-generator.js --template ${template}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return res.status(500).json({ error: error.message });
        }
        res.json({ message: 'HTML generated successfully' });
    });
});

// Convert to PDF
app.post('/convert-pdf', (req, res) => {
    exec('node html-to-pdf-puppeteer.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return res.status(500).json({ error: error.message });
        }
        res.json({ message: 'PDF conversion complete' });
    });
});

// Generate and Convert
app.post('/generate-and-convert', (req, res) => {
    const template = req.body.template || 'Version4.html';
    exec(`node template-generator.js --template ${template} && node html-to-pdf-puppeteer.js`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return res.status(500).json({ error: error.message });
        }
        res.json({ message: 'Generation and conversion complete' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 