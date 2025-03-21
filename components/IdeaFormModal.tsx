'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X } from 'lucide-react';

type IdeaFormModalProps = {
  onClose: () => void;
};

export default function IdeaFormModal({ onClose }: IdeaFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
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
            title, 
            description, 
            user_id: userId || null,
            author_name: authorName || null
          },
        ]);
      
      if (insertError) throw insertError;
      
      setTitle('');
      setDescription('');
      setAuthorName('');
      setSuccess(true);
      
      // 3초 후 모달 닫기
      setTimeout(() => {
        onClose();
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
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-90vh overflow-y-auto border border-gray-700">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-100">새 아이디어 작성</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          {success ? (
            <div className="text-center py-8">
              <div className="text-green-400 mb-2 text-xl">✓</div>
              <p className="text-lg font-medium mb-2 text-gray-100">성공적으로 제출되었습니다!</p>
              <p className="text-sm text-gray-400">잠시 후 창이 닫힙니다...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-2 bg-red-900 bg-opacity-50 text-red-300 rounded text-sm">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="title" className="block mb-1 font-medium text-gray-300">
                  제목
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="아이디어 제목을 입력하세요"
                  disabled={submitting}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block mb-1 font-medium text-gray-300">
                  내용
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-32"
                  placeholder="아이디어의 내용을 자세히 설명해주세요"
                  disabled={submitting}
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label htmlFor="authorName" className="block mb-1 font-medium text-gray-300">
                  작성자 이름 (선택)
                </label>
                <input
                  id="authorName"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="이름을 입력하거나 비워두세요"
                  disabled={submitting}
                />
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className={`w-full py-2 px-4 rounded ${
                    submitting
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white transition`}
                  disabled={submitting}
                >
                  {submitting ? '제출 중...' : '아이디어 제출하기'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 