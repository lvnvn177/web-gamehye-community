'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-gray-300 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            {/* <Image 
              src="/logo.png" 
              alt="GameHye Logo" 
              width={30} 
              height={30} 
              className="mr-3"
            /> */}
            <p className="text-sm">© {new Date().getFullYear()} Sellanding. All rights reserved.</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <Link href="/privacy" className="text-sm hover:text-white transition">
              개인정보 처리방침
            </Link>
            <Link href="/terms" className="text-sm hover:text-white transition">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 