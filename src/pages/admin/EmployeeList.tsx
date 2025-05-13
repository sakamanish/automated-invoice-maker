
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Employee } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, User, MessageSquare } from 'lucide-react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // In production, this would be a Supabase query
    // For demo, we're using localStorage
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      const parsedEmployees = JSON.parse(storedEmployees);
      setEmployees(parsedEmployees);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-business-800">Manage Employees</h1>
        <Button asChild className="bg-business-700 hover:bg-business-800 gap-2">
          <Link to="/admin/new-employee">
            <UserPlus className="h-4 w-4" />
            New Employee
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-business-700">All Employees</CardTitle>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="py-8 text-center">
              <User className="mx-auto mb-4 h-12 w-12 text-business-300" />
              <h3 className="mb-1 text-lg font-medium text-business-700">No employees yet</h3>
              <p className="text-business-500">Add your first employee to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.email}</TableCell>
                    <TableCell>
                      {new Date(employee.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link to={`/admin/employees/${employee.id}/invoices`}>
                            View Invoices
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="gap-1"
                        >
                          <Link to={`/admin/employees/${employee.id}/message`}>
                            <MessageSquare className="h-3.5 w-3.5" />
                            Message
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeList;
