
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, deleteProduct, activateProduct, deactivateProduct } from '@/api/product';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Edit, Trash2 } from "lucide-react";

interface ProductListProps {
  onEdit: (product: Product) => void;
}

const ProductList = ({ onEdit }: ProductListProps) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page],
    queryFn: () => getProducts(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const activateMutation = useMutation({
    mutationFn: activateProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  if (isLoading) return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </CardContent>
    </Card>
  );

  if (error) return (
    <Card>
      <CardContent className="p-6">
        <div className="text-red-500">Error loading products.</div>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-mono">{product.id.substring(0, 8)}...</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category_id || 'Uncategorized'}</TableCell>
                <TableCell>
                  {product.delete_flag 
                    ? <span className="inline-flex items-center text-red-500"><X className="mr-1 h-4 w-4" /> Inactive</span>
                    : <span className="inline-flex items-center text-green-500"><Check className="mr-1 h-4 w-4" /> Active</span>
                  }
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  {product.delete_flag ? (
                    <Button variant="outline" size="sm" onClick={() => activateMutation.mutate(product.id)}>
                      <Check className="h-4 w-4 mr-1" /> Activate
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => deactivateMutation.mutate(product.id)}>
                      <X className="h-4 w-4 mr-1" /> Deactivate
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(product.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductList;
