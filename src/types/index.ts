
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'employee';
  created_at: string;
}

export interface Employee extends User {
  role: 'employee';
}

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  employee_id: string;
  customer_name: string;
  customer_gst: string;
  items: InvoiceItem[];
  total_amount: number;
  invoice_date: string;
  created_at: string;
}

export interface Message {
  id: string;
  from_id: string;
  to_id: string;
  content: string;
  read: boolean;
  created_at: string;
}
