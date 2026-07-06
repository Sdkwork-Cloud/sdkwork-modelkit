import fs from 'fs';
import path from 'path';

function fixDoubleReplacement(content) {
  return content.replace(/dark:hover:bg-black\/([0-9]+)\s+dark:bg-white\/\1/g, 'dark:hover:bg-white/$1');
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
      const newContent = fixDoubleReplacement(content);
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

console.log('Done scanning and replacing double darks.');
