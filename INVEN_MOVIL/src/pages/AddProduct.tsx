import { useState, useRef } from 'react';
import Layout from '../components/Layout';
import BarcodeScanner from '../components/BarcodeScanner';
import { Camera, Save, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function AddProduct() {
  const navigate = useNavigate();
  const { addProduct } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('Abarrotes Generales');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [maxStock, setMaxStock] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImage(url);
    }
  };

  function handleBarcodeScanned(code: string) {
    setShowScanner(false);
    setBarcode(code);
    // If SKU is empty, use barcode as SKU default
    if (!sku) setSku(code);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stockNum = parseInt(stock) || 0;
    const maxStockNum = parseInt(maxStock) || stockNum;

    addProduct({
      sku: sku || `SKU-${Math.floor(Math.random() * 10000)}`,
      barcode: barcode || undefined,
      name,
      category,
      description,
      price: parseFloat(price) || 0,
      stock: stockNum,
      maxStock: maxStockNum,
      imageUrl:
        image ||
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      status:
        stockNum > 10 ? 'IN STOCK' : stockNum > 0 ? 'LOW STOCK' : 'OUT OF STOCK',
      unitsSold: 0,
    });

    navigate('/inventory');
  };

  return (
    <Layout title="Nuevo Producto" showBack>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">
          Información del Producto
        </h2>
        <p className="text-on-surface-variant text-sm mt-1">
          Completa los detalles para registrarlo en el inventario.
        </p>
      </div>

      <form className="space-y-5 pb-10" onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="space-y-1">
          <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant ml-1">
            Nombre del Producto *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full h-14 px-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none placeholder:text-outline-variant text-on-surface"
            placeholder="Ej. Coca-Cola 600ml"
          />
        </div>

        {/* Barcode field */}
        <div className="space-y-1">
          <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant ml-1">
            Código de Barras
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              className="flex-1 h-14 px-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none placeholder:text-outline-variant text-on-surface"
              placeholder="Escanea o escribe el código"
            />
            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white flex-shrink-0 active:scale-95 transition-transform"
              title="Escanear con cámara"
            >
              <ScanLine className="w-6 h-6" />
            </button>
          </div>
          {barcode ? (
            <p className="text-xs text-blue-700 font-bold px-1">✓ Código: {barcode}</p>
          ) : (
            <p className="text-xs text-on-surface-variant px-1">
              Toca el ícono de cámara para escanear con la cámara del dispositivo.
            </p>
          )}
        </div>

        {/* SKU */}
        <div className="space-y-1">
          <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant ml-1">
            SKU (se genera automáticamente si está vacío)
          </label>
          <input
            type="text"
            value={sku}
            onChange={e => setSku(e.target.value)}
            className="w-full h-14 px-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none placeholder:text-outline-variant text-on-surface"
            placeholder="Ej. PROD-001"
          />
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant ml-1">
            Categoría
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full h-14 px-4 appearance-none rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none text-on-surface"
            >
              <option>Electronica</option>
              <option>Mobiliario</option>
              <option>Accesorios</option>
              <option>Galletas</option>
              <option>Frituras</option>
              <option>Yogurth</option>
              <option>Cremeria</option>
              <option>Refrescos</option>
              <option>Bebidas</option>
              <option>Agua</option>
              <option>Dulces</option>
              <option>Jabon</option>
              <option>Abarrotes Generales</option>
              <option>Productos a Granel</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant ml-1">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none placeholder:text-outline-variant text-on-surface resize-none"
            placeholder="Especificaciones, presentación, proveedor..."
            rows={3}
          />
        </div>

        {/* Price, Stock, MaxStock */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant ml-1">
              Precio ($)
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="w-full h-14 px-3 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none text-on-surface"
              placeholder="0.00"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant ml-1">
              Stock
            </label>
            <input
              type="number"
              required
              min="0"
              value={stock}
              onChange={e => setStock(e.target.value)}
              className="w-full h-14 px-3 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none text-on-surface"
              placeholder="0"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant ml-1">
              Máx.
            </label>
            <input
              type="number"
              min="0"
              value={maxStock}
              onChange={e => setMaxStock(e.target.value)}
              className="w-full h-14 px-3 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none text-on-surface"
              placeholder="0"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-6 rounded-2xl bg-surface-container-low border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer relative overflow-hidden"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          {image && (
            <img
              src={image}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
          )}
          <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary relative z-10">
            <Camera className="w-6 h-6" />
          </div>
          <div className="relative z-10">
            <p className="font-sans font-bold text-sm text-on-surface">
              {image ? 'Cambiar Imagen' : 'Añadir Foto del Producto'}
            </p>
            <p className="font-label text-xs text-on-surface-variant">
              PNG o JPG hasta 10MB
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Guardar Producto
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full h-14 mt-3 bg-transparent text-primary font-bold rounded-xl active:opacity-60 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Camera scanner overlay */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowScanner(false)}
        />
      )}
    </Layout>
  );
}
