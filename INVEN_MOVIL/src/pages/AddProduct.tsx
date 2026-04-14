import { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { Camera, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function AddProduct() {
  const navigate = useNavigate();
  const { addProduct } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronica');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImage(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addProduct({
      sku: `SKU-${Math.floor(Math.random() * 10000)}`,
      name,
      category,
      description,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      maxStock: parseInt(stock) || 0,
      imageUrl: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      status: parseInt(stock) > 10 ? 'IN STOCK' : (parseInt(stock) > 0 ? 'LOW STOCK' : 'OUT OF STOCK'),
      unitsSold: 0
    });

    navigate('/inventory');
  };

  return (
    <Layout title="Nuevo Producto" showBack>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight font-sans">Información del Producto</h2>
        <p className="text-on-surface-variant text-sm font-label mt-1">Completa los detalles técnicos para el inventario.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="space-y-2">
          <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant ml-1">Nombre del Producto</label>
          <div className="relative group">
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-14 px-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary-container transition-all placeholder:text-outline-variant font-sans text-on-surface" 
              placeholder="Ej. Laptop Pro X1" 
            />
          </div>
        </div>

        {/* Category Field */}
        <div className="space-y-2">
          <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant ml-1">Categoría</label>
          <div className="relative">
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-14 px-4 appearance-none rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary-container transition-all font-sans text-on-surface"
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant ml-1">Descripción</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary-container transition-all placeholder:text-outline-variant font-sans text-on-surface resize-none" 
            placeholder="Detalla las especificaciones y características principales..." 
            rows={4}
          ></textarea>
        </div>

        {/* Numeric Row (Price & Stock) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant ml-1">Precio ($)</label>
            <input 
              type="number" 
              required
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full h-14 px-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary-container transition-all font-sans text-on-surface" 
              placeholder="0.00" 
            />
          </div>
          <div className="space-y-2">
            <label className="block font-label font-semibold text-xs uppercase tracking-wider text-on-surface-variant ml-1">Stock Inicial</label>
            <input 
              type="number" 
              required
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full h-14 px-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary-container transition-all font-sans text-on-surface" 
              placeholder="0" 
            />
          </div>
        </div>

        {/* Image Upload Placeholder */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="p-6 rounded-2xl bg-surface-container-low border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-center space-y-2 group hover:bg-surface-container-high transition-colors cursor-pointer overflow-hidden relative"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
          {image ? (
            <img src={image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
          ) : null}
          <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container relative z-10">
            <Camera className="w-6 h-6" />
          </div>
          <div className="relative z-10">
            <p className="font-sans font-bold text-sm text-on-surface">{image ? 'Cambiar Imagen' : 'Añadir Imagen'}</p>
            <p className="font-label text-xs text-on-surface-variant">PNG o JPG hasta 10MB</p>
          </div>
        </div>

        {/* Primary Action */}
        <div className="pt-4 pb-8">
          <button 
            type="submit" 
            className="w-full h-14 bg-gradient-to-r from-primary to-primary-container text-on-primary font-sans font-bold rounded-xl shadow-lg shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Guardar Producto
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="w-full h-14 mt-3 bg-transparent text-primary font-sans font-bold rounded-xl active:opacity-60 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Layout>
  );
}
