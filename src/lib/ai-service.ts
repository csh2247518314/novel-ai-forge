import { AIModelConfig, AIProvider, GenerationOptions, Character, Location, Item, WorldSetting } from '@/types';

// 预设模型配置
export const PRESET_MODELS: Record<AIProvider, { modelId: string; name: string; description: string }[]> = {
  openai: [
    { modelId: 'gpt-4', name: 'GPT-4', description: '最强大的模型，适合复杂任务' },
    { modelId: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: '更快更便宜的GPT-4' },
    { modelId: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '快速响应，适合简单任务' },
  ],
  anthropic: [
    { modelId: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', description: '平衡性能与成本' },
    { modelId: 'claude-haiku-4-20250514', name: 'Claude Haiku', description: '快速响应，适合简单对话' },
    { modelId: 'claude-opus-4-20250514', name: 'Claude Opus 4', description: '最高质量，适合复杂写作' },
  ],
  google: [
    { modelId: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: '长上下文支持' },
    { modelId: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: '快速响应' },
  ],
  qwen: [
    { modelId: 'qwen-turbo', name: '通义千问Turbo', description: '阿里云通义千问Turbo模型' },
    { modelId: 'qwen-plus', name: '通义千问Plus', description: '阿里云通义千问Plus模型' },
    { modelId: 'qwen-max', name: '通义千问Max', description: '阿里云通义千问Max模型' },
  ],
  ernie: [
    { modelId: 'ernie-4.0-8k', name: '文心一言4.0', description: '百度文心一言4.0' },
    { modelId: 'ernie-3.5-8k', name: '文心一言3.5', description: '百度文心一言3.5' },
  ],
  doubao: [
    { modelId: 'doubao-pro-32k', name: '豆包Pro 32K', description: '字节跳动豆包Pro' },
    { modelId: 'doubao-lite-32k', name: '豆包Lite 32K', description: '字节跳动豆包Lite' },
  ],
};

// API密钥存储键名
const API_KEY_STORAGE_KEY = 'novel-forge-api-keys';

// 获取存储的API密钥
export function getStoredApiKey(provider: AIProvider): string {
  if (typeof window === 'undefined') return '';
  
  try {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored) {
      const keys = JSON.parse(stored);
      return keys[provider] || '';
    }
  } catch (e) {
    console.error('读取API密钥失败:', e);
  }
  return '';
}

// 存储API密钥
export function setStoredApiKey(provider: AIProvider, apiKey: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    const keys = stored ? JSON.parse(stored) : {};
    keys[provider] = apiKey;
    localStorage.setItem(API_KEY_STORAGE_KEY, JSON.stringify(keys));
  } catch (e) {
    console.error('存储API密钥失败:', e);
  }
}

// 清空所有API密钥
export function clearStoredApiKeys(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

// 格式化上下文数据
function formatCharacterContext(characters: Character[]): string {
  if (characters.length === 0) return '';
  
  return '\n\n【角色设定参考】\n' + characters.map(char => `
角色：${char.name}
身份：${char.role}
外貌：${char.appearance}
性格：${char.personality}
背景：${char.background}
${char.secrets ? `秘密：${char.secrets}` : ''}
`).join('\n---\n');
}

function formatLocationContext(locations: Location[]): string {
  if (locations.length === 0) return '';
  
  return '\n\n【地点设定参考】\n' + locations.map(loc => `
地点：${loc.name}
类型：${loc.type}
描述：${loc.description}
${loc.atmosphere ? `氛围：${loc.atmosphere}` : ''}
`).join('\n---\n');
}

function formatItemContext(items: Item[]): string {
  if (items.length === 0) return '';
  
  return '\n\n【物品设定参考】\n' + items.map(item => `
物品：${item.name}
类型：${item.type}
描述：${item.description}
${item.abilities ? `能力：${item.abilities}` : ''}
`).join('\n---\n');
}

function formatWorldSettingContext(settings: WorldSetting[]): string {
  if (settings.length === 0) return '';
  
  return '\n\n【世界观设定参考】\n' + settings.map(setting => `
${setting.title}（${setting.category}）：
${setting.content}
`).join('\n---\n');
}

// 格式化系统提示词
function formatSystemPrompt(basePrompt: string, contextData?: (Character | Location | Item | WorldSetting)[]): string {
  if (!contextData || contextData.length === 0) {
    return basePrompt;
  }
  
  const characters = contextData.filter(c => 'role' in c) as Character[];
  const locations = contextData.filter(l => 'type' in l && (l as Location).type) as Location[];
  const items = contextData.filter(i => 'type' in i && (i as Item).type === '武器' || (i as Item).type === '道具') as Item[];
  const settings = contextData.filter(s => 'category' in s) as WorldSetting[];
  
  const contextString = 
    formatCharacterContext(characters) +
    formatLocationContext(locations) +
    formatItemContext(items) +
    formatWorldSettingContext(settings);
  
  return basePrompt + contextString;
}

// OpenAI API调用
async function callOpenAI(
  modelId: string,
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
  options: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000,
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API调用失败');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Anthropic API调用
async function callAnthropic(
  modelId: string,
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
  options: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: options.maxTokens ?? 2000,
      temperature: options.temperature ?? 0.7,
      system: systemMessage?.content,
      messages: userMessages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API调用失败');
  }

  const data = await response.json();
  return data.content[0].text;
}

// 通义千问API调用
async function callQwen(
  modelId: string,
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
  options: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      input: {
        messages: messages.map(m => ({
          role: m.role === 'system' ? 'system' : m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      },
      parameters: {
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2000,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API调用失败');
  }

  const data = await response.json();
  return data.output?.text || '';
}

// 文心一言API调用
async function callErnie(
  modelId: string,
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
  options: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const accessToken = apiKey; // 简化处理，实际需要先获取access_token

  const response = await fetch(`https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${modelId}?access_token=${accessToken}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      temperature: options.temperature ?? 0.7,
      max_output_tokens: options.maxTokens ?? 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_msg || 'API调用失败');
  }

  const data = await response.json();
  return data.result;
}

// 豆包API调用
async function callDoubao(
  modelId: string,
  apiKey: string,
  messages: Array<{ role: string; content: string }>,
  options: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages: messages.map(m => ({
        role: m.role === 'system' ? 'system' : m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API调用失败');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// 主AI生成函数
export async function generateWithAI(
  options: GenerationOptions,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const { modelId, temperature, maxTokens, contextData, provider } = options;
  
  const apiKey = getStoredApiKey(provider);
  if (!apiKey) {
    throw new Error(`未配置${provider}的API密钥`);
  }

  const formattedSystemPrompt = formatSystemPrompt(systemPrompt, contextData);
  
  const messages: Array<{ role: string; content: string }> = [
    { role: 'system', content: formattedSystemPrompt },
    { role: 'user', content: userMessage },
  ];

  // 根据provider选择API调用方式
  switch (provider) {
    case 'openai':
      return callOpenAI(modelId, apiKey, messages, { temperature, maxTokens });
    case 'anthropic':
      return callAnthropic(modelId, apiKey, messages, { temperature, maxTokens });
    case 'qwen':
      return callQwen(modelId, apiKey, messages, { temperature, maxTokens });
    case 'ernie':
      return callErnie(modelId, apiKey, messages, { temperature, maxTokens });
    case 'doubao':
      return callDoubao(modelId, apiKey, messages, { temperature, maxTokens });
    default:
      throw new Error(`不支持的AI提供商: ${provider}`);
  }
}

// 预设提示词模板
export const PROMPT_TEMPLATES = {
  续写: `你是一位专业的小说作家。请根据给定的内容续写故事，保持文风一致，情节连贯。

要求：
1. 保持与前文相同的叙事视角和写作风格
2. 延续当前的情感基调
3. 自然衔接，不要突兀转折
4. 字数控制在200-500字左右
5. 不要重复前面的内容

请续写以下内容：`,

  润色: `你是一位专业的小说编辑和作家。请对以下文本进行润色，使其更加生动、流畅、富有表现力。

要求：
1. 优化措辞和句式
2. 增强描写和氛围营造
3. 保持原有的情节和人物性格
4. 适当添加细节描写
5. 不要改变原文的核心内容

请润色以下文本：`,

  改写: `你是一位专业的小说作家。请根据指定的要求改写以下文本。

要求：
1. 保持原文的基本情节不变
2. 调整写作风格以符合要求
3. 重新组织语言表达
4. 确保改写后的文本流畅自然

请改写以下文本：`,

  对话生成: `你是一位专业的小说作家。请根据给定的角色信息和场景，生成一段自然、符合角色性格的对话。

要求：
1. 对话要符合角色的性格、身份和说话习惯
2. 要有推进情节发展的作用
3. 语言要自然、口语化
4. 可以适当添加动作描写来配合对话

场景和角色信息：`,

  场景描写: `你是一位专业的小说作家。请根据给定的信息，生成一段生动的场景描写。

要求：
1. 调动多种感官（视觉、听觉、嗅觉、触觉）
2. 营造适当的氛围和情感基调
3. 细节丰富但不冗长
4. 为情节服务，烘托人物情感

场景信息：`,

  情节发展: `你是一位专业的小说作家。请帮助发展以下情节。

要求：
1. 保持情节的合理性和连贯性
2. 设计有趣的冲突或转折
3. 符合故事的整体走向
4. 为后续情节埋下伏笔

当前情节：`,

  自定义: '',
};
