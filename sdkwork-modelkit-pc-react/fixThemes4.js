import fs from 'fs';
import path from 'path';

function fixGrayText(content) {
  let newContent = content;
  // match className="..."
  newContent = newContent.replace(/className="([^"]*)"/g, (match, classes) => {
    let replaced = classes;
    replaced = replaced.replace(/\btext-gray-[123]00\b/g, 'text-text-main');
    replaced = replaced.replace(/\btext-gray-[456]5?0\b/g, 'text-text-muted');
    replaced = replaced.replace(/\btext-gray-[789]00\b/g, 'text-text-muted');
    return `className="${replaced}"`;
  });

  return newContent;
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const newContent = fixGrayText(content);
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Fixed', fullPath);
      }
    }
  }
}

processDir('packages/sdkwork-modelkit-workspace/src/components');
processDir('packages/sdkwork-modelkit-shop/src/components');
