var express = require('express');
var router = express.Router();
const Product = require("../models/product")
const ProductDisplay = require("../models/product_display")
const ProductInquiry = require("../models/product_inquiry")

const Category = require("../models/sub_category")
const multer = require("multer")
const path = require("path")
const uuid = require('uuid').v4;
const ProductReview = require('../models/product_review');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'public/products');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, uuid() + ext);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
})

// 상품 전체 불러오기
router.get('/product', async (req, res, next) => {



    const products = await Product.findAll({
        include: [ProductInquiry, ProductReview]
    })

    res.json({
        success: true,
        message: "상품 정보를 가져왔습니다.",
        data: products
    })
});

// 상품 하나 불러오기
router.get('/product/:productId', async (req, res, next) => {

    const productId = req.params.productId

    const product = await Product.findOne({
        where: { id: productId },
        include: [ProductDisplay, ProductInquiry]
    })
    if (!product) {
        return res.json({
            message: "상품이 존재하지 않음"
        })
    }

    res.json({
        success: true,
        message: "상품 정보를 가져왔습니다.",
        data: product
    })
});


//제품 개요 만들기
router.post("/product", async (req, res, next) => {
    const { title, price, sojae, fit, detail, model, setak, categoryId, productCode } = req.body

    const newProduct = await Product.create({
        title, price, sojae, fit, detail, model, setak, productCode
    })

    const exCategory = await Category.findOne({ where: { id: categoryId } })

    exCategory.addProduct(newProduct)


    res.json({
        success: true,
        message: "상품이 성공적으로 등록되었습니다.",
        data: newProduct

    })
})

//제품 추가 사진 만들기
router.post("/product/:productId", upload.array('product'), async (req, res, next) => {

    const images = req.files
    const productId = req.params.productId
    const exProduct = await Product.findOne({ where: { id: productId } });
    if (!exProduct) {
        return res.json({
            message: "해당 상품 존재하지 않음"
        })
    }
    const displaies = await ProductDisplay.bulkCreate(images.map(item => ({ image: item.filename })))

    const product = await exProduct.addProductDisplay(displaies)
    res.json({
        success: true,
        message: "상품이 성공적으로 등록되었습니다.",
        data: product

    })
})

router.post("/")

module.exports = router;
