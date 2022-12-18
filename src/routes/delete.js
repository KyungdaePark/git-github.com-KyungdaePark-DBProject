import express from "express";
import {deleteSql} from "../database/sql"

const router = express.Router();

router.post('/vehicle_info/:info_id', async (req, res) => {
    const info_id = req.params.info_id;
    await deleteSql.deleteVehicleInfo(info_id);
    res.redirect('/');
})

router.post('/vehicle', async (req, res) => {
    const vin = req.body.newvin;
    await deleteSql.deleteVehicle(vin);
    res.redirect('/');
})

module.exports = router;