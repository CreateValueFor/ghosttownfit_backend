var express = require('express');
var router = express.Router();
const Inquiry = require("../models/inquiry");
const User = require("../models/user")
const { isLoggedIn } = require('./middlewares');

/* GET home page. */
router.get('/', async (req, res, next) => {
    const offset = Number(req.query.page) * 5
    const inquires = await Inquiry.findAll({
        limit: 10,
        offset: offset,
        include: [User]
    })
    res.json({
        success: true,
        message: "문의를 성공적으로 가져왔습니다.",
        data: inquires
    })
});

router.post('/', isLoggedIn, async (req, res, next) => {


    const { contents, isPrivate, name, password, title } = req.body;


    const nInquiry = await Inquiry.create({
        contents, isPrivate, name, password, title, inquirer: req.user.id
    })
    return res.json({
        success: true,
        message: "등록 성공",
        data: nInquiry
    })
})

router.post('/:inquiryId', async (req, res, next) => {
    const { contents } = req.body;
    const inquiryId = req.params.inquiryId;

    const exInquiry = await Inquiry.findOne({ where: { id: inquiryId } })
    const data = await exInquiry.update({
        reply: contents
    })
    res.json({
        success: true,
        message: "답변 성공",
        data
    })



})


module.exports = router;
