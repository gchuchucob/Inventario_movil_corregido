import Layout from '../components/Layout';
import { TrendingUp, Wallet, DollarSign, Truck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Dashboard() {
  const { products, movements } = useAppContext();

  const totalSales = movements.filter(m => m.type === 'ENTRADA').reduce((acc, m) => acc + (m.amount || 0), 0);
  const totalCosts = movements.filter(m => m.type === 'SALIDA').reduce((acc, m) => acc + (m.amount || 0), 0);
  const netProfit = totalSales - totalCosts;

  const topProducts = [...products].sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0)).slice(0, 3);

  return (
    <Layout title="The Precision Ledger">
      <div className="space-y-6">
        {/* Hero Summary Section */}
        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-gradient-to-br from-primary to-primary-container p-6 rounded-[2rem] shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <p className="font-label text-on-primary-container text-xs uppercase tracking-widest mb-1">Total Sales</p>
              <h2 className="font-sans text-4xl font-extrabold text-on-primary tracking-tighter">${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
              <div className="mt-4 inline-flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4 text-on-primary" />
                <span className="font-label text-[10px] font-bold text-on-primary">{totalSales > 0 ? '+14.2%' : '0.0%'}</span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm">
            <div className="w-10 h-10 bg-secondary-container rounded-2xl flex items-center justify-center mb-3">
              <Wallet className="w-5 h-5 text-on-secondary-container" />
            </div>
            <p className="font-label text-on-surface-variant text-[10px] uppercase tracking-wider mb-0.5">Costs</p>
            <h3 className="font-sans text-xl font-bold text-on-surface">${totalCosts.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
          
          <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm">
            <div className="w-10 h-10 bg-tertiary-fixed rounded-2xl flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5 text-on-tertiary-fixed-variant" />
            </div>
            <p className="font-label text-on-surface-variant text-[10px] uppercase tracking-wider mb-0.5">Net Profit</p>
            <h3 className="font-sans text-xl font-bold text-on-surface">${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
        </section>

        {/* Order Status Tonal Layering */}
        <section className="bg-surface-container-low p-2 rounded-[2.5rem] flex gap-2">
          <div className="flex-1 bg-surface-container-lowest p-5 rounded-[2rem] flex items-center gap-4">
            <div className="relative">
              <Truck className="w-8 h-8 text-blue-600" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-white text-[10px] font-bold">0</span>
            </div>
            <div>
              <p className="font-label text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Arriving</p>
              <p className="font-sans text-lg font-bold">In Transit</p>
            </div>
          </div>
          <div className="flex-1 bg-surface-container-lowest p-5 rounded-[2rem] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-label text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Finished</p>
              <p className="font-sans text-lg font-bold">0 Orders</p>
            </div>
          </div>
        </section>

        {/* Product Summary Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="font-sans text-lg font-bold text-blue-900">Product Summary</h4>
            <Link to="/reports" className="font-label text-xs font-semibold text-primary">View Analytics</Link>
          </div>
          
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <div className="text-center py-8 bg-surface-container-lowest rounded-3xl">
                <p className="font-sans text-sm text-on-surface-variant">No hay productos registrados.</p>
              </div>
            ) : (
              topProducts.map((product, index) => (
                <div key={product.id} className="bg-surface-container-lowest p-4 rounded-3xl flex items-center gap-4 group transition-all active:scale-[0.98]">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-label text-[10px] text-blue-600 font-bold uppercase tracking-widest">{product.sku}</p>
                    <h5 className="font-sans font-bold text-on-surface">{product.name}</h5>
                    <p className="font-label text-xs text-on-surface-variant">{product.unitsSold || 0} units sold</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 text-[10px] font-bold rounded-full ${index === 0 ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'}`}>
                      {index === 0 ? 'TOP' : 'PULSE'}
                    </span>
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
