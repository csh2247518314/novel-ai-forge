'use client';

import { useState, useEffect } from 'react';
import { useProjectStore } from '@/store/project-store';
import { useSettingsStore } from '@/store/settings-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  BookOpen,
  Plus,
  FileText,
  FolderOpen,
  Settings,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit2,
  Sparkles,
  Users,
  Map,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/utils';

interface SidebarProps {
  onOpenSettings: () => void;
  onOpenBible: () => void;
  onOpenChat: () => void;
}

export function Sidebar({ onOpenSettings, onOpenBible, onOpenChat }: SidebarProps) {
  const { 
    projects, 
    currentProject, 
    chapters, 
    currentChapter,
    selectProject, 
    selectChapter,
    createNewProject,
    createNewChapter,
    deleteChapter,
    loadProjects,
  } = useProjectStore();
  
  const { sidebarOpen, toggleSidebar, activeTab, setActiveTab } = useSettingsStore();
  
  const [isChaptersExpanded, setIsChaptersExpanded] = useState(true);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [newProjectName, setNewProjectName] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCreateChapterOpen, setIsCreateChapterOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    await createNewProject(newProjectName.trim());
    setNewProjectName('');
    setIsCreateProjectOpen(false);
  };

  const handleCreateChapter = async () => {
    if (!newChapterTitle.trim()) return;
    await createNewChapter(newChapterTitle.trim());
    setNewChapterTitle('');
    setIsCreateChapterOpen(false);
  };

  const handleSelectChapter = async (chapterId: string) => {
    await selectChapter(chapterId);
    setActiveTab('editor');
  };

  return (
    <aside
      className={cn(
        'h-screen bg-card border-r flex flex-col transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-0 border-r-0'
      )}
    >
      {/* 项目选择器 */}
      <div className="p-4 border-b">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
        >
          {isProjectsExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <BookOpen className="h-4 w-4" />
          <span className="font-medium">项目</span>
        </div>
        
        {isProjectsExpanded && (
          <div className="mt-3 space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className={cn(
                  'px-3 py-2 rounded-md cursor-pointer text-sm transition-colors',
                  currentProject?.id === project.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
                onClick={() => selectProject(project.id)}
              >
                {project.name}
              </div>
            ))}
            
            <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <Plus className="h-4 w-4" />
                  新建项目
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建项目</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="项目名称"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateProjectOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleCreateProject}>创建</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* 章节列表 */}
      {currentProject && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setIsChaptersExpanded(!isChaptersExpanded)}
            >
              {isChaptersExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <FileText className="h-4 w-4" />
              <span className="font-medium">章节</span>
            </div>
            
            {isChaptersExpanded && (
              <div className="mt-3 space-y-2">
                <ScrollArea className="h-[200px]">
                  {chapters.map((chapter, index) => (
                    <div
                      key={chapter.id}
                      className={cn(
                        'group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm transition-colors hover:bg-muted',
                        currentChapter?.id === chapter.id
                          ? 'bg-primary/10 text-primary'
                          : ''
                      )}
                      onClick={() => handleSelectChapter(chapter.id)}
                    >
                      <span className="text-muted-foreground text-xs">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 truncate">{chapter.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChapter(chapter.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
                
                <Dialog open={isCreateChapterOpen} onOpenChange={setIsCreateChapterOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <Plus className="h-4 w-4" />
                      新建章节
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>新建章节</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <Input
                        placeholder="章节标题"
                        value={newChapterTitle}
                        onChange={(e) => setNewChapterTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateChapter()}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateChapterOpen(false)}>
                        取消
                      </Button>
                      <Button onClick={handleCreateChapter}>创建</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {/* 作品圣经快捷入口 */}
          <div className="p-4 border-b">
            <Button
              variant={activeTab === 'bible' ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2"
              onClick={onOpenBible}
            >
              <Users className="h-4 w-4" />
              角色设定
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => {/* 打开地点管理 */}}
            >
              <Map className="h-4 w-4" />
              地点设定
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => {/* 打开物品管理 */}}
            >
              <Package className="h-4 w-4" />
              物品设定
            </Button>
          </div>

          {/* AI助手快捷入口 */}
          <div className="p-4 border-b">
            <Button
              variant={activeTab === 'chat' ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2"
              onClick={onOpenChat}
            >
              <Sparkles className="h-4 w-4" />
              AI助手
            </Button>
          </div>

          {/* 底部设置 */}
          <div className="p-4 mt-auto">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={onOpenSettings}
            >
              <Settings className="h-4 w-4" />
              设置
            </Button>
          </div>
        </div>
      )}

      {/* 没有项目时的状态 */}
      {!currentProject && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">选择一个项目或创建新项目</p>
            <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  新建项目
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建项目</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="项目名称"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateProjectOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleCreateProject}>创建</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </aside>
  );
}
