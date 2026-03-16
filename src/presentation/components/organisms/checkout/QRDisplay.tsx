'use client';

import QRCode from 'react-qr-code';

interface QRDisplayProps {
  value: string;
  size?: number;
}

export const QRDisplay = ({ value, size = 256 }: QRDisplayProps) => {
  return (
    <div className="relative group p-4">
      {/* Decorative Glow */}
      <div className="absolute -inset-1 bg-linear-to-r from-pk-brand to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative pk-qr-container shadow-2xl">
        <div className="pk-qr-overlay animate-pk-scan"></div>
        <QRCode 
          value={value} 
          size={size} 
          level="H"
          fgColor="#0f172a"
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        />
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-pk-text-secondary font-medium tracking-wider uppercase">
          Scan to Pay
        </p>
      </div>
    </div>
  );
};
