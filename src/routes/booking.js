import express from "express";
import {selectSql} from "../database/sql";
import {updateSql} from "../database/sql";

const router = express.Router();


router.get("/:vin", async function (req, res){
    if(!req.cookies.User_Ssn || !req.cookies.User_Role) res.status(400);
    const vin = req.params.vin;
    const User_Ssn = req.cookies.User_Ssn;
    const selectcar = await selectSql.getACar(vin);
    var today = new Date();
    var maxday = new Date();
    today.setMonth(today.getMonth())
    maxday.setMonth(maxday.getMonth()+1)
    var tomonth = (today.getMonth() + 1) < 10 ? '0'+String(today.getMonth()+1) : String(today.getMonth()+1)
    var maxmonth = (maxday.getMonth() + 1) < 10 ? '0'+String(maxday.getMonth()+1) : String(maxday.getMonth()+1)
    const todaystr = today.getFullYear() + '-' + tomonth+ '-' + today.getDate() 
    const maxdaystr = maxday.getFullYear() + '-' + maxmonth + '-' + maxday.getDate() 
    res.render('booking',{
        user: User_Ssn,
        vin: vin,
        maxday: maxdaystr,
        today: todaystr,
        selectcar,
    });
})

router.post('/:vin', async function (req, res) {
    if(!req.cookies.User_Ssn || !req.cookies.User_Role) res.status(400);
    const vin = req.params.vin;
    const bookdate = req.body.bookdate;
    const User_Ssn = req.cookies.User_Ssn;
    const result = await updateSql.setBooking(User_Ssn, vin, bookdate);
    if(result == 0) res.redirect('/');
    else{
        console.log("transaction detected value changed")
        res.redirect('/')
    }
})

router.post('/delete/:vin', async function (req, res){
    if(!req.cookies.User_Ssn || !req.cookies.User_Role) res.status(400);
    const vin = req.params.vin;
    await updateSql.eraseBooking(vin);
    res.redirect('/');
})

module.exports = router;