import Layout from '../components/Layout';
import { UserCircle, Moon, Palette, Store, MapPin, Phone, LogOut, ChevronRight, Edit2 } from 'lucide-react';

export default function Settings() {
  return (
    <Layout title="Azure Ledger">
      {/* Page Title Editorial */}
      <div className="mb-8">
        <p className="font-label text-[12px] uppercase tracking-[0.2em] text-blue-700 font-bold mb-1">PREFERENCIAS</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-on-surface font-sans">Configuración</h2>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        
        {/* Section: Account */}
        <section>
          <h3 className="font-label text-sm font-semibold text-on-surface-variant mb-3 px-1">Cuenta</h3>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4 hover:bg-surface-container-low cursor-pointer border-b border-surface-container active:scale-[0.98] transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-primary-fixed rounded-lg">
                  <UserCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-on-surface">Estado de cuenta</p>
                  <p className="text-xs text-on-surface-variant">Vinculada con Google</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-label font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-md">Activo</span>
                <ChevronRight className="w-5 h-5 text-outline-variant" />
              </div>
            </div>
          </div>
        </section>

        {/* Section: Personalization */}
        <section>
          <h3 className="font-label text-sm font-semibold text-on-surface-variant mb-3 px-1">Personalización</h3>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between border-b border-surface-container">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-secondary-container rounded-lg">
                  <Moon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-on-surface">Modo Oscuro</p>
                  <p className="text-xs text-on-surface-variant">Alternar apariencia visual</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 hover:bg-surface-container-low cursor-pointer active:scale-[0.98] transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-surface-container-high rounded-lg">
                  <Palette className="w-6 h-6 text-on-surface-variant" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-on-surface">Tema de Interfaz</p>
                  <p className="text-xs text-on-surface-variant">Azure Ledger Classic</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-outline-variant" />
            </div>
          </div>
        </section>

        {/* Section: Store Information */}
        <section>
          <h3 className="font-label text-sm font-semibold text-on-surface-variant mb-3 px-1">Información de la Tienda</h3>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4 hover:bg-surface-container-low cursor-pointer border-b border-surface-container active:scale-[0.98] transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-tertiary-fixed rounded-lg">
                  <Store className="w-6 h-6 text-tertiary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-on-surface-variant font-label mb-0.5">Nombre Comercial</p>
                  <p className="text-[15px] font-bold text-on-surface">Azure Global Logistics S.A.</p>
                </div>
              </div>
              <Edit2 className="w-5 h-5 text-outline-variant" />
            </div>
            
            <div className="flex items-center justify-between p-4 hover:bg-surface-container-low cursor-pointer border-b border-surface-container active:scale-[0.98] transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-surface-container-high rounded-lg">
                  <MapPin className="w-6 h-6 text-on-surface-variant" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-on-surface-variant font-label mb-0.5">Dirección</p>
                  <p className="text-[14px] font-medium text-on-surface">Av. Central 452, Ciudad de Panamá</p>
                </div>
              </div>
              <MapPin className="w-5 h-5 text-outline-variant" />
            </div>
            
            <div className="flex items-center justify-between p-4 hover:bg-surface-container-low cursor-pointer active:scale-[0.98] transition-transform">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-surface-container-high rounded-lg">
                  <Phone className="w-6 h-6 text-on-surface-variant" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-on-surface-variant font-label mb-0.5">Teléfono de Contacto</p>
                  <p className="text-[15px] font-bold text-on-surface">+507 234-5678</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-outline-variant" />
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="mt-4">
          <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-error/20 bg-error-container/10 text-error font-bold text-[15px] active:scale-95 transition-all">
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </section>
      </div>
    </Layout>
  );
}
