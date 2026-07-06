import fs from 'fs';
import path from 'path';

const colorMap = {
  // canvas
  '#0A0B0D': 'canvas',
  '#07080A': 'canvas',
  '#050608': 'canvas',
  '#0B0C0F': 'canvas',
  '#08090C': 'canvas',
  '#060709': 'canvas',
  '#050505': 'canvas',
  '#0C0D0E': 'canvas',

  // panel
  '#0D0F14': 'panel',
  '#0E1116': 'panel',
  '#111215': 'panel',
  '#111216': 'panel',
  '#13151D': 'panel',
  '#0E0F12': 'panel',
  '#0F1115': 'panel',
  '#0f172a': 'panel',
  '#0D0E12': 'panel',
  
  // surface
  '#141518': 'surface',
  '#14151B': 'surface',
  '#1A1C20': 'surface',
  '#191a1d': 'surface',
  '#11141B': 'surface',
  '#121018': 'surface',
  '#13151A': 'surface',
  '#15161A': 'surface',
  '#161A23': 'surface',

  // surface-hover
  '#1A1E26': 'surface-hover',
  '#222222': 'surface-hover',
  '#2A2D35': 'surface-hover',
  '#2A2B31': 'surface-hover',
  '#1C1E24': 'surface-hover',
  '#1A1F29': 'surface-hover',
  '#181C26': 'surface-hover',

  // diff syntax (hex #222)
  '#222]': 'var(--color-divider)]',
  '#222/': 'divider/',

  // divider
  '#1C1F26': 'divider',
  '#171A21': 'divider',
  '#1E222B': 'divider',
  '#1A2033': 'divider',
  '#2A2B30': 'divider',
  '#23262F': 'divider',
  '#2D2F36': 'divider',

  // divider-strong
  '#2D313E': 'divider-strong',
  '#30363d': 'divider-strong',
  '#3A3D45': 'divider-strong',
  '#2B2F3A': 'divider-strong',
  '#333]': 'var(--color-divider-strong)]',
  '#333/': 'divider-strong/',
  '#444]': 'var(--color-divider-strong)]',
  '#444/': 'divider-strong/',

  // other
  '#EDF0F5': 'text-main',
  '#c9d1d9': 'text-main',
};


function replaceInContent(content) {
  let changed = false;
  let newContent = content;
  
  for (const [hex, semantic] of Object.entries(colorMap)) {
    // We want to replace standard bg-[hex], border-[hex], text-[hex]
    // Hexes are without brackets in our map but we map inside
    // Wait, let's just replace the raw hex strings if they are in tailwind brackets.
    // e.g. bg-[#0A0B0D] -> bg-canvas
    
    // Pattern for bg-[#HEX]
    const hexRegex1 = new RegExp(`bg-\\[${hex}\\]`, 'gi');
    if (hexRegex1.test(newContent)) {
      newContent = newContent.replace(hexRegex1, `bg-${semantic}`);
    }
    const hexRegex2 = new RegExp(`border-\\[${hex}\\]`, 'gi');
    if (hexRegex2.test(newContent)) {
      newContent = newContent.replace(hexRegex2, `border-${semantic}`);
    }
    const hexRegex3 = new RegExp(`text-\\[${hex}\\]`, 'gi');
    if (hexRegex3.test(newContent)) {
      newContent = newContent.replace(hexRegex3, `text-${semantic}`);
    }
    // Also ring, from
    const hexRegex4 = new RegExp(`ring-\\[${hex}\\]`, 'gi');
    if (hexRegex4.test(newContent)) {
      newContent = newContent.replace(hexRegex4, `ring-${semantic}`);
    }
    const hexRegex5 = new RegExp(`from-\\[${hex}\\]`, 'gi');
    if (hexRegex5.test(newContent)) {
      newContent = newContent.replace(hexRegex5, `from-${semantic}`);
    }
    // Also hover:
    const hexRegexHover1 = new RegExp(`hover:bg-\\[${hex}\\]`, 'gi');
    if (hexRegexHover1.test(newContent)) {
      newContent = newContent.replace(hexRegexHover1, `hover:bg-${semantic}`);
    }
    const hexRegexHover2 = new RegExp(`hover:border-\\[${hex}\\]`, 'gi');
    if (hexRegexHover2.test(newContent)) {
      newContent = newContent.replace(hexRegexHover2, `hover:border-${semantic}`);
    }
  }

  // Extra manual fixes for #222] since it represents ending bracket or slash.
  newContent = newContent.replace(/bg-\[#222\]/gi, "bg-divider");
  newContent = newContent.replace(/border-\[#222\]/gi, "border-divider");
  newContent = newContent.replace(/hover:bg-\[#222\]/gi, "hover:bg-divider");
  newContent = newContent.replace(/hover:border-\[#222\]/gi, "hover:border-divider");
  newContent = newContent.replace(/bg-\[#333\]/gi, "bg-divider-strong");
  newContent = newContent.replace(/border-\[#333\]/gi, "border-divider-strong");
  newContent = newContent.replace(/hover:bg-\[#333\]/gi, "hover:bg-divider-strong");
  newContent = newContent.replace(/hover:border-\[#333\]/gi, "hover:border-divider-strong");
  newContent = newContent.replace(/border-\[#444\]/gi, "border-divider-strong");
  newContent = newContent.replace(/hover:border-\[#444\]/gi, "hover:border-divider-strong");
  newContent = newContent.replace(/bg-\[#444\]/gi, "bg-divider-strong");

  return { newContent, changed };
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const { newContent, changed } = replaceInContent(content);
      // Wait, what if old script did changes?
      // I also want to make sure I run it over the codebase.
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Fixed', fullPath);
      }
    }
  }
}

processDir('packages/sdkwork-modelkit-workspace/src/components');
processDir('packages/sdkwork-modelkit-shop/src/components');

