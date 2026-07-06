const fs = require('fs');

const file = 'packages/sdkwork-modelkit-shop/src/components/ShopView.tsx';
let content = fs.readFileSync(file, 'utf8');

const matches = content.match(/text-(blue|purple|amber|red|emerald|orange)-[0-9]{3}/g);
if (matches) {
  const map = new Map();
  matches.forEach(m => map.set(m, (map.get(m) || 0) + 1));
  console.log(map);
} else {
  console.log("No matches");
}
