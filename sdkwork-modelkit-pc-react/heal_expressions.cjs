const fs = require('fs');
const path = require('path');

const mappings = [];
function processJsonDir(localeDir) {
  const files = fs.readdirSync(localeDir);
  for (const file of files) {
    if (file.endsWith('.json')) {
      const ns = file.replace('.json', '');
      const json = JSON.parse(fs.readFileSync(path.join(localeDir, file), 'utf8'));
      for (const [k, v] of Object.entries(json)) {
        if (v.trim().startsWith('{') || v.trim().startsWith('<') || v.trim().startsWith('(')) {
          mappings.push([`{t('${ns}:${k}')}`, v]);
        }
      }
    }
  }
}

processJsonDir('src/locales/zh');

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

const files = walkFiles('packages');
// Include top level src files if any
const rootSrcFiles = walkFiles('src');

for (const file of [...files, ...rootSrcFiles]) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  for (const [tCall, originalCode] of mappings) {
    if (content.includes(tCall)) {
      content = content.split(tCall).join(originalCode);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Healed expression:', file);
  }
}
