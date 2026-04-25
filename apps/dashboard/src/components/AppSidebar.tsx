import { Link, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '~/components/ui/sidebar'

const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/products',
    icon: Package,
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: ShoppingCart,
  }
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar collapsible="icon">
          <SidebarHeader className="border-b h-16 flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 w-full">
              <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                <Package className="size-6" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold text-base">Admin Shop</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className='space-y-2'>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.title}
                        isActive={location.pathname === item.href}
                        className="h-10"
                      >
                        <Link to={item.href}>
                          <item.icon className="size-5" />
                          <span className="text-sm font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton variant="outline" asChild tooltip="Logout">
                  <Link to="/logout">
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
      )
    }
