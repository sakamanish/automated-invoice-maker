
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Settings, MessageSquare } from 'lucide-react';

const Index = () => {
  const { user, isAdmin, isEmployee } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else if (isEmployee) {
        navigate('/employee/dashboard');
      }
    }
  }, [user, isAdmin, isEmployee, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-business-50 to-business-100 flex flex-col">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-business-800">InvoicePro</h1>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
      </header>

      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-business-800 mb-6">
            Business Invoice Management Made Simple
          </h2>
          <p className="text-lg text-business-600 mb-10">
            Streamline your invoicing process with our comprehensive solution for businesses.
            Create, manage, and track invoices with ease.
          </p>

          <Button 
            size="lg" 
            className="bg-business-700 hover:bg-business-800 text-lg"
            onClick={() => navigate('/login')}
          >
            Get Started
          </Button>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 rounded-full bg-business-100 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-business-600" />
            </div>
            <h3 className="text-xl font-bold text-business-800 mb-2">
              Easy Invoice Generation
            </h3>
            <p className="text-business-600">
              Create professional invoices in seconds with our intuitive interface.
              Add items, calculate totals, and manage GST numbers effortlessly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 rounded-full bg-business-100 flex items-center justify-center mb-4">
              <Settings className="h-6 w-6 text-business-600" />
            </div>
            <h3 className="text-xl font-bold text-business-800 mb-2">
              Complete Admin Control
            </h3>
            <p className="text-business-600">
              Administrators can manage employees, view all invoices, and track 
              business performance through a comprehensive dashboard.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 rounded-full bg-business-100 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-business-600" />
            </div>
            <h3 className="text-xl font-bold text-business-800 mb-2">
              Internal Communication
            </h3>
            <p className="text-business-600">
              Keep your team aligned with our built-in messaging system. Admins can
              send important updates directly to employees.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-business-800 text-business-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2023 InvoicePro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
