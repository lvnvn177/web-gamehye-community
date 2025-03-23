'use client';
import QRCodeShare from '../../components/idea/QRCodeShare';
import IdeaList from '../../components/idea/IdeaList';
import InlineIdeaForm from '../../components/sidemenu/InlineIdeaForm';
import { useIdeaForm } from '../../context/IdeaFormContext';
import { useEffect, useState } from 'react';
import { PlusCircle, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase'; // 직접 supabase 가져오기

export default function IdeaPage() {
  const { isFormVisible, toggleIdeaForm } = useIdeaForm();
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<any>(null); // 사용자 상태 직접 관리
  
  // LoginButton.tsx와 유사한 방식으로 사용자 인증 상태 확인
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    
    // 현재 로그인된 사용자 확인
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // 폼이 표시될 때 body에 클래스 추가하여 스크롤 방지
  useEffect(() => {
    if (isFormVisible || isQRModalVisible) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isFormVisible, isQRModalVisible]);

  const toggleQRModal = () => {
    setIsQRModalVisible(!isQRModalVisible);
  };

  const handleIdeaButtonClick = () => {
    if (user) {
      // 로그인된 상태면 아이디어 폼 표시
      toggleIdeaForm();
    } else {
      // 로그인되지 않은 상태면 가이드 페이지로 이동
      router.push('/guide');
    }
  };
  
  return (
    <div className="relative">
      {/* 배경 오버레이 */}
      {(isFormVisible || isQRModalVisible) && (
        <div className="fixed inset-0 z-40" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} />
      )}
      
      {/* 모달 영역 - 페이지 최상위에 배치 */}
      {isQRModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative max-w-lg w-full mx-4">
            <button 
              onClick={toggleQRModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold text-gray-200 mb-4 text-center">QR 코드 공유</h3>
            <QRCodeShare />
          </div>
        </div>
      )}
      
      {isFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="relative z-10 w-full max-w-md border border-gray-700 rounded-lg bg-gray-800">
            <InlineIdeaForm />
          </div>
        </div>
      )}
      
      {/* 메인 콘텐츠 영역 */}
      <div className="max-w-lg p-4 py-8 mx-auto md:mx-0 md:ml-[calc(50%-25rem)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-100">GameHye</h1>
          <p className="mb-2 text-lg text-gray-300">
            게임에 대한 철학과 아이디어를 자유롭게 나누는 공간입니다.
          </p>
        </div>
        
        {/* 버튼 영역 - 별도 div로 분리 */}
        <div className="flex justify-end items-center mb-6 space-x-2">
          <button 
            onClick={toggleQRModal}
            className="text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
            aria-label="QR 코드 공유"
          >
            <QrCode className="h-5 w-5" />
          </button>
          
          <button 
            onClick={handleIdeaButtonClick}
            className="flex items-center space-x-1 text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
          >
            <PlusCircle className="h-4 w-4" />
            <span>생각 남기기</span>
          </button>
        </div>
        
        {/* 아이디어 목록 영역 - 별도 div로 분리 */}
        <div>
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold text-gray-200">생각 목록</h2>
          </div>
          
          <hr className="border-gray-600 mb-6" />
          <IdeaList />
        </div>
      </div>
    </div>
  );
} 