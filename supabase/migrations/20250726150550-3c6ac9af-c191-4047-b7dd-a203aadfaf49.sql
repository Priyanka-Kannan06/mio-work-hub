
-- Create dashboard_entries table
CREATE TABLE public.dashboard_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  work_reference_mail TEXT NOT NULL,
  mail_date DATE NOT NULL,
  quotation_no TEXT NOT NULL,
  work_quotation_src TEXT,
  work_quotation_pdf TEXT,
  work_order_no TEXT NOT NULL,
  work_order_file TEXT,
  start_fieldwork_date DATE NOT NULL,
  end_fieldwork_date DATE NOT NULL,
  report_submission_date DATE NOT NULL,
  report_file TEXT,
  invoice_number TEXT NOT NULL,
  invoice_src_file TEXT,
  invoice_pdf_file TEXT,
  expected_payment_date DATE NOT NULL,
  payment_received_date DATE,
  total_amount_inr DECIMAL(10,2) NOT NULL DEFAULT 0,
  amount_received_inr DECIMAL(10,2) NOT NULL DEFAULT 0,
  tds_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  gst_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('dashboard-documents', 'dashboard-documents', true);

-- Create RLS policies for dashboard_entries table
ALTER TABLE public.dashboard_entries ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations for now (you can restrict later if needed)
CREATE POLICY "Allow all operations on dashboard_entries" ON public.dashboard_entries
  FOR ALL USING (true);

-- Create storage policies for dashboard-documents bucket
CREATE POLICY "Allow public access to dashboard documents" ON storage.objects
  FOR ALL USING (bucket_id = 'dashboard-documents');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_dashboard_entries_updated_at 
  BEFORE UPDATE ON public.dashboard_entries 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
