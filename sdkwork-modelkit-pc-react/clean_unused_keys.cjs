const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walkFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      results = results.concat(walkFiles(filePath));
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const sourceFiles = walkFiles('packages').concat(walkFiles('src')).filter(f => !f.includes('locales'));
const allCode = sourceFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');

function cleanLocaleDir(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const namespace = file.replace('.json', '');
    
    let deleted = 0;
    for (const key of Object.keys(data)) {
      if (key.startsWith('txt_')) {
        const usagePattern4 = `${namespace}:${key}`; // General match
        if (!allCode.includes(usagePattern4)) {
          delete data[key];
          deleted++;
        }
      }
    }
    
    if (deleted > 0) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
      console.log(`Cleaned ${deleted} unused keys from ${filePath}`);
    }
  }
}

cleanLocaleDir('src/locales/en');
cleanLocaleDir('src/locales/zh');
