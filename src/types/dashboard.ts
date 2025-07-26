
export interface DashboardEntry {
  id: string;
  work_reference_mail: string;
  invoice_number: string; // Changed from mail_date
  quotation_no: string;
  work_quotation_src?: File | string;
  work_quotation_pdf?: File | string;
  work_order_no: string;
  work_order_file?: File | string;
  start_fieldwork_date: Date;
  end_fieldwork_date: Date;
  report_submission_date: Date;
  report_file?: File | string;
  invoice_src_file?: File | string;
  invoice_pdf_file?: File | string;
  expected_payment_date: Date;
  payment_received_date?: Date;
  total_amount: number; // Changed from total_amount_inr
  amount_received: number; // Changed from amount_received_inr
  tds_amount: number;
  gst_amount: number;
  created_at: Date;
}

export interface FilterOptions {
  dateRange?: 'last10days' | 'last30days' | 'custom';
  quotationNo?: string;
  workOrderNo?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface User {
  id: string;
  email: string;
  role: 'admin';
}
