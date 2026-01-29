import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Project, 
  Chapter, 
  Character, 
  Location, 
  Item, 
  WorldSetting,
  ChatSession,
  ChatMessage,
  EditorState 
} from '@/types';
import { generateId } from '@/lib/utils';
import {
  createProject,
  getProject,
  getAllProjects,
  updateProject as dbUpdateProject,
  deleteProject as dbDeleteProject,
  createChapter,
  getChaptersByProject,
  getChapter,
  updateChapter as dbUpdateChapter,
  deleteChapter as dbDeleteChapter,
  createCharacter,
  getCharactersByProject,
  updateCharacter as dbUpdateCharacter,
  deleteCharacter as dbDeleteCharacter,
  createLocation,
  getLocationsByProject,
  updateLocation as dbUpdateLocation,
  deleteLocation as dbDeleteLocation,
  createItem,
  getItemsByProject,
  updateItem as dbUpdateItem,
  deleteItem as dbDeleteItem,
  createWorldSetting,
  getWorldSettingsByProject,
  updateWorldSetting as dbUpdateWorldSetting,
  deleteWorldSetting as dbDeleteWorldSetting,
  createChatSession,
  getChatSessionsByProject,
  updateChatSession as dbUpdateChatSession,
} from '@/lib/db';

interface ProjectState {
  // 项目列表
  projects: Project[];
  currentProject: Project | null;
  
  // 章节
  chapters: Chapter[];
  currentChapter: Chapter | null;
  
  // 作品圣经
  characters: Character[];
  locations: Location[];
  items: Item[];
  worldSettings: WorldSetting[];
  
  // 聊天
  chatSessions: ChatSession[];
  currentChatSession: ChatSession | null;
  
  // 编辑器状态
  editorState: EditorState;
  
  // 加载状态
  isLoading: boolean;
  error: string | null;
  
  // 项目操作
  loadProjects: () => Promise<void>;
  selectProject: (projectId: string) => Promise<void>;
  createNewProject: (name: string, description?: string) => Promise<Project>;
  updateCurrentProject: (updates: Partial<Project>) => Promise<void>;
  deleteCurrentProject: () => Promise<void>;
  
  // 章节操作
  loadChapters: (projectId: string) => Promise<void>;
  selectChapter: (chapterId: string) => Promise<void>;
  createNewChapter: (title: string) => Promise<Chapter>;
  updateCurrentChapter: (content: string) => Promise<void>;
  updateChapterTitle: (chapterId: string, title: string) => Promise<void>;
  deleteChapter: (chapterId: string) => Promise<void>;
  reorderChapters: (chapters: Chapter[]) => Promise<void>;
  
  // 角色操作
  loadCharacters: (projectId: string) => Promise<void>;
  createCharacter: (data: Omit<Character, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => Promise<Character>;
  updateCharacter: (character: Character) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  
  // 地点操作
  loadLocations: (projectId: string) => Promise<void>;
  createLocation: (data: Omit<Location, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => Promise<Location>;
  updateLocation: (location: Location) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  
  // 物品操作
  loadItems: (projectId: string) => Promise<void>;
  createItem: (data: Omit<Item, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => Promise<Item>;
  updateItem: (item: Item) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  
  // 世界观设定操作
  loadWorldSettings: (projectId: string) => Promise<void>;
  createWorldSetting: (data: Omit<WorldSetting, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => Promise<WorldSetting>;
  updateWorldSetting: (setting: WorldSetting) => Promise<void>;
  deleteWorldSetting: (id: string) => Promise<void>;
  
  // 聊天操作
  loadChatSessions: (projectId: string) => Promise<void>;
  selectChatSession: (sessionId: string) => void;
  createChatSession: (title: string) => Promise<ChatSession>;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearCurrentChat: () => void;
  
  // 编辑器状态操作
  setDirty: (isDirty: boolean) => void;
  setSelectedText: (text: string | null) => void;
  
  // 错误处理
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      // 初始状态
      projects: [],
      currentProject: null,
      chapters: [],
      currentChapter: null,
      characters: [],
      locations: [],
      items: [],
      worldSettings: [],
      chatSessions: [],
      currentChatSession: null,
      editorState: {
        currentProjectId: null,
        currentChapterId: null,
        isDirty: false,
        lastSaved: null,
        selectedText: null,
      },
      isLoading: false,
      error: null,

      // 加载所有项目
      loadProjects: async () => {
        set({ isLoading: true });
        try {
          const projects = await getAllProjects();
          set({ projects, isLoading: false });
        } catch (error) {
          set({ error: '加载项目列表失败', isLoading: false });
        }
      },

      // 选择项目
      selectProject: async (projectId: string) => {
        set({ isLoading: true });
        try {
          const project = await getProject(projectId);
          if (project) {
            set({ 
              currentProject: project,
              editorState: { ...get().editorState, currentProjectId: projectId },
            });
            // 加载相关数据
            await get().loadChapters(projectId);
            await get().loadCharacters(projectId);
            await get().loadLocations(projectId);
            await get().loadItems(projectId);
            await get().loadWorldSettings(projectId);
            await get().loadChatSessions(projectId);
          }
          set({ isLoading: false });
        } catch (error) {
          set({ error: '加载项目失败', isLoading: false });
        }
      },

      // 创建新项目
      createNewProject: async (name: string, description?: string) => {
        const project: Project = {
          id: generateId(),
          name,
          description,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await createProject(project);
        set(state => ({ projects: [...state.projects, project] }));
        return project;
      },

      // 更新当前项目
      updateCurrentProject: async (updates: Partial<Project>) => {
        const current = get().currentProject;
        if (!current) return;
        
        const updated = { ...current, ...updates, updatedAt: new Date() };
        await dbUpdateProject(updated);
        set({ currentProject: updated });
        set(state => ({
          projects: state.projects.map(p => p.id === updated.id ? updated : p),
        }));
      },

      // 删除当前项目
      deleteCurrentProject: async () => {
        const current = get().currentProject;
        if (!current) return;
        
        await dbDeleteProject(current.id);
        set({
          currentProject: null,
          chapters: [],
          currentChapter: null,
          characters: [],
          locations: [],
          items: [],
          worldSettings: [],
          chatSessions: [],
          currentChatSession: null,
        });
        await get().loadProjects();
      },

      // 加载章节列表
      loadChapters: async (projectId: string) => {
        try {
          const chapters = await getChaptersByProject(projectId);
          set({ chapters });
        } catch (error) {
          set({ error: '加载章节失败' });
        }
      },

      // 选择章节
      selectChapter: async (chapterId: string) => {
        try {
          const chapter = await getChapter(chapterId);
          set({
            currentChapter: chapter,
            editorState: { ...get().editorState, currentChapterId: chapterId, isDirty: false },
          });
        } catch (error) {
          set({ error: '加载章节失败' });
        }
      },

      // 创建新章节
      createNewChapter: async (title: string) => {
        const project = get().currentProject;
        if (!project) throw new Error('未选择项目');
        
        const chapters = get().chapters;
        const order = chapters.length;
        
        const chapter: Chapter = {
          id: generateId(),
          projectId: project.id,
          title,
          content: '',
          order,
          wordCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await createChapter(chapter);
        set(state => ({ chapters: [...state.chapters, chapter] }));
        return chapter;
      },

      // 更新当前章节内容
      updateCurrentChapter: async (content: string) => {
        const current = get().currentChapter;
        if (!current) return;
        
        const updated = { 
          ...current, 
          content, 
          wordCount: content.length,
          updatedAt: new Date() 
        };
        await dbUpdateChapter(updated);
        set({
          currentChapter: updated,
          editorState: { ...get().editorState, isDirty: true },
        });
      },

      // 更新章节标题
      updateChapterTitle: async (chapterId: string, title: string) => {
        const chapter = get().chapters.find(c => c.id === chapterId);
        if (!chapter) return;
        
        const updated = { ...chapter, title, updatedAt: new Date() };
        await dbUpdateChapter(updated);
        set(state => ({
          chapters: state.chapters.map(c => c.id === chapterId ? updated : c),
          currentChapter: state.currentChapter?.id === chapterId ? updated : state.currentChapter,
        }));
      },

      // 删除章节
      deleteChapter: async (chapterId: string) => {
        await dbDeleteChapter(chapterId);
        set(state => ({
          chapters: state.chapters.filter(c => c.id !== chapterId),
          currentChapter: state.currentChapter?.id === chapterId ? null : state.currentChapter,
        }));
      },

      // 重新排序章节
      reorderChapters: async (chapters: Chapter[]) => {
        for (let i = 0; i < chapters.length; i++) {
          const chapter = chapters[i];
          if (chapter.order !== i) {
            await dbUpdateChapter({ ...chapter, order: i });
          }
        }
        set({ chapters });
      },

      // 加载角色列表
      loadCharacters: async (projectId: string) => {
        try {
          const characters = await getCharactersByProject(projectId);
          set({ characters });
        } catch (error) {
          set({ error: '加载角色列表失败' });
        }
      },

      // 创建角色
      createCharacter: async (data) => {
        const project = get().currentProject;
        if (!project) throw new Error('未选择项目');
        
        const character: Character = {
          ...data,
          id: generateId(),
          projectId: project.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await createCharacter(character);
        set(state => ({ characters: [...state.characters, character] }));
        return character;
      },

      // 更新角色
      updateCharacter: async (character: Character) => {
        const updated = { ...character, updatedAt: new Date() };
        await dbUpdateCharacter(updated);
        set(state => ({
          characters: state.characters.map(c => c.id === updated.id ? updated : c),
        }));
      },

      // 删除角色
      deleteCharacter: async (id: string) => {
        await dbDeleteCharacter(id);
        set(state => ({
          characters: state.characters.filter(c => c.id !== id),
        }));
      },

      // 加载地点列表
      loadLocations: async (projectId: string) => {
        try {
          const locations = await getLocationsByProject(projectId);
          set({ locations });
        } catch (error) {
          set({ error: '加载地点列表失败' });
        }
      },

      // 创建地点
      createLocation: async (data) => {
        const project = get().currentProject;
        if (!project) throw new Error('未选择项目');
        
        const location: Location = {
          ...data,
          id: generateId(),
          projectId: project.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await createLocation(location);
        set(state => ({ locations: [...state.locations, location] }));
        return location;
      },

      // 更新地点
      updateLocation: async (location: Location) => {
        const updated = { ...location, updatedAt: new Date() };
        await dbUpdateLocation(updated);
        set(state => ({
          locations: state.locations.map(l => l.id === updated.id ? updated : l),
        }));
      },

      // 删除地点
      deleteLocation: async (id: string) => {
        await dbDeleteLocation(id);
        set(state => ({
          locations: state.locations.filter(l => l.id !== id),
        }));
      },

      // 加载物品列表
      loadItems: async (projectId: string) => {
        try {
          const items = await getItemsByProject(projectId);
          set({ items });
        } catch (error) {
          set({ error: '加载物品列表失败' });
        }
      },

      // 创建物品
      createItem: async (data) => {
        const project = get().currentProject;
        if (!project) throw new Error('未选择项目');
        
        const item: Item = {
          ...data,
          id: generateId(),
          projectId: project.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await createItem(item);
        set(state => ({ items: [...state.items, item] }));
        return item;
      },

      // 更新物品
      updateItem: async (item: Item) => {
        const updated = { ...item, updatedAt: new Date() };
        await dbUpdateItem(updated);
        set(state => ({
          items: state.items.map(i => i.id === updated.id ? updated : i),
        }));
      },

      // 删除物品
      deleteItem: async (id: string) => {
        await dbDeleteItem(id);
        set(state => ({
          items: state.items.filter(i => i.id !== id),
        }));
      },

      // 加载世界观设定
      loadWorldSettings: async (projectId: string) => {
        try {
          const worldSettings = await getWorldSettingsByProject(projectId);
          set({ worldSettings });
        } catch (error) {
          set({ error: '加载世界观设定失败' });
        }
      },

      // 创建世界观设定
      createWorldSetting: async (data) => {
        const project = get().currentProject;
        if (!project) throw new Error('未选择项目');
        
        const setting: WorldSetting = {
          ...data,
          id: generateId(),
          projectId: project.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await createWorldSetting(setting);
        set(state => ({ worldSettings: [...state.worldSettings, setting] }));
        return setting;
      },

      // 更新世界观设定
      updateWorldSetting: async (setting: WorldSetting) => {
        const updated = { ...setting, updatedAt: new Date() };
        await dbUpdateWorldSetting(updated);
        set(state => ({
          worldSettings: state.worldSettings.map(s => s.id === updated.id ? updated : s),
        }));
      },

      // 删除世界观设定
      deleteWorldSetting: async (id: string) => {
        await dbDeleteWorldSetting(id);
        set(state => ({
          worldSettings: state.worldSettings.filter(s => s.id !== id),
        }));
      },

      // 加载聊天会话
      loadChatSessions: async (projectId: string) => {
        try {
          const chatSessions = await getChatSessionsByProject(projectId);
          set({ chatSessions });
        } catch (error) {
          set({ error: '加载聊天会话失败' });
        }
      },

      // 选择聊天会话
      selectChatSession: (sessionId: string) => {
        const session = get().chatSessions.find(s => s.id === sessionId);
        set({ currentChatSession: session || null });
      },

      // 创建聊天会话
      createChatSession: async (title: string) => {
        const project = get().currentProject;
        if (!project) throw new Error('未选择项目');
        
        const session: ChatSession = {
          id: generateId(),
          projectId: project.id,
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        await createChatSession(session);
        set(state => ({ 
          chatSessions: [...state.chatSessions, session],
          currentChatSession: session,
        }));
        return session;
      },

      // 添加聊天消息
      addChatMessage: async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const current = get().currentChatSession;
        if (!current) return;
        
        const newMessage: ChatMessage = {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        };
        
        const updated = {
          ...current,
          messages: [...current.messages, newMessage],
          updatedAt: new Date(),
        };
        
        await dbUpdateChatSession(updated);
        set(state => ({
          chatSessions: state.chatSessions.map(s => s.id === updated.id ? updated : s),
          currentChatSession: updated,
        }));
      },

      // 清空当前聊天
      clearCurrentChat: () => {
        const current = get().currentChatSession;
        if (!current) return;
        
        const updated = { ...current, messages: [], updatedAt: new Date() };
        set(state => ({
          chatSessions: state.chatSessions.map(s => s.id === updated.id ? updated : s),
          currentChatSession: updated,
        }));
      },

      // 设置脏标记
      setDirty: (isDirty: boolean) => {
        set(state => ({
          editorState: { ...state.editorState, isDirty },
        }));
      },

      // 设置选中文本
      setSelectedText: (text: string | null) => {
        set(state => ({
          editorState: { ...state.editorState, selectedText: text },
        }));
      },

      // 设置错误
      setError: (error: string | null) => {
        set({ error });
      },

      // 清除错误
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'novel-forge-storage',
      partialize: (state) => ({
        // 只持久化必要的状态
      }),
    }
  )
);
