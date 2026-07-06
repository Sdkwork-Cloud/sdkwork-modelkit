const fs = require('fs');
const file = 'packages/sdkwork-modelkit-shop/src/components/ShopView.tsx';
let content = fs.readFileSync(file, 'utf8');

const matches1 = content.match(/text-(blue|purple|amber|red|emerald|orange)-[0-9]{3}/g);
const matches2 = content.match(/bg-(blue|purple|amber|red|emerald|orange)-[0-9]{3}/g);
const matches3 = content.match(/border-(blue|purple|amber|red|emerald|orange)-[0-9]{3}/g);

console.log("TEXT:", matches1 ? [...new Set(matches1)] : "none");
console.log("BG:", matches2 ? [...new Set(matches2)] : "none");
console.log("BORDER:", matches3 ? [...new Set(matches3)] : "none");
