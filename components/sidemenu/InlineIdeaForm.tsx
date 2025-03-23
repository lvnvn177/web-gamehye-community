'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X } from 'lucide-react';
import { useIdeaForm } from '../../context/IdeaFormContext';
import { customFont } from '../../lib/fonts';

export default function InlineIdeaForm() {
  const { toggleIdeaForm } = useIdeaForm();
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // 로그인 상태 및 사용자 이메일 확인
  useEffect(() => {
    const checkUserAuth = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        setUserEmail(userData.user.email || null);
      }
    };
    
    checkUserAuth();
  }, []);

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
      // 현재 로그인한 사용자의 이메일 가져오기
      const email = userData.user?.email || null;
      
      const { error: insertError } = await supabase
        .from('ideas')
        .insert([
          { 
            content: description,
            user_id: userId || null,
            is_public: isPublic,
            email: email // 사용자 이메일 자동 저장
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
    <div className="px-4 py-4">
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
          {userEmail && (
            <p className="text-sm text-gray-400 mt-2">
              답변이 등록되면 {userEmail}로 알림을 보내드립니다.
            </p>
          )}
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
              className={`w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-32 whitespace-pre-line ${customFont.className}`}
              placeholder="게임에 관련된 생각을 자유롭게 적어주세요."
              disabled={submitting}
            ></textarea>
          </div>
          
          {/* 로그인 상태와 이메일에 대한 안내 메시지 */}
          {userEmail ? (
            <div className="mb-4 text-xs text-gray-400">
              답변이 등록되면 {userEmail}로 알림을 보내드립니다.
            </div>
          ) : (
            <div className="mb-4 text-xs text-gray-400">
              로그인하시면 답변이 등록될 때 이메일로 알림을 받을 수 있습니다.
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <button 
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`px-4 py-1.5 rounded border ${
                isPublic 
                  ? 'border-blue-600 text-blue-400'
                  : 'border-purple-600 text-purple-400'
              } transition-colors`}
            >
              {isPublic ? '공개' : '비공개'}
            </button>
            
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