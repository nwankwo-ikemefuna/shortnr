import faker from 'faker';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { IResDataAssertions } from '../../../@types/test.type';
import { testBadGetRequest, testBadPostRequest, testGoodGetRequest, testGoodPostRequest } from '../../../helpers/test.helper';
import { saveUrl } from '../models/url.model';
 
chai.use(chaiHttp);

 
describe('URL Shortening Service', () => {

    //let's encode new data that we can test against
    const validPayload = {
        url: 'https://indicina.co/about?show=staff#staff-section',
    }
    const { urlPath, originalUrl, shortUrl } = saveUrl(validPayload);


    //POST Encode URL
    describe('POST /encode - Encode URL', () => {

        const endpoint = '/encode';

        //BAD: posted empty object
        testBadPostRequest(endpoint, 'It should NOT encode a URL if request object is empty', {}, 400);

        //BAD: posted empty object
        testBadPostRequest(endpoint, 'It should NOT encode a URL if original URL is not provided', { url: '' }, 400);

        //BAD: posted object with invalid original url
        const invalidUrlArr = [ 'https:', 'indicina', '.com', '/about', '#staff-section', 123, true ];
        for (const invalidUrl of invalidUrlArr) {
            const invalidUrlData  = { url: invalidUrl };
            testBadPostRequest(endpoint, `It should NOT encode a URL if original URL is not a valid URL. Input Data: ${JSON.stringify(invalidUrlData)}`, invalidUrlData, 400);
        }

        //GOOD: posted object with all required fields and corresponding correct values
        const validUrlArr = [
            'https://google.com',
            'https://www.linkedin.com/in/ikemefunanwankwo/',
            'https://indicina.co/about?show=staff#staff-section',
        ];
        //generate 5 more random urls (for the sake of completeness)
        for (let i = 5; i > 0; --i) {
            const randomValidUrl = faker.internet.url();
            validUrlArr.push(randomValidUrl);
        }
        for (const validUrl of validUrlArr) {
            const validUrlData  = { url: validUrl };
            const dataAssertions: IResDataAssertions = { 
                urlPath: { check: 'length', value: 6 },
                shortUrl: { check: 'exists' },
                originalUrl: { check: 'equal', value: validUrl } 
            };
            testGoodPostRequest(endpoint, `It should encode a URL if all required params are provided with corresponding correct values. Input Data: ${JSON.stringify(validUrlData)}`, validUrlData, dataAssertions, 201, 'object');
        }

    });


    //POST Decode URL
    describe('POST /decode - Decode URL', () => {

        const endpoint = '/decode';

        //BAD: posted empty object
        testBadPostRequest(endpoint, 'It should NOT decode a URL if request object is empty', {}, 400);

        //BAD: posted empty object
        testBadPostRequest(endpoint, 'It should NOT decode a URL if short URL is not provided', { url: '' }, 400);

        //BAD: posted object with data NOT in memory
        const invalidUrlData  = { url: `${shortUrl}-invalid` }; //this guy will definitely not be in memory
        testBadPostRequest(endpoint, `It should NOT decode a URL if data does not exist in memory. Input Data: ${JSON.stringify(invalidUrlData)}`, invalidUrlData, 404);

        //GOOD: posted object with all required fields and data exists in memory
        const validUrlData  = { url: shortUrl };
        const validDataAssertions: IResDataAssertions = { 
            urlPath: { check: 'equal', value: urlPath },
            shortUrl: { check: 'equal', value: shortUrl },
            originalUrl: { check: 'equal', value: originalUrl } 
        };
        testGoodPostRequest(endpoint, `It should decode a URL if all required params are provided with corresponding correct values and data exists in memory. Input Data: ${JSON.stringify(validUrlData)}`, validUrlData, validDataAssertions, 200, 'object');

    });


    //GET URL Statistics
    describe('GET /statistics/:urlPath - URL Statistics', () => {

        //BAD: url path NOT in memory
        testBadGetRequest(`/statistics/${urlPath}-invalid`, `It should NOT get a short URL's statistics if url path does not exist in memory. Input Data: ${urlPath}-invalid`, 404);

        //GOOD: requested statistics with valid url path which exists in memory
        const dataKeysArr = [ 'urlPath', 'shortUrl', 'originalUrl', 'protocol', 'origin', 'host', 'port', 'username', 'password', 'path', 'query', 'fragment' ];
        const validDataAssertions: IResDataAssertions = { 
            dataProps: { check: '+props', value: dataKeysArr },
            urlPath: { check: 'equal', value: urlPath },
            shortUrl: { check: 'equal', value: shortUrl },
            originalUrl: { check: 'equal', value: originalUrl }
        };
        testGoodGetRequest(`/statistics/${urlPath}`, `It should get a short URL's statistics if url path exists in memory. Input Data: ${urlPath}`, validDataAssertions, 200, 'object');

    });

});