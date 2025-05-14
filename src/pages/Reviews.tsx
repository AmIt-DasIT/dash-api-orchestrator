
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash, Star } from 'lucide-react';
import { DataTable, Column } from '@/components/shared/DataTable';
import { DataForm } from '@/components/shared/DataForm';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { getReviews, createReview, updateReview, deleteReview } from '@/api/review';
import { UserReview } from '@/types';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const reviewSchema = z.object({
  user_id: z.string().min(1, 'User is required'),
  ordered_product_id: z.string().optional().nullable(),
  rating_value: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: z.string().optional().nullable(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const Reviews = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<UserReview | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', page, searchQuery],
    queryFn: () => getReviews(page, pageSize, searchQuery),
  });

  const createMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: 'Success',
        description: 'Review created successfully',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<UserReview, 'id' | 'created_at' | 'updated_at'>> }) => 
      updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: 'Success',
        description: 'Review updated successfully',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
    },
  });

  const handleAdd = () => {
    setSelectedReview(null);
    setIsFormOpen(true);
  };

  const handleEdit = (review: UserReview) => {
    setSelectedReview(review);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  const handleSubmit = async (data: ReviewFormData) => {
    try {
      if (selectedReview) {
        await updateMutation.mutateAsync({
          id: selectedReview.id,
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
      console.error('Failed to save review:', error);
    }
  };

  const defaultValues: ReviewFormData = selectedReview
    ? {
        user_id: selectedReview.user_id,
        ordered_product_id: selectedReview.ordered_product_id,
        rating_value: selectedReview.rating_value,
        comment: selectedReview.comment,
      }
    : {
        user_id: '',
        ordered_product_id: null,
        rating_value: 5,
        comment: '',
      };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const columns: Column<UserReview>[] = [
    { 
      header: 'User ID', 
      accessorKey: 'user_id',
      cell: (item) => (
        <span className="font-mono text-sm">{item.user_id.substring(0, 8)}...</span>
      ),
    },
    { 
      header: 'Product ID', 
      accessorKey: (item) => item.ordered_product_id ? 
        `${item.ordered_product_id.substring(0, 8)}...` : 'N/A',
      cell: (item) => (
        <span className="font-mono text-sm">
          {item.ordered_product_id ? 
            `${item.ordered_product_id.substring(0, 8)}...` : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Rating',
      accessorKey: 'rating_value',
      cell: (item) => renderStarRating(item.rating_value),
    },
    {
      header: 'Comment',
      accessorKey: 'comment',
      cell: (item) => (
        <div className="max-w-md truncate">
          {item.comment || 'No comment'}
        </div>
      ),
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
        <h2 className="text-3xl font-bold tracking-tight">Customer Reviews</h2>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Review
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
        searchPlaceholder="Search reviews..."
        isLoading={isLoading}
      />

      <DataForm
        schema={reviewSchema}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        title={selectedReview ? 'Edit Review' : 'Add Review'}
        description={selectedReview ? 'Update review details' : 'Create a new review'}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      >
        <div className="space-y-4">
          <FormField
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input placeholder="User ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="ordered_product_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Product ID" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="rating_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <Select
                    value={field.value.toString()}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  >
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Average</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Excellent</option>
                  </Select>
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
                  <Textarea 
                    placeholder="Add a comment..." 
                    {...field}
                    value={field.value || ''}
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

export default Reviews;
