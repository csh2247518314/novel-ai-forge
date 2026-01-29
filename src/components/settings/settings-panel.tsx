'use client';

import { useState, useEffect } from 'react';
import { useSettingsStore, getAvailableProviders } from '@/store/settings-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings as SettingsIcon,
  Key,
  Palette,
  Type,
  Check,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIProvider, AIModelConfig } from '@/types';
import { PRESET_MODELS } from '@/lib/ai-service';

export function SettingsPanel() {
  const { 
    settings, 
    updateSettings,
    modelConfigs,
    loadModelConfigs,
    addModelConfig,
    updateModelConfig,
    deleteModelConfig,
    selectModel,
    selectedModelId,
    hasApiKey,
    updateApiKey,
    theme,
    setTheme,
  } = useSettingsStore();

  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('api');
  const providers = getAvailableProviders();

  useEffect(() => {
    loadModelConfigs();
  }, [loadModelConfigs]);

  // 初始化主题
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const handleApiKeyChange = (provider: AIProvider, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
  };

  const handleSaveApiKey = (provider: AIProvider) => {
    const key = apiKeys[provider];
    if (key) {
      updateApiKey(provider, key);
      // 创建一个默认模型配置
      const providerModels = PRESET_MODELS[provider];
      if (providerModels && providerModels.length > 0) {
        const firstModel = providerModels[0];
        const config: AIModelConfig = {
          id: `${provider}-${firstModel.modelId}`,
          name: `${provider} ${firstModel.name}`,
          provider,
          modelId: firstModel.modelId,
          apiKey: key,
          isDefault: modelConfigs.length === 0,
        };
        addModelConfig(config);
      }
    }
  };

  const handleDeleteConfig = (id: string) => {
    if (confirm('确定要删除这个模型配置吗？')) {
      deleteModelConfig(id);
    }
  };

  const handleSelectDefault = (id: string) => {
    selectModel(id);
    // 更新其他配置的非默认状态
    modelConfigs.forEach(config => {
      if (config.id === id) {
        updateModelConfig({ ...config, isDefault: true });
      } else {
        updateModelConfig({ ...config, isDefault: false });
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          设置
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="api" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              API配置
            </TabsTrigger>
            <TabsTrigger 
              value="editor" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              编辑器
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              外观
            </TabsTrigger>
          </TabsList>

          <div className="p-4">
            {/* API配置 */}
            <TabsContent value="api" className="space-y-6 mt-0">
              <div>
                <h3 className="text-sm font-medium mb-4">AI服务提供商</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  选择要配置的AI服务提供商，输入API密钥即可开始使用。
                </p>
              </div>

              {providers.map((provider) => {
                const isConfigured = hasApiKey(provider.provider);
                
                return (
                  <Card key={provider.provider} className="mb-4">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{provider.name}</CardTitle>
                        {isConfigured ? (
                          <span className="flex items-center gap-1 text-xs text-green-500">
                            <Check className="h-3 w-3" />
                            已配置
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <AlertCircle className="h-3 w-3" />
                            未配置
                          </span>
                        )}
                      </div>
                      <CardDescription>
                        可用模型：{provider.models.map(m => m.name).join('、')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label htmlFor={`api-key-${provider.provider}`} className="sr-only">
                            API密钥
                          </Label>
                          <Input
                            id={`api-key-${provider.provider}`}
                            type="password"
                            placeholder={`输入${provider.name} API密钥`}
                            value={apiKeys[provider.provider] || ''}
                            onChange={(e) => handleApiKeyChange(provider.provider, e.target.value)}
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleSaveApiKey(provider.provider)}
                          disabled={!apiKeys[provider.provider]}
                        >
                          保存
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* 已配置的模型 */}
              {modelConfigs.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-4">已配置的模型</h3>
                  <div className="space-y-2">
                    {modelConfigs.map((config) => (
                      <div
                        key={config.id}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-lg border',
                          selectedModelId === config.id ? 'border-primary bg-primary/5' : ''
                        )}
                      >
                        <div>
                          <div className="font-medium text-sm">{config.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {config.provider} - {config.modelId}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={config.isDefault ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleSelectDefault(config.id)}
                          >
                            {config.isDefault ? '默认' : '设为默认'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDeleteConfig(config.id)}
                          >
                            删除
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* 编辑器设置 */}
            <TabsContent value="editor" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>字体大小</Label>
                  <Select
                    value={String(settings.editorFontSize)}
                    onValueChange={(value) => updateSettings({ editorFontSize: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14">14px</SelectItem>
                      <SelectItem value="16">16px</SelectItem>
                      <SelectItem value="18">18px</SelectItem>
                      <SelectItem value="20">20px</SelectItem>
                      <SelectItem value="22">22px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>自动保存间隔</Label>
                  <Select
                    value={String(settings.autoSaveInterval)}
                    onValueChange={(value) => updateSettings({ autoSaveInterval: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30秒</SelectItem>
                      <SelectItem value="60">1分钟</SelectItem>
                      <SelectItem value="120">2分钟</SelectItem>
                      <SelectItem value="300">5分钟</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>显示字数统计</Label>
                    <p className="text-xs text-muted-foreground">在编辑器底部显示当前字数</p>
                  </div>
                  <Button
                    variant={settings.showWordCount ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings({ showWordCount: !settings.showWordCount })}
                  >
                    {settings.showWordCount ? '开启' : '关闭'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>显示预计阅读时间</Label>
                    <p className="text-xs text-muted-foreground">基于当前字数估算阅读时间</p>
                  </div>
                  <Button
                    variant={settings.showReadingTime ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings({ showReadingTime: !settings.showReadingTime })}
                  >
                    {settings.showReadingTime ? '开启' : '关闭'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* 外观设置 */}
            <TabsContent value="appearance" className="space-y-6 mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>主题模式</Label>
                  <Select
                    value={theme}
                    onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">浅色模式</SelectItem>
                      <SelectItem value="dark">深色模式</SelectItem>
                      <SelectItem value="system">跟随系统</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4">
                  <button
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all',
                      theme === 'light' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted'
                    )}
                    onClick={() => setTheme('light')}
                  >
                    <div className="h-20 rounded bg-white border flex items-center justify-center text-foreground">
                      <Type className="h-8 w-8" />
                    </div>
                    <p className="text-sm mt-2 text-center">浅色</p>
                  </button>
                  
                  <button
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all',
                      theme === 'dark' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted'
                    )}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="h-20 rounded bg-gray-900 border flex items-center justify-center text-white">
                      <Type className="h-8 w-8" />
                    </div>
                    <p className="text-sm mt-2 text-center">深色</p>
                  </button>
                  
                  <button
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all',
                      theme === 'system' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted'
                    )}
                    onClick={() => setTheme('system')}
                  >
                    <div className="h-20 rounded bg-gradient-to-r from-white to-gray-900 border flex items-center justify-center">
                      <Type className="h-8 w-8" />
                    </div>
                    <p className="text-sm mt-2 text-center">跟随系统</p>
                  </button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </ScrollArea>
    </div>
  );
}
