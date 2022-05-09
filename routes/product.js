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
        console.log(item)
        const product = await ProductColor.findOne({where:{id: item.id},include:[Product]});
        if(!product){
            return {
                
            }
        }
        console.log()
        return {
            product: {
                id: product.id,
                merchangtProductId : product.id,
                name :  product.Product.title + product.name,
                basePrice: product.Product.price,
                taxType: "TAX",
                infoUrl: 'https://ghosttown.kr/product/'+ product.id,
                imageUrl: `https://ghosttown.kr/public/products/${product.id}/thumb/${product.thumb}`,
                shippingPolicy : {
                    groupId : 'all',
                    method: 'DELIVERY',
                    feeType: 'CONDITIONAL_FREE',
                    feePayType: "PREPAYED",
                    feePrice: 3500,
                    conditionalFree:{
                        basePrice: 100000,
                    }
                }


            },

        }
    }))
    const builder = new xml2js.Builder({headless:true});
    const xmlFile = builder.buildObject(productArray)
    console.log(productArray)
    

    res.type('application/xml');
    return res.send(xmlFile)
    return res.send(xml({
        products:productArray
    }))

    return res.send({
        success:true,
        data: productArray
    })
})



module.exports = router;