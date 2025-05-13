
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Message } from '@/types';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
  });

  // Fetch messages and stats (in production, this would use Supabase queries)
  useEffect(() => {
    if (user) {
      // Load messages from localStorage (demo purposes only)
      const storedMessages = localStorage.getItem('messages');
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        const employeeMessages = parsedMessages.filter(
          (message: Message) => message.to_id === user.id
        );
        setMessages(employeeMessages);
      }

      // Load invoice stats
      const storedInvoices = localStorage.getItem('invoices');
      if (storedInvoices) {
        const parsedInvoices = JSON.parse(storedInvoices);
        const employeeInvoices = parsedInvoices.filter(
          (invoice: any) => invoice.employee_id === user.id
        );
        
        setStats({
          totalInvoices: employeeInvoices.length,
          totalAmount: employeeInvoices.reduce(
            (sum: number, invoice: any) => sum + invoice.total_amount, 
            0
          ),
        });
      }
    }
  }, [user]);

  // Mark messages as read
  useEffect(() => {
    if (messages.length && user) {
      const updatedMessages = messages.map(msg => ({ ...msg, read: true }));
      
      // Update in state
      setMessages(updatedMessages);
      
      // Update in local storage (demo purposes)
      const storedMessages = localStorage.getItem('messages');
      if (storedMessages) {
        const allMessages = JSON.parse(storedMessages);
        const otherMessages = allMessages.filter(
          (message: Message) => message.to_id !== user.id
        );
        
        localStorage.setItem(
          'messages', 
          JSON.stringify([...otherMessages, ...updatedMessages])
        );
      }
    }
  }, [messages, user]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-business-800">
        Welcome back, {user?.email}
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-business-700">Invoice Stats</CardTitle>
            <CardDescription>Your invoice activity summary</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 grid-cols-2">
            <div className="rounded-lg border p-3">
              <p className="text-sm text-business-500">Total Invoices</p>
              <p className="text-2xl font-bold text-business-800">{stats.totalInvoices}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-business-500">Total Amount</p>
              <p className="text-2xl font-bold text-business-800">
                ${stats.totalAmount.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-business-700">Messages</CardTitle>
            <CardDescription>Messages from administration</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[200px] overflow-auto">
            {messages.length === 0 ? (
              <p className="text-sm text-business-500 py-2">No new messages</p>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="rounded-lg border p-3">
                    <div className="text-xs text-business-400 mb-1">
                      {new Date(message.created_at).toLocaleString()}
                    </div>
                    <p className="text-sm text-business-700">{message.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
