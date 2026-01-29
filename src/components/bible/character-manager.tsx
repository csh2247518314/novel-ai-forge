'use client';

import { useState } from 'react';
import { useProjectStore } from '@/store/project-store';
import { Character } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Edit2, Trash2, User, Users, Shield, Skull } from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';

const ROLE_ICONS = {
  '主角': Users,
  '配角': User,
  '反派': Skull,
  'NPC': User,
};

const ROLE_COLORS = {
  '主角': 'text-blue-500',
  '配角': 'text-green-500',
  '反派': 'text-red-500',
  'NPC': 'text-gray-500',
};

export function CharacterManager() {
  const { 
    characters, 
    currentProject,
    createCharacter, 
    updateCharacter, 
    deleteCharacter,
  } = useProjectStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    role: '主角' | '配角' | '反派' | 'NPC';
    appearance: string;
    personality: string;
    background: string;
    abilities: string;
    relationshipsStr: string;
    secrets: string;
    notes: string;
    tags: string[];
  }>({
    name: '',
    role: '配角',
    appearance: '',
    personality: '',
    background: '',
    abilities: '',
    relationshipsStr: '',
    secrets: '',
    notes: '',
    tags: [],
  });

  const handleOpenDialog = (character?: Character) => {
    if (character) {
      setEditingCharacter(character);
      setFormData({
        name: character.name,
        role: character.role as '主角' | '配角' | '反派' | 'NPC',
        appearance: character.appearance,
        personality: character.personality,
        background: character.background,
        abilities: character.abilities || '',
        relationshipsStr: character.relationships?.join(', ') || '',
        secrets: character.secrets || '',
        notes: character.notes || '',
        tags: character.tags,
      });
    } else {
      setEditingCharacter(null);
      setFormData({
        name: '',
        role: '配角',
        appearance: '',
        personality: '',
        background: '',
        abilities: '',
        relationshipsStr: '',
        secrets: '',
        notes: '',
        tags: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !currentProject) return;

    const characterData: Omit<Character, 'id' | 'projectId' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      role: formData.role,
      appearance: formData.appearance,
      personality: formData.personality,
      background: formData.background,
      abilities: formData.abilities,
      relationships: formData.relationshipsStr.split(',').map(r => r.trim()).filter(Boolean),
      secrets: formData.secrets,
      notes: formData.notes,
      tags: formData.tags,
    };

    if (editingCharacter) {
      await updateCharacter({ ...editingCharacter, ...characterData });
    } else {
      await createCharacter(characterData);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个角色吗？')) {
      await deleteCharacter(id);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">角色设定</h2>
        <Button onClick={() => handleOpenDialog()} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          添加角色
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {characters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>暂无角色</p>
            <p className="text-sm">点击上方按钮添加第一个角色</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {characters.map((character) => {
              const Icon = ROLE_ICONS[character.role as keyof typeof ROLE_ICONS] || User;
              
              return (
                <Card key={character.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={cn('text-xs', ROLE_COLORS[character.role as keyof typeof ROLE_COLORS])}>
                            {getInitials(character.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {character.name}
                            <Icon className={cn('h-4 w-4', ROLE_COLORS[character.role as keyof typeof ROLE_COLORS])} />
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">{character.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenDialog(character)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(character.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {character.appearance && (
                      <div>
                        <span className="text-muted-foreground text-xs">外貌</span>
                        <p className="line-clamp-2">{character.appearance}</p>
                      </div>
                    )}
                    {character.personality && (
                      <div>
                        <span className="text-muted-foreground text-xs">性格</span>
                        <p className="line-clamp-2">{character.personality}</p>
                      </div>
                    )}
                    {character.secrets && (
                      <div className="p-2 bg-muted rounded text-xs">
                        <span className="text-muted-foreground">秘密：</span>
                        {character.secrets}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* 添加/编辑角色对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingCharacter ? '编辑角色' : '添加角色'}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">角色名称 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="输入角色名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">角色定位</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: '主角' | '配角' | '反派' | 'NPC') => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="主角">主角</SelectItem>
                      <SelectItem value="配角">配角</SelectItem>
                      <SelectItem value="反派">反派</SelectItem>
                      <SelectItem value="NPC">NPC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appearance">外貌描述</Label>
                <Textarea
                  id="appearance"
                  value={formData.appearance}
                  onChange={(e) => setFormData({ ...formData, appearance: e.target.value })}
                  placeholder="描述角色的外貌特征..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personality">性格特点</Label>
                <Textarea
                  id="personality"
                  value={formData.personality}
                  onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                  placeholder="描述角色的性格特点..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="background">背景故事</Label>
                <Textarea
                  id="background"
                  value={formData.background}
                  onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                  placeholder="描述角色的背景故事..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="abilities">特殊能力</Label>
                <Textarea
                  id="abilities"
                  value={formData.abilities}
                  onChange={(e) => setFormData({ ...formData, abilities: e.target.value })}
                  placeholder="描述角色的特殊能力..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationships">人物关系</Label>
                <Input
                  id="relationships"
                  value={formData.relationshipsStr}
                  onChange={(e) => setFormData({ ...formData, relationshipsStr: e.target.value })}
                  placeholder="用逗号分隔，如：父亲:张三,好友:李四"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secrets">秘密/隐藏设定</Label>
                <Textarea
                  id="secrets"
                  value={formData.secrets}
                  onChange={(e) => setFormData({ ...formData, secrets: e.target.value })}
                  placeholder="只有你知道的信息..."
                  rows={2}
                  className="bg-muted/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">备注</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="其他备注信息..."
                  rows={2}
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSave} disabled={!formData.name.trim()}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
