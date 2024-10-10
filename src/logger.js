const bunyan = require('bunyan');
const RotatingFileStream = require('bunyan-rotating-file-stream');
const moment = require('moment-timezone');

const logName = `app-${moment().format('YYYY-MM-DD')}.log`;
const Log = bunyan.createLogger({
  name: 'logging',
  streams: [
    {
      level: 'info',
      stream: new RotatingFileStream({
        path: `logs/${logName}`,
        period: '1d', // daily rotation
        totalFiles: 10, // keep up to 10 back copies
        rotateExisting: true, // Give ourselves a clean file when we start up, based on period
        threshold: '10m', // Rotate log files larger than 10 megabytes
        totalSize: '20m', // Don't keep more than 20mb of archived log files
        // gzip: true, // Compress the archive log files to save space
      }),
    },
    {
      level: 'error',
      path: 'logs/error.log',
    },
  ],
});

module.exports = Log;
