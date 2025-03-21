'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
    <div className="my-4">
      {user ? (
        <button 
          onClick={handleLogout} 
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          로그아웃
        </button>
      ) : (
        <button 
          onClick={handleLogin} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Google 로그인
        </button>
      )}
    </div>
  );
} 