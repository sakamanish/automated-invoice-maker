
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Invoice, InvoiceItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const formSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerGst: z.string().min(1, 'GST number is required'),
});

type FormValues = z.infer<typeof formSchema>;

const NewInvoice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: uuidv4(), name: '', quantity: 1, rate: 0, amount: 0 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      customerGst: '',
    },
  });

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Recalculate amount if quantity or rate changes
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.rate);
          }
          return updatedItem;
        }
        return item;
      });
    });
  };

  const addItem = () => {
    setItems(prevItems => [
      ...prevItems,
      { id: uuidv4(), name: '', quantity: 1, rate: 0, amount: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } else {
      toast({
        title: 'Cannot remove item',
        description: 'Invoice must have at least one item',
        variant: 'destructive',
      });
    }
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const onSubmit = async (formData: FormValues) => {
    // Validate items
    const invalidItems = items.some(item => !item.name || item.quantity <= 0 || item.rate <= 0);
    
    if (invalidItems) {
      toast({
        title: 'Invalid items',
        description: 'All items must have a name, quantity, and rate',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create invoice object
      const invoice: Invoice = {
        id: uuidv4(),
        employee_id: user!.id,
        customer_name: formData.customerName,
        customer_gst: formData.customerGst,
        items: items,
        total_amount: calculateTotal(),
        invoice_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      
      // In production, this would be a Supabase insert
      // For demo, we'll use localStorage
      const existingInvoices = localStorage.getItem('invoices');
      const invoices = existingInvoices ? JSON.parse(existingInvoices) : [];
      invoices.push(invoice);
      localStorage.setItem('invoices', JSON.stringify(invoices));
      
      toast({
        title: 'Invoice created',
        description: `Invoice #${invoice.id.substring(0, 8)} has been created successfully`,
      });
      
      navigate('/employee/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to create invoice',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-business-800">New Invoice</h1>
        <div className="text-sm text-business-500">
          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg text-business-700">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerGst"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter GST number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-business-700">Invoice Items</CardTitle>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addItem}
                className="gap-2"
              >
                <Plus className="h-4 w-4" /> Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Item Name</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input 
                          value={item.name} 
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          placeholder="Item description"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input 
                          type="number"
                          min="1"
                          value={item.quantity} 
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-20 ml-auto"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input 
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate} 
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-24 ml-auto"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${item.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-business-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-base font-semibold text-business-800">Total Amount:</div>
              <div className="text-lg font-bold text-business-800">
                ${calculateTotal().toFixed(2)}
              </div>
            </CardFooter>
          </Card>

          <div className="flex justify-end">
            <Button 
              type="submit"
              className="bg-business-700 hover:bg-business-800 gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Invoice
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewInvoice;
