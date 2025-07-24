
import { useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { DashboardLayout } from '@/components/DashboardLayout';
import { AddEntryForm } from '@/components/AddEntryForm';
import { ViewEntriesTable } from '@/components/ViewEntriesTable';
import { EditEntryForm } from '@/components/EditEntryForm';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardEntry } from '@/types/dashboard';

const Index = () => {
  const { user, loading: authLoading, login, logout } = useAuth();
  const { entries, loading: dashboardLoading, addEntry, updateEntry, deleteEntry } = useDashboard();
  const [currentView, setCurrentView] = useState<'add' | 'view'>('add');
  const [editingEntry, setEditingEntry] = useState<DashboardEntry | null>(null);

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
    setEditingEntry(entry);
  };

  const handleUpdateEntry = async (id: string, updates: Partial<DashboardEntry>) => {
    await updateEntry(id, updates);
    setEditingEntry(null);
  };

  const handleDeleteEntry = async (id: string) => {
    await deleteEntry(id);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  if (editingEntry) {
    return (
      <DashboardLayout
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={logout}
      >
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Edit Entry</h1>
            <p className="text-muted-foreground">Update the project entry details.</p>
          </div>
          <EditEntryForm 
            entry={editingEntry}
            onSubmit={handleUpdateEntry}
            onCancel={handleCancelEdit}
          />
        </div>
      </DashboardLayout>
    );
  }

  const renderContent = () => {
    switch (currentView) {
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
              onDelete={handleDeleteEntry}
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
