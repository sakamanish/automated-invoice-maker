
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Employee } from '@/types';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof formSchema>;

const NewEmployee = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (formData: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // In production, this would create a user in Supabase Auth
      // For demo, we'll use localStorage
      
      // Check if email is already used
      const storedEmployees = localStorage.getItem('employees');
      const employees = storedEmployees ? JSON.parse(storedEmployees) : [];
      const emailExists = employees.some(
        (emp: Employee) => emp.email === formData.email
      );
      
      if (emailExists) {
        toast({
          title: 'Error',
          description: 'An employee with this email already exists',
          variant: 'destructive',
        });
        return;
      }
      
      // Create new employee
      const newEmployee: Employee = {
        id: uuidv4(),
        email: formData.email,
        role: 'employee',
        created_at: new Date().toISOString(),
      };
      
      // Save to localStorage
      employees.push(newEmployee);
      localStorage.setItem('employees', JSON.stringify(employees));
      
      toast({
        title: 'Employee created',
        description: `Employee account for ${formData.email} has been created`,
      });
      
      // In a real app, we'd send an email to the user with instructions
      // For demo, just show the default password
      toast({
        title: 'Default password set',
        description: 'Default password is: password123',
      });
      
      navigate('/admin/employees');
    } catch (error) {
      console.error('Error creating employee:', error);
      toast({
        title: 'Error',
        description: 'Failed to create employee',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-business-800">Add New Employee</h1>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg text-business-700">Employee Details</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="employee@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-sm text-business-500">
                The employee will receive an account with a default password that they can change later.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                className="bg-business-700 hover:bg-business-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Creating...
                  </span>
                ) : (
                  'Create Employee'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default NewEmployee;
