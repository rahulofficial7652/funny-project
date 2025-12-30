export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({ level: 'INFO', timestamp: new Date().toISOString(), message, meta }));
  },
  error: (message: string, error?: any) => {
    console.error(JSON.stringify({
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      errorBase: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error
    }, null, 2));
  },
  warn: (message: string, meta?: any) => {
    console.warn(JSON.stringify({ level: 'WARN', timestamp: new Date().toISOString(), message, meta }));
  }
};
