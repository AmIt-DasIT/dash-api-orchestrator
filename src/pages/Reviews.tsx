
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/shared/DataTable';
import { DataForm } from '@/components/shared/DataForm';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { getReviews, createReview, updateReview, deleteReview } from '@/api/review';
import { UserReview } from '@/types';

const reviewSchema = z.object({
  user_id: z.string().min(1, { message: "User ID is required." }),
  ordered_product_id: z.string().min(1, { message: "Product ID is required." }),
  rating_value: z.coerce.number().min(1, { message: "Rating must be at least 1." }).max(5, { message: "Rating must be at most 5." }),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof reviewSchema>;

export default function Reviews() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UserReview | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: getReviews,
  });
  
  const createMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: "Review Created",
        description: "The review has been created successfully.",
      });
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create review: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: "Review Updated",
        description: "The review has been updated successfully.",
      });
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update review: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: "Review Deleted",
        description: "The review has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete review: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleOpenForm = (item?: UserReview) => {
    if (item) {
      setSelectedItem(item);
    } else {
      setSelectedItem(null);
    }
    setIsFormOpen(true);
  };
  
  const handleSubmit = async (data: FormValues) => {
    const reviewData = {
      ...data,
      delete_flag: false,
    };
    
    if (selectedItem) {
      await updateMutation.mutateAsync({ id: selectedItem.id, ...reviewData });
    } else {
      await createMutation.mutateAsync(reviewData as Omit<UserReview, "id" | "created_at" | "updated_at">);
    }
  };
  
  const handleConfirmDelete = async () => {
    if (selectedItem) {
      await deleteMutation.mutateAsync(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };
  
  const handleDeleteClick = (item: UserReview) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };
  
  const columns = [
    { header: 'User ID', accessorKey: 'user_id' },
    { header: 'Product ID', accessorKey: 'ordered_product_id' },
    { header: 'Rating', accessorKey: 'rating_value', cell: (item: UserReview) => '⭐'.repeat(item.rating_value) },
    { header: 'Comment', accessorKey: 'comment' },
  ];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reviews</h1>
        <Button onClick={() => handleOpenForm()}>Add New</Button>
      </div>
      
      <DataTable
        data={reviews}
        columns={columns}
        onEdit={handleOpenForm}
        onDelete={handleDeleteClick}
        searchFields={['user_id', 'ordered_product_id', 'comment']}
        idField="id"
      />
      
      <DataForm
        schema={reviewSchema}
        defaultValues={selectedItem ? {
          user_id: selectedItem.user_id,
          ordered_product_id: selectedItem.ordered_product_id,
          rating_value: selectedItem.rating_value,
          comment: selectedItem.comment || '',
        } : {
          user_id: '',
          ordered_product_id: '',
          rating_value: 5,
          comment: '',
        }}
        onSubmit={handleSubmit}
        title={selectedItem ? 'Edit Review' : 'Add Review'}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      >
        <FormField
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="ordered_product_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="rating_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (1-5)</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="1" max="5" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
              This action cannot be undone. This will permanently delete the review.
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
