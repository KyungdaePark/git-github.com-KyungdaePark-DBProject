import cookieParser from "cookie-parser";
import express from "express";
import expressSession from 'express-session';
import { selectSql, updateSql } from "../database/sql";

const router = express.Router();

router.use(cookieParser());
router.use(expressSession({
    secret: 'dilab',
    resave: true,
    saveUninitialized: true,
}))

// router.get('/select_booking', async(req,res) => {
//     if(req.cookies.User_Role != "ADMIN"){
//         res.clearCookie('User_Ssn')
//         res.clearCookie('User_Role')
//         res.redirect('/')
//     }
//     const ssid = req.cookies.User_Ssn;
//     const booked_cars = await selectSql.getBookedCars(ssid);
//     res.render('select_booking',{
//         booked_cars,
//     })
// })

// router.get('/edit_booking', async(req, res) => {
//     if(req.cookies.User_Role != "ADMIN"){
//         res.clearCookie('User_Ssn')
//         res.clearCookie('User_Role')
//         res.redirect('/')
//     }
//     const ssid = req.cookies.User_Ssn;
//     const booked_cars = await selectSql.getBookedCars(ssid);
//     const vins = await selectSql.getVins(ssid)
//     const customers = await selectSql.getCustomers(ssid);
//     const salesperson = await selectSql.getSalesperson(ssid);
//     res.render('edit_booking',{
//         booked_cars,
//         vins,
//         customers,
//         salesperson
//     }) 
// })

router.post('/update/reservation', async (req, res) => {
    console.log(req.body);
    await updateSql.updateSale(req.body)
    res.redirect('/')
})


module.exports = router;