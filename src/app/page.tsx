'use client';

import { useState, useCallback } from 'react';
import { useProjectStore } from '@/store/project-store';
import { useSettingsStore } from '@/store/settings-store';
import { Sidebar } from '@/components/sidebar/sidebar';
import { TiptapEditor } from '@/components/editor/tiptap-editor';
import { CharacterManager } from '@/components/bible/character-manager';
import { AiChat } from '@/components/chat/ai-chat';
import { SettingsPanel } from '@/components/settings/settings-panel';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { cn, countWords, estimateReadingTime } from '@/lib/utils';
import { generateWithAI, PROMPT_TEMPLATES } from '@/lib/ai-service';
import { BookOpen, Save, Loader2 } from 'lucide-react';

export default function HomePage() {
  const { 
    currentProject, 
    currentChapter, 
    characters,
    locations,
    updateCurrentChapter,
    updateChapterTitle,
    setDirty,
    editorState,
  } = useProjectStore();
  
  const { 
    rightPanelOpen, 
    toggleRightPanel, 
    settings,
    selectedModelId,
    modelConfigs,
  } = useSettingsStore();
  
  const [activePanel, setActivePanel] = useState<'editor' | 'bible' | 'chat' | 'settings'>('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleContentChange = useCallback((content: string) => {
    updateCurrentChapter(content);
  }, [updateCurrentChapter]);

  const handleSelectText = useCallback((text: string | null) => {
    setSelectedText(text);
  }, []);

  const handleAiAction = async (action: string, text: string) => {
    const selectedModel = modelConfigs.find(m => m.id === selectedModelId);
    
    if (!selectedModel) {
      alert('请先在设置中配置AI模型');
      return;
    }

    if (!currentChapter) {
      alert('请先选择一个章节');
      return;
    }

    setIsGenerating(true);

    try {
      let systemPrompt = PROMPT_TEMPLATES[action as keyof typeof PROMPT_TEMPLATES] || PROMPT_TEMPLATES.续写;
      
      // 添加角色上下文
      if (characters.length > 0) {
        systemPrompt += '\n\n【角色设定参考】\n';
        characters.forEach(char => {
          systemPrompt += `${char.name}（${char.role}）：${char.background?.slice(0, 100)}\n`;
        });
      }

      // 根据不同操作处理
      let userPrompt = '';
      let generatedContent = '';

      switch (action) {
        case 'continue':
          userPrompt = currentChapter.content.slice(-1000);
          break;
        case 'polish':
        case 'rewrite':
          userPrompt = text || currentChapter.content;
          break;
        default:
          userPrompt = text || '请继续这个故事...';
      }

      generatedContent = await generateWithAI(
        {
          modelId: selectedModel.modelId,
          provider: selectedModel.provider,
          temperature: 0.7,
          maxTokens: 2000,
          contextData: [...characters, ...locations],
        },
        systemPrompt,
        userPrompt
      );

      // 根据操作类型更新内容
      if (action === 'continue') {
        const newContent = currentChapter.content + '\n\n' + generatedContent;
        await updateCurrentChapter(newContent);
      } else if (action === 'polish') {
        // 润色：用生成的内容替换选中文本
        const newContent = currentChapter.content.replace(text, generatedContent);
        await updateCurrentChapter(newContent);
      } else if (action === 'rewrite') {
        // 改写：直接替换
        const newContent = currentChapter.content.replace(text, generatedContent);
        await updateCurrentChapter(newContent);
      }

    } catch (error) {
      console.error('AI生成失败:', error);
      alert(`AI生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!currentChapter) return;
    setIsSaving(true);
    // 实际保存已经在 updateCurrentChapter 中自动处理
    setTimeout(() => {
      setIsSaving(false);
      setDirty(false);
    }, 500);
  };

  const renderRightPanel = () => {
    switch (activePanel) {
      case 'bible':
        return <CharacterManager />;
      case 'chat':
        return <AiChat className="h-full" />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold">章节信息</h3>
            </div>
            <ScrollArea className="flex-1 p-4">
              {currentChapter ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">章节标题</label>
                    <Input
                      value={currentChapter.title}
                      onChange={(e) => updateChapterTitle(currentChapter.id, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">字数统计</label>
                    <p className="text-2xl font-bold mt-1">
                      {countWords(currentChapter.content)}
                    </p>
                  </div>
                  {settings.showReadingTime && (
                    <div>
                      <label className="text-sm text-muted-foreground">预计阅读时间</label>
                      <p className="text-2xl font-bold mt-1">
                        {estimateReadingTime(currentChapter.content)} 分钟
                      </p>
                    </div>
                  )}
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">快捷操作</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAiAction('continue', '')}
                        disabled={isGenerating}
                      >
                        {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4 mr-2" />}
                        AI续写
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAiAction('polish', selectedText || '')}
                        disabled={!selectedText || isGenerating}
                      >
                        润色选区
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAiAction('rewrite', selectedText || '')}
                        disabled={!selectedText || isGenerating}
                      >
                        改写选区
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  请选择一个章节开始创作
                </div>
              )}
            </ScrollArea>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* 顶部标题栏 */}
      <header className="h-14 border-b flex items-center justify-between px-4 bg-card">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            小说工坊
          </h1>
          {currentProject && (
            <span className="text-muted-foreground">/ {currentProject.name}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {editorState.isDirty && (
            <span className="text-xs text-muted-foreground">未保存</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !editorState.isDirty}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            保存
          </Button>
        </div>
      </header>

      {/* 主体内容 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧边栏 */}
        <Sidebar
          onOpenSettings={() => {
            setActivePanel('settings');
          }}
          onOpenBible={() => {
            setActivePanel('bible');
          }}
          onOpenChat={() => {
            setActivePanel('chat');
          }}
        />

        {/* 中间编辑区 */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {currentProject ? (
            currentChapter ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* 面板切换按钮 */}
                <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
                  <Button
                    variant={activePanel === 'editor' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActivePanel('editor')}
                  >
                    编辑器
                  </Button>
                  <Button
                    variant={activePanel === 'bible' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActivePanel('bible')}
                  >
                    角色设定
                  </Button>
                  <Button
                    variant={activePanel === 'chat' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setActivePanel('chat')}
                  >
                    AI助手
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleRightPanel}
                    className={cn(rightPanelOpen ? 'bg-muted' : '')}
                  >
                    {rightPanelOpen ? '隐藏面板' : '显示面板'}
                  </Button>
                </div>

                {/* 内容区域 */}
                <div className="flex-1 flex overflow-hidden">
                  {/* 编辑器 */}
                  <div className={cn('flex-1 overflow-hidden', rightPanelOpen ? 'border-r' : '')}>
                    <TiptapEditor
                      content={currentChapter.content}
                      onChange={handleContentChange}
                      onSelectText={handleSelectText}
                      onAiAction={handleAiAction}
                      placeholder="开始创作你的故事..."
                    />
                  </div>

                  {/* 右侧面板 */}
                  {rightPanelOpen && (
                    <aside className="w-80 border-l bg-card overflow-hidden flex flex-col">
                      {renderRightPanel()}
                    </aside>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">欢迎使用小说工坊</h2>
                  <p className="text-muted-foreground mb-4">
                    {currentProject.name} 尚未创建章节
                  </p>
                  <p className="text-sm text-muted-foreground">
                    请在左侧边栏点击「新建章节」开始创作
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">欢迎使用小说工坊</h2>
                <p className="text-muted-foreground mb-4">
                  集成多个AI模型的智能小说创作平台
                </p>
                <p className="text-sm text-muted-foreground">
                  请在左侧边栏创建新项目开始使用
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
