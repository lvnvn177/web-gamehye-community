'use client';
import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeShare() {
  return (
    <div className="mt-2 mb-6">
      <div className="flex justify-center">
        <QRCodeSVG 
          value="http://gamehye.com" 
          size={100}
        />
      </div>
    </div>
  );
} 