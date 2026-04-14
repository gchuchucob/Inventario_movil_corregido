# Arquitectura del Proyecto: Azure Ledger

## 1. Mapa de Navegación
El flujo lógico de la aplicación se divide en las siguientes pantallas principales, accesibles a través de una barra de navegación inferior (Bottom Navigation Bar), más pantallas de acción secundarias:

1.  **Dashboard (Inicio)**: Vista general de ventas, costos, ganancias, estado de órdenes y resumen de productos top.
2.  **Inventario (Inventory)**: Estado global del inventario, valor total, alertas críticas (stock bajo) y lista de productos con niveles de stock.
    *   *Acción*: Botón flotante (FAB) para añadir un nuevo producto.
3.  **Nuevo Producto (Add Product)**: Formulario para registrar un nuevo ítem en el inventario (Nombre, Categoría, Descripción, Precio, Stock, Imagen).
4.  **Movimientos (Movements)**: Registro de entradas y salidas, barra de búsqueda, historial de transacciones e insights de flujo.
5.  **Reportes (Reports)**: Analíticas detalladas, tendencia de ventas netas, salud del stock, categorías principales e insights de crecimiento.
6.  **Finanzas (Finances)**: Vista alternativa/complementaria de reportes enfocada en patrimonio neto, inversiones, rendimiento de cartera y movimientos financieros recientes.
7.  **Configuración (Settings)**: Preferencias de cuenta, personalización (modo oscuro), información de la tienda y cierre de sesión.

## 2. Inventario de Componentes por Pantalla

### Comunes
*   **TopAppBar**: Encabezado fijo con logo/título, botón de menú/atrás y avatar del usuario.
*   **BottomNavBar**: Barra de navegación inferior con 5 iconos (Dashboard, Inventory, Movements, Reports/Finances, Settings).

### Pantalla 1: Dashboard
*   **Hero Card**: Tarjeta destacada con "Total Sales" ($12,450) y porcentaje de crecimiento (+14.2%).
*   **Metric Cards**: Tarjetas pequeñas para "Costs" y "Net Profit".
*   **Status Cards**: Tarjetas para órdenes "In Transit" y "Finished".
*   **Product List**: Lista de "Product Summary" mostrando imagen, SKU, nombre, unidades vendidas y un badge (TOP, PULSE).

### Pantalla 2: Nuevo Producto
*   **Header**: Título "Información del Producto" y subtítulo.
*   **Form Inputs**:
    *   Input de texto (Nombre del Producto).
    *   Select (Categoría).
    *   Textarea (Descripción).
    *   Inputs numéricos (Precio, Stock Inicial).
*   **Image Upload**: Área punteada para subir imagen.
*   **Action Buttons**: Botón primario "Guardar Producto" y secundario "Cancelar".

### Pantalla 3: Movimientos
*   **Hero Section**: Tarjeta con "Total Movimientos", "Entradas" y "Salidas".
*   **Search Bar**: Input con icono de lupa y botón de filtro.
*   **Transaction List**: Lista de movimientos recientes con iconos de colores (verde/azul para entradas, rojo para salidas, gris para ajustes), detalles y montos.
*   **Insight Card**: Tarjeta de alerta con información de flujo.

### Pantalla 4: Inventario
*   **Header Metrics**: "Total Items" y "Total Value".
*   **Alert Banner**: "Low Stock Alert" en color rojo/naranja.
*   **Inventory List**: Lista de productos con imagen, nombre, SKU, badge de estado (IN STOCK, LOW STOCK) y barra de progreso indicando el nivel de stock.
*   **FAB**: Botón flotante "+" para añadir producto.

### Pantalla 5: Reportes
*   **Chart Card**: Tarjeta con "Net Sales Trend" y un gráfico de barras simulado.
*   **Mini Metrics**: Tarjetas para "Movements" y "Stock Health".
*   **Categories List**: Lista de "Top Categories" con barras de progreso horizontales y montos.
*   **Insights List**: Lista de "Growth Insights" con iconos descriptivos.

### Pantalla 6: Finanzas
*   **Hero Card**: "Patrimonio Neto" con monto y crecimiento.
*   **Metric Cards**: "Inversión Realizada" y "Ganancias Totales".
*   **Performance Card**: "Rendimiento de Cartera" con barras de progreso para Ganancias y Pérdidas, y un tip contextual.
*   **Recent Movements**: Lista de transacciones financieras.

### Pantalla 7: Configuración
*   **Section - Cuenta**: Tarjeta de "Estado de cuenta".
*   **Section - Personalización**: Toggle para "Modo Oscuro" y selector de "Tema de Interfaz".
*   **Section - Información de la Tienda**: Campos para Nombre Comercial, Dirección y Teléfono.
*   **Danger Zone**: Botón "Cerrar Sesión".

## 3. Diccionario de Datos

```typescript
// Tipos de Datos Principales

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  maxStock: number;
  imageUrl: string;
  status: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK';
  unitsSold?: number;
  badge?: string;
};

export type Movement = {
  id: string;
  type: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  title: string;
  date: string;
  reference: string;
  amount?: number;
  units?: number;
};

export type FinanceTransaction = {
  id: string;
  title: string;
  type: 'Inversión' | 'Ganancias' | 'Cripto';
  date: string;
  amount: number;
  status: 'COMPLETADO' | 'RECIBIDO';
};
```
