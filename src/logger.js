const winston = require('winston');
require('winston-daily-rotate-file');
const moment = require('moment-timezone');

// eslint-disable-next-line arrow-body-style
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  // Jika message adalah object, ubah ke string JSON
  const formattedMessage = typeof message === 'object' ? JSON.stringify(message) : message;
  return `${timestamp} [${level.toUpperCase()}]: ${formattedMessage}`;
});

const transport = new winston.transports.DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '10m',
  maxFiles: '10d',
});

const errorTransport = new winston.transports.File({
  filename: 'logs/error.log',
  level: 'error',
});

const Log = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: moment().format('YYYY-MM-DD HH:mm:ss') }),
    logFormat,
  ),
  transports: [
    transport,
    errorTransport,
  ],
});

module.exports = Log;
