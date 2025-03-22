'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';

export default function LoginButton() {
  const [user, setUser] = useState<any>(null);
  
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

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: `${window.location.origin}/` 
      },
    });
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      {user ? (
        <button 
          onClick={handleLogout} 
          className="flex items-center justify-center p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
          title="로그아웃"
        >
          <Image 
            src="/icon_user.svg" 
            alt="로그아웃" 
            width={28} 
            height={28} 
            className="opacity-70"
            style={{ width: '24px', height: '24px', objectFit: 'contain' }}
          />
        </button>
      ) : (
        <button 
          onClick={handleLogin} 
          className="flex items-center justify-center p-2 rounded-full hover:bg-gray-700 transition"
          title="Google 로그인"
        >
          <Image 
            src="/icon_user.svg" 
            alt="Google 로그인" 
            width={28} 
            height={28}
            style={{ width: '24px', height: '24px', objectFit: 'contain' }}
          />
        </button>
      )}
    </div>
  );
} 