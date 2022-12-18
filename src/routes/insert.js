import express from "express";
import {insertSql, selectSql} from '../database/sql';

const router = express.Router();

router.post('/vehicle_info', async (req, res) => {
    if(!req.cookies.User_Ssn || !req.cookies.User_Role) res.status(400);
    await insertSql.insertVehicleInfo(req.body);
    res.redirect('/');
})

router.post('/vehicle', async (req, res) => {
    if(!req.cookies.User_Ssn || !req.cookies.User_Role) res.status(400);
    await insertSql.insertVehicle(req.body);
    res.redirect('/');
})

router.post('/find', async(req, res) => {
    if(!req.cookies.User_Ssn || !req.cookies.User_Role) res.status(400);
    const data = await selectSql.getAVehicle(req.body.findvin)
    console.log(data)
    res.render('findVehicle', {data})
})
module.exports = router;