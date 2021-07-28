"use strict";

import { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import Joi from 'joi';
import { IResponseInfo } from '../../../@types/app';
import { responseObject } from '../../../helpers/utils';
import { joiValidate } from '../../../wrappers/joi';
import { IUrlData, TUrlStat } from '../@types/urlInterface';


/**
 * shorten a url by encoding it
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const encodeUrl = async(req: Request, res: Response) => {
	const { url } = req.body;
	//TODO: add url encoding logic
	const shortUrl = 'xyx'; //placeholder
	const data: IUrlData = { 
		originalUrl: url, 
		shortUrl 
	};
	return responseObject(res, 200, true, data);
};


/**
 * decode a shortened url to its original url
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const decodeUrl = async(req: Request, res: Response) => {
	const { url } = req.body;
	//TODO: add url decoding logic
	const originalUrl = 'xyx'; //placeholder
	const data: IUrlData = { 
		originalUrl, 
		shortUrl: url
	};
	return responseObject(res, 200, true, data);
};


/**
 * Return basic stats of a short URL path
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const urlStatistics = async(req: Request, res: Response) => {
	// const { path } = req.params;
	//TODO: add stats data as defined in url stats interface
	const data: TUrlStat = { 
		originalUrl: 'xyz',
		shortUrl: 'xyz',
		scheme: 'http',
		host: 'example.com',
	}
	return responseObject(res, 200, true, data);
};


/**
 * Validate url data
 * called before encode/decode operations.
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {NextFunction} next - next middleware in the call stack
 */
export const validateUrlData = async(req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
		url: Joi.string().uri().trim().required()
	});

	const payload = req.body;
	let validate = joiValidate(schema, payload);
	if (validate !== true) {
		//validation fails, return error
		const { rCode, rStatus, rMessage }: IResponseInfo = validate;
		return responseObject(res, rCode, rStatus, null, rMessage);
	}

	return next();
}