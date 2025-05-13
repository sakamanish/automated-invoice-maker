
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft } from 'lucide-react';
import { Employee, Message } from '@/types';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

type FormValues = z.infer<typeof formSchema>;

const SendMessage = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  useEffect(() => {
    if (employeeId) {
      // In production, this would be a Supabase query
      // For demo, we're using localStorage
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
    }
  }, [employeeId]);

  const onSubmit = async (formData: FormValues) => {
    if (!user || !employee) return;
    
    try {
      setIsSubmitting(true);
      
      // Create message object
      const newMessage: Message = {
        id: uuidv4(),
        from_id: user.id,
        to_id: employee.id,
        content: formData.message,
        read: false,
        created_at: new Date().toISOString(),
      };
      
      // In production, this would be a Supabase insert
      // For demo, we'll use localStorage
      const existingMessages = localStorage.getItem('messages');
      const messages = existingMessages ? JSON.parse(existingMessages) : [];
      messages.push(newMessage);
      localStorage.setItem('messages', JSON.stringify(messages));
      
      toast({
        title: 'Message sent',
        description: `Your message has been sent to ${employee.email}`,
      });
      
      navigate(`/admin/employees/${employee.id}/invoices`);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Link to={`/admin/employees/${employee.id}/invoices`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-business-800">
          Send Message to {employee.email}
        </h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg text-business-700">Compose Message</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your message here..." 
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default SendMessage;
