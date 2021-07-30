"use strict";

import express from 'express';
const router = express.Router();

import { validateUrlData, encodeUrl, decodeUrl, urlStatistics } from '../controllers/web.controller';

router.post("/encode", validateUrlData, encodeUrl);
router.post("/decode", validateUrlData, decodeUrl);
router.get("/statistics/:urlPath", urlStatistics);

export default router;