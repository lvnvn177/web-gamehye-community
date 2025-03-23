import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmail } from '@/lib/nodemailer';
import { generateReplyEmailHTML } from '@/lib/email-template';

export async function POST(request: Request) {
  try {
    console.log('[reply-notification] API 요청 시작');
    
    // SMTP 환경 변수 로깅 (비밀번호 제외)
    console.log('[reply-notification] SMTP 설정 확인:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM,
    });
    
    // 요청 바디 로깅
    const body = await request.json();
    console.log('[reply-notification] 요청 데이터:', { ideaId: body.ideaId });
    const { ideaId, replyContent } = body;
    
    // 아이디어 정보 조회 (이메일 포함)
    console.log('[reply-notification] 아이디어 정보 조회 시작');
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .select('content, email, user_id')
      .eq('id', ideaId)
      .single();
    
    if (ideaError) {
      console.error('[reply-notification] 아이디어 조회 오류:', ideaError);
      throw ideaError;
    }
    
    console.log('[reply-notification] 아이디어 정보 조회 완료:', { 
      hasEmail: !!idea.email,
      contentLength: idea.content?.length || 0
    });
    
    // 이메일이 없는 경우
    if (!idea.email) {
      console.log('[reply-notification] 이메일 정보 없음, 알림 발송 건너뜀');
      return NextResponse.json(
        { message: '이메일 정보가 없어 알림을 발송하지 않았습니다' },
        { status: 200 }
      );
    }
    
    // 이메일 HTML 생성
    console.log('[reply-notification] 이메일 HTML 생성');
    const html = generateReplyEmailHTML({
      ideaContent: idea.content,
      replyContent,
      ideaId
    });
    
    // 이메일 발송
    console.log('[reply-notification] 이메일 발송 시작:', { 
      to: idea.email.substring(0, 3) + '***@***' // 이메일 일부만 로깅 (보안)
    });
    
    try {
      await sendEmail({
        to: idea.email,
        subject: '아이디어에 새로운 답변이 등록되었습니다',
        html
      });
      console.log('[reply-notification] 이메일 발송 성공');
    } catch (emailError) {
      console.error('[reply-notification] 이메일 발송 실패:', emailError);
      // 이메일 전송 라이브러리의 오류 객체를 자세히 로깅
      if (emailError instanceof Error) {
        console.error('에러 메시지:', emailError.message);
        console.error('에러 이름:', emailError.name);
        console.error('에러 스택:', emailError.stack);
        // 추가 속성이 있을 경우 로깅
        console.error('추가 에러 정보:', JSON.stringify(emailError, Object.getOwnPropertyNames(emailError)));
      }
      throw emailError;
    }
    
    console.log('[reply-notification] API 요청 종료 (성공)');
    return NextResponse.json({
      success: true,
      message: '알림 이메일이 성공적으로 발송되었습니다',
    });
  } catch (error) {
    console.error('[reply-notification] 알림 이메일 발송 오류:', error);
    console.error('[reply-notification] API 요청 종료 (실패)');
    return NextResponse.json(
      { error: '알림 이메일 발송 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; 