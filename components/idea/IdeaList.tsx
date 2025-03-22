'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { customFont } from '../../lib/fonts';
import ReplyForm from '../admin/ReplyForm';
import ReplyDisplay from './ReplyDisplay';
import { MessageSquare, X } from 'lucide-react';

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

  // 시간 형식 변환 함수 수정
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const createdAt = new Date(dateString);
    
    // 현재 UTC 시간과 로컬 시간의 차이를 보정 (시간대 차이 제거)
    const timezoneOffset = now.getTimezoneOffset() * 60 * 1000;
    
    // 시간 차이 계산 (밀리초 단위)
    const diffInMs = now.getTime() - createdAt.getTime();
    
    // 시간 차이를 시간 단위로 변환
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    // 24시간 이내인 경우
    if (diffInHours < 24) {
      // 1시간 미만인 경우 분 단위로 표시
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return diffInMinutes <= 0 ? '방금 전' : `${diffInMinutes}분 전`;
      }
      return `${diffInHours}시간 전`;
    }
    
    // 24시간 이상인 경우 날짜 형식으로 표시
    return createdAt.toLocaleDateString('ko-KR');
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
            
            {/* 관리자 답변 버튼 - 위치 변경 및 아이콘 사용 */}
            {isAdmin && (
              <div className="flex justify-start mb-3">
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