import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Login } from '../components/Login'
import { getSupabaseServerClient } from '../utils/supabase'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '../components/ui/sidebar'
import { AppSidebar } from '../components/AppSidebar'

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      return {
        error: true,
        message: error.message,
      }
    }
  })

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }

    if (context.user.role !== 'admin') {
      throw new Error('Not authorized')
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === 'Not authorized') {
      return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Forbidden</h1>
          <p className="text-xl text-gray-600 mb-6">
            You do not have administrative privileges to access this dashboard.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.href = '/logout'}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )
    }

    throw error
  },
  component: AuthedLayout,
})

function AuthedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <h1>Dashboard</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
