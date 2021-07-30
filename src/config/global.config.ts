"use strict";

import { IGlobalConfig } from "../@types/app.type";

require('dotenv').config();

const config: IGlobalConfig = {
    common: {
        env: process.env.NODE_ENV! || 'development',
        appName: process.env.APP_NAME!,
        baseUrl: process.env.BASE_URL!,
        domain: 'https://short.nr',
    },
    development: {},
    production: {},
    test: {}
};

export default config;