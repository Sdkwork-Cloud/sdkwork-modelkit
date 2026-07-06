const fs = require('fs');
const path = require('path');

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

const zhLocales = {};
['common', 'workspace', 'shop', 'relay', 'software', 'news', 'repos', 'skillhub'].forEach(mod => {
  try {
    zhLocales[mod] = require(`./src/locales/zh/${mod}.json`);
  } catch(e) {}
});

function isCode(str) {
  if (str.includes('\n') || str.includes('=>') || str.includes('return (') || str.includes(';\\n') || str.includes(';\n')) return true;
  if (str.includes('className=') || str.includes('e.target.value') || str.includes('setPublishForm') || str.includes('handleRemoveFromCart') || str.includes('))}')) return true;
  if (str.length > 50 && str.includes('<') && str.includes('>')) return true;
  if (str.includes('setAddressName') || str.includes('setAddressPhone') || str.includes('setAddressDetail')) return true;
  if (str.startsWith('set')) return true; // generic heuristic for state setters
  return false;
}

function autoHeal() {
  walkSync('packages', (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let dirty = false;
    
    // find {t('mod:key')}
    content = content.replace(/\{t\('([^:]+):([^']+)'\)\}/g, (match, mod, key) => {
      if (zhLocales[mod] && zhLocales[mod][key]) {
        const val = zhLocales[mod][key];
        if (isCode(val)) {
          dirty = true;
          return val;
        }
      }
      return match;
    });

    if (dirty) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Healed code in ${filePath}`);
    }
  });
}

autoHeal();
