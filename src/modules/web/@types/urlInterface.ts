import { IAnyObject } from "../../../@types/app";
import { TWebProtocol } from "../../../@types/constants";

/**
 * interface for encoded/decoded url data
 */
export interface IUrlData {
    urlPath: string;
    shortUrl: string;
    originalUrl: string;
}

/**
 * type for url stats
 */
export type TUrlStat = IUrlData & {
    protocol: TWebProtocol;
    origin: string;
    host: string;
    port?: number;
    username?: string;
    password?: string;
    pathname?: string;
    query?: string; //after the question mark ?
    fragment?: string; //after the hashmark #
}