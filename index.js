console.time('Execution Time');
const fs = require('fs');
const path = require('path');
const mdProcessor = require('./mdProcessor.js');
const ejs = require('ejs');
const post_files = fs.readdirSync('src/posts');

const postArray = [];

for (let file of post_files) {
  console.log(`Processing ${file}`);
  postArray.push(JSON.parse(mdProcessor.extractMetadata(fs.readFileSync('src/posts/'+file, 'utf8'))));
}
fs.writeFileSync('posts.json', JSON.stringify(postArray));

async function mergeEjsFiles() {
  const index_html = await ejs.renderFile('src/templates/index.ejs', { postArray: postArray, title: 'Index' });
  fs.writeFileSync('predist/index.html', index_html);
  fs.cpSync('src/templates/static/index.css', 'predist/static/index.css');
  fs.cpSync('src/templates/static/index.css', 'predist/posts/static/index.css');
};

function checkMDFiles(files) {
  let mdFiles = [];
  files.forEach(file => {
    if (path.extname(file) == ".md") {
      mdFiles.push(file);
    }
  });
  return mdFiles;
}

mergeEjsFiles();
checkMDFiles(post_files).forEach(file => {
  mdProcessor.processMarkdown(path.join(__dirname, 'src/posts/' + file));
});

console.timeEnd('Execution Time');

if (process.argv.includes('--server')) {
  const express = require('express');
  const app = express();
  app.use(express.static('predist'));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'predist/index.html'));
  });
  app.get('/post/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'predist/posts/' + req.params.id + '.html'));
  });
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}