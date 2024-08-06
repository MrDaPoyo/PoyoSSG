console.time('Execution Time');
const fs = require('fs');
const path = require('path');
const mdProcessor = require('./mdProcessor.js');
const ejs = require('ejs');

const finalDir = 'dist';

const walk = async (dir) => {
  return new Promise((resolve, reject) => {
    let results = [];
    fs.readdir(dir, (err, list) => {
      if (err) return reject(err);

      let togo = list.length;

      if (!togo) return resolve(results);
      list.forEach(file => {
        file = path.resolve(dir, file);
        fs.stat(file, (err, stat) => {
          if (stat && stat.isDirectory()) {
            walk(file).then(res => {
              results = results.concat(res);
              if (!--togo) resolve(results);
            });
          } else {
            results.push(file);
            processed_file = mdProcessor.readMarkdownFile(file).markdown();


            const outputFilePath = file.replace('src', finalDir).replace('.md', '.html');
            const outputDir = path.dirname(outputFilePath);

            // Ensure the directory exists
            fs.mkdirSync(outputDir, { recursive: true });
            fs.writeFileSync(file.replace('src', 'dist').replace('.md', '.html'), processed_file);
            if (!--togo) resolve(results);
          }
        });
      });
    });
  }
  );
};

console.log('Reading files...');
walk("src").then(files => {
  console.log('Files:', files);
})
  .catch(err => {
    console.error('Error:', err);
  });

console.timeEnd('Execution Time');