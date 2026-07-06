const fs = require('fs');

const bgMap = {
  'bg-[#0E1116]': 'bg-surface',
  'bg-[#1A1D24]': 'bg-panel',
  'bg-[#1A1E26]': 'bg-surface-hover',
  'bg-[#15181E]': 'bg-surface-hover',
  'bg-[#232733]': 'bg-surface-hover',
  'hover:bg-[#232733]': 'hover:bg-surface-hover',
  'hover:bg-[#1A1E26]': 'hover:bg-surface-hover',
  'hover:bg-[#15181E]': 'hover:bg-surface-hover',
  'hover:bg-[#1E222B]': 'hover:bg-surface-hover',
  'bg-[#1C1F26]/30': 'bg-surface-hover/30',
  'bg-[#1A1829]': 'bg-purple-500/10 dark:bg-purple-500/20',
};

const borderMap = {
  'border-[#1E222B]': 'border-divider',
  'border-[#2A2E3B]': 'border-divider-strong',
  'border-[#15181E]': 'border-divider',
  'border-[#222]': 'border-divider-strong',
  'hover:border-[#333]': 'hover:border-divider-strong',
};

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  for (const [key, value] of Object.entries(bgMap)) {
    content = content.split(key).join(value);
  }

  for (const [key, value] of Object.entries(borderMap)) {
    content = content.split(key).join(value);
  }

  fs.writeFileSync(file, content);
}

processFile('packages/sdkwork-modelkit-shop/src/components/ShopView.tsx');
processFile('packages/sdkwork-modelkit-workspace/src/components/system/SystemSettings.tsx');
console.log('Replaced colors');
