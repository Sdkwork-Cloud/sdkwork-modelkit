const fs = require('fs');
const path = require('path');
const https = require('https');

async function translateText(text) {
  // If no Chinese, skip
  if (!/[\u4e00-\u9fa5]/.test(text)) return text;
  
  return new Promise((resolve, reject) => {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=' + encodeURIComponent(text);
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          let translated = '';
          if (parsed && parsed[0]) {
            for (let i = 0; i < parsed[0].length; i++) {
              translated += parsed[0][i][0];
            }
          }
          resolve(translated || text);
        } catch (e) {
          console.error('Parse error for text:', text, e);
          resolve(text);
        }
      });
    }).on('error', (e) => {
      console.error('Request error:', e);
      resolve(text);
    });
  });
}

async function processDir(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;
    
    for (const key of Object.keys(data)) {
      const val = data[key];
      if (typeof val === 'string' && /[\u4e00-\u9fa5]/.test(val)) {
        console.log(`Translating ${file} -> ${key}...`);
        const translated = await translateText(val);
        if (translated !== val) {
          data[key] = translated;
          modified = true;
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
      console.log(`Saved translations for ${file}`);
    }
  }
}

async function run() {
  await processDir('src/locales/en');
  console.log('Done!');
}

run();
