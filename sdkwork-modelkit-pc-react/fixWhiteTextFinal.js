import fs from 'fs';
import path from 'path';

function fixWhiteTextBackticks(content) {
  let newContent = content;
  // match className="... text-white ..." AND className={`...`}
  
  // A generic replacer for text-white
  function replaceIfSafe(match, classes) {
    if (
      classes.includes('bg-primary') ||
      classes.includes('bg-blue-') ||
      classes.includes('bg-indigo-') ||
      classes.includes('bg-red-') ||
      classes.includes('bg-orange-') ||
      classes.includes('bg-violet-') ||
      classes.includes('bg-emerald-') ||
      classes.includes('bg-cyan-') ||
      classes.includes('bg-slate-') ||
      classes.includes('text-white/80') ||
      classes.includes('from-') ||
      classes.includes('bg-black') ||
      classes.includes('bg-white')
    ) {
      return match;
    }
    if (classes.includes('text-white')) {
      const fixed = classes.replace(/\btext-white\b/g, 'text-text-main');
      return match.replace(classes, fixed);
    }
    return match;
  }

  // match ""
  newContent = newContent.replace(/className="([^"]*)"/g, replaceIfSafe);
  
  // match ``
  newContent = newContent.replace(/className=\{`([^`]*)`\}/g, replaceIfSafe);

  // match ''
  newContent = newContent.replace(/className='([^']*)'/g, replaceIfSafe);

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
      const newContent = fixWhiteTextBackticks(content);
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Fixed', fullPath);
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

console.log('Done scanning and replacing text-white inside backticks.');
