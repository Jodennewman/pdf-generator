const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const util = require('util');

const execAsync = util.promisify(exec);

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Error handler middleware
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        error: error.message || 'An unexpected error occurred'
    });
};

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Serve the interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'interface.html'));
});

// Generate HTML files
app.post('/generate-html', asyncHandler(async (req, res) => {
    const { stdout, stderr } = await execAsync('node template-generator.js');
    console.log('Generation output:', stdout);
    if (stderr) console.error('Generation errors:', stderr);
    res.json({ message: 'HTML files generated successfully' });
}));

// Convert HTML to PDF
app.post('/convert-pdf', asyncHandler(async (req, res) => {
    const { stdout, stderr } = await execAsync('node html-to-pdf-puppeteer.js');
    console.log('Conversion output:', stdout);
    if (stderr) console.error('Conversion errors:', stderr);
    res.json({ message: 'PDF conversion completed successfully' });
}));

// Generate and Convert
app.post('/generate-and-convert', asyncHandler(async (req, res) => {
    const { stdout, stderr } = await execAsync('node template-generator.js && node html-to-pdf-puppeteer.js');
    console.log('Generation and conversion output:', stdout);
    if (stderr) console.error('Generation and conversion errors:', stderr);
    res.json({ message: 'Generation and conversion completed successfully' });
}));

// Apply error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    // Open the interface in the default browser using dynamic import
    const open = (await import('open')).default;
    await open(`http://localhost:${PORT}`);
}); 