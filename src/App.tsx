
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Employee pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import NewInvoice from "./pages/employee/NewInvoice";
import InvoiceList from "./pages/employee/InvoiceList";
import Messages from "./pages/employee/Messages";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import EmployeeList from "./pages/admin/EmployeeList";
import NewEmployee from "./pages/admin/NewEmployee";
import EmployeeInvoices from "./pages/admin/EmployeeInvoices";
import SendMessage from "./pages/admin/SendMessage";
import AllInvoices from "./pages/admin/AllInvoices";

const queryClient = new QueryClient();

const App = () => {
  // Initialize localStorage with demo data if empty
  React.useEffect(() => {
    if (!localStorage.getItem('employees')) {
      localStorage.setItem('employees', JSON.stringify([]));
    }
    if (!localStorage.getItem('invoices')) {
      localStorage.setItem('invoices', JSON.stringify([]));
    }
    if (!localStorage.getItem('messages')) {
      localStorage.setItem('messages', JSON.stringify([]));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Employee routes */}
              <Route path="/employee" element={<DashboardLayout requiredRole="employee" />}>
                <Route path="dashboard" element={<EmployeeDashboard />} />
                <Route path="new-invoice" element={<NewInvoice />} />
                <Route path="invoices" element={<InvoiceList />} />
                <Route path="messages" element={<Messages />} />
              </Route>
              
              {/* Admin routes */}
              <Route path="/admin" element={<DashboardLayout requiredRole="admin" />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="employees" element={<EmployeeList />} />
                <Route path="new-employee" element={<NewEmployee />} />
                <Route path="employees/:employeeId/invoices" element={<EmployeeInvoices />} />
                <Route path="employees/:employeeId/message" element={<SendMessage />} />
                <Route path="invoices" element={<AllInvoices />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
