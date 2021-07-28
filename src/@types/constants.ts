//const assertion to limit the scope of the http codes
const httpCodes = [
    // 100s information
    100, 101, 102, 
    // 200s success
    200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 
    // 300s Redirection
    300, 301, 302, 303, 304, 305, 306, 307, 308, 
    // 400s client error
    400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 422, 423, 424, 426, 428, 429, 431, 
    // 500s server error 
    500, 501, 502, 503, 504, 505, 507, 508, 510, 511
] as const;

/**
 * allowed response http codes
 */
export type THttpCode = typeof httpCodes[number];

/**
 * allowed random string pool types
 */
export type TRandomStringPool = 'num' | 'alpha' | 'alphanum';