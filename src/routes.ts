"use strict";

import { Application } from 'express';
import webRouter from './modules/web/routes/webRouter';

export default (app: Application) => {
	//web module routes
	app.use('/', webRouter);
};