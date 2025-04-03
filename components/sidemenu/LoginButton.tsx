'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LoginButtonProps {
  currentPath?: string;
  onClick?: () => void;
}

export default function LoginButton({ currentPath, onClick }: LoginButtonProps) {
  const [user, setUser] = useState<any>(null);
  const isProfilePage = currentPath === '/profile';
  const router = useRouter();
  
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

  // 로그인 안되어 있을 때 가이드 페이지로 이동
  const handleNavigateToGuide = () => {
    if (onClick) onClick();
    router.push('/guide');
  };
  
  return (
    <div>
      {user ? (
        <Link
          href="/profile"
          className="flex items-center justify-center p-2 rounded-full"
          title="프로필 페이지"
          onClick={onClick}
        >
          <Image 
            src={isProfilePage ? "/icon/icon_select_user.svg" : "/icon/icon_user.svg"}
            alt="프로필" 
            width={28} 
            height={28} 
            priority={!isProfilePage}
            style={{ width: '24px', height: '24px', objectFit: 'contain' }}
          />
        </Link>
      ) : (
        <button 
          onClick={handleNavigateToGuide} 
          className="flex items-center justify-center p-2 rounded-full"
          title="로그인 가이드"
        >
          <Image 
            src={isProfilePage ? "/icon/icon_select_user.svg" : "/icon/icon_user.svg"}
            alt="로그인 가이드" 
            width={28} 
            height={28}
            priority={!isProfilePage}
            style={{ width: '24px', height: '24px', objectFit: 'contain' }}
          />
        </button>
      )}
    </div>
  );
} 