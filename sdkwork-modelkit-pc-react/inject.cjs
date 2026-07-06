const fs = require('fs');
const zhPath = 'src/locales/zh/workspace.json';
const enPath = 'src/locales/en/workspace.json';

const zhData = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const zhInject = {
  // DeepLinkInterceptorModal
  "deeplink_detected": "📥 检测到入站生态深度链接，智能配置已加载！",
  "strategy_apply_failed": "配置策略应用失败，请检查密钥是否有效。",
  "key_already_imported": "API Key 已经导入，跳过重复项。",
  "key_sync_success": "🎉 API Key 顺利同步至本地密钥库！",
  "sync_failed": "同步失败，请刷新后重试",
  "config_copied": "配置片段已复制到剪贴板！",
  "no_description": "没有提供描述",
  "copy_final_config": "复制完整配置",
  "generated_config_file": "生成的配置文件:",
  "complete_and_close": "完成并关闭面板",
  
  // ApiKeyManager
  "key_added_ok": "API 密钥添加成功！",
  "key_updated_ok": "API 密钥更新成功！",
  "key_dup_ok": "密钥复制成功！",
  "key_deleted_ok": "API 密钥 {{name}} 已成功删除！",
  "api_keys_mgr": "本地 API 密钥管理器",
  "api_keys_desc": "在本地安全地管理客户端密钥。端到端高强度加密，无惧泄漏风险。",
  "add_api_key": "添加 API 密钥",
  "total_keys": "密钥总数",
  "keys_lbl": "个",
  "active_keys": "活跃密钥数",
  "enabled_lbl": "个已启用",
  "local_enc_layer": "本地加密引擎",
  "key_mapping_table": "密钥映射字典",
  "search_key_placeholder": "输入密钥特征名称进行搜索...",
  "no_keys_configured": "当前工作区暂未配置本地 API 密钥",
  "add_first_key": "立即创建一个密钥",
  
  // RoutingTab
  "advanced_routing_config": "高级负载路由配置",
  "advanced_routing_desc": "配置高级多账号负载路由和防刷保护策略，优化 API 请求吞吐量，规避触发高频限流 (429)。",
  "routing_strategy_label": "路由分发策略",
  "mode_round_robin": "轮询分发 (Round Robin)",
  "mode_round_robin_desc": "按物理顺序，依次、循环地平均分发 API 流量至底端各存活状态的服务商账号。",
  "mode_least_latency": "最小延迟优先 (Least Latency)",
  "mode_least_latency_desc": "系统自动检测和统计历史平均响应，优先路由给当前延迟最低且健康的账号。",
  "mode_weighted_random": "权重随机分发 (Weighted Random)",
  "mode_weighted_random_desc": "根据各服务商设定的配比权重，进行高精度比例随机的概率分发，适合精细配额管理。",
  "mode_fallback": "故障主备切换 (Priority Fallback)",
  "mode_fallback_desc": "始终仅路由到最强主账号，当前主账号发生 429 频控限制或 50x 服务器意外时，静默快速自动切换至备选组。",
  "auto_retry_label": "多账号故障自动重试机制",
  "auto_retry_desc": "当 API 响应发生 429、50x 等故障时，在微秒级不触动客户端的场景下，静默将请求自动轮询重试列表中其它的可用健康账号，实现请求永不掉线。",
  
  // ModelMappingTab
  // TODO
};

const enInject = {
  // DeepLinkInterceptorModal
  "deeplink_detected": "📥 Detected inbound ecosystem Deep Link, smart configuration loaded!",
  "strategy_apply_failed": "Failed to apply strategy, please check key validity.",
  "key_already_imported": "API Key already imported, skipped duplicate.",
  "key_sync_success": "🎉 API Key smoothly synchronized to local keystore!",
  "sync_failed": "Sync failed, please refresh and retry",
  "config_copied": "Configuration snippet copied to clipboard!",
  "no_description": "No description provided",
  "copy_final_config": "Copy configuration",
  "generated_config_file": "Generated config file:",
  "complete_and_close": "Done and Close",
  
  // ApiKeyManager
  "key_added_ok": "API Key added successfully!",
  "key_updated_ok": "API Key updated successfully!",
  "key_dup_ok": "Key duplicated successfully!",
  "key_deleted_ok": "API Key {{name}} deleted successfully!",
  "api_keys_mgr": "Local API Keys Manager",
  "api_keys_desc": "Manage API keys for local proxy tunneling with strong client-side encryption. Supports all tool APIs.",
  "add_api_key": "Add API Key",
  "total_keys": "Total Keys",
  "keys_lbl": "keys",
  "active_keys": "Active Keys",
  "enabled_lbl": "Enabled",
  "local_enc_layer": "Local Encryption Layer",
  "key_mapping_table": "Key Mapping Table",
  "search_key_placeholder": "Search key name or API endpoint...",
  "no_keys_configured": "No Local API Keys Configured",
  "add_first_key": "Click to add your first key",
  
  // RoutingTab
  "advanced_routing_config": "Routing Configuration",
  "advanced_routing_desc": "Configure advanced multi-account routing and anti-abuse policies to optimize API throughput and bypass rate-limiting (429).",
  "routing_strategy_label": "Routing Strategy",
  "mode_round_robin": "Round Robin",
  "mode_round_robin_desc": "Distribute requests sequentially across all active provider accounts.",
  "mode_least_latency": "Least Latency",
  "mode_least_latency_desc": "Route to the provider account with the lowest historical response time.",
  "mode_weighted_random": "Weighted Random",
  "mode_weighted_random_desc": "Distribute based on custom weights defined per provider.",
  "mode_fallback": "Priority Fallback",
  "mode_fallback_desc": "Always use primary account, fallback to others only on failure or rate-limit.",
  "auto_retry_label": "Automatic Multi-Account Retry on Failure",
  "auto_retry_desc": "Seamlessly retry failed requests (429, 50x) using the next available provider account in the rotation."
};

Object.assign(zhData, zhInject);
Object.assign(enData, enInject);

fs.writeFileSync(zhPath, JSON.stringify(zhData, null, 2));
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
console.log('injected!');
