import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings, AIModelConfig, AIProvider } from '@/types';
import { getStoredApiKey, setStoredApiKey, clearStoredApiKeys, PRESET_MODELS } from '@/lib/ai-service';

interface SettingsState {
  // 应用设置
  settings: AppSettings;
  
  // AI模型配置
  modelConfigs: AIModelConfig[];
  selectedModelId: string | null;
  
  // UI状态
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  activeTab: 'editor' | 'bible' | 'chat' | 'settings';
  
  // 主题
  theme: 'light' | 'dark' | 'system';
  
  // 加载状态
  isLoading: boolean;
  
  // 操作方法
  loadSettings: () => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
  
  // 模型配置操作
  loadModelConfigs: () => void;
  addModelConfig: (config: AIModelConfig) => void;
  updateModelConfig: (config: AIModelConfig) => void;
  deleteModelConfig: (id: string) => void;
  selectModel: (modelId: string | null) => void;
  getSelectedModel: () => AIModelConfig | null;
  isModelConfigured: (provider: AIProvider) => boolean;
  
  // API密钥操作
  updateApiKey: (provider: AIProvider, apiKey: string) => void;
  removeApiKey: (provider: AIProvider) => void;
  hasApiKey: (provider: AIProvider) => boolean;
  
  // UI操作
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleRightPanel: () => void;
  setRightPanelOpen: (open: boolean) => void;
  setActiveTab: (tab: 'editor' | 'bible' | 'chat' | 'settings') => void;
  
  // 主题操作
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  initializeTheme: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  editorFontSize: 16,
  editorFontFamily: 'serif',
  autoSaveInterval: 60,
  defaultModel: '',
  showWordCount: true,
  showReadingTime: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // 初始状态
      settings: defaultSettings,
      modelConfigs: [],
      selectedModelId: null,
      sidebarOpen: true,
      rightPanelOpen: true,
      activeTab: 'editor',
      theme: 'dark',
      isLoading: false,

      // 加载设置
      loadSettings: () => {
        // 从localStorage加载模型配置
        const stored = localStorage.getItem('novel-forge-model-configs');
        if (stored) {
          try {
            const configs = JSON.parse(stored);
            set({ modelConfigs: configs });
            
            // 选择默认模型
            const defaultConfig = configs.find((c: AIModelConfig) => c.isDefault);
            if (defaultConfig) {
              set({ selectedModelId: defaultConfig.id });
            }
          } catch (e) {
            console.error('加载模型配置失败:', e);
          }
        }
      },

      // 更新设置
      updateSettings: (updates: Partial<AppSettings>) => {
        set(state => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      // 重置设置
      resetSettings: () => {
        set({ settings: defaultSettings });
      },

      // 加载模型配置
      loadModelConfigs: () => {
        get().loadSettings();
      },

      // 添加模型配置
      addModelConfig: (config: AIModelConfig) => {
        set(state => {
          const newConfigs = [...state.modelConfigs, config];
          localStorage.setItem('novel-forge-model-configs', JSON.stringify(newConfigs));
          return { modelConfigs: newConfigs };
        });
      },

      // 更新模型配置
      updateModelConfig: (config: AIModelConfig) => {
        set(state => {
          const newConfigs = state.modelConfigs.map(c => 
            c.id === config.id ? config : c
          );
          localStorage.setItem('novel-forge-model-configs', JSON.stringify(newConfigs));
          return { modelConfigs: newConfigs };
        });
      },

      // 删除模型配置
      deleteModelConfig: (id: string) => {
        set(state => {
          const newConfigs = state.modelConfigs.filter(c => c.id !== id);
          localStorage.setItem('novel-forge-model-configs', JSON.stringify(newConfigs));
          return { 
            modelConfigs: newConfigs,
            selectedModelId: state.selectedModelId === id ? null : state.selectedModelId,
          };
        });
      },

      // 选择模型
      selectModel: (modelId: string | null) => {
        set({ selectedModelId: modelId });
      },

      // 获取选中的模型
      getSelectedModel: () => {
        const { modelConfigs, selectedModelId } = get();
        if (!selectedModelId) return null;
        return modelConfigs.find(c => c.id === selectedModelId) || null;
      },

      // 检查模型是否已配置
      isModelConfigured: (provider: AIProvider) => {
        return getStoredApiKey(provider) !== '';
      },

      // 更新API密钥
      updateApiKey: (provider: AIProvider, apiKey: string) => {
        setStoredApiKey(provider, apiKey);
      },

      // 移除API密钥
      removeApiKey: (provider: AIProvider) => {
        setStoredApiKey(provider, '');
      },

      // 检查是否有API密钥
      hasApiKey: (provider: AIProvider) => {
        return getStoredApiKey(provider) !== '';
      },

      // 切换侧边栏
      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }));
      },

      // 设置侧边栏状态
      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      // 切换右侧面板
      toggleRightPanel: () => {
        set(state => ({ rightPanelOpen: !state.rightPanelOpen }));
      },

      // 设置右侧面板状态
      setRightPanelOpen: (open: boolean) => {
        set({ rightPanelOpen: open });
      },

      // 设置活动标签
      setActiveTab: (tab: 'editor' | 'bible' | 'chat' | 'settings') => {
        set({ activeTab: tab });
      },

      // 设置主题
      setTheme: (theme: 'light' | 'dark' | 'system') => {
        set({ theme });
        
        // 应用主题到document
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      // 初始化主题
      initializeTheme: () => {
        const { theme } = get();
        
        // 监听系统主题变化
        if (window.matchMedia) {
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            const current = get().theme;
            if (current === 'system') {
              if (e.matches) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            }
          });
        }
        
        // 应用当前主题
        get().setTheme(theme);
      },
    }),
    {
      name: 'novel-forge-settings',
      partialize: (state) => ({
        settings: state.settings,
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        rightPanelOpen: state.rightPanelOpen,
        activeTab: state.activeTab,
      }),
    }
  )
);

// 获取可用的AI提供商列表
export function getAvailableProviders(): Array<{ provider: AIProvider; name: string; models: typeof PRESET_MODELS[AIProvider] }> {
  return [
    { 
      provider: 'openai', 
      name: 'OpenAI', 
      models: PRESET_MODELS.openai 
    },
    { 
      provider: 'anthropic', 
      name: 'Anthropic Claude', 
      models: PRESET_MODELS.anthropic 
    },
    { 
      provider: 'qwen', 
      name: '通义千问', 
      models: PRESET_MODELS.qwen 
    },
    { 
      provider: 'ernie', 
      name: '文心一言', 
      models: PRESET_MODELS.ernie 
    },
    { 
      provider: 'doubao', 
      name: '豆包', 
      models: PRESET_MODELS.doubao 
    },
  ];
}
