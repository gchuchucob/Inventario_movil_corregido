import Layout from '../components/Layout';
import { Download, ArrowLeftRight, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Reports() {
  const { products, movements } = useAppContext();

  // Ventas = movimientos de tipo SALIDA
  const totalSales = movements
    .filter(m => m.type === 'SALIDA')
    .reduce((acc, m) => acc + (m.amount || 0), 0);

  const lowStockCount = products.filter(p => p.status === 'LOW STOCK').length;
  const outOfStockCount = products.filter(p => p.status === 'OUT OF STOCK').length;

  // Build category breakdown from real product data
  const categoryMap = products.reduce<Record<string, { stock: number; value: number }>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = { stock: 0, value: 0 };
    acc[p.category].stock += p.stock;
    acc[p.category].value += p.stock * p.price;
    return acc;
  }, {});

  const categories = Object.entries(categoryMap)
    .sort((a, b) => b[1].value - a[1].value)
    .slice(0, 5);

  const maxCategoryValue = categories.length > 0 ? categories[0][1].value : 1;

  // Stock health %
  const stockHealth =
    products.length > 0
      ? Math.round(
          (products.filter(p => p.status === 'IN STOCK').length / products.length) * 100
        )
      : 0;

  return (
    <Layout title="Reportes">
      <div className="space-y-6">
        {/* Header */}
        <section className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <div>
              <p className="font-label text-[10px] text-secondary font-medium uppercase tracking-widest">
                Analytics Overview
              </p>
              <h2 className="font-sans font-bold text-3xl text-on-surface">Reportes</h2>
            </div>
            <button className="bg-primary text-on-primary px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm active:scale-95 transition-all text-sm font-semibold">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </section>

        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Sales card */}
          <div className="col-span-2 bg-surface-container-lowest p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <p className="font-label text-secondary text-sm font-medium">Total Ventas</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-on-surface">
                ${totalSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              {totalSales > 0 && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {movements.filter(m => m.type === 'SALIDA').length} transacciones
                </span>
              )}
            </div>

            {/* Bar chart proportional to movements */}
            <div className="mt-6 h-24 w-full flex items-end gap-1">
              {movements.length === 0 ? (
                <div className="w-full flex items-center justify-center text-xs text-on-surface-variant">
                  Sin datos aún
                </div>
              ) : (
                (() => {
                  // Group sales by day (last 7)
                  const days: Record<string, number> = {};
                  movements
                    .filter(m => m.type === 'SALIDA')
                    .forEach(m => {
                      const key = m.date.slice(0, 6);
                      days[key] = (days[key] || 0) + (m.amount || 0);
                    });
                  const vals = Object.values(days).slice(-7);
                  const maxVal = Math.max(...vals, 1);
                  // Pad to 7 bars
                  while (vals.length < 7) vals.unshift(0);
                  return vals.map((v, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-lg transition-all ${
                        i === vals.length - 1 ? 'bg-primary' : 'bg-primary/20'
                      }`}
                      style={{ height: `${Math.max((v / maxVal) * 100, 4)}%` }}
                    />
                  ));
                })()
              )}
            </div>
          </div>

          {/* Movements count */}
          <div className="bg-surface-container-low p-5 rounded-2xl flex flex-col justify-between">
            <ArrowLeftRight className="w-6 h-6 text-primary mb-2" />
            <p className="font-label text-secondary text-xs font-medium">Movimientos</p>
            <p className="text-xl font-bold text-on-surface mt-1">{movements.length}</p>
            <div className="mt-4 flex items-center gap-1">
              <div className="h-1 flex-1 bg-primary rounded-full" />
              <div className="h-1 w-8 bg-outline-variant/30 rounded-full" />
            </div>
          </div>

          {/* Stock health */}
          <div className="bg-surface-container-low p-5 rounded-2xl flex flex-col justify-between">
            <Package className="w-6 h-6 text-tertiary mb-2" />
            <p className="font-label text-secondary text-xs font-medium">Salud de Stock</p>
            <p className="text-xl font-bold text-on-surface mt-1">{stockHealth}%</p>
            {(lowStockCount > 0 || outOfStockCount > 0) && (
              <p className="text-[10px] text-tertiary font-bold bg-tertiary-fixed px-2 py-1 rounded-lg self-start mt-4">
                {lowStockCount > 0 && `${lowStockCount} bajo`}
                {lowStockCount > 0 && outOfStockCount > 0 && ' · '}
                {outOfStockCount > 0 && `${outOfStockCount} agotado`}
              </p>
            )}
          </div>
        </div>

        {/* Category breakdown — dynamic */}
        <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
          <h3 className="font-sans font-bold text-lg mb-6">Por Categoría</h3>
          {categories.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center py-4">
              Agrega productos para ver el desglose por categoría.
            </p>
          ) : (
            <div className="space-y-5">
              {categories.map(([cat, data]) => (
                <div key={cat} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-on-surface">{cat}</span>
                    <span className="font-bold text-primary">
                      ${data.value.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all"
                      style={{ width: `${Math.max((data.value / maxCategoryValue) * 100, 2)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-on-surface-variant">{data.stock} unidades en stock</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Insights */}
        {movements.length > 0 && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-sans font-bold text-lg">Alertas</h3>
            </div>
            <div className="space-y-3">
              {lowStockCount > 0 && (
                <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-on-surface">Stock Bajo</p>
                    <p className="text-xs text-secondary">
                      {lowStockCount} producto{lowStockCount > 1 ? 's' : ''} con stock bajo. Considera reabastecer.
                    </p>
                  </div>
                </div>
              )}
              <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">Resumen General</p>
                  <p className="text-xs text-secondary">
                    {products.length} producto{products.length !== 1 ? 's' : ''} ·{' '}
                    {movements.filter(m => m.type === 'SALIDA').length} ventas ·{' '}
                    {movements.filter(m => m.type === 'ENTRADA').length} entradas registradas.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
