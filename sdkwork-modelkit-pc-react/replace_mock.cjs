const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all files matching the pattern
const files = execSync('grep -rl "class Mock" packages src').toString().split('\n').filter(Boolean);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/class Mock([A-Za-z]+)Service/g, 'class Local$1Service');
  content = content.replace(/new Mock([A-Za-z]+)Service/g, 'new Local$1Service');
  fs.writeFileSync(file, content);
}

const allTsFiles = execSync('find packages src -name "*.ts" -o -name "*.tsx"').toString().split('\n').filter(Boolean);
for (const file of allTsFiles) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('Mock')) {
    content = content.replace(/Mock([A-Za-z]+)Service/g, 'Local$1Service');
    fs.writeFileSync(file, content);
  }
}
console.log('Done!');
