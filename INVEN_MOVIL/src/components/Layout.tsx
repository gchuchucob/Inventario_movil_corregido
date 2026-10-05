import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell, LayoutDashboard, Package, ArrowLeftRight,
  BarChart2, Settings, ArrowLeft, Menu, Wallet,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useDarkMode } from '../hooks/useDarkMode';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export default function Layout({ children, title = 'Inventario', showBack = false }: LayoutProps) {
  const location = useLocation();
  const navigate  = useNavigate();
  const { appUser } = useAuth();
  const isOwner   = appUser?.role === 'owner';

  // Aplica clase "dark" al <html> y mantiene sincronía entre pantallas
  useDarkMode();

  const isDashboard  = location.pathname === '/';
  const isAddProduct = location.pathname === '/add-product';

  const navItems = [
    { path: '/',          icon: LayoutDashboard, label: 'Inicio',      ownerOnly: false },
    { path: '/inventory', icon: Package,         label: 'Inventario',  ownerOnly: false },
    { path: '/movements', icon: ArrowLeftRight,  label: 'Movimientos', ownerOnly: false },
    { path: '/finances',  icon: Wallet,          label: 'Finanzas',    ownerOnly: true  },
    { path: '/reports',   icon: BarChart2,        label: 'Reportes',    ownerOnly: true  },
    { path: '/settings',  icon: Settings,         label: 'Config.',     ownerOnly: false },
  ].filter(item => !item.ownerOnly || isOwner);

  return (
    <div className="min-h-screen bg-surface text-on-surface pb-24">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-sm flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          {showBack ? (
            <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform text-primary">
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <button className="active:scale-95 transition-transform text-primary">
              <Menu className="w-6 h-6" />
            </button>
          )}
          <h1 className={cn(
            'font-bold tracking-tight text-primary',
            isDashboard ? 'text-xl' : 'text-lg'
          )}>
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {isDashboard && (
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
              <Bell className="w-5 h-5 text-primary" />
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-sm uppercase select-none">
            {appUser?.displayName?.[0] ?? appUser?.email?.[0] ?? 'U'}
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="pt-20 px-4 max-w-lg mx-auto">{children}</main>

      {/* BottomNavBar */}
      {!isAddProduct && (
        <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-2xl border-t border-outline-variant/20 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] rounded-t-2xl flex justify-around items-center px-1 pt-2 pb-5">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center px-2 py-1 transition-all duration-200 active:scale-90 rounded-xl',
                  isActive
                    ? 'text-primary bg-primary-fixed/40'
                    : 'text-on-surface-variant hover:text-primary'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-label font-medium text-[9px] tracking-wide mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
