
/**
 * interface for encoded/decoded url data
 */
export interface IUrlData {
    originalUrl: string,
    shortUrl: string,
}

/**
 * type for url stats
 */
export type TUrlStat = IUrlData & {
    scheme: 'http' | 'https';
    host: string;
    port?: number;
    user?: string;
    pass?: string;
    path?: string;
    query?: string; //after the question mark ?
    fragment?: string; //after the hashmark #
}