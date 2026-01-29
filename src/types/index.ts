// 项目类型定义

// AI模型提供商类型
export type AIProvider = 
  | 'openai' 
  | 'anthropic' 
  | 'google' 
  | 'qwen' 
  | 'ernie' 
  | 'doubao';

// AI模型配置
export interface AIModelConfig {
  id: string;
  name: string;
  provider: AIProvider;
  modelId: string;
  apiKey: string;
  baseUrl?: string;
  maxTokens?: number;
  temperature?: number;
  isDefault?: boolean;
}

// 预设模型列表
export interface PresetModel {
  id: string;
  name: string;
  provider: AIProvider;
  modelId: string;
  description: string;
}

// 项目类型
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  coverColor?: string;
}

// 章节类型
export interface Chapter {
  id: string;
  projectId: string;
  title: string;
  content: string;
  order: number;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 卷/部分类型
export interface Volume {
  id: string;
  projectId: string;
  title: string;
  order: number;
  chapters: Chapter[];
}

// 角色类型
export interface Character {
  id: string;
  projectId: string;
  name: string;
  role: '主角' | '配角' | '反派' | 'NPC';
  avatar?: string;
  age?: string;
  gender?: string;
  appearance: string;
  personality: string;
  background: string;
  abilities?: string;
  relationships?: string[];
  secrets?: string;
  notes?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 地点类型
export interface Location {
  id: string;
  projectId: string;
  name: string;
  type: '城镇' | '建筑' | '自然' | '异世界' | '其他';
  description: string;
  history?: string;
  atmosphere?: string;
  importantPlaces?: string[];
  connections?: string[];
  notes?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 物品类型
export interface Item {
  id: string;
  projectId: string;
  name: string;
  type: '武器' | '道具' | '魔法物品' | '文献' | '其他';
  description: string;
  appearance?: string;
  abilities?: string;
  origin?: string;
  currentOwner?: string;
  notes?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 世界观设定
export interface WorldSetting {
  id: string;
  projectId: string;
  category: '历史' | '文化' | '魔法' | '科技' | '宗教' | '政治' | '地理' | '其他';
  title: string;
  content: string;
  relatedEntities?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 聊天消息类型
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  modelUsed?: string;
}

// 聊天会话类型
export interface ChatSession {
  id: string;
  projectId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// 提示词模板类型
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: '续写' | '润色' | '改写' | '对话生成' | '场景描写' | '情节发展' | '自定义';
  isSystem?: boolean;
}

// AI生成选项
export interface GenerationOptions {
  modelId: string;
  provider: AIProvider;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  contextData?: (Character | Location | Item | WorldSetting)[];
}

// 编辑器状态
export interface EditorState {
  currentProjectId: string | null;
  currentChapterId: string | null;
  isDirty: boolean;
  lastSaved: Date | null;
  selectedText: string | null;
}

// 应用设置
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  editorFontSize: number;
  editorFontFamily: string;
  autoSaveInterval: number;
  defaultModel: string;
  showWordCount: boolean;
  showReadingTime: boolean;
}

// 导出配置
export interface ExportConfig {
  format: 'markdown' | 'txt' | 'json';
  includeBible: boolean;
  includeFrontmatter: boolean;
  chapterSeparator: string;
}
