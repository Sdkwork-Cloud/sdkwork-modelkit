const fs = require('fs');
const path = require('path');

const workspaceJson = JSON.parse(fs.readFileSync('src/locales/zh/workspace.json', 'utf8'));
const shopJson = JSON.parse(fs.readFileSync('src/locales/zh/shop.json', 'utf8'));

const isMistake = (str) => {
  return str.includes('= {') || str.includes('=>') || str.includes(';\n') || str.includes('navigator.clipboard') || str.includes('set') || str.includes('={');
};

const mappings = [];
for (const [k, v] of Object.entries(workspaceJson)) {
  if (isMistake(v)) mappings.push([`{t('workspace:${k}')}`, v]);
}
for (const [k, v] of Object.entries(shopJson)) {
  if (isMistake(v)) mappings.push([`{t('shop:${k}')}`, v]);
}

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

for (const file of files) {
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
    console.log('Healed reverse:', file);
  }
}

