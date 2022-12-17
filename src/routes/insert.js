import cookieParser from "cookie-parser";
import express from "express";
import expressSession from 'express-session';
import {insertSql} from '../database/sql';

const router = express.Router();

router.post('/vehicle_info', async (req, res) => {
    await insertSql.insertVehicleInfo(req.body);
    res.redirect('/');
})

router.post('/vehicle', async (req, res) => {
    await insertSql.insertVehicle(req.body);
    res.redirect('/');
})

module.exports = router;