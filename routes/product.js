var express = require('express');
const ProductColorSize = require('../models/product_color_size');
const Product = require('../models/product');
var router = express.Router();
const ProductColor = require("../models/product_color");
const ProductDisplay = require('../models/product_display');
const ProductImage = require('../models/product_images');
const SubCategory = require('../models/sub_category');
const { Op } = require("sequelize")
const xml = require("xml")
const {create} = require('xmlbuilder2')
const xml2js = require('xml2js')

// 상품 전체 불러오기
router.get('/color', async (req, res, next) => {
    console.log(req.query);
    const { categoryId, theme } = req.query;
    console.log(categoryId, theme)

    const productSearchOption = {
        model: Product,

        attributes: ['title', 'id', 'price', 'categoryId', 'detail'],
        include: [SubCategory]
    }
    if (categoryId) {
        productSearchOption.where = { categoryId }
    }
    const searchOptions = {

        include: [ProductDisplay, ProductImage, productSearchOption,
            {
                model: ProductColorSize,
                attributes: ['id', 'size', 'count']
            }]
    }

    const whereOption = {}
    if (theme === 'sale') {
        whereOption.salePercent = { [Op.gt]: 0 }
    }
    if (theme === 'best') {
        whereOption.saleCount = { [Op.gt]: 10 }
    }
    if (theme === 'new') {
        whereOption.new = true
    }

    if (theme) {
        searchOptions.where = whereOption
    }





    const data = await ProductColor.findAll(searchOptions)

    return res.json({
        success: true,
        data
    })
})

router.get('/naver', async(req,res,next)=>{
    
    const {product, supplementSearch,optionSearch} = req.query;

    const productArray = await Promise.all(product.map(async (item)=>{
        const product = await ProductColor.findOne({where:{id: item.id}});
        return {
            id: product,

        }
    }))
    // while(true){
    //     const productId = req.query.product[i][id];
    //     if(!productId){
    //         break;
            
    //     }
    //     productArray.push(productId);
    //         i ++;
    // }
    

    res.type('application/xml');
    return res.send(xml({
        products:productArray
    }))

    return res.send({
        success:true,
        data: productArray
    })
})



module.exports = router;