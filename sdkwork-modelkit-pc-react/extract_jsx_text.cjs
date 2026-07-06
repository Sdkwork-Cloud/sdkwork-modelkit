const fs = require('fs');
const path = require('path');

const extractRegex = />([^<]*?[\u4e00-\u9fa5]+[^<{]*?)</g; // JSX text
const attrRegex = /(placeholder|title|label|desc)=(['"])(.*?[\u4e00-\u9fa5]+.*?)(\2)/g;

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(function (name) {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile() && filePath.endsWith('.tsx')) {
      callback(filePath, stat);
    } else if (stat.isDirectory() && name !== 'node_modules' && name !== 'dist' && !name.startsWith('.')) {
      walkSync(filePath, callback);
    }
  });
}

function determineModule(filePath) {
  if (filePath.includes('modelkit-workspace')) return 'workspace';
  if (filePath.includes('modelkit-shop')) return 'shop';
  if (filePath.includes('modelkit-relay')) return 'relay';
  if (filePath.includes('modelkit-software')) return 'software';
  if (filePath.includes('modelkit-news')) return 'news';
  if (filePath.includes('modelkit-repos')) return 'repos';
  if (filePath.includes('modelkit-skillhub')) return 'skillhub';
  return 'common'; 
}

const zhDocs = {};
const enDocs = {};
let keyCounter = 1000;

function generateKey(zhStr) {
  return `auto_text_${keyCounter++}`;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let dirty = false;
  const mod = determineModule(filePath);

  if (!zhDocs[mod]) zhDocs[mod] = {};

  content = content.replace(extractRegex, (match, text) => {
    const trimmed = text.trim();
    if (!trimmed) return match;
    dirty = true;
    let key = generateKey(trimmed);
    zhDocs[mod][key] = trimmed;
    // reconstruct preserving spaces
    return `> {t('${mod}:${key}')} <`;
  });

  content = content.replace(attrRegex, (match, attrName, q1, text, q2) => {
    dirty = true;
    let key = generateKey(text);
    zhDocs[mod][key] = text;
    return `${attrName}={t('${mod}:${key}')}`;
  });

  if (dirty) {
    if (!content.includes('useAppContext()')) {
        content = `import { useAppContext } from '@sdkwork/modelkit-core';\n` + content;
        // This is a naive injection, but maybe I won't inject into components automatically.
    }
    // We will just replace it assuming `t` is available, and fix manual errors if they occur
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed JSX: ${filePath}`);
  }
}

['packages'].forEach(dir => {
  if (fs.existsSync(dir)) walkSync(dir, processFile);
});

// Update json files
for (const mod in zhDocs) {
    if (Object.keys(zhDocs[mod]).length === 0) continue;
    const zhPath = path.join(__dirname, 'src/locales/zh', `${mod}.json`);
    const existingZh = fs.existsSync(zhPath) ? JSON.parse(fs.readFileSync(zhPath, 'utf8')) : {};
    fs.writeFileSync(zhPath, JSON.stringify({...existingZh, ...zhDocs[mod]}, null, 2), 'utf8');
}
