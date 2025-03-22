'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        
        if (!data.user) {
          router.push('/');
          return;
        }
        
        setUser(data.user);
        setEmail(data.user.email || '');
        
        // 이메일에서 아이디 부분 추출 (@ 앞 부분)
        const emailUsername = data.user.email?.split('@')[0] || '';
        setUsername(emailUsername);
        
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }

  if (!user) {
    return null; // 로그인되지 않은 경우 아무것도 표시하지 않음 (리디렉션 처리됨)
  }

  return (
    <div className="max-w-lg mx-auto p-6 py-10" style={{ marginLeft: '20%', transform: 'translateX(70%)' }}>
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gray-700 rounded-full p-4 mb-4">
            <Image 
              src="/icon/icon_select_user.svg"
              alt="프로필" 
              width={64} 
              height={64}
              priority
              className="opacity-80"
              style={{ width: '64px', height: '64px', objectFit: 'contain' }}
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-100">{username}</h1>
          <p className="text-gray-400 mt-1">{email}</p>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">내 계정</h2>
          
          <div className="space-y-4">
            {/* 이메일 정보 */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm text-gray-400 mb-1">로그인 이메일</h3>
              <p className="text-gray-200">{email}</p>
            </div>
            
            {/* 아이디 정보 */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm text-gray-400 mb-1">사용자명</h3>
              <p className="text-gray-200">{username}</p>
            </div>
            
            {/* 기타 정보 추가 가능 */}
          </div>
        </div>
        
        {/* 로그아웃 버튼 */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLogout}
            className="py-2 px-6 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition border border-gray-600"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
} 