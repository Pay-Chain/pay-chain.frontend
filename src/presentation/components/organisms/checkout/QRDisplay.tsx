'use client';

import QRCode from 'react-qr-code';

interface QRDisplayProps {
  value: string;
  size?: number;
  label?: string;
}

export const QRDisplay = ({ value, size = 256, label = 'Scan to Pay' }: QRDisplayProps) => {
  const safeValue = value.trim();

  return (
    <div className="relative group p-4">
      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-linear-to-r from-pk-brand to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      
      {safeValue ? (
        <div className="relative pk-qr-container shadow-2xl">
          <div className="pk-qr-overlay animate-pk-scan"></div>
          <QRCode
            value={safeValue}
            size={size}
            level="H"
            fgColor="#0f172a"
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          />
        </div>
      ) : (
        <div className="relative rounded-2xl border border-dashed border-white/25 bg-white/5 min-h-[256px] flex items-center justify-center text-center px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/45">Payment code unavailable</p>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <p className="text-xs text-pk-text-secondary font-medium tracking-wider uppercase">
          {label}
        </p>
      </div>
    </div>
  );
};
