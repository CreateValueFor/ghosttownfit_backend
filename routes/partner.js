var express = require('express');
var router = express.Router();
const Partner = require("../models/partner")
const multer = require("multer")
const uuid = require('uuid').v4
const path = require('path')
const fs = require('fs');

// const PUBLIC_URL = "http://localhost:8000/uploads/partner/"
// const PUBLIC_URL = "http://13.125.119.128:8000/uploads/partner/"
const PUBLIC_URL = "https://ghost.callenge.co.kr/uploads/partner/"

const upload = multer({

    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/partner')
        },
        filename: (req, file, cb) => {
            cb(null, uuid() + path.extname(file.originalname))
        }
    })
})


// 파트너 모두 가져오기
router.get('/', async (req, res, next) => {
    const data = await (await Partner.findAll({ raw: true })).map(item => ({
        ...item,
        image: item.image && PUBLIC_URL + item.image
    }));
    res.json({
        success: true,
        message: "파트너 가져오기 성공",
        data
    })
});

// 파트너 등록하기
router.post('/', upload.single('image'), async (req, res, next) => {
    const { name, title, role, contents, instagram, youtube } = req.body
    const image = req.file.filename

    const data = await Partner.create({
        name, title, role, contents, image, instagram, youtube
    })
    res.json({
        success: true,
        message: "파트너 등록성공",
        data
    })
});
//파트너 수정하기
router.patch('/:partnerId', upload.single('image'), async (req, res, next) => {
    const { name, title, role, contents, instagram, youtube } = req.body
    const partnerId = req.params.partnerId
    const exPartner = await Partner.findOne({ where: { id: partnerId } })
    let image

    if (req.file) {

        image = req.file.filename
        if (fs.existsSync('uploads/partner/' + exPartner.image)) {
            try {
                fs.unlinkSync('uploads/partner/' + exPartner.image)
                console.log('이미지 삭제됨')
            } catch (error) {
                console.error(error);
            }
        }
    }


    const newPartner = await Partner.update({
        name,
        title,
        role,
        contents,
        instagram, youtube, image
    }, { where: { id: partnerId } })
    res.json({
        success: true,
        message: "파트너 수정 완료",
        data: newPartner
    })
})


module.exports = router;
