'use client';
import QRCodeShare from '../../components/idea/QRCodeShare';
import IdeaList from '../../components/idea/IdeaList';
import InlineIdeaForm from '../../components/sidemenu/InlineIdeaForm';
import { useIdeaForm } from '../../context/IdeaFormContext';
import { useEffect } from 'react';
import { PlusCircle } from 'lucide-react';

export default function IdeaPage() {
  const { isFormVisible, toggleIdeaForm } = useIdeaForm();
  
  // 폼이 표시될 때 body에 클래스 추가하여 스크롤 방지
  useEffect(() => {
    if (isFormVisible) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isFormVisible]);
  
  return (
    <div className="max-w-lg mx-auto p-4 py-8 relative" style={{ marginLeft: '20%', transform: 'translateX(70%)' }}>
      {/* 인라인 스타일을 사용하여 매우 낮은 불투명도(5%) 적용 */}
      {isFormVisible && (
        <div className="fixed inset-0 z-40" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} />
      )}
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-100">GameHye</h1>
        <p className="mb-2 text-lg text-gray-300">
          게임에 대한 철학과 아이디어를 자유롭게 나누는 공간입니다.
        </p>
      </div>
      
      <QRCodeShare />
      
      {/* 인라인 아이디어 폼 - 모달 형태로 변경 */}
      {isFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50" 
             style={{ 
               top: 0, 
               left: 0, 
               right: 0, 
               bottom: 0, 
               margin: 0,
               transform: 'none',
               position: 'fixed'
             }}>
          <div className="w-full max-w-lg" style={{ 
            position: 'absolute', 
            top: '70%',
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            maxWidth: '90vw'
          }}>
            <InlineIdeaForm />
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-200">생각 목록</h2>
          
          {/* 아이디어 제출 버튼 추가 */}
          <button 
            onClick={toggleIdeaForm}
            className="flex items-center space-x-1 text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
          >
            <PlusCircle className="h-4 w-4" />
            <span>생각 남기기</span>
          </button>
        </div>
        <hr className="border-gray-600 mb-6" />
        <IdeaList />
      </div>
    </div>
  );
} 