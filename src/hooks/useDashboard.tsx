
import { useState, useEffect } from 'react';
import { DashboardEntry } from '@/types/dashboard';

export const useDashboard = () => {
  const [entries, setEntries] = useState<DashboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load mock data - replace with Supabase query
    const mockEntries: DashboardEntry[] = [
      {
        id: '1',
        work_reference_mail: 'project1@example.com',
        mail_date: new Date('2024-01-15'),
        quotation_no: 'Q001',
        work_order_no: 'WO001',
        start_fieldwork_date: new Date('2024-01-20'),
        end_fieldwork_date: new Date('2024-01-25'),
        report_submission_date: new Date('2024-01-30'),
        expected_payment_date: new Date('2024-02-15'),
        payment_received_date: new Date('2024-02-10'),
        total_amount_inr: 50000,
        amount_received_inr: 45000,
        tds_amount: 5000,
        gst_amount: 9000,
        created_at: new Date('2024-01-15'),
      },
      {
        id: '2',
        work_reference_mail: 'project2@example.com',
        mail_date: new Date('2024-01-20'),
        quotation_no: 'Q002',
        work_order_no: 'WO002',
        start_fieldwork_date: new Date('2024-01-25'),
        end_fieldwork_date: new Date('2024-02-05'),
        report_submission_date: new Date('2024-02-10'),
        expected_payment_date: new Date('2024-02-20'),
        total_amount_inr: 75000,
        amount_received_inr: 0,
        tds_amount: 7500,
        gst_amount: 13500,
        created_at: new Date('2024-01-20'),
      },
    ];
    
    setEntries(mockEntries);
    setLoading(false);
  }, []);

  const addEntry = async (entry: Omit<DashboardEntry, 'id' | 'created_at'>) => {
    // Mock implementation - replace with Supabase insert
    const newEntry: DashboardEntry = {
      ...entry,
      id: Date.now().toString(),
      created_at: new Date(),
    };
    setEntries(prev => [newEntry, ...prev]);
    return Promise.resolve();
  };

  const updateEntry = async (id: string, updates: Partial<DashboardEntry>) => {
    // Mock implementation - replace with Supabase update
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
    return Promise.resolve();
  };

  const downloadFile = async (fileUrl: string, filename: string) => {
    // Mock implementation - replace with Supabase storage download
    console.log('Downloading file:', filename);
    return Promise.resolve();
  };

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    downloadFile
  };
};
