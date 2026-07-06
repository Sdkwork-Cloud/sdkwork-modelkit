import fs from 'fs';
import path from 'path';

function fixWhiteTextHover(content) {
  let newContent = content;
  // match className="... hover:text-white ..."
  newContent = newContent.replace(/className="([^"]*)"/g, (match, classes) => {
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
    if (classes.includes('hover:text-white')) {
      return `className="${classes.replace(/\bhover:text-white\b/g, 'hover:text-text-main')}"`;
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
      const newContent = fixWhiteTextHover(content);
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Fixed', fullPath);
      }
    }
  }
}

processDir('packages/sdkwork-modelkit-workspace/src/components');
processDir('packages/sdkwork-modelkit-shop/src/components');
