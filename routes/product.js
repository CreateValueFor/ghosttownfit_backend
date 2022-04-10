var express = require('express');
const ProductColorSize = require('../models/product_color_size');
const Product = require('../models/product');
var router = express.Router();
const ProductColor = require("../models/product_color");
const ProductDisplay = require('../models/product_display');


// 상품 전체 불러오기
router.get('/color', async (req, res, next) => {
    console.log(req.query);

    const data = await ProductColor.findAll({

        include: [ProductDisplay, {
            model: Product,

            attributes: ['title', 'id', 'price', 'categoryId', 'detail']
        },
            {
                model: ProductColorSize,
                attributes: ['id', 'size', 'count']
            }]
    })

    return res.json({
        success: true,
        data
    })
})

module.exports = router;