'use client';
import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeShare() {
  return (
    <div className="mt-2 mb-6 flex justify-center">
      <QRCodeSVG 
        value="https://www.gamehye.com" 
        size={100}
        bgColor="transparent"
        fgColor="#e2e8f0" // tailwind gray-200 색상
      />
    </div>
  );
} 