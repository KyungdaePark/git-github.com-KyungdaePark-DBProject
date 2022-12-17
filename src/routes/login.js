import cookieParser from "cookie-parser";
import express from "express";
import expressSession from 'express-session';
import { selectSql } from "../database/sql";

const router = express.Router();

// 쿠키 및 세션 설정
router.use(cookieParser());
router.use(expressSession({
    secret: 'dilab',
    resave: true,
    saveUninitialized: true,
}))

router.post('/logout', async (req, res) => {
    res.clearCookie('User_Role')
    res.clearCookie('User_Ssn')
    res.redirect('/')
})
// 로그인 정보 유무 판단
router.get('/', async (req, res) => {
    if (req.cookies.User_Ssn && req.cookies.User_Role) { //로그인한사람이 있으면
        if(req.cookies.User_Role == "ADMIN"){
            const ssid = req.cookies.User_Ssn;
            const user = await selectSql.getUsersInfo(req.cookies.User_Ssn, req.cookies.User_Role)
            const registered_car_info = await selectSql.getAllVehicleInfos();
            const registered_car = await selectSql.getAllVehicles();
            const booked_cars = await selectSql.getBookedCars(ssid);
            console.log(booked_cars)
            const vins = await selectSql.getVins();
            const customers = await selectSql.getCustomers(ssid);
            const salesperson = await selectSql.getSalesperson(ssid);
            const mycars = await selectSql.getMycars(ssid);
            console.log(vins)
            res.render('saleman_main', {
                Sname: user[0].Sname,
                Semail: user[0].SEmail,
                registered_car_info, registered_car, booked_cars, vins, customers, salesperson, mycars})
            // res.render('saleperson_main',{
            //     Sname: user[0].Sname,
            //     Semail: user[0].SEmail,
            //     vins,customers,salesperson
            // })
        }
        else if(req.cookies.User_Role == "CUSTOMER"){
            const user = await selectSql.getUsersInfo(req.cookies.User_Ssn, req.cookies.User_Role)
            const canbuycars = await selectSql.getCanbuyCars();
            const mybookedcars = await selectSql.getBookedCar(req.cookies.User_Ssn);
            // TODO const bookedcars = await selectSql.
            res.render('customer_main', {user, canbuycars, mybookedcars})
        }
        else{ // 로그인 정보 오류
            res.clearCookie('User_Ssn')
            res.clearCookie('User_Role')
            res.render('login'); // TODO : [alert] role information is not correct
        }
    } else { // 없으면 login.hbs 던져줌
        res.render('login');
    }
})

// 로그인 정보 request 들어옴
router.post('/', async (req, res) => {
    const req_vars = req.body;
    const users = await selectSql.getUsers();
    let checkLogin = false;
    let whoAmI_USsn = '';
    let whoAmI_Role = '';
    
    console.log(req_vars)
    users.map((user) => {
        if (req_vars.id == user.User_Id && req_vars.password == user.Password){
            checkLogin = true;
            whoAmI_USsn = user.Usn;
            whoAmI_Role = user.Role;
        }
    })
    console.log(whoAmI_USsn)
    if (whoAmI_USsn === undefined){
        checkLogin = false;
    }
    if (checkLogin) {
        let whoAmI_Ssn = await selectSql.getssn(whoAmI_USsn, whoAmI_Role);
        if(whoAmI_Role=="ADMIN"){
            whoAmI_Ssn = whoAmI_Ssn[0].Sid;
        }
        else if(whoAmI_Role=="CUSTOMER"){
            whoAmI_Ssn = whoAmI_Ssn[0].Ssn;
        }
        console.log(`[Login] Role : ${whoAmI_Role}, Ssn : ${whoAmI_Ssn}`)
        res.cookie('User_Ssn', whoAmI_Ssn, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
        }),
        res.cookie('User_Role', whoAmI_Role, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
        }),
        res.redirect('/');
    } else {
        res.redirect('/');
    }
})

module.exports = router;