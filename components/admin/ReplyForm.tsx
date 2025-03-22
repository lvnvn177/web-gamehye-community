'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { customFont } from '../../lib/fonts';

export default function ReplyForm({ ideaId, isPublic }: { ideaId: number, isPublic: boolean }) {
  const [reply, setReply] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getUser();
      const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
      setIsAdmin(data.user?.id === adminId);
    };
    
    checkAdmin();
  }, []);

  const handleReply = async () => {
    if (!reply.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!isAdmin) {
        alert('운영자만 답변할 수 있습니다.');
        return;
      }
      
      const { error } = await supabase.from('replies').insert({ 
        idea_id: ideaId, 
        content: reply, 
        admin_id: user.user!.id 
      });
      
      if (error) throw error;
      
      setReply('');
      window.location.reload();
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('답변 제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="mt-4 pt-2 bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold mb-2">
        운영자 답변 작성
        {!isPublic && <span className="ml-2 text-xs px-2 py-1 bg-gray-700 text-gray-400 rounded-full">비공개 아이디어</span>}
      </h3>
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        maxLength={500}
        rows={3}
        className={`w-full p-2 border rounded resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-700 text-gray-200 ${customFont.className}`}
        placeholder="운영자 답변 (최대 500자)"
        disabled={isSubmitting}
      />
      <div className="text-right text-sm text-gray-500 mb-2">
        {reply.length}/500
      </div>
      <button 
        onClick={handleReply} 
        className={`px-4 py-2 rounded text-white ${
          isSubmitting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-500 hover:bg-green-600'
        } transition`}
        disabled={isSubmitting}
      >
        {isSubmitting ? '제출 중...' : '답변 등록'}
      </button>
    </div>
  );
} 