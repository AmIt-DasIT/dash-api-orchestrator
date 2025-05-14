
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductCategories, createProductCategory, updateProductCategory, deleteProductCategory, activateProductCategory } from '@/api/productCategory';
import { ProductCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Check, X } from 'lucide-react';

const Categories = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [formData, setFormData] = useState({
    category_name: '',
    parent_category_id: '',
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['productCategories'],
    queryFn: getProductCategories,
  });

  const createMutation = useMutation({
    mutationFn: createProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductCategory> }) => 
      updateProductCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    },
  });

  const activateMutation = useMutation({
    mutationFn: activateProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productCategories'] });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedCategory) {
      updateMutation.mutate({
        id: selectedCategory.id,
        data: {
          category_name: formData.category_name,
          parent_category_id: formData.parent_category_id || null,
        },
      });
    } else {
      createMutation.mutate({
        category_name: formData.category_name,
        parent_category_id: formData.parent_category_id || null,
        delete_flag: false,
      } as Omit<ProductCategory, 'id' | 'created_at' | 'updated_at'>);
    }
  };

  const handleEdit = (category: ProductCategory) => {
    setSelectedCategory(category);
    setFormData({
      category_name: category.category_name,
      parent_category_id: category.parent_category_id || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setFormData({
      category_name: '',
      parent_category_id: '',
    });
    setShowForm(false);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Product Categories</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : <><PlusCircle className="mr-2 h-4 w-4" /> Add Category</>}
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>
                {selectedCategory ? 'Edit Category' : 'Add New Category'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="category_name" className="text-sm font-medium">
                  Category Name
                </label>
                <Input
                  id="category_name"
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="parent_category_id" className="text-sm font-medium">
                  Parent Category
                </label>
                <select
                  id="parent_category_id"
                  name="parent_category_id"
                  value={formData.parent_category_id}
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                >
                  <option value="">None (Top Level)</option>
                  {categories?.map((category) => (
                    // Prevent selecting itself as parent
                    selectedCategory?.id !== category.id && (
                      <option key={category.id} value={category.id}>
                        {category.category_name}
                      </option>
                    )
                  ))}
                </select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button onClick={resetForm} type="button" variant="outline">Cancel</Button>
              <Button type="submit">
                {selectedCategory ? 'Update' : 'Create'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.category_name}</TableCell>
                  <TableCell>
                    {category.parent_category_id
                      ? categories.find(c => c.id === category.parent_category_id)?.category_name || 'Unknown'
                      : 'None'
                    }
                  </TableCell>
                  <TableCell>
                    {category.delete_flag 
                      ? <span className="inline-flex items-center text-red-500"><X className="mr-1 h-4 w-4" /> Inactive</span>
                      : <span className="inline-flex items-center text-green-500"><Check className="mr-1 h-4 w-4" /> Active</span>
                    }
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    {category.delete_flag ? (
                      <Button variant="outline" size="sm" onClick={() => activateMutation.mutate(category.id)}>
                        <Check className="h-4 w-4 mr-1" /> Activate
                      </Button>
                    ) : null}
                    <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(category.id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
