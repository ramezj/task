import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '~/api/products'
import { ordersApi } from '~/api/orders'
import { useAuth } from '~/hooks/use-auth'
import { Skeleton } from '~/components/ui/skeleton'
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

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
  
  const today = new Date().toISOString().split('T')[0]
  const ordersToday = ordersData?.orders.filter(order => 
    order.createdAt.startsWith(today)
  ).length || 0

  const activeProducts = productsData?.products.filter(p => p.isActive).length || 0

  const stats = [
    {
      title: 'Orders Today',
      value: ordersToday,
      isLoading: isLoadingOrders,
      icon: ShoppingCart,
      description: 'New orders placed today',
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      isLoading: isLoadingOrders,
      icon: DollarSign,
      description: 'Gross revenue from all orders',
    },
    {
      title: 'Active Products',
      value: activeProducts,
      isLoading: isLoadingProducts,
      icon: Package,
      description: 'Products currently listed',
    },
    {
      title: 'Growth',
      value: '+12.5%',
      isLoading: false,
      icon: TrendingUp,
      description: 'Revenue growth this month',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Keep track of your shop's performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  stat.value
                )}
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="w-full">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            Chart (Coming Soon)
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
