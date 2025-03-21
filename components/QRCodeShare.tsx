'use client';
import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeShare() {
  return (
    <div className="my-6 p-4 border rounded bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">QR 코드로 공유하세요</h3>
      <div className="flex justify-center">
        <QRCodeSVG 
          value="http://gamehye.com" 
          size={128}
        />
      </div>
    </div>
  );
} 