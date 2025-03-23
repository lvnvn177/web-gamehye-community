import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  cc?: string | string[];
  bcc?: string | string[];
}

// 트랜스포터 생성 로직을 분리해서 로깅 추가
function createTransporter() {
  console.log('[nodemailer] 트랜스포터 생성 시작');
  console.log('[nodemailer] SMTP 설정 확인:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    from: process.env.SMTP_FROM,
    // 비밀번호는 보안상 출력하지 않음
    hasPassword: !!process.env.SMTP_PASSWORD
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // TLS 사용, 포트 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    },
    // Gmail의 경우 추가 옵션
    tls: {
      rejectUnauthorized: false // 개발 환경에서만 사용, 프로덕션에서는 true로 설정
    }
  });
  
  console.log('[nodemailer] 트랜스포터 생성 완료');
  return transporter;
}

// 이메일 전송 함수
export async function sendEmail(options: EmailOptions): Promise<void> {
  const { to, subject, html, cc, bcc } = options;
  
  console.log('[nodemailer] 이메일 발송 시작');
  try {
    const transporter = createTransporter();
    
    // 연결 테스트
    console.log('[nodemailer] SMTP 연결 테스트 시작');
    try {
      await transporter.verify();
      console.log('[nodemailer] SMTP 연결 성공');
    } catch (verifyError) {
      console.error('[nodemailer] SMTP 연결 테스트 실패:', verifyError);
      throw verifyError;
    }
    
    // 실제 이메일 발송
    console.log('[nodemailer] 이메일 발송 시도');
    const mailOptions = {
      from: `"GameHye" <${process.env.SMTP_FROM || 'noreply@gamehye.com'}>`,
      to,
      cc,
      bcc,
      subject,
      html,
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('[nodemailer] 이메일 발송 성공:', info.messageId);
  } catch (error) {
    console.error('[nodemailer] 이메일 발송 오류:', error);
    throw error;
  }
} 