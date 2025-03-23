'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { customFont } from '../../lib/fonts';
import { parseISO, formatDistanceToNow, differenceInHours } from 'date-fns';
import { ko } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { logger } from '../../lib/logger';

type Reply = {
  id: number;
  created_at: string;
  content: string;
  admin_id: string;
  idea_id: number;
};

export default function ReplyDisplay({ ideaId }: { ideaId: number }) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ideaUserId, setIdeaUserId] = useState<string | null>(null);

  // 시간 형식 변환 함수
  const formatTimeAgo = (dateString: string) => {
    try {
      // UTC 시간을 파싱
      const utcDate = parseISO(dateString);
      
      // 현재 시간과의 차이 계산
      const hoursDiff = differenceInHours(new Date(), utcDate);
      
      // 24시간 이내인 경우 상대적 시간 표시
      if (hoursDiff < 24) {
        return formatDistanceToNow(utcDate, {
          addSuffix: true,
          locale: ko
        });
      }
      
      // 24시간 이상인 경우 날짜 형식으로 표시 (KST 기준)
      return formatInTimeZone(utcDate, 'Asia/Seoul', 'yyyy년 M월 d일', { locale: ko });
    } catch (error) {
      logger.error('시간 형식 변환 오류:', error);
      return dateString; // 오류 발생 시 원본 문자열 반환
    }
  };

  useEffect(() => {
    async function fetchRepliesAndUserData() {
      try {
        setLoading(true);
        
        // 현재 로그인한 사용자 정보 가져오기
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id || null;
        setCurrentUser(userId);
        
        // 관리자 확인
        const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
        setIsAdmin(userId === adminId);
        
        // 먼저 아이디어의 공개 여부 확인
        const { data: ideaData, error: ideaError } = await supabase
          .from('ideas')
          .select('is_public, user_id')
          .eq('id', ideaId)
          .single();
        
        if (ideaError) {
          throw ideaError;
        }
        
        setIsPublic(ideaData.is_public);
        setIdeaUserId(ideaData.user_id);
        
        // 비공개 글이라도 항상 모든 답변을 가져오기
        const { data, error } = await supabase
          .from('replies')
          .select('*')
          .eq('idea_id', ideaId)
          .order('created_at', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        setReplies(data || []);
      } catch (err) {
        logger.error('Error fetching replies:', err);
        setError('답변을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchRepliesAndUserData();
  }, [ideaId]);

  // 접근 권한 확인 함수 (IdeaList.tsx와 동일한 방식)
  const canViewPrivateContent = () => {
    return isPublic || isAdmin || (currentUser && currentUser === ideaUserId);
  };

  if (loading) {
    return <div className="py-2 text-center text-gray-500 text-sm">답변을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="py-2 text-center text-red-400 text-sm">{error}</div>;
  }

  // 답변이 없는 경우에만 null 반환 (비공개 여부와 관계없이)
  if (replies.length === 0) {
    return null;
  }

  // 권한 확인 (IdeaList.tsx와 동일한 방식)
  const isPrivateAndRestricted = !isPublic && !canViewPrivateContent();

  return (
    <div className="mt-4 pt-4">
      {replies.map((reply) => (
        <div key={reply.id} className="mb-3 bg-gray-700 bg-opacity-50 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-green-400 font-semibold">GameHye</h4>
            <span className="text-xs text-gray-500">{formatTimeAgo(reply.created_at)}</span>
          </div>
          <p className={`${customFont.className} ${isPrivateAndRestricted ? 'text-gray-500 italic' : 'text-gray-200'}`}>
            {isPrivateAndRestricted ? 
              '비공개 답변입니다.' : 
              reply.content
            }
          </p>
        </div>
      ))}
    </div>
  );
} 