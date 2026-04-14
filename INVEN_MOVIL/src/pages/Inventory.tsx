import Layout from '../components/Layout';
import { Zap, Package, DollarSign, AlertTriangle, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Inventory() {
  const { products } = useAppContext();

  const totalItems = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValue = products.reduce((acc, p) => acc + (p.stock * p.price), 0);
  const lowStockItems = products.filter(p => p.status === 'LOW STOCK').length;

  return (
    <Layout title="Azure Ledger">
      <div className="space-y-8">
        {/* Hero Section: Key Metrics */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="font-label text-sm text-on-surface-variant font-medium">Global Status</span>
              <h2 className="font-sans text-2xl font-extrabold tracking-tight">Inventario Total</h2>
            </div>
            <div className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full flex items-center gap-1">
              <Zap className="w-4 h-4 fill-current" />
              <span className="font-label text-[12px] font-semibold">Live</span>
            </div>
          </div>

          {/* Bento Grid Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-[0_-4px_24px_rgba(0,0,0,0.02)] space-y-2">
              <Package className="w-6 h-6 text-primary" />
              <div>
                <p className="font-label text-sm text-on-surface-variant">Total Items</p>
                <p className="font-sans text-2xl font-extrabold text-on-surface">{totalItems.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-5 rounded-xl shadow-[0_-4px_24px_rgba(0,0,0,0.02)] space-y-2">
              <DollarSign className="w-6 h-6 text-primary" />
              <div>
                <p className="font-label text-sm text-on-surface-variant">Total Value</p>
                <p className="font-sans text-2xl font-extrabold text-on-surface">${(totalValue / 1000).toFixed(1)}k</p>
              </div>
            </div>
          </div>
        </section>

        {/* Alerts Section */}
        {lowStockItems > 0 && (
          <section className="space-y-4">
            <h3 className="font-sans font-bold text-lg flex items-center gap-2">
              Critical Alerts
              <span className="inline-block h-2 w-2 rounded-full bg-error animate-pulse"></span>
            </h3>
            
            <div className="bg-tertiary-fixed text-on-tertiary-fixed p-4 rounded-xl flex items-center justify-between border-l-4 border-tertiary">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-tertiary" />
                <div>
                  <p className="font-label font-bold text-sm">Low Stock Alert</p>
                  <p className="font-label text-xs opacity-80">{lowStockItems} items below threshold</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Product List */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-bold text-lg">Product Summary</h3>
            <button className="text-primary font-label text-sm font-semibold flex items-center gap-1">
              Filter <Filter className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="text-center py-10 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant">
                <Package className="w-12 h-12 text-outline-variant mx-auto mb-3" />
                <p className="font-sans font-bold text-on-surface">No hay productos</p>
                <p className="font-label text-sm text-on-surface-variant mt-1">Añade tu primer producto al inventario.</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="bg-surface-container-low p-4 rounded-2xl space-y-4 transition-all active:scale-[0.98]">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-surface-container-lowest overflow-hidden flex items-center justify-center p-2">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-on-surface">{product.name}</h4>
                        <p className="font-label text-xs text-on-surface-variant">SKU: {product.sku}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      product.status === 'IN STOCK' ? 'bg-primary-fixed text-on-primary-fixed-variant' :
                      product.status === 'LOW STOCK' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                      'bg-error-container text-on-error-container'
                    }`}>
                      {product.status}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-end text-xs font-label mb-1">
                      <span className="text-on-surface-variant">Stock Level ({Math.round((product.stock / Math.max(product.maxStock, 1)) * 100)}%)</span>
                      <span className={`font-bold ${product.status === 'LOW STOCK' ? 'text-tertiary' : 'text-on-surface'}`}>
                        {product.stock} / {product.maxStock}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${product.status === 'LOW STOCK' ? 'bg-tertiary' : 'bg-gradient-to-r from-primary to-primary-container'}`}
                        style={{ width: `${Math.min((product.stock / Math.max(product.maxStock, 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-40">
        <Link to="/add-product" className="w-14 h-14 bg-primary rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center text-white active:scale-95 transition-transform">
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </Layout>
  );
}
