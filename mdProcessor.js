const fs = require('fs');
const path = require('path');
const marked = require('marked');
const ejs = require('ejs');

// Directories
const srcDir = path.join(__dirname, 'src/posts');
const distDir = path.join(__dirname, 'predist/posts');
const templatePath = path.join(__dirname, 'src/templates/post.ejs');

function extractMetadata(content) {
    const metadata = {};
    const metadataRegex = /^---\n([\s\S]+?)\n---/;
    const match = typeof content === 'string' ? content.match(metadataRegex) : null;
    if (match) {
        const metadataContent = match[1];
        metadataContent.split('\n').forEach(line => {
            const [key, value] = line.split(':').map(item => item.trim());
            metadata[key] = value;
        });
    }
    return JSON.stringify(metadata);
}


function processMarkdown(directory) {

    // Read Markdown files from src directory
    // Convert Markdown content to HTML
    const files = fs.readdirSync(srcDir);
    const mdFiles = files.filter(file => path.extname(file) === '.md');
    mdFiles.forEach(file => {
        const filePath = path.join(srcDir, file);
        const text = fs.readFileSync(filePath, 'utf8');
        const converted = marked(text);
    
        // Render HTML using EJS template
        ejs.renderFile(templatePath, { content: converted, metadata: {}, title: file }, (err, str) => {
            if (err) {
                console.error(`Error rendering file ${file}:`, err);
                return;
            }
            const outputFilePath = path.join(distDir, `${path.basename(file, '.md')}.html`);
            fs.writeFileSync(outputFilePath, str);
        });
    });

}

module.exports = { processMarkdown, extractMetadata };