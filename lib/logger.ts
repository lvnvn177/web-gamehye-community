// 환경에 따른 로그 레벨 설정
const isProduction = process.env.NODE_ENV === 'production';

// 로그 레벨 (심각도 오름차순)
enum LogLevel {
  DEBUG = 0,  // 상세 디버깅 정보
  INFO = 1,   // 일반 정보
  WARN = 2,   // 경고
  ERROR = 3,  // 오류
}

// 프로덕션에서는 경고와 오류만 출력
const minLogLevel = isProduction ? LogLevel.WARN : LogLevel.DEBUG;

function formatMessage(level: string, message: string, ...args: any[]) {
  return [`[${level}]`, message, ...args].filter(Boolean).join(' ');
}

export const logger = {
  debug(message: string, ...args: any[]) {
    if (minLogLevel <= LogLevel.DEBUG) {
      console.log(formatMessage('DEBUG', message), ...args);
    }
  },
  
  info(message: string, ...args: any[]) {
    if (minLogLevel <= LogLevel.INFO) {
      console.log(formatMessage('INFO', message), ...args);
    }
  },
  
  warn(message: string, ...args: any[]) {
    if (minLogLevel <= LogLevel.WARN) {
      console.warn(formatMessage('WARN', message), ...args);
    }
  },
  
  error(message: string, ...args: any[]) {
    if (minLogLevel <= LogLevel.ERROR) {
      console.error(formatMessage('ERROR', message), ...args);
    }
  }
}; 