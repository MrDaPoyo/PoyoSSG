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
  console.log(index_html);
  console.log(postArray);
  fs.writeFileSync('predist/index.html', index_html);
  fs.cpSync('src/templates/static/index.css', 'predist/index.css');
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

const files = fs.readdirSync("src/posts").filter(file => path.extname(file) === '.md');

files.forEach(file => {
  console.log(`Processing ${file}`);
  mdProcessor.processMarkdown(path.join("src/posts", file));
});


console.timeEnd('Execution Time');