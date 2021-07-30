"use strict";

import { Schema, ValidationResult, ValidationErrorItem, Context } from "joi";
import { IAnyObject } from "../@types/app.type";
import { responseInfo } from "../helpers/utils.helper";


/**
 * validate payload with joi
 * @param {Schema} schema - joi schema
 * @param {IAnyObject} payload - request payload to be validated
 * @return {string}
 */
export const joiValidate = (schema: Schema, payload: IAnyObject) => {
	const result: ValidationResult = schema.validate(payload, { abortEarly: true });
	if (!result.error) return true; //all good
	const error: ValidationErrorItem = result.error.details[0];
	const msg = joiCustomErrorMsg(error);
	return responseInfo(400, false, null, msg);
};


/**
 * Customize joi error message
 * @param {ValidationErrorItem} error - error object
 * @return {string}
 */
const joiCustomErrorMsg = (error: ValidationErrorItem) => {
	const type = error.type;
	const context: Context = error.context || {};
	const label = context.key;
		
	let msg: string;
	switch (type) {
		case "string.base":
		case "number.base":
		case "object.base":
		case "array.base":
			const base = type.split('.')[0];
			msg = `${label} must be ${base == 'object' ? 'an' : 'a'} ${base}`;
			break;
		case "any.required":
		case "string.required":
		case "number.required":
		case "object.required":
			msg = `${label} is required!`;
			break;
		case "any.empty":
		case "string.empty":
		case "number.empty":
		case "object.empty":
			msg = `${label} should not be empty!`;
			break;
		case "string.email":
			msg = `${label} must be a valid email address!`;
			break;
		case "any.unknown":
		case "string.unknown":
		case "number.unknown":
		case "object.unknown":
			msg = `${label} is not allowed!`;
			break;
		case "any.only":
			//check for refs
			const refObj = context.valids[0] || null; //this wouldn't be an object otherwise
			if (refObj && typeof refObj === 'object') {
				const refKey = refObj.key || '';
				msg = `${label} must match ${refKey}!`;
			} else {
				msg = `${label} must be one of the following: ${context.valids.join(', ')}`;
			}
			break;
		case "any.invalid":
			msg = `${label} is invalid!`;
			break;
		case "any.min":
		case "string.min":
		case "number.min":
			msg = `${label} should have at least ${context.limit} characters!`;
			break;
		case "any.max":
		case "string.max":
		case "number.max":
			msg = `${label} should have at most ${context.limit} characters!`;
			break;
		default:
			msg = error.message;
			break;
	}
	return msg;
};