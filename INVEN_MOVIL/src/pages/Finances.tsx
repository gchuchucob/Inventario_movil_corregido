import Layout from '../components/Layout';
import { TrendingUp, Wallet, DollarSign, BarChart3, Lightbulb, LineChart, Landmark, Bitcoin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Finances() {
  const { finances } = useAppContext();

  const totalInversion = finances.filter(f => f.type === 'Inversión').reduce((acc, f) => acc + f.amount, 0);
  const totalGanancias = finances.filter(f => f.type === 'Ganancias' || f.type === 'Cripto').reduce((acc, f) => acc + f.amount, 0);
  const patrimonioNeto = totalGanancias - totalInversion;

  return (
    <Layout title="Azure Ledger">
      <div className="space-y-6">
        {/* Hero: Total Net Worth */}
        <section className="mt-4">
          <div className="bg-gradient-to-br from-primary to-primary-container p-8 rounded-[2rem] text-on-primary shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="font-label text-on-primary-container/80 text-xs font-semibold tracking-widest uppercase mb-1">Patrimonio Neto</p>
              <h2 className="text-4xl font-extrabold tracking-tight">${patrimonioNeto.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
              <div className="mt-6 flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
                <TrendingUp className="w-4 h-4" />
                <span className="font-label text-xs font-bold">{patrimonioNeto > 0 ? '+12.4%' : '0.0%'} este mes</span>
              </div>
            </div>
            {/* Abstract Texture background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full -ml-8 -mb-8 blur-2xl"></div>
          </div>
        </section>

        {/* Asymmetric Bento Grid: Inversión & Ganancias */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm border border-outline-variant/10">
            <div className="w-10 h-10 bg-secondary-container/50 rounded-2xl flex items-center justify-center mb-4">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <p className="font-label text-on-surface-variant text-[11px] font-bold uppercase tracking-wider mb-1">Inversión Realizada</p>
            <p className="text-xl font-bold text-on-surface">${totalInversion.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          
          <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm border border-outline-variant/10">
            <div className="w-10 h-10 bg-tertiary-fixed/30 rounded-2xl flex items-center justify-center mb-4">
              <DollarSign className="w-5 h-5 text-tertiary" />
            </div>
            <p className="font-label text-on-surface-variant text-[11px] font-bold uppercase tracking-wider mb-1">Ganancias Totales</p>
            <p className="text-xl font-bold text-on-surface">${totalGanancias.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </section>

        {/* Losses vs Profits Pulse */}
        <section className="bg-surface-container-low p-6 rounded-[2rem] space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Rendimiento de Cartera
          </h3>
          
          <div className="space-y-4">
            {/* Profits Row */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="font-label text-sm font-semibold text-on-surface-variant">Ganancias</span>
                <span className="text-blue-700 font-bold">${totalGanancias.toLocaleString()}</span>
              </div>
              <div className="h-3 w-full bg-white rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: totalGanancias > 0 ? '78%' : '0%' }}></div>
              </div>
            </div>
            
            {/* Losses Row */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="font-label text-sm font-semibold text-on-surface-variant">Pérdidas</span>
                <span className="text-tertiary font-bold">${totalInversion.toLocaleString()}</span>
              </div>
              <div className="h-3 w-full bg-white rounded-full overflow-hidden">
                <div className="h-full bg-tertiary-fixed-dim rounded-full" style={{ width: totalInversion > 0 ? '22%' : '0%' }}></div>
              </div>
            </div>
          </div>
          
          {/* Contextual Tip */}
          {finances.length > 0 && (
            <div className="bg-tertiary-fixed p-4 rounded-2xl flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-tertiary flex-shrink-0" />
              <p className="font-label text-xs text-on-tertiary-fixed leading-relaxed">
                Tus activos en <span className="font-bold">Tecnología</span> han superado el benchmark. Considera rebalancear para proteger ganancias.
              </p>
            </div>
          )}
        </section>

        {/* Recent Movements Editorial List */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-lg font-bold">Movimientos Recientes</h3>
            <button className="text-primary font-label text-sm font-bold">Ver todo</button>
          </div>
          
          <div className="space-y-3">
            {finances.length === 0 ? (
              <div className="text-center py-8 bg-surface-container-lowest rounded-2xl">
                <p className="font-sans text-sm text-on-surface-variant">No hay transacciones financieras registradas.</p>
              </div>
            ) : (
              finances.map((finance) => (
                <div key={finance.id} className="bg-surface-container-lowest p-4 rounded-2xl flex items-center justify-between group active:scale-95 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center">
                      {finance.type === 'Inversión' ? <LineChart className="w-6 h-6 text-on-surface-variant" /> :
                       finance.type === 'Ganancias' ? <Landmark className="w-6 h-6 text-on-surface-variant" /> :
                       <Bitcoin className="w-6 h-6 text-on-surface-variant" />}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{finance.title}</p>
                      <p className="font-label text-xs text-on-surface-variant">{finance.type} • {finance.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${finance.type === 'Inversión' ? 'text-on-surface' : 'text-blue-700'}`}>
                      {finance.type === 'Inversión' ? '-' : '+'}${finance.amount.toFixed(2)}
                    </p>
                    <p className="font-label text-[10px] text-on-surface-variant uppercase font-bold">{finance.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
