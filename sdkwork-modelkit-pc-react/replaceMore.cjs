const fs = require('fs');

const borderMap = {
  'border-[#21242E]': 'border-divider',
  'border-[#1F222B]': 'border-divider',
  'border-[#232733]': 'border-divider',
};

function processFile(file) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    for (const [key, value] of Object.entries(borderMap)) {
      content = content.split(key).join(value);
    }
    fs.writeFileSync(file, content);
  } catch (err) {}
}

processFile('packages/sdkwork-modelkit-shop/src/components/ShopView.tsx');
console.log('Replaced more borders');
