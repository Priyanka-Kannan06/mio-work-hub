
import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Eye, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  currentView: 'add' | 'view';
  onViewChange: (view: 'add' | 'view') => void;
  onLogout: () => void;
}

export const DashboardLayout = ({ 
  children, 
  currentView, 
  onViewChange, 
  onLogout 
}: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { key: 'add', label: 'Add Entry', icon: Plus },
    { key: 'view', label: 'View Entries', icon: Eye },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-foreground">Project Manager</h2>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.key}>
                    <Button
                      variant={currentView === item.key ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => {
                        onViewChange(item.key as 'add' | 'view');
                        setSidebarOpen(false);
                      }}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={onLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
