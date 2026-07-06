const fs = require('fs');

const bgMap = {
  'bg-[#0E1116]': 'bg-surface',
  'bg-[#0E0F12]': 'bg-panel',
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
  'bg-[#141518]': 'bg-surface',
  'border-[#1C1F26]': 'border-divider',
  'text-gray-200': 'text-text-main',
  'text-gray-300': 'text-text-main',
  'text-gray-400': 'text-text-muted',
  'text-gray-500': 'text-text-muted',
  'text-gray-600': 'text-text-muted',
  'text-gray-450': 'text-text-muted',
  'hover:text-gray-300': 'hover:text-text-main',
  'border-[#111]': 'border-divider',
  'hover:border-[#222]': 'hover:border-divider-strong',
};

const borderMap = {
  'border-[#1E222B]': 'border-divider',
  'border-[#2A2E3B]': 'border-divider-strong',
  'border-[#15181E]': 'border-divider',
  'border-[#222]': 'border-divider-strong',
  'border-[#333]': 'border-divider-strong',
  'hover:border-[#333]': 'hover:border-divider-strong',
  'hover:border-gray-600': 'hover:border-divider-strong',
  'bg-[#1C1F26]': 'bg-button-dark'
};

function processFile(file) {
  try {
    let content = fs.readFileSync(file, 'utf8');

    for (const [key, value] of Object.entries(bgMap)) {
      content = content.split(key).join(value);
    }

    for (const [key, value] of Object.entries(borderMap)) {
      content = content.split(key).join(value);
    }

    fs.writeFileSync(file, content);
  } catch (err) {
    console.error('Error on ', file, err.message);
  }
}

processFile('packages/sdkwork-modelkit-shop/src/components/ShopView.tsx');
processFile('packages/sdkwork-modelkit-workspace/src/components/system/SystemSettings.tsx');
console.log('Replaced colors via script!');
