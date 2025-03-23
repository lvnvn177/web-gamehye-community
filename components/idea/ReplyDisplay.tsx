'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { customFont } from '../../lib/fonts';
import { parseISO, formatDistanceToNow, differenceInHours } from 'date-fns';
import { ko } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';

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
      console.error('시간 형식 변환 오류:', error);
      return dateString; // 오류 발생 시 원본 문자열 반환
    }
  };

  useEffect(() => {
    async function fetchReplies() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('replies')
          .select('*')
          .eq('idea_id', ideaId)
          .order('created_at', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        console.log('Supabase 원본 데이터:', data);
        
        setReplies(data || []);
      } catch (err) {
        console.error('Error fetching replies:', err);
        setError('답변을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchReplies();
  }, [ideaId]);

  if (loading) {
    return <div className="py-2 text-center text-gray-500 text-sm">답변을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="py-2 text-center text-red-400 text-sm">{error}</div>;
  }

  if (replies.length === 0) {
    return null; // 답변이 없는 경우 아무것도 표시하지 않음
  }

  return (
    <div className="mt-4 pt-4">
      {replies.map((reply) => (
        <div key={reply.id} className="mb-3 bg-gray-700 bg-opacity-50 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-green-400 font-semibold">GameHye</h4>
            <span className="text-xs text-gray-500">{formatTimeAgo(reply.created_at)}</span>
          </div>
          <p className={`text-gray-200 ${customFont.className}`}>{reply.content}</p>
        </div>
      ))}
    </div>
  );
} 