
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

const NewEmployee = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: 'password123', // Default password
    },
  });

  const onSubmit = async (formData: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Check if email already exists
      const { data: existingUsers } = await supabase
        .from('users')
        .select('email')
        .eq('email', formData.email);
        
      if (existingUsers && existingUsers.length > 0) {
        toast({
          title: 'Error',
          description: 'An employee with this email already exists',
          variant: 'destructive',
        });
        return;
      }
      
      // Create new user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'employee'
          }
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('Failed to create user');
      }
      
      // User creation should trigger our database function to create the user record
      // But we'll manually insert it as well to be sure
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: formData.email,
          role: 'employee'
        });
        
      if (insertError) {
        console.error('Error creating user record:', insertError);
        // Not throwing here as the trigger might have already created the record
      }
      
      toast({
        title: 'Employee created',
        description: `Employee account for ${formData.email} has been created`,
      });
      
      toast({
        title: 'Default password set',
        description: 'Default password is: password123',
      });
      
      navigate('/admin/employees');
    } catch (error) {
      console.error('Error creating employee:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create employee',
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-business-500">
                      This is the initial password. The employee can change it later.
                    </p>
                  </FormItem>
                )}
              />
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
