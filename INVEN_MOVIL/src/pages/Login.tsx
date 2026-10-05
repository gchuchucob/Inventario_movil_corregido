import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Mail, Lock, User, Store, Eye, EyeOff, Loader2 } from 'lucide-react';

type Mode = 'login' | 'register';

export default function Login() {
  const { loginEmail, loginGoogle, registerOwner } = useAuth();
  const [mode, setMode]           = useState<Mode>('login');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [name, setName]           = useState('');
  const [storeName, setStoreName] = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  function friendlyError(code: string): string {
    const map: Record<string, string> = {
      'auth/user-not-found':       'No existe una cuenta con ese correo.',
      'auth/wrong-password':       'Contraseña incorrecta.',
      'auth/invalid-credential':   'Correo o contraseña incorrectos.',
      'auth/email-already-in-use': 'Ese correo ya está registrado.',
      'auth/weak-password':        'La contraseña debe tener al menos 6 caracteres.',
      'auth/invalid-email':        'El formato del correo no es válido.',
      'auth/too-many-requests':    'Demasiados intentos. Espera unos minutos.',
      'auth/popup-closed-by-user': 'Cerraste la ventana de Google.',
    };
    return map[code] ?? 'Ocurrió un error. Intenta de nuevo.';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await loginEmail(email, password);
      } else {
        if (!name.trim() || !storeName.trim()) {
          setError('Por favor completa todos los campos.');
          setLoading(false);
          return;
        }
        await registerOwner(email, password, name.trim(), storeName.trim());
      }
    } catch (err: unknown) {
      setError(friendlyError((err as { code?: string }).code ?? ''));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError('');
    setLoading(true);
    try {
      await loginGoogle();
    } catch (err: unknown) {
      setError(friendlyError((err as { code?: string }).code ?? ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8 select-none">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
          <Package className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">Inventario Ángel</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          {mode === 'login' ? 'Inicia sesión en tu tienda' : 'Crea tu tienda nueva'}
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl shadow-sm p-6 space-y-5">

        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden border border-outline-variant/30">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
              mode === 'login' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
              mode === 'register' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            Nueva tienda
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Tu nombre</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input type="text" required value={name} onChange={e => setName(e.target.value)}
                    placeholder="Ej. Ángel García"
                    className="w-full h-12 pl-9 pr-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none text-sm text-on-surface" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Nombre de tu tienda</label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input type="text" required value={storeName} onChange={e => setStoreName(e.target.value)}
                    placeholder="Ej. Tienda Ángel"
                    className="w-full h-12 pl-9 pr-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none text-sm text-on-surface" />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full h-12 pl-9 pr-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none text-sm text-on-surface" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input type={showPwd ? 'text' : 'password'} required minLength={6}
                value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full h-12 pl-9 pr-10 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none text-sm text-on-surface" />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline" tabIndex={-1}>
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full h-12 bg-primary text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-60">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'login' ? 'Iniciar sesión' : 'Crear tienda'}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-outline-variant/30" />
          <span className="text-xs text-on-surface-variant font-medium">o continúa con</span>
          <div className="flex-1 h-px bg-outline-variant/30" />
        </div>

        <button onClick={handleGoogle} disabled={loading}
          className="w-full h-12 bg-surface-container border border-outline-variant/40 text-on-surface font-semibold rounded-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-60 text-sm">
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continuar con Google
        </button>

        {mode === 'register' && (
          <p className="text-center text-xs text-on-surface-variant leading-relaxed">
            Solo el dueño crea la tienda. Los empleados son invitados desde Configuración → Gestionar empleados.
          </p>
        )}
      </div>
    </div>
  );
}
