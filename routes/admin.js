var express = require('express');
var router = express.Router();
const Product = require("../models/product")
const ProductDisplay = require("../models/product_display")
const ProductImage = require("../models/product_images")
const ProductInquiry = require("../models/product_inquiry")

const Category = require("../models/sub_category")
const multer = require("multer")
const path = require("path")
const uuid = require('uuid').v4;
const ProductReview = require('../models/product_review');
const ProductColor = require('../models/product_color');
const ProductColorSize = require('../models/product_color_size');
const fs = require('fs');
const fsExtra = require("fs-extra");

const upload = multer({

    storage: multer.diskStorage({
        destination(req, file, done) {
            const { colorId } = req.params;
            const isExist = fs.existsSync(`public/products/${colorId}`);
            if (!isExist) {
                fs.mkdirSync(`public/products/${colorId}`)
                fs.mkdirSync(`public/products/${colorId}/thumb`)
                fs.mkdirSync(`public/products/${colorId}/images`)
                fs.mkdirSync(`public/products/${colorId}/displaies`)
            }
            const field = file.fieldname;
            if (field === 'thumb') {
                fsExtra.emptyDirSync(`public/products/${colorId}/thumb`)
                fsExtra.emptyDirSync(`public/products/${colorId}/displaies`)
                fsExtra.emptyDirSync(`public/products/${colorId}/images`)
                done(null, `public/products/${colorId}/thumb`)
            } else if (field === 'images') {
                done(null, `public/products/${colorId}/images`)

            } else {
                done(null, `public/products/${colorId}/displaies`)

            }
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, uuid() + ext);
        }
    }),
    limits: { fileSize: 1024 * 1024 * 1024 }
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
        include: [{
            model: ProductColor,

            include: [ProductColorSize]
        }]
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



// 상품 색상 하나 불러오기
router.get('/product/color/:colorId', async (req, res, next) => {
    const colorId = req.params.colorId;

    const color = await ProductColor.findOne({
        where: { id: colorId },
        include: [
            ProductDisplay, ProductImage, ProductColorSize, { model: Product, attributes: ["title"] }
        ]
    })
    res.json({
        success: true,
        message: "상품 색상 정보를 가져왔습니다.",
        data: color
    })
})

//제품 수정하기
router.patch('/product/:productId', async (req, res, next) => {
    const productId = req.params.productId
    const { title, price, sojae, fit, detail, model, setak, categoryId, productCode } = req.body
    const newProduct = await Product.update({
        title, price, sojae, fit, detail, model, setak, categoryId, productCode
    }, { where: { id: productId } })
    return res.json({
        success: true,
        message: "업데이트완료",
        data: newProduct
    })
})

//제품 삭제하기
router.delete('/product/:productId', async (req, res, next) => {
    const productId = req.params.productId

    await Product.destroy({
        where: { id: productId }
    })

    res.json({
        success: true,
        message: '삭제 완료'
    })
})


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

router.post('/product/:productId/color', async (req, res, next) => {
    const { name, seksangList } = req.body;
    const productId = req.params.productId;

    await Product.update({ hasOption: true }, { where: { id: productId } })

    const newColor = await ProductColor.create({
        productId,
        name
    })

    await seksangList.forEach(async item => {
        const newSize = await ProductColorSize.create({
            size: item.size,
            count: item.count
        })

        newColor.addProductColorSize(newSize.id)
    })

    return res.json({
        success: true,
        message: "색상 및 재고 추가 완료",
        newColor
    })


})

//색상 상세 소개 등록하기
router.post("/product/color/:colorId", upload.fields([{ name: "thumb" }, { name: "displaies" }, { name: "images" }]), async (req, res, next) => {

    const colorId = req.params.colorId
    const { detail } = req.body
    const exProductColor = await ProductColor.findOne({ where: { id: colorId } });
    if (!exProductColor) {
        return res.json({
            message: "해당 상품 색상 존재하지 않음"
        })
    }
    const images = req.files



    await ProductColor.update({
        thumb: images.thumb[0].filename,
        detail
    }, { where: { id: colorId } })
    await ProductDisplay.destroy({ where: { productColorId: colorId } })
    await ProductImage.destroy({ where: { productColorId: colorId } })

    images.images.forEach(async item => {
        await ProductImage.create({
            image: item.filename,
            productColorId: colorId
        })
    })

    images.displaies.forEach(async item => {
        await ProductDisplay.create({
            image: item.filename,
            productColorId: colorId
        })
    })


    return res.json({
        success: true,
        message: "정상 등록 완료"
    })
})

// 제품 컬러 삭제하기 
router.delete("/product/color/:colorId", async (req, res, next) => {
    const { colorId } = req.params;
    const data = ProductColor.destroy({ where: { id: colorId } });
    return res.json({
        success: true,
        message: "삭제 성공",
        data: data
    })
})

router.post("/")

module.exports = router;
