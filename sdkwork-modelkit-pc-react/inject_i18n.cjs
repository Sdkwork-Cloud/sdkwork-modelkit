const fs = require('fs');
const path = require('path');

const jsxTextRegex = />([^<]*?[\u4e00-\u9fa5]+[^<{]*?)</g; 
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

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let dirty = false;
  const mod = determineModule(filePath);
  
  if (!zhDocs[mod]) zhDocs[mod] = {};

  const matches1 = [...content.matchAll(jsxTextRegex)];
  const matches2 = [...content.matchAll(attrRegex)];
  
  if (matches1.length === 0 && matches2.length === 0) return;

  content = content.replace(jsxTextRegex, (match, text) => {
    let trimmed = text.trim();
    if (!trimmed) return match;
    dirty = true;
    let key = `txt_${keyCounter++}`;
    zhDocs[mod][key] = trimmed;
    return match.replace(trimmed, `{t('${mod}:${key}')}`);
  });

  content = content.replace(attrRegex, (match, attrName, q1, text, q2) => {
    dirty = true;
    let key = `txt_${keyCounter++}`;
    zhDocs[mod][key] = text;
    return `${attrName}={t('${mod}:${key}')}`;
  });

  if (dirty) {
    // Add import if missing
    if (!content.includes('useAppContext')) {
      content = `import { useAppContext } from '@sdkwork/modelkit-core';\n` + content;
    }

    // Attempt to inject `const { t } = useAppContext();`
    // Find all export function / function that return JSX (heuristic)
    const functionRegex = /(export\s+(?:default\s+)?function\s+[a-zA-Z0-9_]+\s*\([^)]*\)\s*\{)/g;
    content = content.replace(functionRegex, (match) => {
        if (!content.includes('const { t } = useAppContext()') && !content.includes('const { t,') && !content.includes(', t } = useAppContext()') && !content.includes('const { language, t }')) {
             return match + `\n  const { t } = useAppContext();`;
        }
        return match;
    });
    
    // Fallback for arrow functions
    const arrowFuncRegex = /(const\s+[a-zA-Z0-9_]+\s*=\s*\([^)]*\)\s*=>\s*\{)/g;
    content = content.replace(arrowFuncRegex, (match) => {
        if (!content.includes('const { t } = useAppContext()') && !content.includes('const { t,') && !content.includes(', t } = useAppContext()') && !content.includes('const { language, t }')) {
             return match + `\n  const { t } = useAppContext();`;
        }
        return match;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed JSX: ${filePath}`);
  }
}

['packages', 'src'].forEach(dir => {
  if (fs.existsSync(dir)) walkSync(dir, processFile);
});

// Update json files
for (const mod in zhDocs) {
    if (Object.keys(zhDocs[mod]).length === 0) continue;
    const zhPath = path.join(__dirname, 'src/locales/zh', `${mod}.json`);
    const enPath = path.join(__dirname, 'src/locales/en', `${mod}.json`);
    
    const existingZh = fs.existsSync(zhPath) ? JSON.parse(fs.readFileSync(zhPath, 'utf8')) : {};
    const existingEn = fs.existsSync(enPath) ? JSON.parse(fs.readFileSync(enPath, 'utf8')) : {};
    
    // Auto translate via English translation fallback
    for(let key in zhDocs[mod]){
       if(!existingEn[key]) existingEn[key] = zhDocs[mod][key]; // default en fallback is just the original Chinese strings for now, or machine-translated structure 
    }

    fs.writeFileSync(zhPath, JSON.stringify({...existingZh, ...zhDocs[mod]}, null, 2), 'utf8');
    fs.writeFileSync(enPath, JSON.stringify(existingEn, null, 2), 'utf8');
}
