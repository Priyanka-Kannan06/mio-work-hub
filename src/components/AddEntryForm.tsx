
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DashboardEntry } from '@/types/dashboard';
import { Save, Upload } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';

interface AddEntryFormProps {
  onSubmit: (entry: Omit<DashboardEntry, 'id' | 'created_at'>) => Promise<void>;
}

export const AddEntryForm = ({ onSubmit }: AddEntryFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { uploadFile } = useDashboard();
  
  const [formData, setFormData] = useState({
    work_reference_mail: '',
    mail_date: '',
    quotation_no: '',
    work_order_no: '',
    start_fieldwork_date: '',
    end_fieldwork_date: '',
    report_submission_date: '',
    invoice_number: '',
    expected_payment_date: '',
    payment_received_date: '',
    total_amount_inr: 0,
    amount_received_inr: 0,
    tds_amount: 0,
    gst_amount: 0,
  });

  const [files, setFiles] = useState({
    work_quotation_src: null as File | null,
    work_quotation_pdf: null as File | null,
    work_order_file: null as File | null,
    report_file: null as File | null,
    invoice_src_file: null as File | null,
    invoice_pdf_file: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Upload files and get URLs
      const fileUrls: Record<string, string | undefined> = {};
      
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          const timestamp = Date.now();
          const filePath = `${formData.quotation_no}/${key}_${timestamp}_${file.name}`;
          const url = await uploadFile(file, filePath);
          if (url) {
            fileUrls[key] = url;
          }
        }
      }

      const entryData = {
        ...formData,
        ...fileUrls,
        mail_date: new Date(formData.mail_date),
        start_fieldwork_date: new Date(formData.start_fieldwork_date),
        end_fieldwork_date: new Date(formData.end_fieldwork_date),
        report_submission_date: new Date(formData.report_submission_date),
        expected_payment_date: new Date(formData.expected_payment_date),
        payment_received_date: formData.payment_received_date ? new Date(formData.payment_received_date) : undefined,
      };

      await onSubmit(entryData);
      
      toast({
        title: "Entry Added",
        description: "Project entry has been successfully added with documents",
      });
      
      // Reset form
      setFormData({
        work_reference_mail: '',
        mail_date: '',
        quotation_no: '',
        work_order_no: '',
        start_fieldwork_date: '',
        end_fieldwork_date: '',
        report_submission_date: '',
        invoice_number: '',
        expected_payment_date: '',
        payment_received_date: '',
        total_amount_inr: 0,
        amount_received_inr: 0,
        tds_amount: 0,
        gst_amount: 0,
      });
      
      setFiles({
        work_quotation_src: null,
        work_quotation_pdf: null,
        work_order_file: null,
        report_file: null,
        invoice_src_file: null,
        invoice_pdf_file: null,
      });
    } catch (error) {
      console.error('Error adding entry:', error);
      toast({
        title: "Error",
        description: "Failed to add entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5" />
          Add New Project Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="work_reference_mail">Work Reference Mail</Label>
              <Input
                id="work_reference_mail"
                value={formData.work_reference_mail}
                onChange={(e) => handleInputChange('work_reference_mail', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="mail_date">Mail Date</Label>
              <Input
                id="mail_date"
                type="date"
                value={formData.mail_date}
                onChange={(e) => handleInputChange('mail_date', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Quotation Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quotation_no">Quotation Number</Label>
              <Input
                id="quotation_no"
                value={formData.quotation_no}
                onChange={(e) => handleInputChange('quotation_no', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="work_order_no">Work Order Number</Label>
              <Input
                id="work_order_no"
                value={formData.work_order_no}
                onChange={(e) => handleInputChange('work_order_no', e.target.value)}
                required
              />
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">File Uploads</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="work_quotation_src">Work Quotation Source</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input 
                    type="file" 
                    id="work_quotation_src" 
                    accept=".pdf,.doc,.docx" 
                    onChange={(e) => handleFileChange('work_quotation_src', e.target.files?.[0] || null)}
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <Label htmlFor="work_quotation_pdf">Work Quotation PDF</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input 
                    type="file" 
                    id="work_quotation_pdf" 
                    accept=".pdf" 
                    onChange={(e) => handleFileChange('work_quotation_pdf', e.target.files?.[0] || null)}
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <Label htmlFor="work_order_file">Work Order File</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input 
                    type="file" 
                    id="work_order_file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={(e) => handleFileChange('work_order_file', e.target.files?.[0] || null)}
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <Label htmlFor="report_file">Report File</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input 
                    type="file" 
                    id="report_file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={(e) => handleFileChange('report_file', e.target.files?.[0] || null)}
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <Label htmlFor="invoice_src_file">Invoice Source File</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input 
                    type="file" 
                    id="invoice_src_file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={(e) => handleFileChange('invoice_src_file', e.target.files?.[0] || null)}
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <Label htmlFor="invoice_pdf_file">Invoice PDF File</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input 
                    type="file" 
                    id="invoice_pdf_file" 
                    accept=".pdf" 
                    onChange={(e) => handleFileChange('invoice_pdf_file', e.target.files?.[0] || null)}
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="start_fieldwork_date">Start Fieldwork Date</Label>
              <Input
                id="start_fieldwork_date"
                type="date"
                value={formData.start_fieldwork_date}
                onChange={(e) => handleInputChange('start_fieldwork_date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_fieldwork_date">End Fieldwork Date</Label>
              <Input
                id="end_fieldwork_date"
                type="date"
                value={formData.end_fieldwork_date}
                onChange={(e) => handleInputChange('end_fieldwork_date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="report_submission_date">Report Submission Date</Label>
              <Input
                id="report_submission_date"
                type="date"
                value={formData.report_submission_date}
                onChange={(e) => handleInputChange('report_submission_date', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoice_number">Invoice Number</Label>
                <Input
                  id="invoice_number"
                  value={formData.invoice_number}
                  onChange={(e) => handleInputChange('invoice_number', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="total_amount_inr">Total Amount (INR)</Label>
                <Input
                  id="total_amount_inr"
                  type="number"
                  value={formData.total_amount_inr}
                  onChange={(e) => handleInputChange('total_amount_inr', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount_received_inr">Amount Received (INR)</Label>
                <Input
                  id="amount_received_inr"
                  type="number"
                  value={formData.amount_received_inr}
                  onChange={(e) => handleInputChange('amount_received_inr', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="tds_amount">TDS Amount</Label>
                <Input
                  id="tds_amount"
                  type="number"
                  value={formData.tds_amount}
                  onChange={(e) => handleInputChange('tds_amount', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="gst_amount">GST Amount</Label>
                <Input
                  id="gst_amount"
                  type="number"
                  value={formData.gst_amount}
                  onChange={(e) => handleInputChange('gst_amount', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Payment Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expected_payment_date">Expected Payment Date</Label>
              <Input
                id="expected_payment_date"
                type="date"
                value={formData.expected_payment_date}
                onChange={(e) => handleInputChange('expected_payment_date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="payment_received_date">Payment Received Date</Label>
              <Input
                id="payment_received_date"
                type="date"
                value={formData.payment_received_date}
                onChange={(e) => handleInputChange('payment_received_date', e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding Entry...' : 'Add Entry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
