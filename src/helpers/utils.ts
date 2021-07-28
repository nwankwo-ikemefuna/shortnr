"use strict";

import { Response } from 'express';
import _ from 'lodash';
import { IAnyObject, IResponseInfo } from '../@types/app';
import { THttpCode } from '../@types/constants';


// Returns response info 
export const responseInfo = (rCode: THttpCode, rStatus: boolean, rData: IAnyObject | null, rMessage?: string | null, rMeta?: IAnyObject | null): IResponseInfo => {
	return { rCode, rStatus, rData, rMessage, rMeta };
};

// Returns a Backend response object to the client
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