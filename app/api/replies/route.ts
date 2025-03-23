import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const { idea_id, content } = await req.json();
    
    // 사용자 인증 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' }, 
        { status: 401 }
      );
    }
    
    // 운영자 확인
    const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
    if (user.id !== adminId) {
      return NextResponse.json(
        { error: '운영자만 답변할 수 있습니다.' }, 
        { status: 403 }
      );
    }
    
    // 답변 저장
    const { data, error } = await supabase
      .from('replies')
      .insert({ idea_id, content, admin_id: user.id })
      .select()
      .single();
      
    if (error) throw error;
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    logger.error('Error submitting reply:', error);
    return NextResponse.json(
      { error: error.message || '답변 저장 중 오류가 발생했습니다.' }, 
      { status: 500 }
    );
  }
} 