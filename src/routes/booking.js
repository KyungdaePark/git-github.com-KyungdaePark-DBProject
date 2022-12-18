import express from "express";
import {selectSql} from "../database/sql";
import {updateSql} from "../database/sql";

const router = express.Router();

function convertDateFormat(date) {
    return date.toLocaleDateString().replace(/./g, '').split(' ').map((v,i)=> i > 0 && v.length < 2 ? '0' + v : v).join('-');
}  

router.get("/:vin", async function (req, res){
    const vin = req.params.vin;
    const User_Ssn = req.cookies.User_Ssn;
    const selectcar = await selectSql.getACar(vin);
    console.log(selectcar)
    res.render('booking',{
        user: User_Ssn,
        vin: vin,
        selectcar,
    });
})

router.post('/:vin', async function (req, res) {
    const vin = req.params.vin;
    const bookdate = req.body.bookdate;
    const User_Ssn = req.cookies.User_Ssn;
    // 다른놈이 인터셉트 해서 booking 해버리면 우짤 .... 이거 막자 
    await updateSql.setBooking(User_Ssn, vin, bookdate);
    res.redirect('/');
})

router.post('/delete/:vin', async function (req, res){
    const vin = req.params.vin;
    await updateSql.eraseBooking(vin);
    res.redirect('/');
})

module.exports = router;