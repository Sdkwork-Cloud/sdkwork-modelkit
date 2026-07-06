const fs = require('fs');

const zhPath = 'src/locales/zh/workspace.json';
const enPath = 'src/locales/en/workspace.json';

const zhData = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Keys to add
const additions = {
  "sidebar_tools": { zh: "工具网络", en: "Agent Tools" },
  "sidebar_tools_desc": { zh: "组件工具", en: "Modules" },
  "sidebar_search_tools": { zh: "寻找组件...", en: "Search tools..." },
  "sidebar_tools_loading": { zh: "加载中...", en: "Loading..." },
  "sidebar_tools_empty": { zh: "暂无组件工具装载。", en: "No tools loaded." },
  
  "sidebar_relay": { zh: "本地路由", en: "Local Router" },
  "sidebar_relay_desc": { zh: "Local Proxy Tunnel", en: "Local Proxy Tunnel" },
  "sidebar_relay_new": { zh: "新建路由", en: "New Router" },
  "sidebar_relay_list": { zh: "中继连接", en: "Relay Connections" },
  "sidebar_relay_empty": { zh: "工作环境未检测到活跃的对等中继隧道。请在此点击创建", en: "No active relays found. Create one here." },

  "sidebar_logs": { zh: "日志", en: "Logs" },
  "sidebar_logs_desc": { zh: "请求日志", en: "Relay Request Logs" },

  "sidebar_stats": { zh: "统计", en: "Stats" },
  "sidebar_stats_desc": { zh: "数据统计", en: "Usage Stats" },

  "sidebar_vip": { zh: "高级版", en: "VIP" },
  "sidebar_vip_desc": { zh: "订阅 VIP 会员", en: "Subscribe to VIP" },

  "sidebar_settings": { zh: "设置", en: "Settings" },
  "sidebar_settings_desc": { zh: "控制中心", en: "Control Center" },
  "sidebar_settings_system": { zh: "系统设置", en: "System Setup" },
  "sidebar_settings_profile": { zh: "用户凭据", en: "User Profile" },
  "sidebar_api_keys": { zh: "API 密钥库", en: "API Keys Vault" }
};

for (const [key, val] of Object.entries(additions)) {
  zhData[key] = val.zh;
  enData[key] = val.en;
}

fs.writeFileSync(zhPath, JSON.stringify(zhData, null, 2) + "\n");
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + "\n");

console.log("Locales updated!");
