
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardEntry } from '@/types/dashboard';
import { Download, FileText, Calendar, DollarSign, Mail } from 'lucide-react';

interface EntryDetailsModalProps {
  entry: DashboardEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EntryDetailsModal = ({ entry, isOpen, onClose }: EntryDetailsModalProps) => {
  if (!entry) return null;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getPaymentStatus = () => {
    if (entry.payment_received_date) {
      return <Badge variant="default">Paid</Badge>;
    }
    const now = new Date();
    const expectedDate = new Date(entry.expected_payment_date);
    if (expectedDate < now) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  const FileDownloadLink = ({ file, label }: { file?: File; label: string }) => {
    if (!file) return <span className="text-muted-foreground">Not uploaded</span>;
    
    const handleDownload = () => {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {file.name}
      </Button>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Entry Details - {entry.quotation_no}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Basic Information
              </h3>
              <div className="space-y-2 text-sm">
                <div><strong>Reference Mail:</strong> {entry.work_reference_mail}</div>
                <div><strong>Mail Date:</strong> {formatDate(entry.mail_date)}</div>
                <div><strong>Quotation No:</strong> {entry.quotation_no}</div>
                <div><strong>Work Order No:</strong> {entry.work_order_no}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </h3>
              <div className="space-y-2 text-sm">
                <div><strong>Start Fieldwork:</strong> {formatDate(entry.start_fieldwork_date)}</div>
                <div><strong>End Fieldwork:</strong> {formatDate(entry.end_fieldwork_date)}</div>
                <div><strong>Report Submission:</strong> {formatDate(entry.report_submission_date)}</div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div><strong>Invoice Number:</strong> {entry.invoice_number}</div>
                <div><strong>Total Amount:</strong> {formatCurrency(entry.total_amount_inr)}</div>
                <div><strong>Amount Received:</strong> {formatCurrency(entry.amount_received_inr)}</div>
              </div>
              <div className="space-y-2">
                <div><strong>TDS Amount:</strong> {formatCurrency(entry.tds_amount)}</div>
                <div><strong>GST Amount:</strong> {formatCurrency(entry.gst_amount)}</div>
                <div><strong>Payment Status:</strong> {getPaymentStatus()}</div>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <div><strong>Expected Payment Date:</strong> {formatDate(entry.expected_payment_date)}</div>
              {entry.payment_received_date && (
                <div><strong>Payment Received Date:</strong> {formatDate(entry.payment_received_date)}</div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Work Quotation Source:</label>
                  <div className="mt-1">
                    <FileDownloadLink file={entry.work_quotation_src} label="Work Quotation Source" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Work Quotation PDF:</label>
                  <div className="mt-1">
                    <FileDownloadLink file={entry.work_quotation_pdf} label="Work Quotation PDF" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Work Order File:</label>
                  <div className="mt-1">
                    <FileDownloadLink file={entry.work_order_file} label="Work Order File" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Report File:</label>
                  <div className="mt-1">
                    <FileDownloadLink file={entry.report_file} label="Report File" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Invoice Source File:</label>
                  <div className="mt-1">
                    <FileDownloadLink file={entry.invoice_src_file} label="Invoice Source File" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Invoice PDF File:</label>
                  <div className="mt-1">
                    <FileDownloadLink file={entry.invoice_pdf_file} label="Invoice PDF File" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
