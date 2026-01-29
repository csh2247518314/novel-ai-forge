'use client';

import { useEffect, useState } from 'react';
import { initDatabases } from '@/lib/db';
import { useProjectStore } from '@/store/project-store';
import { useSettingsStore } from '@/store/settings-store';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { loadProjects } = useProjectStore();
  const { loadSettings, initializeTheme } = useSettingsStore();

  useEffect(() => {
    // 初始化数据库
    initDatabases();
    
    // 加载数据
    loadProjects();
    loadSettings();
    initializeTheme();
    
    setIsInitialized(true);
  }, [loadProjects, loadSettings, initializeTheme]);

  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在加载...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
