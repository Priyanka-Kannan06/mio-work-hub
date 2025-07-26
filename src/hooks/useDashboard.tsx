
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardEntry } from '@/types/dashboard';

export const useDashboard = () => {
  const [entries, setEntries] = useState<DashboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('dashboard_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading entries:', error);
        return;
      }

      const formattedEntries: DashboardEntry[] = data.map(entry => ({
        ...entry,
        mail_date: new Date(entry.mail_date),
        start_fieldwork_date: new Date(entry.start_fieldwork_date),
        end_fieldwork_date: new Date(entry.end_fieldwork_date),
        report_submission_date: new Date(entry.report_submission_date),
        expected_payment_date: new Date(entry.expected_payment_date),
        payment_received_date: entry.payment_received_date ? new Date(entry.payment_received_date) : undefined,
        created_at: new Date(entry.created_at),
      }));

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('dashboard-documents')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('dashboard-documents')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const addEntry = async (entry: Omit<DashboardEntry, 'id' | 'created_at'>) => {
    try {
      console.log('Adding entry:', entry);
      
      // Prepare the data for insertion
      const insertData = {
        work_reference_mail: entry.work_reference_mail,
        mail_date: entry.mail_date.toISOString().split('T')[0],
        quotation_no: entry.quotation_no,
        work_quotation_src: typeof entry.work_quotation_src === 'string' ? entry.work_quotation_src : null,
        work_quotation_pdf: typeof entry.work_quotation_pdf === 'string' ? entry.work_quotation_pdf : null,
        work_order_no: entry.work_order_no,
        work_order_file: typeof entry.work_order_file === 'string' ? entry.work_order_file : null,
        start_fieldwork_date: entry.start_fieldwork_date.toISOString().split('T')[0],
        end_fieldwork_date: entry.end_fieldwork_date.toISOString().split('T')[0],
        report_submission_date: entry.report_submission_date.toISOString().split('T')[0],
        report_file: typeof entry.report_file === 'string' ? entry.report_file : null,
        invoice_number: entry.invoice_number,
        invoice_src_file: typeof entry.invoice_src_file === 'string' ? entry.invoice_src_file : null,
        invoice_pdf_file: typeof entry.invoice_pdf_file === 'string' ? entry.invoice_pdf_file : null,
        expected_payment_date: entry.expected_payment_date.toISOString().split('T')[0],
        payment_received_date: entry.payment_received_date ? entry.payment_received_date.toISOString().split('T')[0] : null,
        total_amount_inr: entry.total_amount_inr,
        amount_received_inr: entry.amount_received_inr,
        tds_amount: entry.tds_amount,
        gst_amount: entry.gst_amount,
      };

      const { data, error } = await supabase
        .from('dashboard_entries')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Error adding entry:', error);
        throw error;
      }

      console.log('Entry added successfully:', data);
      await loadEntries(); // Refresh entries
    } catch (error) {
      console.error('Error in addEntry:', error);
      throw error;
    }
  };

  const updateEntry = async (id: string, updates: Partial<DashboardEntry>) => {
    try {
      const updateData: any = {};
      
      // Convert dates to ISO strings for database
      Object.keys(updates).forEach(key => {
        const value = updates[key as keyof DashboardEntry];
        if (value instanceof Date) {
          updateData[key] = value.toISOString().split('T')[0];
        } else if (typeof value === 'string' || typeof value === 'number' || value === null || value === undefined) {
          updateData[key] = value;
        }
      });

      const { error } = await supabase
        .from('dashboard_entries')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating entry:', error);
        throw error;
      }

      await loadEntries(); // Refresh entries
    } catch (error) {
      console.error('Error in updateEntry:', error);
      throw error;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dashboard_entries')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting entry:', error);
        throw error;
      }

      await loadEntries(); // Refresh entries
    } catch (error) {
      console.error('Error in deleteEntry:', error);
      throw error;
    }
  };

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    uploadFile
  };
};
