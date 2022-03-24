

const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn, verifyToken, checkToken } = require('./middlewares');
const User = require('../models/user');
const Token = require("../models/token")
const jwt = require('jsonwebtoken');

var router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { userid, name, password, phone, email } = req.body;
    console.log(name)
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            return res.status(400).json({
                success: false,
                message: '해당 이메일로 등록된 계정이 존재합니다.'
            })
        }
        const exxUser = await User.findOne({ where: { userid } });
        if (exxUser) {
            return res.status(400).json({
                success: false,
                message: '해당 아이디로 등록된 계정이 존재합니다.'
            })
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            userid,
            password: hash,
            name,
            phone,
            email
        });
        return res.json({
            success: true,
            message: "유저 생성이 완료되었습니다."
        })
    } catch (error) {
        console.error(error);
        return next(error);
    }
})

router.post('/login', isNotLoggedIn, async (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }

        if (!user) {
            console.log(info)
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, async (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }


            const refreshToken = jwt.sign({},
                process.env.JWT_SECRET, {
                expiresIn: '14d',
                issuer: "ghosttown"
            })
            await Token.upsert({
                userId: user.id,
                refreshToken
            })

            const accessToken = jwt.sign({ id: user.id, nick: user.nick },
                process.env.JWT_SECRET, {
                expiresIn: '5s',
                issuer: 'ghosttown'
            }
            )

            res.cookie('access', accessToken);
            res.cookie('refresh', refreshToken)

            return res.json({
                success: true,
                message: '로그인 성공. 토큰 발급',
            });
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/test', checkToken, (req, res) => {
    res.json({
        success: true,
        message: "토큰 성공",
        data: req.decoded
    })
})

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.json({
        success: true,
        message: "로그아웃 성공"
    })
})

router.get('/kakao', passport.authenticate('kakao'))

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});


// Following function will generate access token that will be valid for 2 minutes
function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2m' });
}

module.exports = router;