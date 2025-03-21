import LoginButton from '../components/LoginButton';
import IdeaForm from '../components/IdeaForm';
import QRCodeShare from '../components/QRCodeShare';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-4">GameHye Community에 오신 것을 환영합니다!</h1>
      <p className="mb-6 text-lg text-gray-700">
        게임에 대한 철학과 아이디어를 자유롭게 나누는 공간입니다.
      </p>
      
      <LoginButton />
      
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-3">아이디어 제출</h2>
        <IdeaForm />
      </div>
      
      <QRCodeShare />
      
      <div className="mt-8">
        <Link href="/ideas" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          아이디어 목록 보기
        </Link>
      </div>
    </div>
  );
}
