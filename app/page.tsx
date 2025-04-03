'use client';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../components/common/Footer';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex justify-center pt-12 sm:pt-16 md:pt-24">
        <Image 
          src="/logo.svg" 
          alt="GameHye Logo" 
          width={240} 
          height={240} 
          priority
          className="w-40 h-40 sm:w-56 sm:h-56 md:w-60 md:h-60"
        />
      </div>
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 sm:p-12 md:p-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 md:mb-10">
            <p className="text-lg sm:text-xl md:text-2xl mb-3 md:mb-4 text-gray-300">게임에 관한 모든 아이디어를 공유하고 발전시키는 공간</p>
            <p className="text-base sm:text-lg text-gray-400 mb-6 md:mb-8">
            <span className="inline-flex items-center" style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'text-bottom' }}>
                <a href="https://www.sellanding.kr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-blue-400 transition-colors">
                  <Image 
                    src="/sellanding.svg" 
                    alt="Sellanding Logo" 
                    width={17} 
                    height={17} 
                    className="mr-1"
                    style={{ display: 'inline-block' }}
                  /> <span style={{ verticalAlign: 'middle', color: 'white' }}>Sellanding</span>
                </a></span><br />에서 출시한 게임에 대한 <span className="text-white">피드백</span> 또는 '게임' 이라는 주제에 관한 <span className="text-white">자유로운 생각</span>을 남겨주세요.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-left">
            <div className="bg-gray-700 p-5 sm:p-6 rounded-lg shadow-md hover:bg-gray-650 transition-colors">
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-100">생각 남기기</h2>
              <p className="text-sm sm:text-base text-gray-300">
                피드백 또는 게임에 대한 자유로운 생각을 남겨주세요.
              </p>
            </div>
            
            <div className="bg-gray-700 p-5 sm:p-6 rounded-lg shadow-md hover:bg-gray-650 transition-colors">
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-100">익명성</h2>
              <p className="text-sm sm:text-base text-gray-300">
                모든 댓글은 익명으로 작성됩니다, 자유롭게 생각을 남겨주세요.
              </p>
            </div>
            
            <div className="bg-gray-700 p-5 sm:p-6 rounded-lg shadow-md hover:bg-gray-650 transition-colors sm:col-span-2 md:col-span-1">
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-100">공개 설정</h2>
              <p className="text-sm sm:text-base text-gray-300">
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
