import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// 두 번째 방법: 타입 정의를 분리
type RouteParams = { params: { id: string } };

type ParamsType = Promise<{ id: string }>;

export async function DELETE(
  request: NextRequest,
  props: { params: ParamsType }
) {
  try {
    const { id } = await props.params;
    
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
        { error: '운영자만 삭제할 수 있습니다.' }, 
        { status: 403 }
      );
    }
    
    // 연관된 답변 먼저 삭제 (외래 키 제약 조건)
    await supabase.from('replies').delete().eq('idea_id', id);
    
    // 아이디어 삭제
    const { error } = await supabase.from('ideas').delete().eq('id', id);
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting idea:', error);
    return NextResponse.json(
      { error: error.message || '아이디어 삭제 중 오류가 발생했습니다.' }, 
      { status: 500 }
    );
  }
} 