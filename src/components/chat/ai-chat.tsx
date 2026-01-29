'use client';

import { useState, useRef, useEffect } from 'react';
import { useProjectStore } from '@/store/project-store';
import { useSettingsStore } from '@/store/settings-store';
import { generateWithAI, PROMPT_TEMPLATES } from '@/lib/ai-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Sparkles, Send, User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/types';

interface AiChatProps {
  className?: string;
}

export function AiChat({ className }: AiChatProps) {
  const { 
    currentProject, 
    currentChatSession,
    characters,
    locations,
    addChatMessage,
    createChatSession,
  } = useProjectStore();
  
  const { modelConfigs, selectedModelId, selectModel } = useSettingsStore();
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');
  const scrollRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentChatSession?.messages]);

  // 如果没有聊天会话，创建一个
  useEffect(() => {
    if (currentProject && !currentChatSession) {
      createChatSession('新对话');
    }
  }, [currentProject, currentChatSession, createChatSession]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !currentChatSession) return;

    const userMessage = input.trim();
    setInput('');

    // 添加用户消息
    addChatMessage({
      role: 'user',
      content: userMessage,
    });

    // 构建上下文
    const contextData = [...characters, ...locations];
    const selectedModel = modelConfigs.find(m => m.id === selectedModelId);

    if (!selectedModel) {
      addChatMessage({
        role: 'assistant',
        content: '请先在设置中配置AI模型。',
      });
      return;
    }

    setIsLoading(true);

    try {
      // 构建系统提示词
      let systemPrompt = `你是一位专业的小说创作助手，正在帮助用户创作小说。项目名称：${currentProject?.name || '未命名项目'}。`;

      if (contextData.length > 0) {
        systemPrompt += '\n\n以下是作品中已设定的角色和地点信息：';
        contextData.forEach(entity => {
          if ('role' in entity) {
            systemPrompt += `\n- ${entity.name}（${entity.role}）: ${entity.background?.slice(0, 100)}`;
          } else if ('type' in entity) {
            systemPrompt += `\n- ${entity.name}（${entity.type}）: ${entity.description?.slice(0, 100)}`;
          }
        });
      }

      // 添加当前章节内容（如果有）
      const { currentChapter } = useProjectStore.getState();
      if (currentChapter?.content) {
        systemPrompt += `\n\n当前正在创作的章节内容：${currentChapter.content.slice(-500)}`;
      }

      // 根据选择的模板构建用户提示词
      let userPrompt = userMessage;
      if (selectedTemplate !== 'custom' && PROMPT_TEMPLATES[selectedTemplate as keyof typeof PROMPT_TEMPLATES]) {
        userPrompt = PROMPT_TEMPLATES[selectedTemplate as keyof typeof PROMPT_TEMPLATES] + '\n\n' + userMessage;
      }

      // 调用AI
      const response = await generateWithAI(
        {
          modelId: selectedModel.modelId,
          provider: selectedModel.provider,
          temperature: 0.7,
          maxTokens: 2000,
          contextData: contextData,
        },
        systemPrompt,
        userPrompt
      );

      addChatMessage({
        role: 'assistant',
        content: response,
        modelUsed: selectedModel.name,
      });
    } catch (error) {
      addChatMessage({
        role: 'assistant',
        content: `抱歉，发生了错误：${error instanceof Error ? error.message : '未知错误'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* 头部 */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI创作助手
          </h2>
        </div>

        {/* 模型选择 */}
        <Select value={selectedModelId || ''} onValueChange={selectModel}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择AI模型" />
          </SelectTrigger>
          <SelectContent>
            {modelConfigs.map((config) => (
              <SelectItem key={config.id} value={config.id}>
                {config.name} - {config.provider}
              </SelectItem>
            ))}
            {modelConfigs.length === 0 && (
              <div className="p-2 text-sm text-muted-foreground text-center">
                请在设置中配置API密钥
              </div>
            )}
          </SelectContent>
        </Select>

        {/* 快捷模板 */}
        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="选择任务类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">自定义对话</SelectItem>
            <SelectItem value="continue">续写</SelectItem>
            <SelectItem value="polish">润色</SelectItem>
            <SelectItem value="rewrite">改写</SelectItem>
            <SelectItem value="dialogue">对话生成</SelectItem>
            <SelectItem value="scene">场景描写</SelectItem>
            <SelectItem value="plot">情节发展</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 聊天消息区域 */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {!currentChatSession || currentChatSession.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium">开始与AI助手对话</p>
              <p className="text-sm text-muted-foreground mt-1">
                可以讨论情节、生成对话、续写内容等
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {currentChatSession.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLoading={isLoading}
              />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">AI正在思考...</span>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* 输入区域 */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题或请求..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, isLoading }: { message: ChatMessage; isLoading: boolean }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={isUser ? 'bg-primary' : 'bg-primary/20'}>
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-2 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        {message.modelUsed && !isUser && (
          <div className="mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
            via {message.modelUsed}
          </div>
        )}
      </div>
    </div>
  );
}
