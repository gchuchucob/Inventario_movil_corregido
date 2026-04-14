import Layout from '../components/Layout';
import { ArrowDownRight, ArrowUpRight, Search, Filter, ShoppingCart, Truck, Package, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Movements() {
  const { movements } = useAppContext();

  const totalEntradas = movements.filter(m => m.type === 'ENTRADA').length;
  const totalSalidas = movements.filter(m => m.type === 'SALIDA').length;

  return (
    <Layout title="Azure Ledger">
      <div className="space-y-6">
        {/* Dashboard Summary */}
        <section className="grid grid-cols-2 gap-3">
          <div className="col-span-2 bg-gradient-to-br from-primary to-primary-container p-6 rounded-2xl text-on-primary shadow-sm overflow-hidden relative">
            <div className="relative z-10">
              <p className="font-label text-xs uppercase tracking-widest opacity-80 mb-1">Total Movimientos</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-4">{movements.length}</h2>
              <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span className="font-label text-xs font-semibold">{movements.length > 0 ? '+12%' : '0%'} vs last month</span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <ArrowRightLeft className="w-32 h-32" />
            </div>
          </div>
          
          <div className="bg-surface-container-low p-4 rounded-2xl flex flex-col justify-between">
            <ArrowDownRight className="w-6 h-6 text-blue-700 mb-2" />
            <div>
              <p className="font-label text-[10px] text-on-surface-variant font-medium">Entradas</p>
              <p className="text-lg font-bold text-blue-800">{totalEntradas}</p>
            </div>
          </div>
          
          <div className="bg-surface-container-low p-4 rounded-2xl flex flex-col justify-between">
            <ArrowUpRight className="w-6 h-6 text-error mb-2" />
            <div>
              <p className="font-label text-[10px] text-on-surface-variant font-medium">Salidas</p>
              <p className="text-lg font-bold text-on-surface">{totalSalidas}</p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex-1 min-w-[200px] bg-surface-container-highest rounded-xl px-4 py-3 flex items-center gap-3">
            <Search className="w-5 h-5 text-outline" />
            <input 
              type="text" 
              placeholder="Buscar movimiento..." 
              className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full placeholder:text-outline font-label outline-none" 
            />
          </div>
          <button className="bg-surface-container-low p-3 rounded-xl flex items-center justify-center">
            <Filter className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-sans font-bold text-on-surface-variant tracking-tight">Movimientos Recientes</h3>
            <button className="text-primary text-xs font-bold font-label tracking-wide uppercase">Ver Historial</button>
          </div>
          
          <div className="space-y-2">
            {movements.length === 0 ? (
              <div className="text-center py-8 bg-surface-container-lowest rounded-2xl">
                <p className="font-sans text-sm text-on-surface-variant">No hay movimientos registrados.</p>
              </div>
            ) : (
              movements.map((movement) => (
                <div key={movement.id} className={`bg-surface-container-lowest p-4 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex items-center justify-between border-l-4 ${
                  movement.type === 'ENTRADA' ? 'border-blue-600' : 
                  movement.type === 'SALIDA' ? 'border-error' : 'border-slate-300'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      movement.type === 'ENTRADA' ? 'bg-blue-50' : 
                      movement.type === 'SALIDA' ? 'bg-error-container/10' : 'bg-slate-100'
                    }`}>
                      {movement.type === 'ENTRADA' ? <ShoppingCart className="w-6 h-6 text-blue-700" /> :
                       movement.type === 'SALIDA' ? <Truck className="w-6 h-6 text-error" /> :
                       <Package className="w-6 h-6 text-slate-500" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface tracking-tight text-sm">{movement.title}</h4>
                      <p className="font-label text-xs text-on-surface-variant mt-0.5">{movement.date} • Ref: {movement.reference}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {movement.amount ? (
                      <p className={`font-bold tracking-tight text-sm ${movement.type === 'ENTRADA' ? 'text-blue-700' : 'text-error'}`}>
                        {movement.type === 'ENTRADA' ? '+' : '-'}${movement.amount.toFixed(2)}
                      </p>
                    ) : (
                      <p className="font-bold text-on-surface tracking-tight text-sm">{movement.units} units</p>
                    )}
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter ${
                      movement.type === 'ENTRADA' ? 'bg-blue-50 text-blue-700' : 
                      movement.type === 'SALIDA' ? 'bg-error-container/10 text-error' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {movement.type}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Featured Analysis Card */}
        {movements.length > 0 && (
          <section className="bg-tertiary-fixed p-5 rounded-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-on-tertiary-fixed" />
                <h5 className="text-on-tertiary-fixed font-bold font-sans text-sm">Insight de Flujo</h5>
              </div>
              <p className="text-on-tertiary-fixed-variant text-xs font-label leading-relaxed pr-8">
                Las salidas aumentaron un 15% esta semana debido a la reposición trimestral de stock de seguridad.
              </p>
            </div>
            <div className="absolute top-0 right-0 p-4">
              <AlertTriangle className="w-12 h-12 text-on-tertiary-fixed opacity-20" />
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}

function ArrowRightLeft({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m16 3 4 4-4 4"/>
      <path d="M20 7H4"/>
      <path d="m8 21-4-4 4-4"/>
      <path d="M4 17h16"/>
    </svg>
  )
}
