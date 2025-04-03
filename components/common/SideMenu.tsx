'use client';
import { useState, useEffect } from 'react';
import LoginButton from '../sidemenu/LoginButton';
import { X, Menu } from 'lucide-react';
import Image from 'next/image';
import { useIdeaForm } from '../../context/IdeaFormContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { toggleIdeaForm } = useIdeaForm();
  const pathname = usePathname();
  
  const isHome = pathname === '/';
  const isIdeaPage = pathname === '/idea';

  // 모바일 화면에서 메뉴가 열렸을 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // 반응형 처리 - 화면 크기 변경 시 모바일 메뉴 자동 닫기
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 모바일 메뉴 버튼 */}
      <button 
        onClick={toggleMenu} 
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-md shadow-md md:hidden"
        aria-label="메뉴 열기/닫기"
      >
        <Menu className="h-6 w-6 text-gray-200" />
      </button>

      {/* 오버레이 - 모바일에서 메뉴 외부 클릭 시 닫힘 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleMenu}
        />
      )}

      {/* 사이드 메뉴 */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 bg-opacity-90 backdrop-blur-sm shadow-lg z-50 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 flex flex-col`}
      >
        {/* GameHye 텍스트를 상단에 별도로 배치 */}
        <div className="p-4 pt-6">
          <div className="flex justify-between items-center">
            <Link href="/">
              <h2 className="text-xl font-bold text-gray-100 hover:text-white transition-colors">GameHye</h2>
            </Link>
            <button 
              onClick={toggleMenu} 
              className="md:hidden text-gray-400 hover:text-gray-200 transition-colors"
              aria-label="메뉴 닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* 버튼 섹션은 중앙 정렬 유지 */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="p-4">
            {/* 모든 버튼을 세로로 정렬 */}
            <div className="flex flex-col items-center space-y-6">
              {/* 홈 버튼 */}
              <Link 
                href="/" 
                className="flex items-center justify-center p-2 rounded-full hover:bg-gray-700 transition-colors"
                title="홈"
                onClick={() => isOpen && toggleMenu()}
              >
                <Image 
                  src={isHome ? "/icon/icon_select_home.svg" : "/icon/icon_home.svg"} 
                  alt="홈" 
                  width={28} 
                  height={28}
                  priority
                  style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                />
              </Link>
              
              {/* 아이디어 제출 버튼 */}
              <Link 
                href="/idea" 
                className="flex items-center justify-center p-2 rounded-full hover:bg-gray-700 transition-colors"
                title="아이디어 페이지"
                onClick={() => isOpen && toggleMenu()}
              >
                <Image 
                  src={isIdeaPage ? "/icon/icon_select_idea.svg" : "/icon/icon_idea.svg"} 
                  alt="아이디어 페이지" 
                  width={32} 
                  height={32}
                  priority
                  style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                />
              </Link>
              
              {/* 로그인 버튼 - 현재 경로 전달 */}
              <LoginButton currentPath={pathname} onClick={() => isOpen && toggleMenu()} />
            </div>
          </div>
        </div>
        
        {/* 모바일에서만 보이는 메뉴 하단 링크 */}
        <div className="p-4 md:hidden">
          <div className="flex flex-col space-y-3 text-sm text-gray-400">
            <Link href="/about" className="hover:text-white transition-colors" onClick={toggleMenu}>
              서비스 소개
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors" onClick={toggleMenu}>
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors" onClick={toggleMenu}>
              개인정보 처리방침
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 