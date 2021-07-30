"use strict";

import { Response } from 'express';
import _ from 'lodash';
import { IAnyObject, IResponseInfo } from '../@types/app.type';
import { THttpCode, TRandomStringPool } from '../@types/constants.type';


/**
 * Return a response info object
 * @param {THttpCode} rCode - http code
 * @param {boolean} rStatus - status of the request
 * @param {IAnyObject | null} rData - the data object to be returned to client
 * @param {string | null} rMessage - message to return to client
 * @param {IAnyObject | null} rMeta - any additional meta data to return to client 
 */
export const responseInfo = (rCode: THttpCode, rStatus: boolean, rData: IAnyObject | null, rMessage?: string | null, rMeta?: IAnyObject | null): IResponseInfo => {
	return { rCode, rStatus, rData, rMessage, rMeta };
};


/**
 * Return a response object to the client and terminate the request-response cycle
 * @param {Response} res - express response object
 * @param {THttpCode} code - http code
 * @param {boolean} status - status of the request
 * @param {IAnyObject | null} data - the data object to be returned to client
 * @param {string | null} message - message to return to client
 * @param {IAnyObject | null} meta - any additional meta data to return to client 
 */
export const responseObject = (response: Response, code: THttpCode, status: boolean, data: IAnyObject | null, message?: string | null, meta?: IAnyObject | null) => {
	let resObject = { status };
	if (!_.isEmpty(meta)) {
		resObject = { ...resObject, ...{ meta } };
	}
	if (!status || (status && !data)) {
		resObject = { ...resObject, ...{ message } };
	} else {
		resObject = { ...resObject, ...{ data } };
	}
	return response.status(code).json(resObject);
};


/**
 * generate a random string from a pool of characters
 * @param {number} len - length of characters desired 
 * @param {TRandomStringPool} poolType - pool type
 */
export const generateRandomString = (len = 10, poolType: TRandomStringPool = 'alphanum') => {
	try {
		if (!['num', 'alpha', 'alphanum'].includes(poolType)) throw new Error('Invalid pool type');
		
		let pool: string;
		switch (poolType) {
			case 'num':
				pool = '0123456789';
				break;
			case 'alpha':
				pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
				break;
			case 'alpha':
			default: 
				pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
				break;
		}
		let result = '';
		for (let i = len; i > 0; --i) {
			result += pool[Math.round(Math.random() * (pool.length - 1))];
		}
		return result;
	} catch (err) {
		throw err.message;
	}
}
