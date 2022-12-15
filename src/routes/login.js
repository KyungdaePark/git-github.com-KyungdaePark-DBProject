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

// 로그인 정보 유무 판단
router.get('/', async (req, res) => {
    if (req.cookies.User_Ssn) { //로그인한사람이 있으면
        if(req.cookies.User_Role == "ADMIN"){
            const user = await selectSql.getUsersInfo(req.cookies.User_Ssn, req.cookies.User_Role)
            res.render('saleman_main', {user})
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
    let whoAmI_Ssn = '';
    let whoAmI_Role = '';
    console.log(users)
    users.map((user) => {
        if (req_vars.id == user.User_Id && req_vars.password === user.Password){
            checkLogin = true;
            whoAmI_Ssn = user.Uid;
            whoAmI_Role = user.Role;
        }
    })
    if (checkLogin) {
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