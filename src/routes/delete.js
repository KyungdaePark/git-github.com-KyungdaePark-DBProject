import cookieParser from "cookie-parser";
import express from "express";
import expressSession from 'express-session';
import { selectSql } from "../database/sql";
import {updateSql} from "../database/sql";
import {deleteSql} from "../database/sql"

const router = express.Router();

router.post('/vehicle_info/:info_id', async (req, res) => {
    const info_id = req.params.info_id;
    await deleteSql.deleteVehicleInfo(info_id);
    res.redirect('/');
})

router.post('/vehicle/:vin', async (req, res) => {
    const vin = req.params.vin;
    await deleteSql.deleteVehicle(vin);
    res.redirect('/');
})

module.exports = router;