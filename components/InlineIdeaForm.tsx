'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X } from 'lucide-react';
import { useIdeaForm } from '../context/IdeaFormContext';

export default function InlineIdeaForm() {
  const { toggleIdeaForm } = useIdeaForm();
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('아이디어 내용을 입력해주세요.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      const { error: insertError } = await supabase
        .from('ideas')
        .insert([
          { 
            title: '아이디어', // 기본 제목 설정
            description, 
            user_id: userId || null,
            author_name: null // 작성자 이름 없음
          },
        ]);
      
      if (insertError) throw insertError;
      
      setDescription('');
      setSuccess(true);
      
      // 3초 후 폼 숨기기
      setTimeout(() => {
        toggleIdeaForm();
        window.location.reload(); // 페이지 새로고침으로 목록 업데이트
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting idea:', err);
      setError('아이디어 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-md mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-100">새 아이디어</h2>
        <button onClick={toggleIdeaForm} className="text-gray-400 hover:text-gray-200">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {success ? (
        <div className="text-center py-4">
          <div className="text-green-400 mb-2 text-xl">✓</div>
          <p className="text-gray-100">성공적으로 제출되었습니다!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-2 bg-red-900 bg-opacity-50 text-red-300 rounded text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-32"
              placeholder="여기에 아이디어를 자유롭게 작성해주세요..."
              disabled={submitting}
            ></textarea>
          </div>
          
          <div>
            <button
              type="submit"
              className={`py-2 px-4 rounded ${
                submitting
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition`}
              disabled={submitting}
            >
              {submitting ? '제출 중...' : '제출하기'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 