"use strict";

import { Application } from 'express';
import webRouter from './modules/web/routes/web.route';

export default (app: Application) => {
	//web module routes
	app.use('/', webRouter);
};