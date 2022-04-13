var express = require('express');
var router = express.Router();
const Inquiry = require("../models/inquiry");
const User = require("../models/user")
const { isLoggedIn } = require('./middlewares');
const multer = require("multer");
const jwt = require('jsonwebtoken');
const path = require('path')
const uuid = require('uuid').v4;


const upload = multer({

    storage: multer.diskStorage({
        destination(req, file, done) {

            done(null, 'public/inquiry/common')
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, uuid() + ext);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
})

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

router.post('/', upload.single('thumb'), async (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1]
    let thumb;
    if (req.file) {

        thumb = req.file.filename
    }


    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const exUser = await User.findOne({ where: { id } })
    if (!exUser) {
        return res.json({
            success: false,
            messaeg: "유저가 존재하지 않습니다."
        })
    }


    const { contents, isPrivate, name, title } = req.body;


    const nInquiry = await Inquiry.create({
        contents, isPrivate, name, title, thumb, inquirer: exUser.id
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
