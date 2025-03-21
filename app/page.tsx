import QRCodeShare from '../components/QRCodeShare';
import IdeaList from '../components/IdeaList';

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-100">GameHye Community에 오신 것을 환영합니다!</h1>
      <p className="mb-2 text-lg text-gray-300">
        게임에 대한 철학과 아이디어를 자유롭게 나누는 공간입니다.
      </p>
      
      <QRCodeShare />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">아이디어 목록</h2>
        <IdeaList />
      </div>
    </div>
  );
}
