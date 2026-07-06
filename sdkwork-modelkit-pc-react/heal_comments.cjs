const fs = require('fs');
const path = require('path');

const workspaceJson = JSON.parse(fs.readFileSync('src/locales/zh/workspace.json', 'utf8'));
const shopJson = JSON.parse(fs.readFileSync('src/locales/zh/shop.json', 'utf8'));

const mappings = [];
const addMappings = (json, ns) => {
  for (const [k, v] of Object.entries(json)) {
    if (v.trim().startsWith('{/*') || v.trim().startsWith('<') || v.trim().startsWith('(')) {
      mappings.push([`{t('${ns}:${k}')}`, v]);
    }
  }
};
addMappings(workspaceJson, 'workspace');
addMappings(shopJson, 'shop');

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
    console.log('Healed comment:', file);
  }
}
