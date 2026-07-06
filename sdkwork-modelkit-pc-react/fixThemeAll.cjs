import fs from 'fs';
import path from 'path';

function replaceThemeClasses(content) {
  let newContent = content;

  // Replace bg-white text-black button/panel patterns
  newContent = newContent.replace(/bg-white([^'"`]*)text-black/g, 'bg-surface$1text-text-main');
  newContent = newContent.replace(/text-black([^'"`]*)bg-white/g, 'text-text-main$1bg-surface');

  // Replace hover:bg-gray-200 and hover:bg-neutral-200
  newContent = newContent.replace(/hover:bg-gray-200/g, 'hover:bg-surface-hover');
  newContent = newContent.replace(/hover:bg-neutral-200/g, 'hover:bg-surface-hover');
  newContent = newContent.replace(/hover:bg-gray-100/g, 'hover:bg-surface-hover');

  // Any remaining generic text-black
  newContent = newContent.replace(/\btext-black\b/g, 'text-text-main');

  // Replace hardcoded grays in text and backgrounds
  newContent = newContent.replace(/\btext-gray-900\b/g, 'text-text-main');
  newContent = newContent.replace(/\btext-gray-800\b/g, 'text-text-main');
  newContent = newContent.replace(/\btext-gray-700\b/g, 'text-text-main');
  newContent = newContent.replace(/\btext-gray-600\b/g, 'text-text-muted');
  newContent = newContent.replace(/\btext-gray-500\b/g, 'text-text-muted');
  newContent = newContent.replace(/\btext-gray-400\b/g, 'text-text-muted');
  newContent = newContent.replace(/\btext-gray-300\b/g, 'text-text-muted');
  
  newContent = newContent.replace(/\bbg-gray-100\b/g, 'bg-surface');
  newContent = newContent.replace(/\bbg-gray-50\b/g, 'bg-surface');
  newContent = newContent.replace(/\bbg-gray-800\b/g, 'bg-surface-hover');
  newContent = newContent.replace(/\bbg-gray-900\b/g, 'bg-surface');

  // replace other instances of bg-white if they are not used with text-transparent or something
  // Wait, bg-white alone might be okay in some places, but let's carefully replace it if it's meant to be a surface
  // Actually, replacing bg-white with bg-panel is safer for general panels
  // We already replaced bg-white text-black above.

  return newContent;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const newContent = replaceThemeClasses(content);
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log('Updated:', filePath);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        walkDir(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir('packages');
walkDir('src');
walkDir('sdks');
