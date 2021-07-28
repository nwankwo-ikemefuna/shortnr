"use strict";

import express from 'express';
const router = express.Router();

import { validateUrlData, encodeUrl, decodeUrl, urlStatistics } from '../controllers/webController';

router.post("/encode", validateUrlData, encodeUrl);
router.post("/decode", validateUrlData, decodeUrl);
router.get("/statistics/:path", urlStatistics);

export default router;