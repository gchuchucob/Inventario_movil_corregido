import { useState } from 'react';
import Layout from '../components/Layout';
import BarcodeScanner from '../components/BarcodeScanner';
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowLeftRight,
  Search,
  Filter,
  ShoppingCart,
  Truck,
  Package,
  AlertTriangle,
  Plus,
  ScanLine,
  X,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

type FormType = 'ENTRADA' | 'SALIDA' | 'AJUSTE';

export default function Movements() {
  const { movements, products, addMovement, findProductByBarcode } = useAppContext();

  const [showForm, setShowForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formType, setFormType] = useState<FormType>('ENTRADA');
  const [formBarcode, setFormBarcode] = useState('');
  const [formProductId, setFormProductId] = useState('');
  const [formUnits, setFormUnits] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formRef, setFormRef] = useState('');
  const [matchedProduct, setMatchedProduct] = useState<ReturnType<typeof findProductByBarcode>>(undefined);

  const totalEntradas = movements.filter(m => m.type === 'ENTRADA').length;
  const totalSalidas = movements.filter(m => m.type === 'SALIDA').length;

  const filtered = movements.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleBarcodeScanned(barcode: string) {
    setShowScanner(false);
    setFormBarcode(barcode);
    const product = findProductByBarcode(barcode);
    setMatchedProduct(product);
    if (product) {
      setFormProductId(product.id);
      setFormAmount(product.price.toFixed(2));
    }
  }

  function handleBarcodeInput(value: string) {
    setFormBarcode(value);
    if (value.length >= 4) {
      const product = findProductByBarcode(value);
      setMatchedProduct(product);
      if (product) {
        setFormProductId(product.id);
        setFormAmount(product.price.toFixed(2));
      }
    } else {
      setMatchedProduct(undefined);
      setFormProductId('');
    }
  }

  function handleProductSelect(id: string) {
    setFormProductId(id);
    const product = products.find(p => p.id === id);
    if (product) {
      setMatchedProduct(product);
      setFormBarcode(product.barcode ?? product.sku);
      setFormAmount(product.price.toFixed(2));
    }
  }

  function resetForm() {
    setFormBarcode('');
    setFormProductId('');
    setFormUnits('');
    setFormAmount('');
    setFormRef('');
    setMatchedProduct(undefined);
    setFormType('ENTRADA');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const units = parseInt(formUnits) || 0;
    const amount = parseFloat(formAmount) || 0;
    const productName = matchedProduct?.name ?? formBarcode ?? 'Producto';

    addMovement({
      type: formType,
      title: formType === 'ENTRADA'
        ? `Entrada: ${productName}`
        : formType === 'SALIDA'
        ? `Venta: ${productName}`
        : `Ajuste: ${productName}`,
      date: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      reference: formRef || `REF-${Date.now().toString(36).toUpperCase()}`,
      productId: formProductId || undefined,
      barcode: formBarcode || undefined,
      units,
      amount: amount > 0 ? amount * units : undefined,
    });

    resetForm();
    setShowForm(false);
  }

  return (
    <Layout title="Movimientos">
      <div className="space-y-6">
        {/* Summary cards */}
        <section className="grid grid-cols-2 gap-3">
          <div className="col-span-2 bg-gradient-to-br from-primary to-primary-container p-6 rounded-2xl text-on-primary shadow-sm overflow-hidden relative">
            <div className="relative z-10">
              <p className="font-label text-xs uppercase tracking-widest opacity-80 mb-1">Total Movimientos</p>
              <h2 className="text-3xl font-extrabold tracking-tight mb-4">{movements.length}</h2>
              <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span className="font-label text-xs font-semibold">
                  {movements.length > 0 ? `${totalEntradas} entradas · ${totalSalidas} salidas` : 'Sin movimientos aún'}
                </span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <ArrowLeftRight className="w-32 h-32" />
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
              <p className="font-label text-[10px] text-on-surface-variant font-medium">Salidas / Ventas</p>
              <p className="text-lg font-bold text-on-surface">{totalSalidas}</p>
            </div>
          </div>
        </section>

        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 bg-surface-container-highest rounded-xl px-4 py-3 flex items-center gap-3">
            <Search className="w-5 h-5 text-outline" />
            <input
              type="text"
              placeholder="Buscar movimiento..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full placeholder:text-outline font-label outline-none"
            />
          </div>
          <button className="bg-surface-container-low p-3 rounded-xl flex items-center justify-center">
            <Filter className="w-5 h-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Movement list */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-sans font-bold text-on-surface-variant tracking-tight">Movimientos Recientes</h3>
          </div>

          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-8 bg-surface-container-lowest rounded-2xl">
                <Package className="w-10 h-10 text-outline-variant mx-auto mb-2" />
                <p className="font-sans text-sm text-on-surface-variant">No hay movimientos registrados.</p>
                <p className="font-label text-xs text-on-surface-variant mt-1">Toca el botón + para registrar uno.</p>
              </div>
            ) : (
              filtered.map((movement) => (
                <div
                  key={movement.id}
                  className={`bg-surface-container-lowest p-4 rounded-2xl shadow-sm flex items-center justify-between border-l-4 ${
                    movement.type === 'ENTRADA'
                      ? 'border-blue-600'
                      : movement.type === 'SALIDA'
                      ? 'border-error'
                      : 'border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      movement.type === 'ENTRADA' ? 'bg-blue-50' :
                      movement.type === 'SALIDA' ? 'bg-red-50' : 'bg-slate-100'
                    }`}>
                      {movement.type === 'ENTRADA'
                        ? <ShoppingCart className="w-6 h-6 text-blue-700" />
                        : movement.type === 'SALIDA'
                        ? <Truck className="w-6 h-6 text-error" />
                        : <Package className="w-6 h-6 text-slate-500" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface tracking-tight text-sm">{movement.title}</h4>
                      <p className="font-label text-xs text-on-surface-variant mt-0.5">
                        {movement.date} · Ref: {movement.reference}
                      </p>
                      {movement.barcode && (
                        <p className="font-label text-[10px] text-outline mt-0.5">📦 {movement.barcode}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {movement.amount != null ? (
                      <p className={`font-bold tracking-tight text-sm ${movement.type === 'ENTRADA' ? 'text-blue-700' : 'text-error'}`}>
                        {movement.type === 'ENTRADA' ? '+' : '-'}${movement.amount.toFixed(2)}
                      </p>
                    ) : (
                      <p className="font-bold text-on-surface tracking-tight text-sm">{movement.units} uds.</p>
                    )}
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter mt-1 ${
                      movement.type === 'ENTRADA' ? 'bg-blue-50 text-blue-700' :
                      movement.type === 'SALIDA' ? 'bg-red-50 text-error' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {movement.type}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Insight */}
        {movements.length > 0 && (
          <section className="bg-tertiary-fixed p-5 rounded-2xl relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-on-tertiary-fixed" />
              <h5 className="text-on-tertiary-fixed font-bold font-sans text-sm">Resumen de Flujo</h5>
            </div>
            <p className="text-on-tertiary-fixed-variant text-xs font-label leading-relaxed">
              {totalSalidas > totalEntradas
                ? `Las salidas (${totalSalidas}) superan las entradas (${totalEntradas}). Revisa tu stock.`
                : `Tienes ${totalEntradas} entradas y ${totalSalidas} salidas registradas.`}
            </p>
          </section>
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-40">
        <button
          onClick={() => setShowForm(true)}
          className="w-14 h-14 bg-primary rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center text-white active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* New movement modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end">
          <div className="w-full bg-surface rounded-t-3xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-extrabold text-on-surface">Nuevo Movimiento</h2>
              <button onClick={() => { setShowForm(false); resetForm(); }}>
                <X className="w-6 h-6 text-on-surface-variant" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type selector */}
              <div className="grid grid-cols-3 gap-2">
                {(['ENTRADA', 'SALIDA', 'AJUSTE'] as FormType[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormType(t)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      formType === t
                        ? t === 'ENTRADA' ? 'bg-blue-600 text-white' : t === 'SALIDA' ? 'bg-error text-white' : 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Barcode field with scan button */}
              <div className="space-y-1">
                <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant">
                  Código de Barras / SKU
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formBarcode}
                    onChange={e => handleBarcodeInput(e.target.value)}
                    placeholder="Escanea o escribe el código"
                    className="flex-1 h-12 px-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none text-sm text-on-surface"
                  />
                  <button
                    type="button"
                    onClick={() => setShowScanner(true)}
                    className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  >
                    <ScanLine className="w-5 h-5" />
                  </button>
                </div>
                {matchedProduct && (
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-bold">
                    <Package className="w-4 h-4" />
                    {matchedProduct.name} · Stock actual: {matchedProduct.stock}
                  </div>
                )}
                {formBarcode.length > 3 && !matchedProduct && (
                  <p className="text-xs text-on-surface-variant px-1">
                    Código no encontrado en inventario. Se registrará igualmente.
                  </p>
                )}
              </div>

              {/* Or pick from list */}
              {products.length > 0 && (
                <div className="space-y-1">
                  <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant">
                    O selecciona producto
                  </label>
                  <select
                    value={formProductId}
                    onChange={e => handleProductSelect(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none text-sm text-on-surface"
                  >
                    <option value="">-- Seleccionar --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Units */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant">
                    Unidades
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formUnits}
                    onChange={e => setFormUnits(e.target.value)}
                    placeholder="0"
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none text-sm text-on-surface"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant">
                    Precio unit. ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formAmount}
                    onChange={e => setFormAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-12 px-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none text-sm text-on-surface"
                  />
                </div>
              </div>

              {/* Reference */}
              <div className="space-y-1">
                <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant">
                  Referencia (opcional)
                </label>
                <input
                  type="text"
                  value={formRef}
                  onChange={e => setFormRef(e.target.value)}
                  placeholder="Ej. Factura #001"
                  className="w-full h-12 px-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none text-sm text-on-surface"
                />
              </div>

              <button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Registrar {formType === 'ENTRADA' ? 'Entrada' : formType === 'SALIDA' ? 'Venta/Salida' : 'Ajuste'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Barcode scanner overlay */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowScanner(false)}
        />
      )}
    </Layout>
  );
}
