"use strict";

import { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { URL } from 'url';
import Joi from 'joi';
import _ from 'lodash';
import { IResponseInfo, IStrObject } from '../../../@types/app';
import config from '../../../config/global';
import { generateRandomString, responseObject } from '../../../helpers/utils';
import { joiValidate } from '../../../wrappers/joi';
import { IUrlData, TUrlStat } from '../@types/urlInterface';
import { TWebProtocol } from '../../../@types/constants';


//this guy will hold our encoded urls in memory
let encodedUrls: IStrObject= {};


/**
 * shorten a url by encoding it
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const encodeUrl = async(req: Request, res: Response) => {
	const originalUrl = req.body.url;
	
	//check if url already has short url
	let urlPath = '';
	const exists = Object.values(encodedUrls).includes(originalUrl);
	if (exists) {
		urlPath = Object.keys(encodedUrls).find(key => encodedUrls[key] === originalUrl)!;
	} else {
		//generate 6 random alphanumeric characters to be as url path for the short url
		urlPath = generateRandomString(6, 'alphanum');
		//map url path to original url and store in memory
		encodedUrls = { ...encodedUrls, ...{ [urlPath]: originalUrl } };
	}
	const shortUrl = `${config.common.domain}/${urlPath}`;
	const data: IUrlData = { urlPath, shortUrl, originalUrl };
	
	return responseObject(res, 200, true, data);
};


/**
 * decode a shortened url to its original url
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const decodeUrl = async(req: Request, res: Response) => {
	const shortUrl = req.body.url;
	const urlSegments = shortUrl.split('/');
	const [ urlPath ] = urlSegments.slice(-1); //last item
	
	//ensure url path exists in memory
	if (urlPath in encodedUrls === false) {
		return responseObject(res, 404, false, null, 'Short URL not found!');
	} 
	const originalUrl = encodedUrls[urlPath];
	const data: IUrlData = { urlPath, shortUrl, originalUrl };
	
	return responseObject(res, 200, true, data);
};


/**
 * Return basic stats of a short URL path
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const urlStatistics = async(req: Request, res: Response) => {
	const { urlPath } = req.params;

	//ensure url path exists in memory
	if (urlPath in encodedUrls === false) {
		return responseObject(res, 404, false, null, 'URL path not found!');
	} 
	
	const originalUrl = encodedUrls[urlPath];
	const shortUrl = `${config.common.domain}/${urlPath}`;

	const urlObject = new URL(originalUrl);
	const data: TUrlStat = { 
		urlPath,
		shortUrl,
		originalUrl,
		protocol: <TWebProtocol>urlObject.protocol,
		origin: urlObject.origin,
		host: urlObject.host,
		port: parseInt(urlObject.port),
		username: urlObject.username,
		password: urlObject.password,
		pathname: urlObject.pathname,
		query: urlObject.search,
		fragment: urlObject.hash
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