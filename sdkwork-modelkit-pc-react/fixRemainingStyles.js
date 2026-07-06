import fs from 'fs';
import path from 'path';

function fixRemaining(content) {
  let newContent = content;
  
  // To handle hover:bg-white/10 -> hover:bg-black/10 dark:hover:bg-white/10
  newContent = newContent.replace(/\bhover:bg-white\/([0-9]+|\[[0-9.]+\])/g, (match, suffix) => {
    // If it's a very low opacity like 5% or [0.03], we use 5
    // But let's just use 5 for all to keep it simple, or map them
    let numSuffix = suffix;
    if (suffix.startsWith('[')) {
        const val = parseFloat(suffix.replace(/[\[\]]/g, ''));
        if (val <= 0.05) numSuffix = '5';
        else if (val <= 0.1) numSuffix = '10';
        else numSuffix = '20';
    }
    return `hover:bg-black/${numSuffix} dark:hover:bg-white/${numSuffix}`;
  });

  // To handle bg-white/10 -> bg-black/10 dark:bg-white/10
  newContent = newContent.replace(/\bbg-white\/([0-9]+|\[[0-9.]+\])/g, (match, suffix) => {
    let numSuffix = suffix;
    if (suffix.startsWith('[')) {
        const val = parseFloat(suffix.replace(/[\[\]]/g, ''));
        if (val <= 0.05) numSuffix = '5';
        else if (val <= 0.1) numSuffix = '10';
        else numSuffix = '20';
    }
    return `bg-black/${numSuffix} dark:bg-white/${numSuffix}`;
  });

  // In className=`...`, it's not matched by our previous className="..." script!
  // So let's globally replace hover:text-white to hover:text-text-main ONLY where safe.
  // Actually, we can just replace all hover:text-white with hover:text-text-main, unless it's adjacent to a primary color, but for simplicity let's do a wide replace.
  // We can do an educated global replace.
  newContent = newContent.replace(/\bhover:text-white\b/g, 'hover:text-text-main');

  // Same for text-gray-400 group-hover:text-white -> group-hover:text-text-main
  newContent = newContent.replace(/\bgroup-hover:text-white\b/g, 'group-hover:text-text-main');
  
  // remaining text-gray
  newContent = newContent.replace(/\btext-gray-100\b/g, 'text-text-main');
  newContent = newContent.replace(/\btext-gray-150\b/g, 'text-text-main');
  newContent = newContent.replace(/\btext-gray-200\b/g, 'text-text-main');
  newContent = newContent.replace(/\btext-gray-300\b/g, 'text-text-main');
  newContent = newContent.replace(/\btext-gray-400\b/g, 'text-text-muted');
  newContent = newContent.replace(/\btext-gray-500\b/g, 'text-text-muted');
  newContent = newContent.replace(/\btext-gray-550\b/g, 'text-text-muted');
  newContent = newContent.replace(/\btext-gray-600\b/g, 'text-text-muted');
  
  newContent = newContent.replace(/\bhover:text-gray-[0-9]+\b/g, 'hover:text-text-main');

  return newContent;
}

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const newContent = fixRemaining(content);
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Fixed', fullPath);
      }
    }
  }
}

// process packages
processDir('packages/sdkwork-modelkit-workspace/src/components');
processDir('packages/sdkwork-modelkit-workspace/src/pages');
processDir('packages/sdkwork-modelkit-shop/src/components');
processDir('packages/sdkwork-modelkit-shop/src/pages');
processDir('packages/sdkwork-modelkit-skillhub/src/pages');
processDir('packages/sdkwork-modelkit-relay/src/pages');
processDir('packages/sdkwork-modelkit-software/src/pages');
processDir('packages/sdkwork-modelkit-repos/src/pages');
processDir('packages/sdkwork-modelkit-commons/src/components');

console.log('Done scanning and replacing.');
