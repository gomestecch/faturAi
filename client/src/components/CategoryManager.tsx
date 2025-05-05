import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CirclePlus, Trash2, Pencil, Save, Info, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  defaultCategories, 
  CategoryDefinition, 
  categoryColors 
} from "@/lib/categories";
import { loadUserCategories, saveUserCategories } from "@/lib/storage";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryManagerProps {
  onCategoryChange: () => void;
}

export default function CategoryManager({ onCategoryChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<CategoryDefinition[]>([]);
  const [userCategories, setUserCategories] = useState<CategoryDefinition[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDefinition | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(categoryColors.other);
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryKeywords, setNewCategoryKeywords] = useState("");
  const [showDefaultCategories, setShowDefaultCategories] = useState(true);

  // Carregar categorias do localStorage ao iniciar
  useEffect(() => {
    const userCats = loadUserCategories();
    setUserCategories(userCats);
    setCategories([...defaultCategories, ...userCats]);
  }, []);

  // Salvar categorias do usuário quando elas mudam
  useEffect(() => {
    saveUserCategories(userCategories);
    setCategories([
      ...(showDefaultCategories ? defaultCategories : []), 
      ...userCategories
    ]);
    onCategoryChange();
  }, [userCategories, showDefaultCategories, onCategoryChange]);

  // Adicionar nova categoria
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const id = newCategoryName.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "_");
    
    const keywords = newCategoryKeywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    
    const newCategory: CategoryDefinition = {
      id,
      name: newCategoryName,
      color: newCategoryColor,
      description: newCategoryDescription,
      keywords
    };
    
    setUserCategories([...userCategories, newCategory]);
    resetForm();
  };

  // Atualizar categoria existente
  const handleUpdateCategory = () => {
    if (!editingCategory || !newCategoryName.trim()) return;
    
    const keywords = newCategoryKeywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    
    const updatedCategory: CategoryDefinition = {
      ...editingCategory,
      name: newCategoryName,
      color: newCategoryColor,
      description: newCategoryDescription,
      keywords
    };
    
    const updatedCategories = userCategories.map(cat => 
      cat.id === editingCategory.id ? updatedCategory : cat
    );
    
    setUserCategories(updatedCategories);
    resetForm();
    setIsEditing(false);
    setEditingCategory(null);
  };

  // Deletar categoria
  const handleDeleteCategory = (categoryId: string) => {
    setUserCategories(userCategories.filter(cat => cat.id !== categoryId));
  };

  // Editar categoria
  const startEditing = (category: CategoryDefinition) => {
    setIsEditing(true);
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryColor(category.color);
    setNewCategoryDescription(category.description);
    setNewCategoryKeywords(category.keywords.join(', '));
  };

  // Reset form
  const resetForm = () => {
    setNewCategoryName("");
    setNewCategoryColor(categoryColors.other);
    setNewCategoryDescription("");
    setNewCategoryKeywords("");
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingCategory(null);
    resetForm();
  };

  // Toggle para mostrar/esconder categorias padrão
  const toggleDefaultCategories = () => {
    setShowDefaultCategories(!showDefaultCategories);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Gerenciamento de Categorias</h2>
            <p className="text-muted-foreground text-sm">Personalize suas categorias para melhor organização</p>
          </div>
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleDefaultCategories}
              className="flex items-center gap-1"
            >
              {showDefaultCategories ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showDefaultCategories ? "Ocultar Padrão" : "Mostrar Padrão"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="add">Adicionar/Editar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="rounded-lg border p-4 relative">
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-2 rounded-tl-lg rounded-bl-lg"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    
                    <div className="pl-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{category.name}</h3>
                        
                        {/* Mostrar os botões de editar/excluir somente para categorias de usuários */}
                        {userCategories.some(cat => cat.id === category.id) && (
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6" 
                              onClick={() => startEditing(category)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-destructive" 
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                      
                      {category.keywords.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-xs font-medium flex items-center gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center">
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                    <span>Palavras-chave</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Estas palavras são usadas para categorização automática
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {category.keywords.slice(0, 4).map((keyword, idx) => (
                              <span 
                                key={idx} 
                                className="text-xs bg-muted px-2 py-0.5 rounded-full"
                              >
                                {keyword}
                              </span>
                            ))}
                            {category.keywords.length > 4 && (
                              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                +{category.keywords.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="add">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Nome da Categoria</Label>
                  <Input 
                    id="category-name" 
                    placeholder="Ex: Viagens, Educação, etc." 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category-color">Cor</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-10 h-10 rounded-full border"
                      style={{ backgroundColor: newCategoryColor }}
                    ></div>
                    <select 
                      id="category-color"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                    >
                      {Object.entries(categoryColors).map(([name, color]) => (
                        <option key={name} value={color}>
                          {name.charAt(0).toUpperCase() + name.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category-description">Descrição</Label>
                <Input 
                  id="category-description" 
                  placeholder="Descreva quando usar esta categoria" 
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="category-keywords">Palavras-chave para detecção automática</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Palavras separadas por vírgula que serão usadas para categorizar automaticamente suas transações
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input 
                  id="category-keywords" 
                  placeholder="restaurante, mercado, supermercado, etc. (separadas por vírgula)" 
                  value={newCategoryKeywords}
                  onChange={(e) => setNewCategoryKeywords(e.target.value)}
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                {isEditing && (
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancelar
                  </Button>
                )}
                <Button 
                  onClick={isEditing ? handleUpdateCategory : handleAddCategory}
                  className="flex items-center gap-2"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4" />
                      Atualizar Categoria
                    </>
                  ) : (
                    <>
                      <CirclePlus className="h-4 w-4" />
                      Adicionar Categoria
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}