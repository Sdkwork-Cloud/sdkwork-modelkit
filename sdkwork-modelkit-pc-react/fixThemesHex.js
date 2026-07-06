import fs from 'fs';
import path from 'path';

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var num = parseInt(hex, 16);
    return [num >> 16, num >> 8 & 255, num & 255];
}

function getLightness(rgb) {
    return (Math.max(...rgb) + Math.min(...rgb)) / 2 / 255;
}

function getSemanticClass(prefix, hex) {
    const rgb = hexToRgb(hex);
    const l = getLightness(rgb);

    if (prefix.includes('border') || prefix.includes('ring')) {
        if (l < 0.15) return `${prefix}-divider`;
        return `${prefix}-divider-strong`;
    }

    if (prefix.includes('bg') || prefix.includes('from') || prefix.includes('to')) {
        if (l < 0.05) return `${prefix}-canvas`;
        if (l < 0.07) return `${prefix}-panel`;
        if (l < 0.1) return `${prefix}-surface`;
        if (l < 0.16) return `${prefix}-surface-hover`;
        if (prefix.includes('hover:bg')) return `hover:bg-surface-hover`;
        return `${prefix}-surface-hover`; // default fallback
    }
    
    if (prefix.includes('text')) {
        if (l > 0.8) return `${prefix}-text-main`;
        if (l > 0.5) return `${prefix}-text-muted`;
        return `${prefix}-primary-main`; // assuming some primary colors
    }
    
    return `${prefix}-[${hex}]`; // unchanged
}

function fixDynamicHex(content) {
  let newContent = content;
  // Match things like bg-[#121314], hover:border-[#aaa], text-[#111]
  const regex = /\b(bg|border|ring|from|to|text|hover:bg|hover:border|hover:text)-\[#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\]/g;
  
  newContent = newContent.replace(regex, (match, prefix, hexcode) => {
     // Skip known primary/accent colors that shouldn't be mapped to canvas/panel etc
     // e.g. blue, red, emerald
     const rgb = hexToRgb('#' + hexcode);
     const max = Math.max(...rgb);
     const min = Math.min(...rgb);
     const chroma = max - min;
     
     // If it's a colorful hex, leave it
     if (chroma > 40) {
         return match;
     }
     
     return getSemanticClass(prefix, '#' + hexcode);
  });

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
      const newContent = fixDynamicHex(content);
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
