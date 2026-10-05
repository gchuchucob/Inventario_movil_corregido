import { useState } from 'react';
import Layout from '../components/Layout';
import { UserPlus, Trash2, Mail, Users, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function UsersManager() {
  const { store, appUser, refreshUser } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading]   = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [msg, setMsg]           = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const allowedEmails: string[] = store?.allowedEmails ?? [];

  function showMsg(type: 'ok' | 'err', text: string) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  }

  async function addWorker() {
    const email = newEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) { showMsg('err', 'Introduce un correo válido.'); return; }
    if (email === appUser?.email)        { showMsg('err', 'No puedes añadirte a ti mismo.'); return; }
    if (allowedEmails.includes(email))   { showMsg('err', 'Ese correo ya está en la lista.'); return; }
    if (!store) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, 'stores', store.id), { allowedEmails: arrayUnion(email) });
      setNewEmail('');
      await refreshUser();
      showMsg('ok', `${email} añadido. Cuando inicie sesión tendrá acceso.`);
    } catch {
      showMsg('err', 'Error al añadir. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  }

  async function removeWorker(email: string) {
    if (!store) return;
    setRemoving(email);
    try {
      await updateDoc(doc(db, 'stores', store.id), { allowedEmails: arrayRemove(email) });
      await refreshUser();
      showMsg('ok', `${email} eliminado.`);
    } catch {
      showMsg('err', 'Error al eliminar.');
    } finally {
      setRemoving(null);
    }
  }

  return (
    <Layout title="Gestión de Equipo" showBack>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-on-surface">Empleados</h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Añade el correo de cada empleado. Cuando inicien sesión verán el inventario
          y podrán registrar ventas, pero no modificarán productos ni verán finanzas.
        </p>
      </div>

      {/* Cómo funciona */}
      <div className="bg-primary-fixed/40 rounded-2xl p-4 flex gap-3 mb-6">
        <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-xs text-on-surface leading-relaxed space-y-1">
          <p><strong>Dueño</strong> — acceso total: productos, movimientos, finanzas, reportes y configuración.</p>
          <p><strong>Empleado</strong> — registra entradas/salidas y consulta inventario. Sin finanzas ni borrado.</p>
        </div>
      </div>

      {/* Añadir */}
      <div className="space-y-2 mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Añadir empleado por correo
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addWorker()}
              placeholder="empleado@correo.com"
              className="w-full h-12 pl-9 pr-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary/40 outline-none text-sm text-on-surface" />
          </div>
          <button onClick={addWorker} disabled={loading}
            className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-on-primary flex-shrink-0 active:scale-95 transition-all disabled:opacity-60">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Flash */}
      {msg && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${
          msg.type === 'ok'
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
            : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {msg.type === 'err' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {msg.text}
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Users className="w-4 h-4 text-on-surface-variant" />
          <h3 className="font-bold text-on-surface-variant text-sm">Lista de acceso ({allowedEmails.length})</h3>
        </div>

        {allowedEmails.length === 0 ? (
          <div className="text-center py-10 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant">
            <Users className="w-10 h-10 text-outline-variant mx-auto mb-3" />
            <p className="font-bold text-on-surface text-sm">Sin empleados aún</p>
            <p className="text-xs text-on-surface-variant mt-1">Añade correos arriba para dar acceso.</p>
          </div>
        ) : (
          allowedEmails.map(email => (
            <div key={email} className="bg-surface-container-lowest p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold text-sm uppercase">
                  {email[0]}
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm">{email}</p>
                  <p className="text-xs text-on-surface-variant">Empleado · acceso limitado</p>
                </div>
              </div>
              <button onClick={() => removeWorker(email)} disabled={removing === email}
                className="w-9 h-9 rounded-xl bg-error-container/20 flex items-center justify-center text-error active:scale-90 transition-all disabled:opacity-50"
                aria-label={`Eliminar ${email}`}>
                {removing === email ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))
        )}
      </div>

      {allowedEmails.length > 0 && (
        <div className="mt-6 bg-surface-container-low rounded-2xl p-4 text-xs text-on-surface-variant leading-relaxed">
          <strong className="text-on-surface">¿Cómo acceden los empleados?</strong>
          <ol className="list-decimal ml-4 mt-2 space-y-1">
            <li>El empleado abre la app en su dispositivo.</li>
            <li>Toca <em>"Entrar"</em> e ingresa su correo y contraseña (o Google).</li>
            <li>Si su correo está en esta lista, accede automáticamente a tu tienda.</li>
          </ol>
        </div>
      )}
    </Layout>
  );
}
