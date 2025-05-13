
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Employee, Invoice } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageSquare, ArrowLeft, FileText } from 'lucide-react';

const EmployeeInvoices = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (employeeId) {
      // In production, this would be a Supabase query
      // For demo, we're using localStorage
      
      // Get employee
      const storedEmployees = localStorage.getItem('employees');
      if (storedEmployees) {
        const parsedEmployees = JSON.parse(storedEmployees);
        const foundEmployee = parsedEmployees.find(
          (emp: Employee) => emp.id === employeeId
        );
        if (foundEmployee) {
          setEmployee(foundEmployee);
        }
      }
      
      // Get invoices
      const storedInvoices = localStorage.getItem('invoices');
      if (storedInvoices) {
        const parsedInvoices = JSON.parse(storedInvoices);
        const employeeInvoices = parsedInvoices.filter(
          (invoice: Invoice) => invoice.employee_id === employeeId
        );
        
        // Sort by date (newest first)
        employeeInvoices.sort(
          (a: Invoice, b: Invoice) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        setInvoices(employeeInvoices);
      }
    }
  }, [employeeId]);

  if (!employee) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Employee not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/admin/employees">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-business-800">
          Invoices for {employee.email}
        </h1>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          className="gap-1"
          asChild
        >
          <Link to={`/admin/employees/${employee.id}/message`}>
            <MessageSquare className="h-4 w-4" />
            Send Message
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-business-700">All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="py-8 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-business-300" />
              <h3 className="mb-1 text-lg font-medium text-business-700">No invoices yet</h3>
              <p className="text-business-500">This employee hasn't created any invoices</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>GST Number</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.invoice_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{invoice.customer_name}</TableCell>
                    <TableCell>{invoice.customer_gst}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${invoice.total_amount.toFixed(2)}
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

export default EmployeeInvoices;
