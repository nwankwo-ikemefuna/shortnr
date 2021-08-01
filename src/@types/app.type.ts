import { THttpCode } from "./constants.type";
/** 
 * pick some required properties from an SSOT interface, while leaving the rest optional
 */
export type TOptionalExcept<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;

/** 
 * make all properties of T optional, and all properties of K required
 */
export type TOptionalKRequired<T, K> = Partial<T> & K;

/** 
 * index signature for an object whose keys and values are strings
 */
export interface IStrObject {
    [key: string]: string;
};

/** 
 * index signature for an object whose keys are strings and values can be anything
 */
export interface IAnyObject {
    [key: string]: any;
};

/** 
 * Response info used to generate and send a response object to the client
 */
export interface IResponseInfo {
    rCode: THttpCode;
    rStatus: boolean;
    rData: IAnyObject | null;
    rMessage?: string | null;
    rMeta?: IAnyObject | null;
};

/**
 * common config properties
 */
export interface ICommonConfig {
    env: string;
    appName: string;
    baseUrl: string;
    domain: string;
}

/**
 * global config properties
 */
export interface IGlobalConfig {
    [key: string]: ICommonConfig | IAnyObject;
    common: ICommonConfig;
    development: IAnyObject;
    production: IAnyObject;
    test: IAnyObject;
}