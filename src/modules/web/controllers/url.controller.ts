"use strict";

import { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import Joi from 'joi';
import { IResponseInfo } from '../../../@types/app.type';
import { responseObject } from '../../../helpers/utils.helper';
import { joiValidate } from '../../../wrappers/joi.wrapper';
import { getAllUrls, getOneUrl, getUrlStatistics, saveUrl } from '../models/url.model';


/**
 * shorten a url by encoding it
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const encodeUrl = (req: Request, res: Response) => {
	const data = saveUrl(req.body);
	return responseObject(res, 201, true, data);
};


/**
 * decode a shortened url to its original url
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const decodeUrl = (req: Request, res: Response) => {
	const shortUrl = req.body.url;
	const urlSegments = shortUrl.split('/');
	const [ urlPath ] = urlSegments.slice(-1); //last item

	if (!urlPath) {
		return responseObject(res, 400, false, null, 'URL path missing in URL!');
	}
	
	//ensure url path exists in memory
	const encodedUrls = getAllUrls();
	if (urlPath in encodedUrls === false) {
		return responseObject(res, 404, false, null, 'Short URL not found!');
	} 

	const data = getOneUrl(urlPath);
	return responseObject(res, 200, true, data);
};


/**
 * Return basic stats of a short URL path
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const urlStatistics = (req: Request, res: Response) => {
	const { urlPath } = req.params;

	if (!urlPath) {
		return responseObject(res, 400, false, null, 'URL path missing in URL!');
	}

	//ensure url path exists in memory
	const encodedUrls = getAllUrls();
	if (urlPath in encodedUrls === false) {
		return responseObject(res, 404, false, null, 'URL path not found!');
	} 

	const data = getUrlStatistics(urlPath);
	return responseObject(res, 200, true, data);
};


/**
 * Validate url data middleware
 * called before encode/decode operations.
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {NextFunction} next - next middleware in the call stack
 */
export const validateUrlData = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
		url: Joi.string().uri().trim().required()
	});

	const payload = req.body;
	let validate = joiValidate(schema, payload);
	if (validate !== true) {
		//validation fails, return validation error to client
		const { rCode, rStatus, rMessage }: IResponseInfo = validate;
		return responseObject(res, rCode, rStatus, null, rMessage);
	}

	return next();
}