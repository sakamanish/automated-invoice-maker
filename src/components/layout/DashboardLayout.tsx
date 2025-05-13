
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { SidebarNav } from './SidebarNav';

interface DashboardLayoutProps {
  requiredRole?: 'admin' | 'employee';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ requiredRole }) => {
  const { user, isLoading, logout, isAdmin, isEmployee } = useAuth();
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role
  if (
    (requiredRole === 'admin' && !isAdmin) || 
    (requiredRole === 'employee' && !isEmployee)
  ) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar className="border-r">
        <SidebarHeader className="px-4 py-6">
          <h1 className="text-xl font-bold text-business-800">
            {isAdmin ? 'Admin Dashboard' : 'Employee Portal'}
          </h1>
        </SidebarHeader>
        
        <SidebarContent className="px-4">
          <div className="mb-4 flex items-center gap-3 rounded-lg border p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-business-100">
              <User className="h-4 w-4 text-business-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-business-700">{user.email}</p>
              <p className="text-xs text-business-500 capitalize">{user.role}</p>
            </div>
          </div>
          
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarNav />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </SidebarFooter>
      </Sidebar>
      
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};
