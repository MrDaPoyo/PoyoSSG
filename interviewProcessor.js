const fs = require('fs');
const path = require('path');

function processMarkdown(text) {
    const lines = text.trim().split('\n');
    const title = lines[0].replace('#', '').trim();
    const subtitle = lines[1].replace('##', '').trim();
    let htmlOutput = `<h1 class="title">${title}</h1><h2 class='subtitle bottom-border'>${subtitle}</h2>\n`;
    htmlOutput += `<meta name="title" content="${title}"><meta name="description" content="${subtitle}"><meta name="keywords" content="Poyo, Dapoyo, the poyo reporter, reporter, news, tutorial"><meta name="author" content="Poyo!"></meta>`;
    raw_users = lines[2].replace('###', '').trim();
    let interviewer = raw_users.split(',')[0];
    let interviewee = raw_users.split(',')[1];
    lines.forEach(line => {
        if (line.startsWith(interviewer+":")) {
            line = line.replace((interviewer + ":"), "");
            htmlOutput += `<p class="right-text bold"><span class="red">${interviewer}:</span>${line}</p>\n`;
        } else if (line.startsWith(interviewee + ":")) {
            line = line.replace((interviewee + ":"), "");
            htmlOutput += `<p class="left-text"><span class="bold">${interviewee}:</span>${line}</p>\n`;
        }
    });
    return htmlOutput;
}

function readData(text, location) {
    const lines = text.trim().split('\n');
    const title = lines[0].replace('#', '').trim();
    const subtitle = lines[1].replace('##', '').trim();
    raw_users = lines[2].replace('###', '').trim();
    let interviewer = raw_users.split(',')[0];
    let interviewee = raw_users.split(',')[1];
    return JSON.stringify({
        title: title,
        subtitle: subtitle,
        interviewer: interviewer,
        interviewee: interviewee,
        location: location
    });
}

module.exports = {
    processMarkdown,
    readData
};