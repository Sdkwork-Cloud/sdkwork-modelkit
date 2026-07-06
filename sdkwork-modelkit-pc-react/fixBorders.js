import fs from 'fs';
import path from 'path';

function fixWhiteBorders(content) {
  let newContent = content;

  // We want to replace border-white/[x] with border-divider
  // Same for border-[white]/10 etc, except if it's on a button with primary colors.
  function replaceSafe(match, classes) {
    if (
      classes.includes('bg-primary') ||
      classes.includes('bg-blue-') ||
      classes.includes('bg-indigo-') ||
      classes.includes('bg-red-') ||
      classes.includes('bg-orange-') ||
      classes.includes('bg-[') || // maybe hex
      classes.includes('from-') ||
      classes.includes('border-t-white') // specific loaders
    ) {
      return match;
    }

    // replace border-white/xxx with border-divider
    let fixed = classes.replace(/\bborder-white\/([0-9]+|\[[0-9.]+\])/g, 'border-divider');
    // hover:border-white/xxx -> hover:border-divider-strong
    fixed = fixed.replace(/\bhover:border-white\/([0-9]+|\[[0-9.]+\])/g, 'hover:border-divider-strong');

    return match.replace(classes, fixed);
  }

  // match ""
  newContent = newContent.replace(/className="([^"]*)"/g, replaceSafe);
  // match ``
  newContent = newContent.replace(/className=\{`([^`]*)`\}/g, replaceSafe);
  // match ''
  newContent = newContent.replace(/className='([^']*)'/g, replaceSafe);

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
      const newContent = fixWhiteBorders(content);
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Fixed borders in', fullPath);
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

console.log('Done scanning and replacing border-white.');
