
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { DataForm } from '@/components/shared/DataForm';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getPromotions, createPromotion, updatePromotion, deletePromotion } from '@/api/promotion';
import { Promotion } from '@/types';
import { z } from 'zod';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const promotionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  discount_rate: z.number().min(0, 'Discount rate must be positive').max(100, 'Discount rate cannot exceed 100%'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
});

type PromotionFormData = z.infer<typeof promotionSchema>;

const Promotions = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['promotions', page, searchQuery],
    queryFn: () => getPromotions(page, pageSize, searchQuery),
  });

  const createMutation = useMutation({
    mutationFn: createPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast({
        title: 'Success',
        description: 'Promotion created successfully',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Promotion, 'id' | 'created_at' | 'updated_at'>> }) => 
      updatePromotion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast({
        title: 'Success',
        description: 'Promotion updated successfully',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast({
        title: 'Success',
        description: 'Promotion deleted successfully',
      });
    },
  });

  const handleAdd = () => {
    setSelectedPromotion(null);
    setIsFormOpen(true);
  };

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete promotion:', error);
      }
    }
  };

  const handleSubmit = async (data: PromotionFormData) => {
    try {
      if (selectedPromotion) {
        await updateMutation.mutateAsync({
          id: selectedPromotion.id,
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
      console.error('Failed to save promotion:', error);
    }
  };

  const formattedPromotion = selectedPromotion ? {
    name: selectedPromotion.name,
    description: selectedPromotion.description || '',
    discount_rate: selectedPromotion.discount_rate,
    start_date: selectedPromotion.start_date?.split('T')[0] || '',
    end_date: selectedPromotion.end_date?.split('T')[0] || '',
  } : {
    name: '',
    description: '',
    discount_rate: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };

  const columns: Column<Promotion>[] = [
    { 
      header: 'Name', 
      accessorKey: 'name', 
    },
    { 
      header: 'Discount Rate', 
      accessorKey: (item) => `${item.discount_rate}%`, 
    },
    { 
      header: 'Start Date', 
      accessorKey: (item) => format(new Date(item.start_date), 'MMM dd, yyyy'), 
    },
    { 
      header: 'End Date', 
      accessorKey: (item) => format(new Date(item.end_date), 'MMM dd, yyyy'), 
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
        <h2 className="text-3xl font-bold tracking-tight">Promotions</h2>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Promotion
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
        searchPlaceholder="Search promotions..."
        isLoading={isLoading}
      />

      <DataForm
        schema={promotionSchema}
        defaultValues={formattedPromotion}
        onSubmit={handleSubmit}
        title={selectedPromotion ? 'Edit Promotion' : 'Add Promotion'}
        description={selectedPromotion ? 'Update promotion details' : 'Create a new promotion'}
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
                  <Input placeholder="Summer Sale" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Special discount for summer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="discount_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Rate (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="10"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </DataForm>
    </div>
  );
};

export default Promotions;
