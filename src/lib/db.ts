import PouchDB from 'pouchdb';
import { Project, Chapter, Character, Location, Item, WorldSetting, ChatSession } from '@/types';

// 本地数据库实例
let projectDb: PouchDB.Database | null = null;
let chapterDb: PouchDB.Database | null = null;
let characterDb: PouchDB.Database | null = null;
let locationDb: PouchDB.Database | null = null;
let itemDb: PouchDB.Database | null = null;
let worldSettingDb: PouchDB.Database | null = null;
let chatDb: PouchDB.Database | null = null;

// 初始化数据库
export function initDatabases(): void {
  if (typeof window === 'undefined') return;

  try {
    projectDb = new PouchDB('novel-forge-projects', { adapter: 'idb' });
    chapterDb = new PouchDB('novel-forge-chapters', { adapter: 'idb' });
    characterDb = new PouchDB('novel-forge-characters', { adapter: 'idb' });
    locationDb = new PouchDB('novel-forge-locations', { adapter: 'idb' });
    itemDb = new PouchDB('novel-forge-items', { adapter: 'idb' });
    worldSettingDb = new PouchDB('novel-forge-world-settings', { adapter: 'idb' });
    chatDb = new PouchDB('novel-forge-chats', { adapter: 'idb' });
    
    console.log('数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
}

// 获取数据库实例
export function getProjectDb(): PouchDB.Database | null {
  return projectDb;
}

export function getChapterDb(): PouchDB.Database | null {
  return chapterDb;
}

export function getCharacterDb(): PouchDB.Database | null {
  return characterDb;
}

export function getLocationDb(): PouchDB.Database | null {
  return locationDb;
}

export function getItemDb(): PouchDB.Database | null {
  return itemDb;
}

export function getWorldSettingDb(): PouchDB.Database | null {
  return worldSettingDb;
}

export function getChatDb(): PouchDB.Database | null {
  return chatDb;
}

// 项目操作
export async function createProject(project: Project): Promise<Project> {
  if (!projectDb) throw new Error('数据库未初始化');
  await projectDb.put({ ...project, _id: project.id });
  return project;
}

export async function getProject(id: string): Promise<Project | null> {
  if (!projectDb) throw new Error('数据库未初始化');
  const doc = await projectDb.get(id);
  return doc as unknown as Project;
}

export async function getAllProjects(): Promise<Project[]> {
  if (!projectDb) throw new Error('数据库未初始化');
  const result = await projectDb.allDocs({ include_docs: true });
  return result.rows
    .map(row => (row.doc as unknown as Project & { _id?: string }))
    .filter(doc => !doc._id?.startsWith('_design'));
}

export async function updateProject(project: Project): Promise<Project> {
  if (!projectDb) throw new Error('数据库未初始化');
  await projectDb.put({ ...project, _id: project.id, _rev: (await projectDb.get(project.id))._rev });
  return project;
}

export async function deleteProject(id: string): Promise<void> {
  if (!projectDb) throw new Error('数据库未初始化');
  const doc = await projectDb.get(id);
  await projectDb.remove(doc);
}

// 章节操作
export async function createChapter(chapter: Chapter): Promise<Chapter> {
  if (!chapterDb) throw new Error('数据库未初始化');
  await chapterDb.put({ ...chapter, _id: chapter.id });
  return chapter;
}

export async function getChapter(id: string): Promise<Chapter | null> {
  if (!chapterDb) throw new Error('数据库未初始化');
  try {
    const doc = await chapterDb.get(id);
    return doc as unknown as Chapter;
  } catch {
    return null;
  }
}

export async function getChaptersByProject(projectId: string): Promise<Chapter[]> {
  if (!chapterDb) throw new Error('数据库未初始化');
  const result = await chapterDb.allDocs({ include_docs: true });
  return result.rows
    .map(row => (row.doc as unknown as Chapter & { _id?: string }))
    .filter(doc => doc.projectId === projectId && !doc._id?.startsWith('_design'))
    .sort((a, b) => a.order - b.order);
}

export async function updateChapter(chapter: Chapter): Promise<Chapter> {
  if (!chapterDb) throw new Error('数据库未初始化');
  const existing = await chapterDb.get(chapter.id);
  await chapterDb.put({ ...chapter, _id: chapter.id, _rev: existing._rev });
  return chapter;
}

export async function deleteChapter(id: string): Promise<void> {
  if (!chapterDb) throw new Error('数据库未初始化');
  const doc = await chapterDb.get(id);
  await chapterDb.remove(doc);
}

// 角色操作
export async function createCharacter(character: Character): Promise<Character> {
  if (!characterDb) throw new Error('数据库未初始化');
  await characterDb.put({ ...character, _id: character.id });
  return character;
}

export async function getCharacter(id: string): Promise<Character | null> {
  if (!characterDb) throw new Error('数据库未初始化');
  try {
    const doc = await characterDb.get(id);
    return doc as unknown as Character;
  } catch {
    return null;
  }
}

export async function getCharactersByProject(projectId: string): Promise<Character[]> {
  if (!characterDb) throw new Error('数据库未初始化');
  const result = await characterDb.allDocs({ include_docs: true });
  return result.rows
    .map(row => (row.doc as unknown as Character & { _id?: string }))
    .filter(doc => doc.projectId === projectId && !doc._id?.startsWith('_design'));
}

export async function updateCharacter(character: Character): Promise<Character> {
  if (!characterDb) throw new Error('数据库未初始化');
  const existing = await characterDb.get(character.id);
  await characterDb.put({ ...character, _id: character.id, _rev: existing._rev });
  return character;
}

export async function deleteCharacter(id: string): Promise<void> {
  if (!characterDb) throw new Error('数据库未初始化');
  const doc = await characterDb.get(id);
  await characterDb.remove(doc);
}

// 地点操作
export async function createLocation(location: Location): Promise<Location> {
  if (!locationDb) throw new Error('数据库未初始化');
  await locationDb.put({ ...location, _id: location.id });
  return location;
}

export async function getLocationsByProject(projectId: string): Promise<Location[]> {
  if (!locationDb) throw new Error('数据库未初始化');
  const result = await locationDb.allDocs({ include_docs: true });
  return result.rows
    .map(row => (row.doc as unknown as Location & { _id?: string }))
    .filter(doc => doc.projectId === projectId && !doc._id?.startsWith('_design'));
}

export async function updateLocation(location: Location): Promise<Location> {
  if (!locationDb) throw new Error('数据库未初始化');
  const existing = await locationDb.get(location.id);
  await locationDb.put({ ...location, _id: location.id, _rev: existing._rev });
  return location;
}

export async function deleteLocation(id: string): Promise<void> {
  if (!locationDb) throw new Error('数据库未初始化');
  const doc = await locationDb.get(id);
  await locationDb.remove(doc);
}

// 物品操作
export async function createItem(item: Item): Promise<Item> {
  if (!itemDb) throw new Error('数据库未初始化');
  await itemDb.put({ ...item, _id: item.id });
  return item;
}

export async function getItemsByProject(projectId: string): Promise<Item[]> {
  if (!itemDb) throw new Error('数据库未初始化');
  const result = await itemDb.allDocs({ include_docs: true });
  return result.rows
    .map(row => (row.doc as unknown as Item & { _id?: string }))
    .filter(doc => doc.projectId === projectId && !doc._id?.startsWith('_design'));
}

export async function updateItem(item: Item): Promise<Item> {
  if (!itemDb) throw new Error('数据库未初始化');
  const existing = await itemDb.get(item.id);
  await itemDb.put({ ...item, _id: item.id, _rev: existing._rev });
  return item;
}

export async function deleteItem(id: string): Promise<void> {
  if (!itemDb) throw new Error('数据库未初始化');
  const doc = await itemDb.get(id);
  await itemDb.remove(doc);
}

// 世界观设定操作
export async function createWorldSetting(setting: WorldSetting): Promise<WorldSetting> {
  if (!worldSettingDb) throw new Error('数据库未初始化');
  await worldSettingDb.put({ ...setting, _id: setting.id });
  return setting;
}

export async function getWorldSettingsByProject(projectId: string): Promise<WorldSetting[]> {
  if (!worldSettingDb) throw new Error('数据库未初始化');
  const result = await worldSettingDb.allDocs({ include_docs: true });
  return result.rows
    .map(row => (row.doc as unknown as WorldSetting & { _id?: string }))
    .filter(doc => doc.projectId === projectId && !doc._id?.startsWith('_design'));
}

export async function updateWorldSetting(setting: WorldSetting): Promise<WorldSetting> {
  if (!worldSettingDb) throw new Error('数据库未初始化');
  const existing = await worldSettingDb.get(setting.id);
  await worldSettingDb.put({ ...setting, _id: setting.id, _rev: existing._rev });
  return setting;
}

export async function deleteWorldSetting(id: string): Promise<void> {
  if (!worldSettingDb) throw new Error('数据库未初始化');
  const doc = await worldSettingDb.get(id);
  await worldSettingDb.remove(doc);
}

// 聊天操作
export async function createChatSession(session: ChatSession): Promise<ChatSession> {
  if (!chatDb) throw new Error('数据库未初始化');
  await chatDb.put({ ...session, _id: session.id });
  return session;
}

export async function getChatSessionsByProject(projectId: string): Promise<ChatSession[]> {
  if (!chatDb) throw new Error('数据库未初始化');
  const result = await chatDb.allDocs({ include_docs: true });
  return result.rows
    .map(row => (row.doc as unknown as ChatSession & { _id?: string }))
    .filter(doc => doc.projectId === projectId && !doc._id?.startsWith('_design'));
}

export async function updateChatSession(session: ChatSession): Promise<ChatSession> {
  if (!chatDb) throw new Error('数据库未初始化');
  const existing = await chatDb.get(session.id);
  await chatDb.put({ ...session, _id: session.id, _rev: existing._rev });
  return session;
}

// 导出项目数据
export async function exportProjectData(projectId: string): Promise<{
  project: Project;
  chapters: Chapter[];
  characters: Character[];
  locations: Location[];
  items: Item[];
  worldSettings: WorldSetting[];
}> {
  const [project, chapters, characters, locations, items, worldSettings] = await Promise.all([
    getProject(projectId),
    getChaptersByProject(projectId),
    getCharactersByProject(projectId),
    getLocationsByProject(projectId),
    getItemsByProject(projectId),
    getWorldSettingsByProject(projectId),
  ]);

  if (!project) throw new Error('项目不存在');

  return {
    project,
    chapters,
    characters,
    locations,
    items,
    worldSettings,
  };
}

// 导入项目数据
export async function importProjectData(data: {
  project: Project;
  chapters: Chapter[];
  characters: Character[];
  locations: Location[];
  items: Item[];
  worldSettings: WorldSetting[];
}): Promise<void> {
  const { project, chapters, characters, locations, items, worldSettings } = data;

  await createProject(project);

  for (const chapter of chapters) {
    await createChapter(chapter);
  }

  for (const character of characters) {
    await createCharacter(character);
  }

  for (const location of locations) {
    await createLocation(location);
  }

  for (const item of items) {
    await createItem(item);
  }

  for (const setting of worldSettings) {
    await createWorldSetting(setting);
  }
}
