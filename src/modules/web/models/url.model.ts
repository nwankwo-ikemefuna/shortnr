import { IAnyObject, IStrObject } from "../../../@types/app.type";
import { TWebProtocol } from "../../../@types/constants.type";
import config from "../../../config/global.config";
import { generateRandomString } from "../../../helpers/utils.helper";
import { IUrlData, TUrlStat } from "../@types/url.type";


//this fella will hold our encoded urls in memory in the form { [urlPath]: [originalUrl], ++ }
let encodedUrls: IStrObject = {};


/**
 * Get all url maps
 */
export const getAllUrls = () => {
    return encodedUrls;
}


/**
 * Get one one url map
 * @param {string} urlPath - the url path from the encoded url
 */
export const getOneUrl = (urlPath: string) => {
    const originalUrl = encodedUrls[urlPath];
	const shortUrl = `${config.common.domain}/${urlPath}`;
	const data: IUrlData = { urlPath, shortUrl, originalUrl };
    return data;
}

/**
 * Save a new shortened url to memory
 * @param {IAnyObject} payload - request payload
 */
export const saveUrl = (payload: IAnyObject) => {
    const originalUrl = payload.url;
	//check if url already has short url
	let urlPath = '';
	const exists = Object.values(encodedUrls).includes(originalUrl);
	if (exists) {
		urlPath = Object.keys(encodedUrls).find(key => encodedUrls[key] === originalUrl)!;
	} else {
		//generate 6 random alphanumeric characters to be used as url path for the short url
		urlPath = generateRandomString(6, 'alphanum');
		//map url path to original url and store in memory
		encodedUrls = { ...encodedUrls, ...{ [urlPath]: originalUrl } };
	}

	return getOneUrl(urlPath);
}


export const getUrlStatistics = (urlPath: string) => {
    const { originalUrl, shortUrl } = getOneUrl(urlPath);
    //parse original url to an object 
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
        path: urlObject.pathname,
        query: urlObject.search,
        fragment: urlObject.hash
    }

    return data;
}