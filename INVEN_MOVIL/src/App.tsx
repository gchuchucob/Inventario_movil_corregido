import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { Loader2 } from 'lucide-react';

import Dashboard     from './pages/Dashboard';
import Inventory     from './pages/Inventory';
import AddProduct    from './pages/AddProduct';
import Movements     from './pages/Movements';
import Reports       from './pages/Reports';
import Finances      from './pages/Finances';
import Settings      from './pages/Settings';
import UsersManager  from './pages/UsersManager';
import Login         from './pages/Login';
import PendingAccess from './pages/PendingAccess';

// ─── Rutas protegidas ─────────────────────────────────────────────────────────

function AppRoutes() {
  const { firebaseUser, appUser, isLoading } = useAuth();

  // Pantalla de carga mientras Firebase verifica la sesión
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm text-on-surface-variant font-medium">Cargando…</p>
        </div>
      </div>
    );
  }

  // Sin sesión → login
  if (!firebaseUser) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // Autenticado con Firebase pero sin perfil Firestore (empleado no invitado aún)
  if (!appUser) {
    return (
      <Routes>
        <Route path="*" element={<PendingAccess />} />
      </Routes>
    );
  }

  const isOwner = appUser.role === 'owner';

  return (
    <AppProvider>
      <Routes>
        {/* Accesibles por todos */}
        <Route path="/"          element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/movements" element={<Movements />} />
        <Route path="/settings"  element={<Settings />} />

        {/* Solo dueño */}
        <Route path="/add-product" element={isOwner ? <AddProduct />   : <Navigate to="/" />} />
        <Route path="/reports"     element={isOwner ? <Reports />      : <Navigate to="/" />} />
        <Route path="/finances"    element={isOwner ? <Finances />     : <Navigate to="/" />} />
        <Route path="/users"       element={isOwner ? <UsersManager /> : <Navigate to="/" />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AppProvider>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
