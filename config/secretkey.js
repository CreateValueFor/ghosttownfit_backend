module.exports = {
    secretKey: "ghosttownkr",
    options: {
        algorithm: "HS256", // 해싱 알고리즘
        expiresIn: "30m",  // 토큰 유효 기간
        issuer: "ghosttown" // 발행자
    }
}