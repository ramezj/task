import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '~/api/orders'
import { useAuth } from '~/hooks/use-auth'
import { Skeleton } from '~/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '~/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useState } from 'react'
import { Loader2, Eye } from 'lucide-react'
import type { Order, OrderStatus } from '@task/types/order.js'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/_authed/orders')({
  component: OrdersPage,
})

const statuses: (OrderStatus | 'all')[] = [
  'all',
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

function OrdersPage() {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['orders', accessToken, selectedStatus],
    queryFn: () => ordersApi.list(accessToken!, { 
      status: selectedStatus === 'all' ? undefined : selectedStatus 
    }),
    enabled: !!accessToken,
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateStatus(accessToken!, id, { status }),
    onSuccess: (updatedData) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      if (selectedOrder?.id === updatedData.order.id) {
        setSelectedOrder(updatedData.order)
      }
    },
  })

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailOpen(true)
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
      case 'confirmed': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
      case 'processing': return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
      case 'shipped': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
      case 'delivered': return 'bg-green-500/10 text-green-600 border-green-500/20'
      case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
      </div>

      <Tabs 
        value={selectedStatus} 
        onValueChange={(v) => setSelectedStatus(v as OrderStatus | 'all')}
        className="w-full"
      >
        <TabsList className="bg-muted/50 p-1">
          {statuses.map((s) => (
            <TabsTrigger key={s} value={s} className="capitalize px-4">
              {s}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="border bg-card rounded-md">
        <Table className='rounded-md'>
          <TableHeader className='rounded-md'>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || !accessToken ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : (
              data?.orders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer group" onClick={() => openOrderDetail(order)}>
                  <TableCell className="font-mono text-xs text-muted-foreground uppercase">
                    {order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell className="font-mono text-xs uppercase text-muted-foreground">
                    {order.userId.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${order.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="group-hover:bg-accent">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Order Details
              <Badge variant="outline" className={`capitalize ${selectedOrder ? getStatusColor(selectedOrder.status) : ''}`}>
                {selectedOrder?.status}
              </Badge>
            </DialogTitle>
            <DialogDescription className="font-mono uppercase text-xs">
              ID: {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4">
                <div>
                  <p className="text-muted-foreground font-medium">Date</p>
                  <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Customer ID</p>
                  <p className="font-mono uppercase text-xs truncate">{selectedOrder.userId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">Total Amount</p>
                  <p className="text-lg font-bold text-primary">${selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground font-medium mb-1">Update Status</p>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => 
                      updateStatusMutation.mutate({ id: selectedOrder.id, status: value as OrderStatus })
                    }
                    disabled={updateStatusMutation.isPending}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.filter(s => s !== 'all').map((s) => (
                        <SelectItem key={s} value={s} className="capitalize">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2 border-b pb-2">
                  Items ({selectedOrder.items.length})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 group">
                      <div className="h-16 w-16 overflow-hidden bg-muted flex-shrink-0 border">
                        {item.productImageUrl ? (
                          <img 
                            src={item.productImageUrl} 
                            alt={item.productName || 'Product'} 
                            className="h-full w-full object-cover transition-transform group-hover:scale-110" 
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.productName || 'Unknown Product'}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} x ${item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {updateStatusMutation.isPending && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-[1px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
