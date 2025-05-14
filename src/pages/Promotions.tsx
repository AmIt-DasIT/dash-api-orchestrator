
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
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPromotions, createPromotion, updatePromotion, deletePromotion } from '@/api/promotion';
import { Promotion } from '@/types';

const promotionSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().min(2, { message: "Description must be at least 2 characters." }),
  discount_rate: z.coerce.number().min(0, { message: "Discount rate must be at least 0." }).max(100, { message: "Discount rate must be at most 100." }),
  start_date: z.string(),
  end_date: z.string(),
});

type FormValues = z.infer<typeof promotionSchema>;

export default function Promotions() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Promotion | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: getPromotions,
  });
  
  const createMutation = useMutation({
    mutationFn: createPromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast({
        title: "Promotion Created",
        description: "The promotion has been created successfully.",
      });
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create promotion: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: updatePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast({
        title: "Promotion Updated",
        description: "The promotion has been updated successfully.",
      });
      setIsFormOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update promotion: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: deletePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast({
        title: "Promotion Deleted",
        description: "The promotion has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete promotion: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleOpenForm = (item?: Promotion) => {
    if (item) {
      setSelectedItem(item);
      setStartDate(new Date(item.start_date));
      setEndDate(new Date(item.end_date));
    } else {
      setSelectedItem(null);
      setStartDate(undefined);
      setEndDate(undefined);
    }
    setIsFormOpen(true);
  };
  
  const handleSubmit = async (data: FormValues) => {
    const formattedStartDate = format(startDate || new Date(), 'yyyy-MM-dd');
    const formattedEndDate = format(endDate || new Date(), 'yyyy-MM-dd');
    
    const promotionData = {
      ...data,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      delete_flag: false,
    };
    
    if (selectedItem) {
      await updateMutation.mutateAsync({ id: selectedItem.id, ...promotionData });
    } else {
      await createMutation.mutateAsync(promotionData as Omit<Promotion, "id" | "created_at" | "updated_at">);
    }
  };
  
  const handleConfirmDelete = async () => {
    if (selectedItem) {
      await deleteMutation.mutateAsync(selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };
  
  const handleDeleteClick = (item: Promotion) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };
  
  const columns = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Description', accessorKey: 'description' },
    { header: 'Discount Rate', accessorKey: 'discount_rate', cell: (item: Promotion) => `${item.discount_rate}%` },
    { header: 'Start Date', accessorKey: 'start_date' },
    { header: 'End Date', accessorKey: 'end_date' },
  ];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Promotions</h1>
        <Button onClick={() => handleOpenForm()}>Add New</Button>
      </div>
      
      <DataTable
        data={promotions}
        columns={columns}
        onEdit={handleOpenForm}
        onDelete={handleDeleteClick}
        searchFields={['name', 'description']}
        idField="id"
      />
      
      <DataForm
        schema={promotionSchema}
        defaultValues={selectedItem ? {
          name: selectedItem.name,
          description: selectedItem.description,
          discount_rate: selectedItem.discount_rate,
          start_date: selectedItem.start_date,
          end_date: selectedItem.end_date,
        } : {
          name: '',
          description: '',
          discount_rate: 0,
          start_date: '',
          end_date: '',
        }}
        onSubmit={handleSubmit}
        title={selectedItem ? 'Edit Promotion' : 'Add Promotion'}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
                <Input {...field} type="number" min="0" max="100" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                      }}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      disabled={(date) => {
                        return startDate ? date < startDate : false;
                      }}
                    />
                  </PopoverContent>
                </Popover>
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
              This action cannot be undone. This will permanently delete the promotion.
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
