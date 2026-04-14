import Layout from '../components/Layout';
import { Download, ArrowRightLeft, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Reports() {
  const { products, movements } = useAppContext();

  const totalSales = movements.filter(m => m.type === 'ENTRADA').reduce((acc, m) => acc + (m.amount || 0), 0);
  const lowStockCount = products.filter(p => p.status === 'LOW STOCK').length;

  return (
    <Layout title="Azure Ledger">
      <div className="space-y-6">
        {/* Header Section */}
        <section className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <div>
              <p className="font-label text-sm text-secondary font-medium uppercase tracking-widest text-[10px]">Analytics Overview</p>
              <h2 className="font-sans font-bold text-3xl text-on-surface">Reports</h2>
            </div>
            <button className="bg-primary-container text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm active:scale-95 transition-all text-sm font-semibold">
              <Download className="w-4 h-4" />
              Export to Excel
            </button>
          </div>
        </section>

        {/* Bento Grid Analysis */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Revenue Card (Wide) */}
          <div className="col-span-2 bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div className="relative z-10">
              <p className="font-label text-secondary text-sm font-medium">Net Sales Trend</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-on-surface">${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{totalSales > 0 ? '+12.5%' : '0.0%'}</span>
              </div>
            </div>
            
            {/* Mock Line Chart */}
            <div className="mt-6 h-32 w-full flex items-end gap-1">
              <div className="flex-1 bg-primary/10 rounded-t-lg h-[40%]"></div>
              <div className="flex-1 bg-primary/10 rounded-t-lg h-[60%]"></div>
              <div className="flex-1 bg-primary/10 rounded-t-lg h-[55%]"></div>
              <div className="flex-1 bg-primary/20 rounded-t-lg h-[75%]"></div>
              <div className="flex-1 bg-primary/15 rounded-t-lg h-[65%]"></div>
              <div className="flex-1 bg-primary/30 rounded-t-lg h-[90%]"></div>
              <div className="flex-1 bg-primary rounded-t-lg h-[100%] shadow-lg shadow-primary/20"></div>
            </div>
          </div>

          {/* Movement Velocity */}
          <div className="bg-surface-container-low p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <ArrowRightLeft className="w-6 h-6 text-primary mb-2" />
              <p className="font-label text-secondary text-xs font-medium">Movements</p>
              <p className="text-xl font-bold text-on-surface mt-1">{movements.length}</p>
            </div>
            <div className="mt-4 flex items-center gap-1">
              <div className="h-1 flex-1 bg-primary rounded-full"></div>
              <div className="h-1 w-8 bg-outline-variant/30 rounded-full"></div>
            </div>
          </div>

          {/* Inventory Health */}
          <div className="bg-surface-container-low p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <Package className="w-6 h-6 text-tertiary mb-2" />
              <p className="font-label text-secondary text-xs font-medium">Stock Health</p>
              <p className="text-xl font-bold text-on-surface mt-1">{products.length > 0 ? '94.2%' : '0.0%'}</p>
            </div>
            {lowStockCount > 0 && (
              <p className="text-[10px] text-tertiary font-bold bg-tertiary-fixed px-2 py-1 rounded-lg self-start mt-4">{lowStockCount} ITEMS LOW</p>
            )}
          </div>
        </div>

        {/* Sales by Category (Horizontal Bar Chart) */}
        {products.length > 0 && (
          <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <h3 className="font-sans font-bold text-lg mb-6">Top Categories</h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-on-surface">Electronica</span>
                  <span className="font-bold text-primary">$45.2k</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-container w-[85%] rounded-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-on-surface">Mobiliario</span>
                  <span className="font-bold text-primary">$32.1k</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-container w-[65%] rounded-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-on-surface">Accesorios</span>
                  <span className="font-bold text-primary">$18.9k</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-container w-[40%] rounded-full"></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Detailed Insights List */}
        {movements.length > 0 && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-sans font-bold text-lg">Growth Insights</h3>
              <button className="text-primary text-sm font-bold">View all</button>
            </div>
            <div className="space-y-3">
              <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">Seasonal Spike Detected</p>
                  <p className="text-xs text-secondary">Electronica demand is up 22% this week.</p>
                </div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">Supply Chain Latency</p>
                  <p className="text-xs text-secondary">Avg. lead time increased by 1.2 days.</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
