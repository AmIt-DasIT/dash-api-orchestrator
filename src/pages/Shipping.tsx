
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { DataForm } from '@/components/shared/DataForm';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getShippingMethods, createShippingMethod, updateShippingMethod, deleteShippingMethod } from '@/api/shipping';
import { ShippingMethod } from '@/types';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const shippingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const Shipping = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<ShippingMethod | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['shipping', page, searchQuery],
    queryFn: () => getShippingMethods(page, pageSize, searchQuery),
  });

  const createMutation = useMutation({
    mutationFn: createShippingMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping'] });
      toast({
        title: 'Success',
        description: 'Shipping method created successfully',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<ShippingMethod, 'id' | 'created_at' | 'updated_at'>> }) => 
      updateShippingMethod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping'] });
      toast({
        title: 'Success',
        description: 'Shipping method updated successfully',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteShippingMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping'] });
      toast({
        title: 'Success',
        description: 'Shipping method deleted successfully',
      });
    },
  });

  const handleAdd = () => {
    setSelectedMethod(null);
    setIsFormOpen(true);
  };

  const handleEdit = (method: ShippingMethod) => {
    setSelectedMethod(method);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this shipping method?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete shipping method:', error);
      }
    }
  };

  const handleSubmit = async (data: ShippingFormData) => {
    try {
      if (selectedMethod) {
        await updateMutation.mutateAsync({
          id: selectedMethod.id,
          data: {
            ...data,
            delete_flag: false,
          },
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          delete_flag: false,
        });
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to save shipping method:', error);
    }
  };

  const defaultValues: ShippingFormData = selectedMethod
    ? {
        name: selectedMethod.name,
        price: selectedMethod.price,
      }
    : {
        name: '',
        price: 0,
      };

  const columns: Column<ShippingMethod>[] = [
    { 
      header: 'Name', 
      accessorKey: 'name', 
    },
    { 
      header: 'Price', 
      accessorKey: (item) => `$${item.price.toFixed(2)}`, 
    },
    { 
      header: 'Actions', 
      accessorKey: 'id',
      cell: (item) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Shipping Methods</h2>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Shipping Method
        </Button>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        totalItems={data?.total || 0}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onSearch={setSearchQuery}
        searchPlaceholder="Search shipping methods..."
        isLoading={isLoading}
      />

      <DataForm
        schema={shippingSchema}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        title={selectedMethod ? 'Edit Shipping Method' : 'Add Shipping Method'}
        description={selectedMethod ? 'Update shipping method details' : 'Create a new shipping method'}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      >
        <div className="space-y-4">
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Express Delivery" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="9.99"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </DataForm>
    </div>
  );
};

export default Shipping;
