
const jwt = require('jsonwebtoken');


exports.verify = (req, res, next) => {

    try {
        if (!req.headers.authorization) {
            res.json({
                success: false,
                message: "토큰이 존재하지 않습니다."
            })
        }
        const token = req.headers.authorization.split(' ')[1]

        id = jwt.verify(token, process.env.JWT_SECRET).id;
        req.userId = id
        next()
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error,
            errorCode: 'T001'

        })
    }
};

// module.exports = {
//     sign: async (user, done) => {
//         /* 현재는 idx와 email을 payload로 넣었지만 필요한 값을 넣으면 됨! */
//         const payload = {
//             userid: user.userid,
//             password: user.password,
//         };
//         const result = {
//             //sign메소드를 통해 access token 발급!
//             token: jwt.sign(payload, secretKey, options),
//             refreshToken: randToken.uid(256)
//         };
//         // return result;
//         return done(result);
//     },
//     // verify: async (token) => {
//     //     let decoded;
//     //     try {
//     //         // verify를 통해 값 decode!
//     //         decoded = jwt.verify(token, secretKey);
//     //     } catch (err) {
//     //         if (err.message === 'jwt expired') {
//     //             console.log('expired token');
//     //             return TOKEN_EXPIRED;
//     //         } else if (err.message === 'invalid token') {
//     //             console.log('invalid token');
//     //             console.log(TOKEN_INVALID);
//     //             return TOKEN_INVALID;
//     //         } else {
//     //             console.log("invalid token");
//     //             return TOKEN_INVALID;
//     //         }
//     //     }
//     //     return decoded;
//     // }
// }