import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  LayoutDashboard, 
  Package, 
  ArrowRightLeft, 
  BarChart2, 
  Settings,
  ArrowLeft,
  Menu
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export default function Layout({ children, title = "Azure Ledger", showBack = false }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isDashboard = location.pathname === '/';
  const isAddProduct = location.pathname === '/add-product';

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
    { path: '/movements', icon: ArrowRightLeft, label: 'Movements' },
    { path: '/reports', icon: BarChart2, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          {showBack ? (
            <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform text-blue-700 dark:text-blue-400">
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <button className="active:scale-95 transition-transform text-blue-700 dark:text-blue-400">
              <Menu className="w-6 h-6" />
            </button>
          )}
          <h1 className={cn(
            "font-bold tracking-tight text-blue-700 dark:text-blue-400",
            isDashboard ? "text-xl" : "text-lg"
          )}>
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {isDashboard && (
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors">
              <Bell className="w-5 h-5 text-blue-700 dark:text-blue-400" />
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/10">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNKjYYt0UFPLqNC52qsbK4VmfjCS-ghxNUIEPNMg0RBoZw_YCKMYp6uiQgW2rhKy_ArX3Pu-zIV-coWfYLWBtnXc9qLzbF65OKQqj-ogPB5nRnbJ67ok1Jlx1DSEh_qiVNi__07zlqZ93oZjtpxkwflqCv46tIqQVCHPxuFU4Sf2EJJRZwgEmJYrCxD6oHTCAg0ygk5vJpC8sv52vTlrpN76sQbqkSDWPZxoJcA5XDO-z40mCNrsxaLDCePj_QKkGrO3m8zzUCst4N" 
              alt="User Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 max-w-lg mx-auto">
        {children}
      </main>

      {/* BottomNavBar */}
      {!isAddProduct && (
        <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-slate-100/50 dark:border-slate-800/50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] rounded-t-2xl flex justify-around items-center px-4 pt-2 pb-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center px-3 py-1 transition-all duration-200 active:scale-90",
                  isActive 
                    ? "text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl" 
                    : "text-slate-400 dark:text-slate-500 hover:text-blue-600"
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="font-label font-medium text-[10px] tracking-wide mt-1">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
