export interface PresetSupplier {
  name: string;
  nameEn?: string;
  starred?: boolean;
  openaiUrl?: string;
  anthropicUrl?: string;
  geminiUrl?: string;
  modelId: string;
}

export const PRESET_SUPPLIERS: PresetSupplier[] = [
  { name: "OpenAI Official", nameEn: "OpenAI Official", modelId: "gpt-4o", openaiUrl: "https://api.openai.com/v1" },
  { name: "胜算云", nameEn: "ShengSuanYun", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.shengsuanyun.com/v1" },
  { name: "PatewayAI", nameEn: "PatewayAI", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.pateway.ai/v1" },
  { name: "火山Agentplan", nameEn: "Volcengine Agentplan", starred: true, modelId: "doubao-pro-32k", openaiUrl: "https://ark.cn-beijing.volces.com/api/v3" },
  { name: "BytePlus", nameEn: "BytePlus", starred: true, modelId: "doubao-pro-32k", openaiUrl: "https://ark.byteplusapi.com/api/v3" },
  { name: "DouBaoSeed", nameEn: "DouBaoSeed", starred: true, modelId: "doubao-pro-32k", openaiUrl: "https://ark.cn-beijing.volces.com/api/v3" },
  { name: "Azure OpenAI", nameEn: "Azure OpenAI", modelId: "gpt-4o", openaiUrl: "https://your-resource.openai.azure.com" },
  { name: "DeepSeek", nameEn: "DeepSeek", modelId: "deepseek-chat", openaiUrl: "https://api.deepseek.com/v1" },
  { name: "Zhipu GLM", nameEn: "Zhipu GLM", modelId: "glm-4", openaiUrl: "https://open.bigmodel.cn/api/paas/v4" },
  { name: "Zhipu GLM en", nameEn: "Zhipu GLM en", modelId: "glm-4", openaiUrl: "https://open.bigmodel.cn/api/paas/v4" },
  { name: "Baidu Qianfan Coding Plan", nameEn: "Qianfan", modelId: "ernie-speed-128k", openaiUrl: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop" },
  { name: "Bailian", nameEn: "Bailian (Qwen)", modelId: "qwen-max", openaiUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1" },
  { name: "Kimi", nameEn: "Kimi (Moonshot)", modelId: "moonshot-v1-8k", openaiUrl: "https://api.moonshot.cn/v1" },
  { name: "StepFun", nameEn: "StepFun", modelId: "step-1-8k", openaiUrl: "https://api.stepfun.com/v1" },
  { name: "StepFun en", nameEn: "StepFun en", modelId: "step-1-8k", openaiUrl: "https://api.stepfun.com/v1" },
  { name: "ModelScope", nameEn: "ModelScope", modelId: "qwen-turbo", openaiUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1" },
  { name: "Longcat", nameEn: "Longcat", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.longcat.cn/v1" },
  { name: "MiniMax", nameEn: "MiniMax", starred: true, modelId: "abab6.5-chat", openaiUrl: "https://api.minimax.chat/v1" },
  { name: "MiniMax en", nameEn: "MiniMax en", starred: true, modelId: "abab6.5-chat", openaiUrl: "https://api.minimax.chat/v1" },
  { name: "BaiLing", nameEn: "BaiLing", modelId: "bailing-chat", openaiUrl: "https://api.bailing.ai/v1" },
  { name: "Xiaomi MiMo", nameEn: "Xiaomi MiMo", modelId: "mimo-chat", openaiUrl: "https://api.mimo.xiaomi.com/v1" },
  { name: "Xiaomi MiMo Token Plan (China)", nameEn: "Xiaomi MiMo (China)", modelId: "mimo-chat", openaiUrl: "https://api.mimo.xiaomi.com/v1" },
  { name: "SiliconFlow", nameEn: "SiliconFlow", starred: true, modelId: "deepseek-ai/DeepSeek-V3", openaiUrl: "https://api.siliconflow.cn/v1" },
  { name: "SiliconFlow en", nameEn: "SiliconFlow en", starred: true, modelId: "deepseek-ai/DeepSeek-V3", openaiUrl: "https://api.siliconflow.cn/v1" },
  { name: "Novita AI", nameEn: "Novita AI", modelId: "meta-llama/llama-3-8b-instruct", openaiUrl: "https://api.novita.ai/v3" },
  { name: "Nvidia", nameEn: "Nvidia", modelId: "meta/llama3-8b-instruct", openaiUrl: "https://integrate.api.nvidia.com/v1" },
  { name: "AiHubMix", nameEn: "AiHubMix", modelId: "gpt-4o", openaiUrl: "https://api.aihubmix.com/v1" },
  { name: "DMXAPI", nameEn: "DMXAPI", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.dmxapi.com/v1" },
  { name: "PackyCode", nameEn: "PackyCode", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.packycode.com/v1" },
  { name: "APIKEY.FUN", nameEn: "APIKEY.FUN", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.apikey.fun/v1" },
  { name: "APINebula", nameEn: "APINebula", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.apinebula.com/v1" },
  { name: "AtlasCloud", nameEn: "AtlasCloud", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.atlascloud.cn/v1" },
  { name: "SudoCode", nameEn: "SudoCode", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.sudocode.cn/v1" },
  { name: "ClaudeCN", nameEn: "ClaudeCN", starred: true, modelId: "claude-3-5-sonnet", openaiUrl: "https://api.claudecn.com/v1" },
  { name: "RunAPI", nameEn: "RunAPI", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.runapi.com/v1" },
  { name: "RelaxyCode", nameEn: "RelaxyCode", modelId: "gpt-4o", openaiUrl: "https://api.relaxycode.com/v1" },
  { name: "Cubence", nameEn: "Cubence", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.cubence.com/v1" },
  { name: "AlGoCode", nameEn: "AlGoCode", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.algocode.com/v1" },
  { name: "RightCode", nameEn: "RightCode", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.rightcode.cc/v1" },
  { name: "AlCodeMirror", nameEn: "AlCodeMirror", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.alcodemirror.com/v1" },
  { name: "CrazyRouter", nameEn: "CrazyRouter", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.crazyrouter.com/v1" },
  { name: "SSSAiCode", nameEn: "SSSAiCode", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.sssaicode.com/v1" },
  { name: "优云智算", nameEn: "Uyun Intelligent", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.uyun.cn/v1" },
  { name: "优云智算Coding Plan", nameEn: "Uyun Coding Plan", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.uyun.cn/v1" },
  { name: "Micu", nameEn: "Micu", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.micu.ai/v1" },
  { name: "CTok.ai", nameEn: "CTok.ai", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.ctok.ai/v1" },
  { name: "E-FlowCode", nameEn: "E-FlowCode", modelId: "gpt-4o", openaiUrl: "https://api.eflowcode.com/v1" },
  { name: "LemonData", nameEn: "LemonData", starred: true, modelId: "gpt-4o", openaiUrl: "https://api.lemondata.cn/v1" },
  { name: "PIPELLM", nameEn: "PIPELLM", modelId: "gpt-4o", openaiUrl: "https://api.pipellm.com/v1" },
  { name: "OpenRouter", nameEn: "OpenRouter", modelId: "anthropic/claude-3.5-sonnet", openaiUrl: "https://openrouter.ai/api/v1" },
  { name: "TheRouter", nameEn: "TheRouter", modelId: "gpt-4o", openaiUrl: "https://api.therouter.cn/v1" },
];
