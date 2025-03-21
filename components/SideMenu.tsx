'use client';
import { useState } from 'react';
import LoginButton from './LoginButton';
import { X, Menu } from 'lucide-react';
import IdeaFormModal from './IdeaFormModal';
import Image from 'next/image';

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {/* 모바일 메뉴 버튼 */}
      <button 
        onClick={toggleMenu} 
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-md shadow-md md:hidden"
      >
        <Menu className="h-6 w-6 text-gray-200" />
      </button>

      {/* 오버레이 - 모바일에서 메뉴 외부 클릭 시 닫힘 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* 사이드 메뉴 */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col justify-center`}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-bold text-gray-100">GameHye</h2>
            <button onClick={toggleMenu} className="md:hidden text-gray-400 hover:text-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="space-y-6">
            <a href="/" className="block py-2 text-gray-300 hover:text-white transition">홈</a>
          </nav>
          
          <div className="mt-10 mb-6 flex justify-center">
            <button 
              onClick={toggleModal} 
              className="flex items-center justify-center p-2 rounded-full hover:bg-gray-700 transition"
              title="아이디어 제출"
            >
              <Image 
                src="/Light Bulb Emoji.png" 
                alt="아이디어 제출" 
                width={32} 
                height={32} 
              />
            </button>
          </div>
          
          <div className="mt-10 flex justify-center">
            <LoginButton />
          </div>
        </div>
      </div>

      {/* 아이디어 작성 모달 */}
      {isModalOpen && <IdeaFormModal onClose={toggleModal} />}
    </>
  );
} 