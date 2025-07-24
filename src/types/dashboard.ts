
export interface DashboardEntry {
  id: string;
  work_reference_mail: string;
  mail_date: Date;
  quotation_no: string;
  work_quotation_src?: File;
  work_quotation_pdf?: File;
  work_order_no: string;
  work_order_file?: File;
  start_fieldwork_date: Date;
  end_fieldwork_date: Date;
  report_submission_date: Date;
  report_file?: File;
  invoice_number: string;
  invoice_src_file?: File;
  invoice_pdf_file?: File;
  expected_payment_date: Date;
  payment_received_date?: Date;
  total_amount_inr: number;
  amount_received_inr: number;
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
