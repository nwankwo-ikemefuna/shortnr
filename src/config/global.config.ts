"use strict";

import { IGlobalConfig } from "../@types/app.type";

require('dotenv').config();

const config: IGlobalConfig = {
    common: {
        env: process.env.NODE_ENV! || 'development',
        appName: process.env.APP_NAME!,
        domain: 'https://short.nr',
    },
    development: {},
    production: {},
    test: {}
};

export default config;