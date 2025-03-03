const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

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

// Execute command and handle output streams
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        const [cmd, ...args] = command.split(' ');
        const process = spawn(cmd, args);
        let output = '';
        let errorOutput = '';

        process.stdout.on('data', (data) => {
            const text = data.toString();
            output += text;
            console.log(text);
        });

        process.stderr.on('data', (data) => {
            const text = data.toString();
            errorOutput += text;
            console.error(text);
        });

        process.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Process exited with code ${code}\n${errorOutput}`));
            } else {
                resolve({ output, errorOutput });
            }
        });

        process.on('error', (err) => {
            reject(err);
        });
    });
}

// Serve the interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'interface.html'));
});

// Generate HTML files
app.post('/generate-html', asyncHandler(async (req, res) => {
    await executeCommand('node template-generator.js');
    res.json({ message: 'HTML files generated successfully' });
}));

// Convert HTML to PDF
app.post('/convert-pdf', asyncHandler(async (req, res) => {
    await executeCommand('node html-to-pdf-puppeteer.js');
    res.json({ message: 'PDF conversion completed successfully' });
}));

// Generate and Convert
app.post('/generate-and-convert', asyncHandler(async (req, res) => {
    await executeCommand('node template-generator.js');
    await executeCommand('node html-to-pdf-puppeteer.js');
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