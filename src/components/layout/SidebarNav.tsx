
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Home,
  FileText,
  MessageSquare,
  Plus,
  Users,
} from 'lucide-react';

export function SidebarNav() {
  const { isAdmin } = useAuth();
  
  const employeeLinks = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/employee/dashboard',
    },
    {
      title: 'New Invoice',
      icon: Plus,
      href: '/employee/new-invoice',
    },
    {
      title: 'My Invoices',
      icon: FileText,
      href: '/employee/invoices',
    },
    {
      title: 'Messages',
      icon: MessageSquare,
      href: '/employee/messages',
    },
  ];
  
  const adminLinks = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/admin/dashboard',
    },
    {
      title: 'Employees',
      icon: Users,
      href: '/admin/employees',
    },
    {
      title: 'All Invoices',
      icon: FileText,
      href: '/admin/invoices',
    },
  ];

  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton asChild>
            <NavLink
              to={link.href}
              className={({ isActive }) =>
                isActive ? 'text-business-700 font-medium bg-business-100 rounded-md' : 'text-business-600'
              }
            >
              <link.icon className="h-5 w-5 mr-2" />
              <span>{link.title}</span>
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
