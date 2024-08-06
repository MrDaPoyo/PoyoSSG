console.time('Execution Time');
const fs = require('fs');
const path = require('path');
const interviewProcessor = require('./interviewProcessor');
const mdProcessor = require('./mdProcessor');
const ejs = require('ejs');
const { title } = require('process');
const marked = require('marked');

const interview_files = fs.readdirSync('src/interviews');
const post_files = fs.readdirSync('src/posts');
const interviewsFilePath = path.join(__dirname, '/predist/interviews.json');
const rawInterviewData = fs.readFileSync(interviewsFilePath, 'utf8');
const interviewArray = JSON.parse(rawInterviewData).map(post => JSON.parse(post));



async function processAllInterviews(all_files) {
  let files = [];
  all_files.forEach(file => {
    if (path.extname(file) == ".md") {
      console.log(file);
      files.push(file);
    }
  })

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`Processing ${file}`);
    const text = fs.readFileSync(`src/interviews/${file}`, 'utf8');
    const metadata = mdProcessor.extractMetadata(text);
    const content = text.replace(/^---\n[\s\S]+?\n---/, '').trim();
    const converted = marked(content);
    const interview = fs.readFileSync(`src/interviews/${file}`, 'utf8');
    let interviewName = file.replace('.md', '.html');

    let rendered = await ejs.renderFile('src/templates/interview.ejs', { interview : interviewProcessor.processMarkdown(interview), title: 'Interview' });
    fs.writeFileSync(`predist/interviews/${interviewName}`, rendered);
  }
}

function interviewsJsonify(all_files) {
  let interviews = [];
  all_files.forEach(file => {
    if (path.extname(file) == ".md") {
      const interview = fs.readFileSync(`src/interviews/${file}`, 'utf8');
      const interviewName = file.replace('.md', '.html');
      const data = interviewProcessor.readData(interview, interviewName);
      interviews.push(data);
    }
  });
  fs.writeFileSync('predist/interviews.json', JSON.stringify(interviews));
}

async function mergeEjsFiles() {
  const index_html = await ejs.renderFile('src/templates/index.ejs', { posts: interviewArray, title: 'Index' });
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


// transform .md PoyoInterviews to .ejs files
processAllInterviews(interview_files);
interviewsJsonify(interview_files);
mergeEjsFiles(interview_files);
checkMDFiles(post_files).forEach(file => {
  mdProcessor.processMarkdown(path.join(__dirname, 'src/posts/' + file));
});

const files = fs.readdirSync("src/posts").filter(file => path.extname(file) === '.md');

files.forEach(file => {
    console.log(`Processing ${file}`);
    mdProcessor.processMarkdown(path.join("src/posts", file));
});


console.timeEnd('Execution Time');