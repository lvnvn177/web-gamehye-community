'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { customFont } from '../../lib/fonts';
import { logger } from '../../lib/logger';

export default function ReplyForm({ ideaId, isPublic }: { ideaId: number, isPublic: boolean }) {
  const [reply, setReply] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<{
    show: boolean;
    success: boolean;
    message: string;
  }>({ show: false, success: false, message: '' });
  
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
      
      // 1. 답변 등록
      const { data: replyData, error } = await supabase.from('replies').insert({ 
        idea_id: ideaId, 
        content: reply, 
        admin_id: user.user!.id 
      }).select().single();
      
      if (error) throw error;
      
      // 2. 이메일 알림 발송 API 호출
      try {
        const notificationResponse = await fetch('/api/reply-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ideaId,
            replyContent: reply,
          }),
        });
        
        const notificationResult = await notificationResponse.json();
        
        if (notificationResponse.ok) {
          setNotificationStatus({
            show: true,
            success: true,
            message: notificationResult.message || '알림 이메일이 발송되었습니다',
          });
        } else {
          setNotificationStatus({
            show: true,
            success: false,
            message: notificationResult.error || '알림 이메일 발송 중 오류가 발생했습니다',
          });
        }
        
        // 3초 후에 알림 숨기기
        setTimeout(() => {
          setNotificationStatus(prev => ({ ...prev, show: false }));
        }, 3000);
        
      } catch (notifyError) {
        logger.error('알림 발송 오류:', notifyError);
      }
      
      setReply('');
      window.location.reload();
    } catch (error) {
      logger.error('Error submitting reply:', error);
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
      {notificationStatus.show && (
        <div className={`mb-2 text-sm rounded-md p-2 ${
          notificationStatus.success ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'
        }`}>
          {notificationStatus.message}
        </div>
      )}
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