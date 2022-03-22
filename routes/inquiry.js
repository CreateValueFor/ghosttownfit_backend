var express = require('express');
var router = express.Router();
const Inquiry = require("../models/inquiry");
const { isLoggedIn } = require('./middlewares');

/* GET home page. */
router.get('/', async (req, res, next) => {
    const offset = Number(req.query.page) * 5
    const inquires = await Inquiry.findAll({
        limit: 5,
        offset: offset
    })
    res.json({
        success: true,
        message: "문의를 성공적으로 가져왔습니다.",
        data: inquires
    })
});

router.post('/', isLoggedIn, async (req, res, next) => {
    console.log(req)

    const { contents, isPrivate, name, password, title } = req.body;
    const nInquiry = await Inquiry.create({
        contents, isPrivate, name, password, title
    })
    return res.json({
        success: true,
        message: "등록 성공",
        data: nInquiry
    })
})

module.exports = router;
