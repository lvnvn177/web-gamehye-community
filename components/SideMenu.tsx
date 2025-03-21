'use client';
import { useState } from 'react';
import LoginButton from './LoginButton';
import { X, Menu, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 모바일 메뉴 버튼 */}
      <button 
        onClick={toggleMenu} 
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* 오버레이 - 모바일에서 메뉴 외부 클릭 시 닫힘 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* 사이드 메뉴 */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-blue-50 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col justify-center`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-blue-600">GameHye</h2>
            <button onClick={toggleMenu} className="md:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="space-y-4">
            <Link href="/" className="block py-2 hover:text-blue-600 transition">홈</Link>
          </nav>
          
          <div className="mt-6 mb-6">
            <Link href="#idea-form" className="flex items-center gap-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              <PlusCircle className="h-5 w-5" />
              <span>아이디어 제출</span>
            </Link>
          </div>
          
          <div className="mt-4">
            <LoginButton />
          </div>
        </div>
      </div>
    </>
  );
} 