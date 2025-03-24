'use client';
import Link from 'next/link';
import Footer from '../components/common/Footer';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-100">GameHye</h1>
          
          <div className="mb-10">
            <p className="text-xl md:text-2xl mb-4 text-gray-300">게임에 관한 모든 아이디어를 공유하고 발전시키는 공간</p>
            <p className="text-lg text-gray-400 mb-8">
              GameHye는 게임 개발자와 게임 애호가들이 모여 새로운 게임 아이디어를 공유하고,
              피드백을 주고받으며 함께 성장할 수 있는 커뮤니티 플랫폼입니다.
            </p>
            
            {/* <div className="mb-8">
              <Link 
                href="/idea" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
              >
                아이디어 둘러보기
              </Link>
            </div> */}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-gray-700 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-3 text-gray-100">생각 남기기</h2>
              <p className="text-gray-300">
                자사 게임에 대한 피드백 또는 게임에 대한 자유로운 생각을 남겨주세요.
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-3 text-gray-100">익명성</h2>
              <p className="text-gray-300">
                모든 댓글은 익명으로 작성됩니다,  자유롭게 생각을 남겨주세요.
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-3 text-gray-100">공개 설정</h2>
              <p className="text-gray-300">
                생각을 남길 때 공개 또는 비공개로 설정할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
