
import { useQuery } from '@tanstack/react-query';
import { ShopOrder } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, FileDown } from 'lucide-react';
import { formatDistance } from 'date-fns';

const getOrders = async (): Promise<ShopOrder[]> => {
  // This would come from your API
  return [
    {
      id: "1234567890",
      user_id: "user1",
      order_date: new Date().toISOString(),
      payment_method_id: "pm1",
      shipping_address: "123 Main St",
      shipping_method: "standard",
      order_total: 99.99,
      order_status: "pending",
      delete_flag: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "2345678901",
      user_id: "user2",
      order_date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      payment_method_id: "pm2",
      shipping_address: "456 Oak Ave",
      shipping_method: "express",
      order_total: 149.99,
      order_status: "shipped",
      delete_flag: false,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "3456789012",
      user_id: "user3",
      order_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      payment_method_id: "pm1",
      shipping_address: "789 Pine St",
      shipping_method: "standard",
      order_total: 75.50,
      order_status: "delivered",
      delete_flag: false,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

const Orders = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">#{order.id.substring(0, 8)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{new Date(order.order_date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">
                      {formatDistance(new Date(order.order_date), new Date(), { addSuffix: true })}
                    </div>
                  </TableCell>
                  <TableCell>User #{order.user_id}</TableCell>
                  <TableCell className="font-medium">${order.order_total.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[order.order_status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
                    }`}>
                      {order.order_status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" /> View
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

export default Orders;
