"use strict";

import express from 'express';
const router = express.Router();

import { validateUrlData, encodeUrl, decodeUrl, urlStatistics } from '../controllers/url.controller';

router.post("/encode", validateUrlData, encodeUrl);
router.post("/decode", validateUrlData, decodeUrl);
router.get("/statistics/:urlPath", urlStatistics);

export default router;