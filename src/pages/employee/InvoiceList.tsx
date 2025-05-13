
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Invoice } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const InvoiceList = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (user) {
      // In production, this would be a Supabase query
      // For demo, we're using localStorage
      const storedInvoices = localStorage.getItem('invoices');
      if (storedInvoices) {
        const allInvoices = JSON.parse(storedInvoices);
        const employeeInvoices = allInvoices.filter(
          (invoice: Invoice) => invoice.employee_id === user.id
        );
        
        // Sort by date (newest first)
        employeeInvoices.sort(
          (a: Invoice, b: Invoice) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        setInvoices(employeeInvoices);
      }
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-business-800">My Invoices</h1>
        <Button asChild className="bg-business-700 hover:bg-business-800 gap-2">
          <Link to="/employee/new-invoice">
            <Plus className="h-4 w-4" />
            New Invoice
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
              <p className="text-business-500">Create your first invoice to get started</p>
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

export default InvoiceList;
