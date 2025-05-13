
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Message } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (user) {
      // In production, this would be a Supabase query
      // For demo, we're using localStorage
      const storedMessages = localStorage.getItem('messages');
      if (storedMessages) {
        const allMessages = JSON.parse(storedMessages);
        const employeeMessages = allMessages.filter(
          (message: Message) => message.to_id === user.id
        );
        
        // Sort by date (newest first)
        employeeMessages.sort(
          (a: Message, b: Message) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        // Mark messages as read
        const updatedMessages = employeeMessages.map((msg: Message) => ({ ...msg, read: true }));
        
        // Update in state
        setMessages(updatedMessages);
        
        // Update in local storage
        const otherMessages = allMessages.filter(
          (message: Message) => message.to_id !== user.id
        );
        
        localStorage.setItem(
          'messages', 
          JSON.stringify([...otherMessages, ...updatedMessages])
        );
      }
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-business-800">Messages</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-business-700">Messages from Admin</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="py-8 text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-business-300" />
              <h3 className="mb-1 text-lg font-medium text-business-700">No messages</h3>
              <p className="text-business-500">You don't have any messages yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className="rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-business-700">From Admin</span>
                    <span className="text-xs text-business-500">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-business-700">{message.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Messages;
