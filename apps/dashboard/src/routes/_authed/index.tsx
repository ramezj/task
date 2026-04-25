import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '~/api/products'
import { ordersApi } from '~/api/orders'
import { useAuth } from '~/hooks/use-auth'
import { Skeleton } from '~/components/ui/skeleton'
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react'

export const Route = createFileRoute('/_authed/')({
  component: DashboardHome,
})

function DashboardHome() {
  const { accessToken } = useAuth()
  
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.list(),
  })

  const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders', accessToken],
    queryFn: () => ordersApi.list(accessToken!),
    enabled: !!accessToken,
  })

  const totalRevenue = ordersData?.orders.reduce((sum, order) => sum + order.totalAmount, 0) || 0
  const totalCustomers = new Set(ordersData?.orders.map(o => o.userId)).size

  const stats = [
    {
      title: 'Total Products',
      value: productsData?.products.length,
      isLoading: isLoadingProducts,
      icon: Package,
      color: 'text-blue-600',
    },
    {
      title: 'Active Orders',
      value: ordersData?.orders.length,
      isLoading: isLoadingOrders,
      icon: ShoppingCart,
      color: 'text-green-600',
    },
    {
      title: 'Total Customers',
      value: totalCustomers,
      isLoading: isLoadingOrders,
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      isLoading: isLoadingOrders,
      icon: DollarSign,
      color: 'text-yellow-600',
    },
  ]

  return (
    <div className="p-4 space-y-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="p-6 bg-card border rounded-xl shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
              <stat.icon className={`size-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold">
              {stat.isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                stat.value
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-6 bg-card border rounded-xl shadow-sm min-h-[300px] flex items-center justify-center text-muted-foreground">
          Recent Activity Chart (Coming Soon)
        </div>
        <div className="p-6 bg-card border rounded-xl shadow-sm min-h-[300px] flex items-center justify-center text-muted-foreground">
          Low Stock Alerts (Coming Soon)
        </div>
      </div>
    </div>
  )
}
