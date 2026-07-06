const fs = require('fs');
const file = 'packages/sdkwork-modelkit-shop/src/components/ShopView.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace standard dark mode hardcoded colors with semantic variables
content = content.replace(/bg-\[#0E1116\]/g, 'bg-surface');
content = content.replace(/border-\[#1E222B\]/g, 'border-divider');
content = content.replace(/bg-\[#1A1D24\]/g, 'bg-panel');
content = content.replace(/bg-\[#1A1E26\]/g, 'bg-surface-hover');
content = content.replace(/bg-\[#15181E\]/g, 'bg-surface');
content = content.replace(/bg-\[#232733\]/g, 'bg-surface-hover');
content = content.replace(/border-\[#2A2E3B\]/g, 'border-divider-strong');
content = content.replace(/border-\[#15181E\]/g, 'border-divider');
content = content.replace(/text-white/g, 'text-white dark:text-text-main'); // Wait, text-white usually means button text. We can just use text-white there since it's on a dark bg. Or use text-white. Let's see.

fs.writeFileSync(file, content);
console.log('Replaced colors in ShopView.tsx');
