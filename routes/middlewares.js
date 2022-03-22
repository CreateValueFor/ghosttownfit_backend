const jwt = require('jsonwebtoken')
const Token = require("../models/token")
const User = require('../models/user')

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).json({ message: '로그인 필요' });
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
        // const refreshToken = jwt.verify(req.cookies.refresh, process.env.JWT_SECRET);
    } catch (error) {
        return null;
        if (error.name === 'TokenExpiredError') { // 유효기간 초과


            // const refreshToken = jwt.verify(req.cookies.refresh, process.env.JWT_SECRET);
            // console.log('refresh token is ', refreshToken)
            // const user = await Token.findOne({

            // })
            // console.log(user)

            // const newAccessToken = jwt.sign({ id: user.id, nick: user.nick },
            //     process.env.JWT_SECRET, {
            //     expiresIn: '1h',
            //     issuer: "ghosttown"
            // });
            // res.cookie('access', newAccessToken);
            // res.cookies.access = newAccessToken;




            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다',
            });



        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다',
        });
    }
};

exports.checkToken = async (req, res, next) => {

    if (req.cookies.access === undefined) throw Error('API 사용 권한이 없습니다.')

    const accessToken = verifyToken(req.cookies.access);

    const refreshToken = await Token.findOne({
        where:
            { refreshToken: req.cookies.refresh },
        include: [User]
    });

    // const refreshToken = verifyToken(req.cookies.refresh); // *실제로는 DB 조회

    if (accessToken === null) {
        if (refreshToken === null) {
            throw Error('API 사용 권한이 없습니다.')
        } else {

            // const user = await Token.findOne({
            //     include: [User],
            //     where: { refreshToken }
            // }).Token
            // console.log(user);

            const newAccessToken = jwt.sign({ id: refreshToken.User.id, nick: refreshToken.User.nick },
                process.env.JWT_SECRET, {
                expiresIn: '1h',
                issuer: "ghosttown"
            });
            res.cookie('access', newAccessToken);
            // res.cookies.access = newAccessToken;
            return next();
        }
    } else {
        if (refreshToken === undefined) {
            const newRefreshToken = jwt.sign({},
                process.env.JWT_SECRET, {
                expiresIn: "14d",
                issuer: 'ghosttown'
            }
            );
            await Token.create({
                id: accessToken.id,
                refreshToken: newRefreshToken
            })
            res.cookie('refresh', newRefreshToken)

            return next();

        } else {
            return next();
        }
    }
}