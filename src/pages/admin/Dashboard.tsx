
import React, { useEffect, useState } from 'react';
import { Employee, Invoice } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalInvoices: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    // In production, this would be Supabase queries
    // For demo, we're using localStorage
    
    // Load employees
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      const parsedEmployees = JSON.parse(storedEmployees);
      setEmployees(parsedEmployees);
      setStats(prev => ({ ...prev, totalEmployees: parsedEmployees.length }));
    }
    
    // Load invoice stats
    const storedInvoices = localStorage.getItem('invoices');
    if (storedInvoices) {
      const parsedInvoices = JSON.parse(storedInvoices);
      setStats(prev => ({
        ...prev,
        totalInvoices: parsedInvoices.length,
        totalAmount: parsedInvoices.reduce(
          (sum: number, invoice: Invoice) => sum + invoice.total_amount, 
          0
        ),
      }));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-business-800">Admin Dashboard</h1>
        <Button asChild className="bg-business-700 hover:bg-business-800 gap-2">
          <Link to="/admin/new-employee">
            <UserPlus className="h-4 w-4" />
            New Employee
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-business-500">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-business-800">{stats.totalEmployees}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-business-500">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-business-800">{stats.totalInvoices}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-business-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-business-800">${stats.totalAmount.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-business-700">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-business-600">
            Welcome to the admin dashboard. From here you can manage employees, view invoices, and send messages.
          </p>
          <div className="mt-4 grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link to="/admin/employees">
                View All Employees
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/admin/invoices">
                View All Invoices
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
