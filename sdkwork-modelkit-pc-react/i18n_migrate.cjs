const fs = require('fs');
const path = require('path');

const extractRegex = /\bt\(\s*(['"])(.*?)\1\s*,\s*(['"])(.*?)\3\s*\)/g;

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(function (name) {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile() && (filePath.endsWith('.ts') || filePath.endsWith('.tsx'))) {
      callback(filePath, stat);
    } else if (stat.isDirectory() && name !== 'node_modules' && name !== 'dist' && !name.startsWith('.')) {
      walkSync(filePath, callback);
    }
  });
}

const docs = {
  common: { en: {}, zh: {} },
  workspace: { en: {}, zh: {} },
  shop: { en: {}, zh: {} },
  relay: { en: {}, zh: {} },
  software: { en: {}, zh: {} },
  news: { en: {}, zh: {} },
  repos: { en: {}, zh: {} },
  skillhub: { en: {}, zh: {} }
};

let keyCounter = 1;
function generateKey(enStr) {
  let key = enStr.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().replace(/_+/g, '_').replace(/^_|_$/g, '');
  if (!key) key = `text_${keyCounter++}`;
  if (key.length > 50) key = key.substring(0, 50);
  return key;
}

function determineModule(filePath) {
  const parts = filePath.split('/');
  if (filePath.includes('modelkit-workspace')) return 'workspace';
  if (filePath.includes('modelkit-shop')) return 'shop';
  if (filePath.includes('modelkit-relay')) return 'relay';
  if (filePath.includes('modelkit-software')) return 'software';
  if (filePath.includes('modelkit-news')) return 'news';
  if (filePath.includes('modelkit-repos')) return 'repos';
  if (filePath.includes('modelkit-skillhub')) return 'skillhub';
  return 'common'; // fallback
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let dirty = false;
  
  const mod = determineModule(filePath);

  content = content.replace(extractRegex, (match, q1, zhStr, q2, enStr) => {
    dirty = true;
    let key = generateKey(enStr);
    
    // Ensure unique key for different translations
    if (docs[mod].en[key] && docs[mod].en[key] !== enStr) {
        let i = 2;
        while(docs[mod].en[`${key}_${i}`] && docs[mod].en[`${key}_${i}`] !== enStr) i++;
        key = `${key}_${i}`;
    }
    
    docs[mod].en[key] = enStr;
    docs[mod].zh[key] = zhStr;
    
    // Convert t('zh', 'en') -> t('mod:key')
    return `t('${mod}:${key}')`;
  });
  
  if (dirty) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed: ${filePath} (module: ${mod})`);
  }
}

['src', 'packages', 'sdks'].forEach(dir => {
  if (fs.existsSync(dir)) {
    walkSync(dir, processFile);
  }
});

// Write to JSON files
for (const mod in docs) {
  const enPath = path.join(__dirname, 'src/locales/en', `${mod}.json`);
  const zhPath = path.join(__dirname, 'src/locales/zh', `${mod}.json`);
  
  if (fs.existsSync(enPath)) {
    const existingEn = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    fs.writeFileSync(enPath, JSON.stringify({...existingEn, ...docs[mod].en}, null, 2), 'utf8');
  } else {
    fs.writeFileSync(enPath, JSON.stringify(docs[mod].en, null, 2), 'utf8');
  }
  
  if (fs.existsSync(zhPath)) {
    const existingZh = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
    fs.writeFileSync(zhPath, JSON.stringify({...existingZh, ...docs[mod].zh}, null, 2), 'utf8');
  } else {
    fs.writeFileSync(zhPath, JSON.stringify(docs[mod].zh, null, 2), 'utf8');
  }
}

console.log('Migration completed successfully.');

