import fs from 'fs';
import path from 'path';

function fixGrayTexts(content) {
  let newContent = content;

  newContent = newContent.replace(/\btext-gray-(350|450|505|555|650|655|700)\b/g, 'text-text-muted');

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
      const newContent = fixGrayTexts(content);
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Fixed grays in', fullPath);
      }
    }
  }
}

// process packages
processDir('packages/sdkwork-modelkit-workspace/src');
processDir('packages/sdkwork-modelkit-shop/src');
processDir('packages/sdkwork-modelkit-skillhub/src');
processDir('packages/sdkwork-modelkit-relay/src');
processDir('packages/sdkwork-modelkit-software/src');
processDir('packages/sdkwork-modelkit-repos/src');
processDir('packages/sdkwork-modelkit-commons/src');

console.log('Done scanning and replacing remaining generic gray texts.');
