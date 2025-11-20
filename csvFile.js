const fs = require('fs');
const { name } = require('mustache/mustache.js');
const { type } = require('os');
const path = require('path');

// Define the directory where PDFs will be stored
const OUT_DIR = path.join(__dirname, 'public/pdfs');
const BASE_URL = 'pdfs';

let files = fs.readdirSync(OUT_DIR); 
console.log(`folders in ${OUT_DIR}:`, files);

let urlLists = [];

files.forEach(folder => {
    const folderPath = path.join(OUT_DIR, folder);
    let folderFiles = fs.readdirSync(folderPath);
    console.log(`files in ${folder}:`, folderFiles);
    folderFiles.forEach(file => {
        const fileUrl = `${BASE_URL}/${folder}/${file}`;
        console.log(`File URL: ${fileUrl}`);
        urlLists.push(fileUrl);
    });
});

function csvMaker(papers) {
    const csvLines = [];
    const headers = ['name', 'url', 'subject', 'year', 'type'];
    csvLines.push(headers.join(','));
    papers.forEach(paper => {
        const values = headers.map(header => `"${paper[header]}"`);
        csvLines.push(values.join(','));
    });
    const csvContent = csvLines.join('\n');
    fs.writeFileSync('papers.csv', csvContent);
    console.log('CSV file created: papers.csv');
}

let papers = [];

for (let url of urlLists) {
    let parts = url.split('/');
    let fileName = parts[parts.length - 1];
    let folderName = parts[parts.length - 2];
    let nameParts = fileName.split('-');

    let paperType = nameParts.pop().replace('.pdf', '');
    let year = nameParts[1];
    let subject = folderName;
    let name = nameParts.join('-');

    let paperEntry = {
        name: name,
        url: url,
        subject: subject,
        year: year,
        type: paperType
    };
    papers.push(paperEntry);
}

csvMaker(papers);

