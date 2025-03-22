'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X } from 'lucide-react';
import { useIdeaForm } from '../../context/IdeaFormContext';

export default function InlineIdeaForm() {
  const { toggleIdeaForm } = useIdeaForm();
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
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
            content: description,
            user_id: userId || null,
            is_public: isPublic
          },
        ]);
      
      if (insertError) throw insertError;
      
      setDescription('');
      setSuccess(true);
      
      setTimeout(() => {
        toggleIdeaForm();
        window.location.reload();
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
        <h2 className="text-lg font-semibold text-gray-100">새로운 생각</h2>
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
              placeholder="게임에 관련된 생각을 자유롭게 적어주세요."
              disabled={submitting}
            ></textarea>
          </div>
          
          <div className="mb-4 flex items-center space-x-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="public"
                name="visibility"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 bg-gray-700"
              />
              <label htmlFor="public" className="text-gray-300">공개</label>
            </div>
            <div className="flex items-center ml-4">
              <input
                type="radio"
                id="private"
                name="visibility"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-500 bg-gray-700"
              />
              <label htmlFor="private" className="text-gray-300">비공개</label>
            </div>
          </div>
          
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className={`py-2 px-6 rounded ${
                submitting
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              } transition border border-gray-600`}
              disabled={submitting}
            >
              {submitting ? '남기는 중...' : '남기기'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 