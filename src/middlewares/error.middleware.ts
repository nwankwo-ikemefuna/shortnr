"use strict";

import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

const env = process.env.NODE_ENV || "development";

import { responseObject } from '../helpers/utils.helper';


const logsDir = __dirname + '/../../logs';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    // defaultMeta: {service: 'user-service'},
    transports: [
        // - Write all logs with level `error` and below to `error.log`
        new winston.transports.File({ filename: `${logsDir}/error.log`, level: 'error' })
    ],
    //uncaught exceptions
    exceptionHandlers: [
        new winston.transports.File({ filename: `${logsDir}/exception.log` })
    ]
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (env !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            // winston.format.simple(),
            winston.format.json(),
            // winston.format.colorize(),
            winston.format.prettyPrint(),
        )
    }));
}

export default function (err: any, _req: Request, res: Response, next: NextFunction) {
    logger.error(err.message, err);
    // console.log(err);
    next();
    return responseObject(res, 500, false, null, 'Server error occured!');
} 

