import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const pageTitles: Record<string, string> = {
  '/':          'Dashboard',
  '/fleet':     'Fleet',
  '/bookings':  'Bookings',
  '/customers': 'Customers',
};

export default function AppShell() {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? 'DriveOn';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <TopBar title={title} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
