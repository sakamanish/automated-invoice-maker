
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Invoice, Employee } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText } from 'lucide-react';

const AllInvoices = () => {
  const [invoices, setInvoices] = useState<Array<Invoice & { employee_email?: string }>>([]);

  useEffect(() => {
    // In production, this would be a Supabase query with joins
    // For demo, we're using localStorage
    
    // Get invoices
    const storedInvoices = localStorage.getItem('invoices');
    if (!storedInvoices) return;
    
    // Get employees to map IDs to names
    const storedEmployees = localStorage.getItem('employees');
    const employees = storedEmployees ? JSON.parse(storedEmployees) : [];
    
    // Map employees to invoices
    const parsedInvoices = JSON.parse(storedInvoices);
    const enhancedInvoices = parsedInvoices.map((invoice: Invoice) => {
      const employee = employees.find(
        (emp: Employee) => emp.id === invoice.employee_id
      );
      return {
        ...invoice,
        employee_email: employee?.email || 'Unknown',
      };
    });
    
    // Sort by date (newest first)
    enhancedInvoices.sort(
      (a: Invoice, b: Invoice) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    setInvoices(enhancedInvoices);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-business-800">All Invoices</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-business-700">
            All Company Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="py-8 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-business-300" />
              <h3 className="mb-1 text-lg font-medium text-business-700">No invoices yet</h3>
              <p className="text-business-500">Your employees haven't created any invoices</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Customer</TableHead>
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
                    <TableCell>
                      <Link 
                        to={`/admin/employees/${invoice.employee_id}/invoices`}
                        className="text-business-700 hover:underline"
                      >
                        {invoice.employee_email}
                      </Link>
                    </TableCell>
                    <TableCell>{invoice.customer_name}</TableCell>
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

export default AllInvoices;
