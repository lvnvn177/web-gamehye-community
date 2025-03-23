'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { FcGoogle } from 'react-icons/fc';
import Image from 'next/image';

export default function LoginGuidePage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    // 현재 URL을 리디렉션 URL로 저장하여 로그인 후 돌아올 수 있게 함
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/idea`
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-100">GameHye</h1>
          <Image 
            src="/icon/icon_select_idea.svg"
            alt="아이디어 아이콘"
            width={64}
            height={64}
            className="mx-auto my-4"
            priority
            style={{ width: '64px', height: '64px', objectFit: 'contain' }}
          />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">안내</h2>
          <p className="text-gray-300 mb-6">
            GameHye 서비스에 글을 남기기 위해서는 소셜 로그인 연동을 해주세요.
          </p>
        </div>
        
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-md transition duration-300"
        >
          <FcGoogle className="text-xl" />
          <span>Google 계정으로 계속</span>
        </button>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-200 text-sm"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
} 