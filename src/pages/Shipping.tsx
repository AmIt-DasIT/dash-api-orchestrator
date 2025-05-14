
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/shared/DataTable';
import { DataForm } from '@/components/shared/DataForm';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { getShippingMethods, createShippingMethod, updateShippingMethod, deleteShippingMethod } from '@/api/shipping';
import { ShippingMethod } from '@/types';

const shippingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  price: z.coerce.number().min(0, { message: "Price must be at least 0." }),
});

type FormValues = z.infer<typeof shippingSchema>;

export default function Shipping() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShippingMethod | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: shippingMethods = [], isLoading } = useQuery({
    queryKey: ['shipping'],
    queryFn: getShippingMethods,
  });
  
  const createMutation = useMutation({
    mutationFn: createShippingMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping'] });
      toast({
        title: "Shipping Method Created",
        description: "The shipping method has been created successfully.",
      });
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create shipping method: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: updateShippingMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping'] });
      toast({
        title: "Shipping Method Updated",
        description: "The shipping method has been updated successfully.",
      });
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update shipping method: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteShippingMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipping'] });
      toast({
        title: "Shipping Method Deleted",
        description: "The shipping method has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete shipping method: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleOpenForm = (item?: ShippingMethod) => {
    if (item) {
      setSelectedItem(item);
    } else {
      setSelectedItem(null);
    }
    setIsFormOpen(true);
  };
  
  const handleSubmit = async (data: FormValues) => {
    const shippingData = {
      ...data,
      delete_flag: false,
    };
    
    if (selectedItem) {
      await updateMutation.mutateAsync({ id: selectedItem.id, ...shippingData });
    } else {
      await createMutation.mutateAsync(shippingData as Omit<ShippingMethod, "id" | "created_at" | "updated_at">);
    }
  };
  
  const handleConfirmDelete = async () => {
    if (selectedItem) {
      await deleteMutation.mutateAsync(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };
  
  const handleDeleteClick = (item: ShippingMethod) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };
  
  const columns = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Price', accessorKey: 'price', cell: (item: ShippingMethod) => `$${item.price.toFixed(2)}` },
  ];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Shipping Methods</h1>
        <Button onClick={() => handleOpenForm()}>Add New</Button>
      </div>
      
      <DataTable
        data={shippingMethods}
        columns={columns}
        onEdit={handleOpenForm}
        onDelete={handleDeleteClick}
        searchFields={['name']}
        idField="id"
      />
      
      <DataForm
        schema={shippingSchema}
        defaultValues={selectedItem ? {
          name: selectedItem.name,
          price: selectedItem.price,
        } : {
          name: '',
          price: 0,
        }}
        onSubmit={handleSubmit}
        title={selectedItem ? 'Edit Shipping Method' : 'Add Shipping Method'}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      >
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="0" step="0.01" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </DataForm>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the shipping method.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
