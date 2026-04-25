import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
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

export const Route = createFileRoute('/_authed/orders')({
  component: OrdersPage,
})

function OrdersPage() {
  const { accessToken } = useAuth()
  
  const { data, isLoading } = useQuery({
    queryKey: ['orders', accessToken],
    queryFn: () => ordersApi.list(accessToken!),
    enabled: !!accessToken,
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          View and manage customer orders.
        </p>
      </div>

      <div className="border rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || !accessToken ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                </TableRow>
              ))
            ) : (
              data?.orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                  <TableCell>{order.userId.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <span className="capitalize px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
