
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DashboardEntry } from '@/types/dashboard';
import { Save, Upload, X } from 'lucide-react';

interface EditEntryFormProps {
  entry: DashboardEntry;
  onSubmit: (id: string, updates: Partial<DashboardEntry>) => Promise<void>;
  onCancel: () => void;
}

export const EditEntryForm = ({ entry, onSubmit, onCancel }: EditEntryFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    work_reference_mail: entry.work_reference_mail,
    mail_date: entry.mail_date.toISOString().split('T')[0],
    quotation_no: entry.quotation_no,
    work_order_no: entry.work_order_no,
    start_fieldwork_date: entry.start_fieldwork_date.toISOString().split('T')[0],
    end_fieldwork_date: entry.end_fieldwork_date.toISOString().split('T')[0],
    report_submission_date: entry.report_submission_date.toISOString().split('T')[0],
    expected_payment_date: entry.expected_payment_date.toISOString().split('T')[0],
    payment_received_date: entry.payment_received_date ? entry.payment_received_date.toISOString().split('T')[0] : '',
    total_amount_inr: entry.total_amount_inr,
    amount_received_inr: entry.amount_received_inr,
    tds_amount: entry.tds_amount,
    gst_amount: entry.gst_amount,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(entry.id, {
        ...formData,
        mail_date: new Date(formData.mail_date),
        start_fieldwork_date: new Date(formData.start_fieldwork_date),
        end_fieldwork_date: new Date(formData.end_fieldwork_date),
        report_submission_date: new Date(formData.report_submission_date),
        expected_payment_date: new Date(formData.expected_payment_date),
        payment_received_date: formData.payment_received_date ? new Date(formData.payment_received_date) : undefined,
      });
      
      toast({
        title: "Entry Updated",
        description: "Project entry has been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5" />
          Edit Project Entry
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

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating Entry...' : 'Update Entry'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
