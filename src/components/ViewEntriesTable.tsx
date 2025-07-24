
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DashboardEntry, FilterOptions } from '@/types/dashboard';
import { Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ViewEntriesTableProps {
  entries: DashboardEntry[];
  onEdit: (entry: DashboardEntry) => void;
  onDelete: (id: string) => void;
}

export const ViewEntriesTable = ({ entries, onEdit, onDelete }: ViewEntriesTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: 'last10days'
  });
  const { toast } = useToast();

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.work_reference_mail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.quotation_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.work_order_no.toLowerCase().includes(searchTerm.toLowerCase());

    const now = new Date();
    const entryDate = new Date(entry.created_at);
    
    let matchesDateFilter = true;
    if (filters.dateRange === 'last10days') {
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
      matchesDateFilter = entryDate >= tenDaysAgo;
    } else if (filters.dateRange === 'last30days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDateFilter = entryDate >= thirtyDaysAgo;
    }

    return matchesSearch && matchesDateFilter;
  });

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getPaymentStatus = (entry: DashboardEntry) => {
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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await onDelete(id);
        toast({
          title: "Entry Deleted",
          description: "The entry has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete entry. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Project Entries
        </CardTitle>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by reference mail, quotation, or work order..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filters.dateRange === 'last10days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters({ ...filters, dateRange: 'last10days' })}
            >
              Last 10 Days
            </Button>
            <Button
              variant={filters.dateRange === 'last30days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters({ ...filters, dateRange: 'last30days' })}
            >
              Last 30 Days
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference Mail</TableHead>
                <TableHead>Quotation No</TableHead>
                <TableHead>Work Order No</TableHead>
                <TableHead>Mail Date</TableHead>
                <TableHead>Fieldwork Period</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {entry.work_reference_mail}
                  </TableCell>
                  <TableCell>{entry.quotation_no}</TableCell>
                  <TableCell>{entry.work_order_no}</TableCell>
                  <TableCell>{formatDate(entry.mail_date)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(entry.start_fieldwork_date)} - {formatDate(entry.end_fieldwork_date)}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(entry.total_amount_inr)}</TableCell>
                  <TableCell>{getPaymentStatus(entry)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(entry)}
                        title="Edit entry"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                        title="Delete entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredEntries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No entries found matching your criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
