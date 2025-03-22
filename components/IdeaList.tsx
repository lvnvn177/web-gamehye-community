'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Idea = {
  id: string;
  created_at: string;
  content: string;
  user_id: string | null;
};

export default function IdeaList() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIdeas() {
      try {
        setLoading(true);
        
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
    
    fetchIdeas();
  }, []);

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
      {ideas.map((idea) => (
        <div key={idea.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-100">새로운 생각</h3>
          <p className="text-gray-300 mb-3">{idea.content}</p>
          <div className="text-sm text-gray-500 flex justify-between">
            <span>익명</span>
            <span>{new Date(idea.created_at).toLocaleDateString('ko-KR')}</span>
          </div>
        </div>
      ))}
    </div>
  );
} 