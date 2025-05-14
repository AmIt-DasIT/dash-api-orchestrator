
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import ProductList from '@/components/products/ProductList';
import ProductForm from '@/components/products/ProductForm';
import { Product } from '@/types';

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedProduct(undefined);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProduct(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {showForm && (
        <ProductForm product={selectedProduct} onClose={handleCloseForm} />
      )}

      <ProductList onEdit={handleEdit} />
    </div>
  );
};

export default Products;
