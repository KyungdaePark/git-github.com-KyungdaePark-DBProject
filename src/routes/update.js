import express from "express";
import {updateSql} from "../database/sql";

const router = express.Router();

router.post('/vehicle_info/:info_id', async (req, res) => {
    if(!req.cookies.User_Ssn || !req.cookies.User_Role) res.status(400);
    const vehicle_info_data = req.body;
    const info_id = req.params.info_id;
    await updateSql.updateVehicleInfo(vehicle_info_data, info_id)
    res.redirect('/')
})

router.post('/vehicle', async (req, res) => {
    if(!req.cookies.User_Ssn || !req.cookies.User_Role) res.status(400);
    const vehicle_data = req.body;
    await updateSql.updateVehicle(vehicle_data)
    res.redirect('/')
})

router.post('/reservation', async (req, res) => {
    if(!req.cookies.User_Ssn || !req.cookies.User_Role) res.status(400);
    await updateSql.updateSale(req.body)
    res.redirect('/')
})

module.exports = router;