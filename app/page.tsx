'use client';
import QRCodeShare from '../components/QRCodeShare';
import IdeaList from '../components/IdeaList';
import InlineIdeaForm from '../components/InlineIdeaForm';
import { useIdeaForm } from '../context/IdeaFormContext';

export default function Home() {
  const { isFormVisible } = useIdeaForm();
  
  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-100">GameHye Community에 오신 것을 환영합니다!</h1>
      <p className="mb-2 text-lg text-gray-300">
        게임에 대한 철학과 아이디어를 자유롭게 나누는 공간입니다.
      </p>
      
      <QRCodeShare />
      
      {/* 인라인 아이디어 폼 - 조건부 렌더링 */}
      {isFormVisible && <InlineIdeaForm />}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-200">생각 목록</h2>
        <hr className="border-gray-600 mb-6" />
        <IdeaList />
      </div>
    </div>
  );
}
