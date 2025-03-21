import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import ReplyForm from '../../components/ReplyForm';
// import DeleteButton from '../../components/DeleteButton';

export const revalidate = 0; // 실시간 데이터 갱신을 위해 캐시 비활성화

export default async function IdeasPage() {
  // 아이디어 목록 가져오기 (최신순)
  const { data: ideas, error: ideasError } = await supabase
    .from('ideas')
    .select('*')
    .order('created_at', { ascending: false });
    
  // 모든 답변 가져오기
  const { data: replies, error: repliesError } = await supabase
    .from('replies')
    .select('*');
    
  // 현재 사용자 확인 (서버 컴포넌트에서는 쿠키 기반)
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.id === process.env.NEXT_PUBLIC_ADMIN_ID;
  
  if (ideasError || repliesError) {
    console.error("Error fetching data:", ideasError || repliesError);
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">아이디어 목록</h1>
        <Link href="/" className="text-blue-500 hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
      
      {ideas && ideas.length > 0 ? (
        <div className="space-y-6">
          {ideas.map((idea) => (
            <div key={idea.id} className="p-4 border rounded shadow-sm">
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{idea.content}</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                작성일: {new Date(idea.created_at).toLocaleString()}
              </p>
              
              {/* 답변 목록 */}
              {replies && replies.filter(r => r.idea_id === idea.id).length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="font-semibold mb-2">운영자 답변</h3>
                  {replies
                    .filter(r => r.idea_id === idea.id)
                    .map(reply => (
                      <div key={reply.id} className="mb-2 p-3 bg-gray-50 rounded-md">
                        <p className="whitespace-pre-wrap">{reply.content}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          작성일: {new Date(reply.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))
                  }
                </div>
              )}
              
              {/* 운영자 답변 폼 (클라이언트 컴포넌트) */}
              <ReplyForm ideaId={idea.id} />
              
              {/* 운영자 삭제 버튼 (서버 액션) */}
              {isAdmin && (
                <form action={async () => {
                  'use server';
                  // 답변 먼저 삭제 (외래 키 제약 조건)
                  await supabase.from('replies').delete().eq('idea_id', idea.id);
                  // 아이디어 삭제
                  await supabase.from('ideas').delete().eq('id', idea.id);
                  // 페이지 리프레시 (서버 액션에서는 redirect)
                }}>
                  <button 
                    type="submit" 
                    className="mt-4 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                  >
                    삭제
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border rounded">
          <p className="text-gray-500">작성된 아이디어가 없습니다.</p>
        </div>
      )}
    </div>
  );
} 