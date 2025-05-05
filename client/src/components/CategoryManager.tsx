import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ChevronDown,
  PaintBucket,
  Tags,
  Info,
} from "lucide-react";
import { defaultCategories, CategoryDefinition, getCategoryColor } from "@/lib/categories";
import { saveUserCategories, loadUserCategories } from "@/lib/storage";

interface CategoryManagerProps {
  onCategoryChange: () => void;
}

export default function CategoryManager({ onCategoryChange }: CategoryManagerProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryDefinition[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryDefinition | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    color: "#808080",
    description: "",
    keywords: "",
  });

  // Carregar categorias ao montar o componente
  useEffect(() => {
    const userCategories = loadUserCategories();
    const allCategories = userCategories.length > 0 
      ? [...defaultCategories, ...userCategories] 
      : [...defaultCategories];
    
    // Remover duplicatas baseado no ID
    const uniqueCategories = allCategories.filter((category, index, self) =>
      index === self.findIndex((c) => c.id === category.id)
    );
    
    setCategories(uniqueCategories);
  }, []);

  // Salvar categorias sempre que forem alteradas
  useEffect(() => {
    // Filtrar apenas categorias personalizadas (não padrão)
    const defaultCategoryIds = defaultCategories.map(cat => cat.id);
    const customCategories = categories.filter(cat => !defaultCategoryIds.includes(cat.id));
    
    if (customCategories.length > 0) {
      saveUserCategories(customCategories);
    }
  }, [categories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      color: "#808080",
      description: "",
      keywords: "",
    });
    setIsEditing(false);
    setCurrentCategory(null);
  };

  const handleAddCategory = () => {
    // Validar os campos obrigatórios
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    
    // Criar ID a partir do nome (slug)
    const id = formData.id || formData.name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '_'); // Substitui espaços por underscore
    
    // Validar ID único
    if (!isEditing && categories.some(cat => cat.id === id)) {
      toast({
        title: "Erro",
        description: "Já existe uma categoria com esse nome.",
        variant: "destructive",
      });
      return;
    }

    // Processar keywords
    const keywords = formData.keywords.split(",")
      .map(keyword => keyword.trim())
      .filter(keyword => keyword);
    
    // Criar nova categoria
    const newCategory: CategoryDefinition = {
      id,
      name: formData.name,
      color: formData.color,
      description: formData.description,
      keywords,
    };

    if (isEditing && currentCategory) {
      // Atualizar categoria existente
      const updatedCategories = categories.map(cat => 
        cat.id === currentCategory.id ? newCategory : cat
      );
      setCategories(updatedCategories);
      
      toast({
        title: "Categoria atualizada",
        description: `A categoria "${newCategory.name}" foi atualizada com sucesso.`,
      });
    } else {
      // Adicionar nova categoria
      setCategories([...categories, newCategory]);
      
      toast({
        title: "Categoria adicionada",
        description: `A categoria "${newCategory.name}" foi adicionada com sucesso.`,
      });
    }

    // Limpar formulário e fechar dialog
    resetForm();
    setIsDialogOpen(false);
    
    // Notificar a mudança
    onCategoryChange();
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Verificar se é uma categoria padrão
    if (defaultCategories.some(cat => cat.id === categoryId)) {
      toast({
        title: "Operação não permitida",
        description: "Categorias padrão não podem ser excluídas.",
        variant: "destructive",
      });
      return;
    }
    
    // Remover categoria
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);
    
    toast({
      title: "Categoria removida",
      description: "A categoria foi removida com sucesso.",
    });
    
    // Notificar a mudança
    onCategoryChange();
  };

  const startEditing = (category: CategoryDefinition) => {
    setCurrentCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      color: category.color,
      description: category.description,
      keywords: category.keywords.join(", "),
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleRestoreDefaults = () => {
    // Filtrar categorias personalizadas
    const defaultCategoryIds = defaultCategories.map(cat => cat.id);
    const customCategories = categories.filter(cat => !defaultCategoryIds.includes(cat.id));
    
    // Restaurar categorias padrão e manter personalizadas
    setCategories([...defaultCategories, ...customCategories]);
    
    toast({
      title: "Categorias padrão restauradas",
      description: "As categorias padrão foram restauradas com sucesso.",
    });
    
    // Notificar a mudança
    onCategoryChange();
  };

  // Verificar se há categorias personalizadas
  const hasCustomCategories = categories.some(cat => 
    !defaultCategories.map(d => d.id).includes(cat.id)
  );

  return (
    <Card className="mb-6 border-border/40 shadow-sm">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Tags className="h-5 w-5" />
              Gerenciador de Categorias
            </CardTitle>
            <CardDescription>
              Categorize suas transações para análises mais precisas
            </CardDescription>
          </div>
          
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                  }}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isEditing ? "Editar Categoria" : "Nova Categoria"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditing 
                      ? "Atualize os detalhes da categoria selecionada." 
                      : "Crie uma nova categoria para classificar suas transações."}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome da Categoria</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Ex: Restaurantes, Transporte"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="color" className="flex items-center gap-2">
                      <PaintBucket className="h-4 w-4" />
                      Cor
                    </Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="color"
                        name="color"
                        type="color"
                        className="w-16 h-8 p-1"
                        value={formData.color}
                        onChange={handleInputChange}
                      />
                      <div 
                        className="flex-1 p-2 rounded-md font-medium"
                        style={{ 
                          backgroundColor: `${formData.color}15`,
                          color: formData.color,
                          border: `1px solid ${formData.color}30`
                        }}
                      >
                        {formData.name || "Nome da Categoria"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descrição (opcional)</Label>
                    <Input
                      id="description"
                      name="description"
                      placeholder="Descrição da categoria"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="keywords" className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Palavras-chave
                      <span className="text-xs text-muted-foreground font-normal">
                        (separadas por vírgula)
                      </span>
                    </Label>
                    <Input
                      id="keywords"
                      name="keywords"
                      placeholder="restaurante, delivery, ifood"
                      value={formData.keywords}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <DialogFooter className="gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAddCategory}
                    className="gap-1"
                  >
                    <Save className="h-4 w-4" />
                    {isEditing ? "Atualizar" : "Adicionar"} Categoria
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              onClick={handleRestoreDefaults}
              size="icon"
              title="Restaurar categorias padrão"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="default">Padrão</TabsTrigger>
            <TabsTrigger value="custom">Personalizadas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Accordion type="multiple" className="w-full">
              {categories.map(category => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="py-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                      {category.keywords.length > 0 && (
                        <span className="text-xs text-muted-foreground font-normal">
                          ({category.keywords.length} palavra{category.keywords.length !== 1 ? 's' : ''})
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-6 py-2 space-y-3">
                      {category.description && (
                        <p className="text-sm">{category.description}</p>
                      )}
                      
                      {category.keywords.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Palavras-chave:</h4>
                          <div className="flex flex-wrap gap-1">
                            {category.keywords.map((keyword, i) => (
                              <span 
                                key={i}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-xs"
                          onClick={() => startEditing(category)}
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Editar
                        </Button>
                        
                        {!defaultCategories.some(cat => cat.id === category.id) && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Excluir
                          </Button>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="default">
            <Accordion type="multiple" className="w-full">
              {defaultCategories.map(category => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="py-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                      {category.keywords.length > 0 && (
                        <span className="text-xs text-muted-foreground font-normal">
                          ({category.keywords.length} palavra{category.keywords.length !== 1 ? 's' : ''})
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-6 py-2 space-y-3">
                      {category.description && (
                        <p className="text-sm">{category.description}</p>
                      )}
                      
                      {category.keywords.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Palavras-chave:</h4>
                          <div className="flex flex-wrap gap-1">
                            {category.keywords.map((keyword, i) => (
                              <span 
                                key={i}
                                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-xs"
                          onClick={() => startEditing(category)}
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="custom">
            {hasCustomCategories ? (
              <Accordion type="multiple" className="w-full">
                {categories
                  .filter(cat => !defaultCategories.some(d => d.id === cat.id))
                  .map(category => (
                    <AccordionItem key={category.id} value={category.id}>
                      <AccordionTrigger className="py-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                          {category.keywords.length > 0 && (
                            <span className="text-xs text-muted-foreground font-normal">
                              ({category.keywords.length} palavra{category.keywords.length !== 1 ? 's' : ''})
                            </span>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-6 py-2 space-y-3">
                          {category.description && (
                            <p className="text-sm">{category.description}</p>
                          )}
                          
                          {category.keywords.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Palavras-chave:</h4>
                              <div className="flex flex-wrap gap-1">
                                {category.keywords.map((keyword, i) => (
                                  <span 
                                    key={i}
                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2 text-xs"
                              onClick={() => startEditing(category)}
                            >
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              Editar
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            ) : (
              <div className="text-center py-8">
                <Tags className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-1">Nenhuma categoria personalizada</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Crie categorias personalizadas para organizar melhor suas transações
                </p>
                <Button 
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(true);
                  }}
                  variant="outline"
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Nova Categoria
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}