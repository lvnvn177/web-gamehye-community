export function generateReplyEmailHTML(replyData: {
  ideaContent: string;
  replyContent: string;
  ideaId: number;
}) {
  const { ideaContent, replyContent, ideaId } = replyData;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gamehye-com.vercel.app';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>새로운 답변이 등록되었습니다</title>
        <style>
          body {
            font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }
          .header h1 {
            color: #4CAF50;
            margin: 0;
            font-size: 24px;
          }
          .content {
            padding: 20px 0;
          }
          .idea-box {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-style: italic;
          }
          .reply-box {
            background-color: #e8f5e9;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
          }
          .btn {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>새로운 답변이 등록되었습니다</h1>
          </div>
          <div class="content">
            <p>안녕하세요,</p>
            <p>작성하신 아이디어에 새로운 답변이 등록되었습니다.</p>
            
            <div class="idea-box">
              <strong>내가 작성한 아이디어:</strong>
              <p>${ideaContent}</p>
            </div>
            
            <div class="reply-box">
              <strong>GameHye의 답변:</strong>
              <p>${replyContent}</p>
            </div>
            
            <a href="${appUrl}/ideas#${ideaId}" class="btn">아이디어 보러가기</a>
            
            <p>감사합니다.<br>GameHye 드림</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Sellanding. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
} 