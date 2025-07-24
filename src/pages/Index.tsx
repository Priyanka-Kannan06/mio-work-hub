
import { useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DashboardStats } from '@/components/DashboardStats';
import { AddEntryForm } from '@/components/AddEntryForm';
import { ViewEntriesTable } from '@/components/ViewEntriesTable';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardEntry } from '@/types/dashboard';

const Index = () => {
  const { user, loading: authLoading, login, logout } = useAuth();
  const { entries, loading: dashboardLoading, addEntry, updateEntry, downloadFile } = useDashboard();
  const [currentView, setCurrentView] = useState<'dashboard' | 'add' | 'view'>('dashboard');

  if (authLoading || dashboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={login} />;
  }

  const handleEditEntry = (entry: DashboardEntry) => {
    console.log('Edit entry:', entry);
    // TODO: Implement edit modal
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
              <p className="text-muted-foreground">Welcome back! Here's your project summary.</p>
            </div>
            <DashboardStats entries={entries} />
            <ViewEntriesTable 
              entries={entries.slice(0, 5)} 
              onEdit={handleEditEntry}
              onDownload={downloadFile}
            />
          </div>
        );
      case 'add':
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Add New Entry</h1>
              <p className="text-muted-foreground">Create a new project entry with all required details.</p>
            </div>
            <AddEntryForm onSubmit={addEntry} />
          </div>
        );
      case 'view':
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">View All Entries</h1>
              <p className="text-muted-foreground">Browse, filter, and manage your project entries.</p>
            </div>
            <ViewEntriesTable 
              entries={entries}
              onEdit={handleEditEntry}
              onDownload={downloadFile}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      currentView={currentView}
      onViewChange={setCurrentView}
      onLogout={logout}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default Index;
