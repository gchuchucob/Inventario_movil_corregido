import Layout from '../components/Layout';
import { TrendingUp, Wallet, DollarSign, Truck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Dashboard() {
  const { products, movements } = useAppContext();

  // SALIDA = ventas (dinero que entra a la caja)
  // ENTRADA = reposición de stock (costo / inversión)
  const totalSales = movements
    .filter(m => m.type === 'SALIDA')
    .reduce((acc, m) => acc + (m.amount || 0), 0);

  const totalCosts = movements
    .filter(m => m.type === 'ENTRADA')
    .reduce((acc, m) => acc + (m.amount || 0), 0);

  const netProfit = totalSales - totalCosts;

  const completedOrders = movements.filter(m => m.type === 'SALIDA').length;
  const inTransit = movements.filter(m => m.type === 'ENTRADA').length;

  const topProducts = [...products]
    .sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0))
    .slice(0, 3);

  return (
    <Layout title="Panel Principal">
      <div className="space-y-6">
        {/* Hero Summary */}
        <section className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-gradient-to-br from-primary to-primary-container p-6 rounded-[2rem] shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <p className="font-label text-on-primary-container text-xs uppercase tracking-widest mb-1">
                Total Ventas
              </p>
              <h2 className="font-sans text-4xl font-extrabold text-on-primary tracking-tighter">
                ${totalSales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </h2>
              <div className="mt-4 inline-flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4 text-on-primary" />
                <span className="font-label text-[10px] font-bold text-on-primary">
                  {completedOrders} {completedOrders === 1 ? 'venta' : 'ventas'} registradas
                </span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm">
            <div className="w-10 h-10 bg-secondary-container rounded-2xl flex items-center justify-center mb-3">
              <Wallet className="w-5 h-5 text-on-secondary-container" />
            </div>
            <p className="font-label text-on-surface-variant text-[10px] uppercase tracking-wider mb-0.5">
              Costos (Entradas)
            </p>
            <h3 className="font-sans text-xl font-bold text-on-surface">
              ${totalCosts.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </h3>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-3xl shadow-sm">
            <div className="w-10 h-10 bg-tertiary-fixed rounded-2xl flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5 text-on-tertiary-fixed-variant" />
            </div>
            <p className="font-label text-on-surface-variant text-[10px] uppercase tracking-wider mb-0.5">
              Ganancia Neta
            </p>
            <h3
              className={`font-sans text-xl font-bold ${
                netProfit >= 0 ? 'text-on-surface' : 'text-error'
              }`}
            >
              ${netProfit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </section>

        {/* Order Status */}
        <section className="bg-surface-container-low p-2 rounded-[2.5rem] flex gap-2">
          <div className="flex-1 bg-surface-container-lowest p-5 rounded-[2rem] flex items-center gap-4">
            <div className="relative">
              <Truck className="w-8 h-8 text-blue-600" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
                {inTransit}
              </span>
            </div>
            <div>
              <p className="font-label text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Entradas</p>
              <p className="font-sans text-lg font-bold">En Stock</p>
            </div>
          </div>
          <div className="flex-1 bg-surface-container-lowest p-5 rounded-[2rem] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-label text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Ventas</p>
              <p className="font-sans text-lg font-bold">{completedOrders} {completedOrders === 1 ? 'Orden' : 'Órdenes'}</p>
            </div>
          </div>
        </section>

        {/* Top Products */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="font-sans text-lg font-bold text-on-surface">Productos Más Vendidos</h4>
            <Link to="/reports" className="font-label text-xs font-semibold text-primary">
              Ver Reportes
            </Link>
          </div>

          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <div className="text-center py-8 bg-surface-container-lowest rounded-3xl">
                <p className="font-sans text-sm text-on-surface-variant">No hay productos registrados.</p>
                <Link to="/add-product" className="text-primary text-sm font-bold mt-2 block">
                  + Agregar producto
                </Link>
              </div>
            ) : (
              topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-surface-container-lowest p-4 rounded-3xl flex items-center gap-4 active:scale-[0.98] transition-all"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label text-[10px] text-blue-600 font-bold uppercase tracking-widest truncate">
                      {product.sku}
                    </p>
                    <h5 className="font-sans font-bold text-on-surface truncate">{product.name}</h5>
                    <p className="font-label text-xs text-on-surface-variant">
                      {product.unitsSold || 0} vendidas · Stock: {product.stock}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`inline-block px-3 py-1 text-[10px] font-bold rounded-full ${
                        index === 0
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                      }`}
                    >
                      {index === 0 ? 'TOP' : `#${index + 1}`}
                    </span>
                    <p className="text-sm font-bold text-on-surface mt-1">
                      ${product.price.toFixed(2)}
                    </p>
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
