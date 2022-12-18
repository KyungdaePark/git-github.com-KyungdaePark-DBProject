import express from "express";
import {insertSql, selectSql} from '../database/sql';

const router = express.Router();

router.post('/vehicle_info', async (req, res) => {
    await insertSql.insertVehicleInfo(req.body);
    res.redirect('/');
})

router.post('/vehicle', async (req, res) => {
    await insertSql.insertVehicle(req.body);
    res.redirect('/');
})

router.post('/find', async(req, res) => {
    const data = await selectSql.getAVehicle(req.body.findvin)
    console.log(data)
    res.render('findVehicle', {data})
})
module.exports = router;