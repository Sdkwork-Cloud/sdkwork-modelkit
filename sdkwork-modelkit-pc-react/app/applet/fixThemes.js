import fs from 'fs';

const map = {
  // ambers used mostly for price and active states
  'text-amber-500': 'text-primary-main',
  'text-amber-400': 'text-primary-light',
  'bg-amber-500/10': 'bg-primary-main/10',
  'border-amber-500': 'border-primary-main',
  'border-amber-500/50': 'border-primary-main/50',
  'border-amber-500/25': 'border-primary-main/25',
  'border-amber-500/20': 'border-primary-main/20',
  'border-amber-500/15': 'border-primary-main/15',
  'hover:border-amber-500/50': 'hover:border-primary-main/50',
  'hover:text-amber-500': 'hover:text-primary-main',
  'ring-amber-500/50': 'ring-primary-main/50',
  'ring-amber-500/20': 'ring-primary-main/20',

  // blues used for links and tabs
  'text-blue-400': 'text-primary-light',
  'hover:text-blue-300': 'hover:text-primary-light',
  'border-blue-500': 'border-primary-main',
  'bg-blue-500/10': 'bg-primary-main/10',
  'border-blue-500/20': 'border-primary-main/20',
  'border-blue-500/30': 'border-primary-main/30',
  'text-blue-500': 'text-primary-main',
  'bg-blue-600/20': 'bg-primary-main/20',

  // purples used occasionally 
  'text-purple-400': 'text-primary-light',
  'text-purple-500': 'text-primary-main',
  'border-purple-500': 'border-primary-main',
  'bg-purple-600': 'bg-primary-main',
  'bg-purple-600/10': 'bg-primary-main/10',
  'text-[#A78BFA]': 'text-primary-light', // similar to purple-400
  'bg-[#8B5CF6]/10': 'bg-primary-main/10',
  'border-[#8B5CF6]/15': 'border-primary-main/15',

  // Some shadow replacements for ring sizes
  'shadow-[0_0_15px_rgba(245,158,11,0.15)]': 'shadow-[0_0_15px_var(--color-primary-alpha)]',
  'shadow-[0_0_15px_rgba(59,130,246,0.05)]': 'shadow-[0_0_15px_var(--color-primary-alpha)]',
  'shadow-[0_0_8px_rgba(168,85,247,0.15)]': 'shadow-[0_0_8px_var(--color-primary-alpha)]'
};

function processFile(file) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    for (const [key, value] of Object.entries(map)) {
      content = content.split(key).join(value);
    }
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  } catch (err) {
    console.error('Error', file);
  }
}

processFile('packages/sdkwork-modelkit-shop/src/components/ShopView.tsx');
processFile('packages/sdkwork-modelkit-workspace/src/components/system/SystemSettings.tsx');
processFile('packages/sdkwork-modelkit-shop/src/components/OrdersPage.tsx');
processFile('packages/sdkwork-modelkit-shop/src/components/CartDrawer.tsx');

