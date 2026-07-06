const fs = require('fs');

const zhPath = 'src/locales/zh/workspace.json';
const enPath = 'src/locales/en/workspace.json';

const zhData = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Keys to add
const additions = {
  "sidebar_core_daemon": { zh: "核心服务:", en: "Core Daemon:" },
  "sidebar_ipc_channel": { zh: "通信信道:", en: "IPC Channel:" },
  "sidebar_active": { zh: "运行中", en: "ACTIVE" }
};

for (const [key, val] of Object.entries(additions)) {
  zhData[key] = val.zh;
  enData[key] = val.en;
}

fs.writeFileSync(zhPath, JSON.stringify(zhData, null, 2) + "\n");
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + "\n");

console.log("Locales updated!");
