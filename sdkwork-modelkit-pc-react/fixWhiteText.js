import fs from 'fs';
import path from 'path';

function fixWhiteText(content) {
  let newContent = content;
  // match className="... text-white ..."
  newContent = newContent.replace(/className="([^"]*)"/g, (match, classes) => {
    // If it has a primary-like background, DO NOT CHANGE text-white
    if (
      classes.includes('bg-primary') ||
      classes.includes('bg-blue-') ||
      classes.includes('bg-indigo-') ||
      classes.includes('bg-red-') ||
      classes.includes('bg-orange-') ||
      classes.includes('bg-violet-') ||
      classes.includes('from-') ||
      classes.includes('bg-black')
    ) {
      return match;
    }
    // Otherwise replace text-white with text-text-main
    if (classes.includes('text-white')) {
      return `className="${classes.replace(/\btext-white\b/g, 'text-text-main')}"`;
    }
    return match;
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
      const newContent = fixWhiteText(content);
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Fixed', fullPath);
      }
    }
  }
}

processDir('packages/sdkwork-modelkit-workspace/src/components');
processDir('packages/sdkwork-modelkit-shop/src/components');
