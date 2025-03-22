'use client';
import { useState } from 'react';
import LoginButton from './LoginButton';
import { X, Menu, Home } from 'lucide-react';
import Image from 'next/image';
import { useIdeaForm } from '../context/IdeaFormContext';

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { toggleIdeaForm } = useIdeaForm();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
          className="fixed inset-0 bg-black bg-opacity-10 z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* 사이드 메뉴 - 배경색 제거 */}
      <div className={`fixed top-0 left-0 h-full w-64 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        {/* GameHye 텍스트를 상단에 별도로 배치 */}
        <div className="p-4 pt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-100">GameHye</h2>
            <button onClick={toggleMenu} className="md:hidden text-gray-400 hover:text-gray-200">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* 버튼 섹션은 중앙 정렬 유지 */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="p-4">
            {/* 모든 버튼을 세로로 정렬 */}
            <div className="flex flex-col items-center space-y-6">
              {/* 홈 버튼을 아이콘으로 변경 */}
              <a 
                href="/" 
                className="flex items-center justify-center p-2 rounded-full hover:bg-gray-700 transition"
                title="홈"
              >
                <Home className="h-6 w-6 text-gray-300" />
              </a>
              
              {/* 아이디어 제출 버튼 */}
              <button 
                onClick={toggleIdeaForm} 
                className="flex items-center justify-center p-2 rounded-full hover:bg-gray-700 transition"
                title="아이디어 제출"
              >
                <Image 
                  src="/icon_idea.svg" 
                  alt="아이디어 제출" 
                  width={32} 
                  height={32} 
                />
              </button>
              
              {/* 로그인 버튼 */}
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 