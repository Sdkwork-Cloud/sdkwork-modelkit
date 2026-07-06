const fs = require('fs');
const path = require('path');

const enDir = 'src/locales/en';
let errors = 0;

for (const file of fs.readdirSync(enDir)) {
  if (file.endsWith('.json')) {
    const data = JSON.parse(fs.readFileSync(path.join(enDir, file), 'utf8'));
    for (const [k, v] of Object.entries(data)) {
      if (/[\u4e00-\u9fa5]/.test(v)) {
        console.log(`Chinese in EN json: ${file} -> ${k}: ${v}`);
        errors++;
      }
    }
  }
}

console.log(`Found ${errors} keys with Chinese in EN locales.`);
