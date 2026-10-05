import { useAuth } from '../context/AuthContext';
import { Clock, LogOut, Package } from 'lucide-react';

export default function PendingAccess() {
  const { firebaseUser, logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 py-12">
      <div className="w-16 h-16 bg-surface-container-highest rounded-2xl flex items-center justify-center mb-6">
        <Clock className="w-9 h-9 text-on-surface-variant" />
      </div>
      <h1 className="text-2xl font-extrabold text-on-surface text-center mb-2">Acceso pendiente</h1>
      <p className="text-sm text-on-surface-variant text-center max-w-xs leading-relaxed mb-2">
        Iniciaste sesión como <strong>{firebaseUser?.email}</strong>, pero el dueño de la tienda
        aún no ha añadido tu correo a la lista de acceso.
      </p>
      <p className="text-sm text-on-surface-variant text-center max-w-xs leading-relaxed mb-8">
        Pídele al dueño que te añada en <strong>Configuración → Gestionar empleados</strong>.
      </p>
      <div className="flex items-center gap-2 bg-surface-container-low px-4 py-3 rounded-xl mb-8">
        <Package className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold text-on-surface">Inventario Ángel</span>
      </div>
      <button onClick={() => logout()} className="flex items-center gap-2 text-error font-bold text-sm">
        <LogOut className="w-4 h-4" />
        Cerrar sesión y usar otro correo
      </button>
    </div>
  );
}
