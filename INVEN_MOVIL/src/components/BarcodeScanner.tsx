import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Loader2 } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

const CONTAINER_ID = 'barcode-qr-region';

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const startedRef = useRef(false);
  const [status, setStatus] = useState<'loading' | 'scanning' | 'error'>('loading');
  const [errMsg, setErrMsg] = useState('');

  // useCallback con deps vacías → referencia estable → evita el bug del loop
  const handleScan = useCallback((text: string) => {
    onScan(text);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Delay pequeño para que el div esté en el DOM
    const timer = setTimeout(async () => {
      if (startedRef.current) return;
      startedRef.current = true;

      const scanner = new Html5Qrcode(CONTAINER_ID, {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.QR_CODE,
        ],
        verbose: false,
      });
      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: 'environment' },   // cámara trasera
          {
            fps: 15,
            qrbox: { width: 280, height: 140 },
            aspectRatio: 1.7,
            disableFlip: false,
          },
          (decodedText) => {
            handleScan(decodedText);
            scanner.stop().catch(() => {});
          },
          () => { /* frame sin código — ignorar */ }
        );
        setStatus('scanning');
      } catch (err) {
        console.error('BarcodeScanner:', err);
        const msg = String(err);
        if (msg.includes('Permission') || msg.includes('permission')) {
          setErrMsg('Permiso de cámara denegado. Ve a ajustes del navegador y actívalo para este sitio.');
        } else if (msg.includes('NotFound') || msg.includes('DevicesNotFound')) {
          setErrMsg('No se detectó ninguna cámara en este dispositivo.');
        } else {
          setErrMsg('No se pudo iniciar la cámara. Asegúrate de usar HTTPS o localhost.');
        }
        setStatus('error');
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      const sc = scannerRef.current;
      if (sc) {
        sc.isScanning ? sc.stop().catch(() => {}) : undefined;
        scannerRef.current = null;
      }
      startedRef.current = false;
    };
  }, [handleScan]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Escanear Código</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Apunta la cámara al código de barras</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
            aria-label="Cerrar escáner"
          >
            <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Área del escáner */}
        <div className="relative bg-black" style={{ minHeight: 260 }}>
          <div id={CONTAINER_ID} className="w-full" />

          {/* Visor de apuntado */}
          {status === 'scanning' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-72 h-36">
                <span className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl-sm" />
                <span className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400 rounded-tr-sm" />
                <span className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400 rounded-bl-sm" />
                <span className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br-sm" />
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-blue-400/70 animate-pulse" />
              </div>
            </div>
          )}

          {/* Cargando */}
          {status === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-white text-sm font-medium">Iniciando cámara…</p>
            </div>
          )}
        </div>

        {/* Error */}
        {status === 'error' && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20">
            <p className="text-red-600 dark:text-red-400 text-sm text-center leading-relaxed">{errMsg}</p>
            <button
              onClick={onClose}
              className="mt-3 w-full py-2 rounded-xl bg-red-600 text-white text-sm font-bold"
            >
              Cerrar
            </button>
          </div>
        )}

        {status === 'scanning' && (
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800">
            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              EAN-13 · EAN-8 · Code 128 · UPC · QR
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
