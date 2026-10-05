import Layout from '../components/Layout';
import {
  UserCircle, Moon, Sun, Store, MapPin, Phone,
  LogOut, ChevronRight, Edit2, Users,
} from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Settings() {
  const { isDark, toggle } = useDarkMode();
  const { appUser, store, logout } = useAuth();
  const isOwner = appUser?.role === 'owner';

  return (
    <Layout title="Configuración">
      <div className="mb-8">
        <p className="font-label text-[12px] uppercase tracking-[0.2em] text-primary font-bold mb-1">PREFERENCIAS</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Configuración</h2>
      </div>

      <div className="space-y-6">

        {/* Cuenta */}
        <section>
          <h3 className="font-label text-sm font-semibold text-on-surface-variant mb-3 px-1">Cuenta</h3>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-primary-fixed rounded-lg">
                  <UserCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-on-surface">{appUser?.displayName ?? 'Usuario'}</p>
                  <p className="text-xs text-on-surface-variant">{appUser?.email}</p>
                </div>
              </div>
              <span className={`text-xs font-label font-bold px-2 py-1 rounded-md ${
                isOwner
                  ? 'text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/30'
                  : 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-900/30'
              }`}>
                {isOwner ? 'Dueño' : 'Empleado'}
              </span>
            </div>
          </div>
        </section>

        {/* Tienda (solo dueño) */}
        {isOwner && store && (
          <section>
            <h3 className="font-label text-sm font-semibold text-on-surface-variant mb-3 px-1">Mi Tienda</h3>
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
              <div className="flex items-center justify-between p-4 border-b border-surface-container">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-tertiary-fixed rounded-lg">
                    <Store className="w-6 h-6 text-tertiary" />
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-label mb-0.5">Nombre</p>
                    <p className="text-[15px] font-bold text-on-surface">{store.name}</p>
                  </div>
                </div>
                <Edit2 className="w-5 h-5 text-outline-variant" />
              </div>
              {store.address && (
                <div className="flex items-center gap-4 p-4 border-b border-surface-container">
                  <div className="w-10 h-10 flex items-center justify-center bg-surface-container-high rounded-lg">
                    <MapPin className="w-6 h-6 text-on-surface-variant" />
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-label mb-0.5">Dirección</p>
                    <p className="text-[14px] font-medium text-on-surface">{store.address}</p>
                  </div>
                </div>
              )}
              {store.phone && (
                <div className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-surface-container-high rounded-lg">
                    <Phone className="w-6 h-6 text-on-surface-variant" />
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-label mb-0.5">Teléfono</p>
                    <p className="text-[15px] font-bold text-on-surface">{store.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Gestión de empleados (solo dueño) */}
        {isOwner && (
          <section>
            <h3 className="font-label text-sm font-semibold text-on-surface-variant mb-3 px-1">Equipo</h3>
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
              <Link to="/users"
                className="flex items-center justify-between p-4 hover:bg-surface-container-low active:scale-[0.98] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-secondary-container rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-on-surface">Gestionar empleados</p>
                    <p className="text-xs text-on-surface-variant">Invita o elimina accesos por correo</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-outline-variant" />
              </Link>
            </div>
          </section>
        )}

        {/* Apariencia — toggle dark mode FUNCIONAL */}
        <section>
          <h3 className="font-label text-sm font-semibold text-on-surface-variant mb-3 px-1">Apariencia</h3>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-secondary-container rounded-lg">
                  {isDark ? <Moon className="w-6 h-6 text-secondary" /> : <Sun className="w-6 h-6 text-secondary" />}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-on-surface">Modo Oscuro</p>
                  <p className="text-xs text-on-surface-variant">{isDark ? 'Activado' : 'Desactivado'}</p>
                </div>
              </div>
              <button
                role="switch"
                aria-checked={isDark}
                onClick={toggle}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                  isDark ? 'bg-primary' : 'bg-surface-container-highest'
                }`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </section>

        {/* Cerrar sesión */}
        <section className="mt-4 pb-6">
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-error/20 bg-error-container/10 text-error font-bold text-[15px] active:scale-95 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </section>
      </div>
    </Layout>
  );
}
