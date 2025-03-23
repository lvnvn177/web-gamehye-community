import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { logger } from '../../../lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    
    // 사용자 인증 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' }, 
        { status: 401 }
      );
    }
    
    // 아이디어 저장
    const { data, error } = await supabase
      .from('ideas')
      .insert({ content, user_id: user.id })
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    logger.error('Error submitting idea:', error);
    return NextResponse.json(
      { error: error.message || '아이디어 저장 중 오류가 발생했습니다.' }, 
      { status: 500 }
    );
  }
} 