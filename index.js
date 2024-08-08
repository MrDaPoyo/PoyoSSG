console.time('Execution Time');
const fs = require('fs');
const path = require('path');
const mdProcessor = require('./mdProcessor.js');
const ejs = require('ejs');
const { output } = require('marked/src/InlineLexer.js');

const distDir = 'dist';
const staticDir = 'static'
const srcDir = 'src';
const postDir = '/src/posts';

var postArray = [];

const walk = async (dir) => {
  return new Promise((resolve, reject) => {
    let results = [];
    fs.readdir(dir, (err, list) => {
      if (err) return reject(err);

      let togo = list.length;

      if (!togo) return resolve(results);
      list.forEach(file => {
        file = path.resolve(dir, file);
        const fileData = path.parse(file);
        let static = path.relative(fileData.dir, staticDir);
        static = static.replace('../', '');

        fs.stat(file, async (err, stat) => {
          if (stat && stat.isDirectory()) {
            walk(file).then(res => {
              results = results.concat(res);
              if (!--togo) resolve(results);
            });
          }
          else if (dir === __dirname + postDir) {
            console.log('Copying Post: ', dir);
            postArray.push(mdProcessor.readMarkdownFile(file).metadata());
            fs.mkdirSync(file.replace(srcDir, distDir).replace(fileData.base, ''), { recursive: true });
            var postList = [];
            postArray.forEach(post => {
              postList.push({ title: post.title, dest: post.dest });
            });
            console.log(postList);
            fs.writeFileSync(file.replace(srcDir, distDir).replace('.md', '.html'), await ejs.renderFile("templates/post.ejs", { title: mdProcessor.readMarkdownFile(file).metadata().title, content: mdProcessor.readMarkdownFile(file).markdown(), static: static, postList }));
          }
          else if (file.split('.')[1] == 'md') {
            console.log('Processing File:', file);
            results.push(file);
            processed_file = mdProcessor.readMarkdownFile(file).markdown();


            const outputFilePath = file.replace(srcDir, distDir).replace('.md', '.html');
            const outputDir = path.dirname(outputFilePath);

            // Ensure the directory exists
            fs.mkdirSync(outputDir, { recursive: true });
            fs.writeFileSync(file.replace(srcDir, distDir).replace('.md', '.html'), await ejs.renderFile("templates/post.ejs", { title: mdProcessor.readMarkdownFile(file).metadata().title, content: mdProcessor.readMarkdownFile(file).markdown(), static: static }));
            if (!--togo) resolve(results);
          } else {
            console.log('Copying File:', file);
            fs.mkdirSync(file.replace(srcDir, distDir).replace(fileData.base, ''), { recursive: true });
            fs.copyFileSync(file, file.replace(srcDir, distDir));
          }
          
          fs.writeFileSync('dist/index.html', await ejs.renderFile("templates/index.ejs", { postArray, title: "Index", static: staticDir }));
        });
      });
    });
  }
  );
};


function run() {

  console.log('Reading files...');
  walk("src").then(files => {
    console.log('Files:', files);
  })
    .catch(err => {
      console.error('Error:', err);
    });
  console.timeEnd('Execution Time');
}

fs.mkdirSync(distDir, { recursive: true });
fs.rmSync(distDir, { recursive: true });
fs.mkdirSync(distDir, { recursive: true });
run();

if (process.argv[2] == '--server') {
  const express = require('express');
  const app = express();
  const port = 3000;
  app.use(express.static(distDir));
  app.use(express.static("templates"));
  app.get('/', (req,res) => {
    res.sendFile(path.join('index.html'));
  })
  app.get('/posts/:post', (req,res) => {
    console.log('Post:', req.params.post);
    res.render("post.ejs", {content: mdProcessor.readMarkdownFile('src/posts').markdown()});
  });
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}