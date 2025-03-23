'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { customFont } from '../../lib/fonts';
import ReplyForm from '../admin/ReplyForm';
import ReplyDisplay from './ReplyDisplay';
import { MessageSquare, X } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { differenceInHours } from 'date-fns';

type Idea = {
  id: string;
  created_at: string;
  content: string;
  user_id: string | null;
  is_public: boolean;
};

export default function IdeaList() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeReplyForm, setActiveReplyForm] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // DB 시간과 한국 시간의 차이를 조정하는 함수
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
    async function fetchUserAndIdeas() {
      try {
        setLoading(true);
        
        // 현재 로그인한 사용자 정보 가져오기
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id || null;
        setCurrentUser(userId);
        
        // 관리자 확인
        const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
        setIsAdmin(userId === adminId);
        
        // 아이디어 불러오기
        const { data, error } = await supabase
          .from('ideas')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setIdeas(data || []);
      } catch (err) {
        setError('아이디어를 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching ideas:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserAndIdeas();
  }, []);

  // 답변 버튼 클릭 핸들러
  const toggleReplyForm = (ideaId: string) => {
    if (activeReplyForm === ideaId) {
      setActiveReplyForm(null);
    } else {
      setActiveReplyForm(ideaId);
    }
  };

  // 삭제 핸들러 추가
  const handleDelete = async (ideaId: string) => {
    if (!confirm('정말로 이 아이디어를 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      setDeleteLoading(ideaId);
      
      // 먼저 관련 답변 확인
      const { data: replies } = await supabase
        .from('replies')
        .select('id')
        .eq('idea_id', ideaId);
      
      // 답변이 있는 경우 답변 먼저 삭제
      if (replies && replies.length > 0) {
        const { error: replyDeleteError } = await supabase
          .from('replies')
          .delete()
          .eq('idea_id', ideaId);
        
        if (replyDeleteError) throw replyDeleteError;
      }
      
      // 아이디어 삭제
      const { error: ideaDeleteError } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId);
      
      if (ideaDeleteError) throw ideaDeleteError;
      
      // 성공적으로 삭제되면 UI에서도 해당 아이디어 제거
      setIdeas(ideas.filter(idea => idea.id !== ideaId));
      
    } catch (err) {
      console.error('Error deleting idea:', err);
      alert('아이디어 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return <div className="py-4 text-center text-gray-400">아이디어를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="py-4 text-center text-red-400">{error}</div>;
  }

  if (ideas.length === 0) {
    return <div className="py-4 text-center text-gray-400">아직 아이디어가 없습니다. 첫 번째 아이디어를 제출해보세요!</div>;
  }

  return (
    <div className="space-y-6">
      {ideas.map((idea) => {
        // 아이디어 접근 권한 확인
        const canViewPrivate = isAdmin || idea.user_id === currentUser;
        const isPrivateAndRestricted = !idea.is_public && !canViewPrivate;
        
        return (
          <div key={idea.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">익명</span>
              <div className="flex items-center">
                {!idea.is_public && (
                  <span className="mr-2 text-xs px-2 py-1 bg-gray-700 text-gray-400 rounded-full">비공개</span>
                )}
                <span className="text-gray-500 text-sm">{formatTimeAgo(idea.created_at)}</span>
              </div>
            </div>
            
            <p className={`text-gray-300 mb-3 whitespace-pre-line ${customFont.className}`}>
              {isPrivateAndRestricted ? (
                <span className="italic text-gray-500">비공개 아이디어입니다.</span>
              ) : (
                idea.content
              )}
            </p>
            
            {/* 관리자 답변 버튼과 삭제 버튼 */}
            {isAdmin && (
              <div className="flex justify-start mb-3 space-x-2">
                <button 
                  onClick={() => toggleReplyForm(idea.id)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                  title={activeReplyForm === idea.id ? "답변 취소" : "답변하기"}
                >
                  {activeReplyForm === idea.id ? (
                    <X size={16} />
                  ) : (
                    <MessageSquare size={16} />
                  )}
                </button>
                
                <button 
                  onClick={() => handleDelete(idea.id)}
                  disabled={deleteLoading === idea.id}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 hover:bg-red-700 text-gray-300 hover:text-white transition-colors"
                  title="아이디어 삭제"
                >
                  {deleteLoading === idea.id ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <Image src="/icon/icon_remove.svg" width={16} height={16} alt="삭제" />
                  )}
                </button>
              </div>
            )}
            
            {/* 구분선 - 재사용 */}
            <div className={`border-t border-gray-700 ${!isPrivateAndRestricted ? "mb-4" : ""}`}></div>
            
            {/* 답변 표시 컴포넌트 */}
            {!isPrivateAndRestricted && (
              <ReplyDisplay ideaId={parseInt(idea.id)} />
            )}
            
            {/* 답변 폼이 활성화된 경우에만 ReplyForm 표시 */}
            {isAdmin && activeReplyForm === idea.id && (
              <div className="mt-3">
                <ReplyForm ideaId={parseInt(idea.id)} isPublic={idea.is_public} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
} 