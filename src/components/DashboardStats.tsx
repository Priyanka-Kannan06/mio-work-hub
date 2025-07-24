
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardEntry } from '@/types/dashboard';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  IndianRupee
} from 'lucide-react';

interface DashboardStatsProps {
  entries: DashboardEntry[];
}

export const DashboardStats = ({ entries }: DashboardStatsProps) => {
  const stats = {
    totalProjects: entries.length,
    totalRevenue: entries.reduce((sum, entry) => sum + entry.total_amount_inr, 0),
    paidProjects: entries.filter(entry => entry.payment_received_date).length,
    overdueProjects: entries.filter(entry => {
      const now = new Date();
      const expectedDate = new Date(entry.expected_payment_date);
      return !entry.payment_received_date && expectedDate < now;
    }).length,
    pendingAmount: entries
      .filter(entry => !entry.payment_received_date)
      .reduce((sum, entry) => sum + entry.total_amount_inr, 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: IndianRupee,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Paid Projects',
      value: stats.paidProjects,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Overdue Projects',
      value: stats.overdueProjects,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Pending Amount',
      value: formatCurrency(stats.pendingAmount),
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
