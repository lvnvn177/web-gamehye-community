import localFont from 'next/font/local'

// public/font 경로에 있는 폰트 로드 (실제 폰트 파일명으로 수정해주세요)
export const customFont = localFont({
  src: '../public/font/IropkeBatangM.ttf', // 실제 폰트 파일 경로와 이름으로 수정
  display: 'swap',
  variable: '--font-custom', // CSS 변수로 사용할 이름
}) 