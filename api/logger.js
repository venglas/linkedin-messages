const { createLogger, format, transports } = require('winston')
const lr = require('line-reader')
const fs = require('fs');
const { resolve } = require('path');

const customFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} | ${level}: ${message}`;
});

const clif = () => fs.readFileSync('logs/logs.log', 'utf8').split('\n').length;


const customFormatFile = format.printf( ({ level, message, timestamp }) => {
  
  return `{ "i": ${clif()} "timestamp": "${timestamp}", "level": "${level}", "message": "${message}" },`;
});

const logger = createLogger({
  transports: [
    new transports.File({
      maxsize: 5120000,
      maxFiles: 20,
      filename: `logs/logs.log`,
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD ( HH:mm:ss )'
        }),
        customFormatFile
      )
    }),
    new transports.Console({
      level: "debug",
      format: format.combine(
        format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DD ( HH:mm:ss )'
        }),
        customFormat
      )
    })
  ]
})

module.exports = logger 