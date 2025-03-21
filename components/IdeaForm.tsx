'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function IdeaForm() {
  const [content, setContent] = useState('');
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      if (!user) {
        alert('로그인이 필요합니다.');
        return;
      }
      
      const { error } = await supabase.from('ideas').insert({ 
        content, 
        user_id: user.id 
      });
      
      if (error) throw error;
      
      setContent('');
      alert('생각이 성공적으로 제출되었습니다!');
    } catch (error) {
      console.error('Error submitting idea:', error);
      alert('생각 제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-4">
      <div className="mb-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          rows={4}
          className="w-full p-2 border rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="저희 게임에 대한 자유로운 피드백 또는 생각을 적어주세요 (최대 500자)"
          disabled={!user || isSubmitting}
        />
        <div className="text-right text-sm text-gray-500">
          {content.length}/500
        </div>
      </div>
      <button 
        type="submit" 
        className={`px-4 py-2 rounded text-white ${
          !user || isSubmitting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        } transition`}
        disabled={!user || isSubmitting}
      >
        {isSubmitting ? '제출 중...' : '제출'}
      </button>
      {!user && (
        <p className="mt-2 text-sm text-red-500">생각을 제출하려면 로그인이 필요합니다.</p>
      )}
    </form>
  );
} 