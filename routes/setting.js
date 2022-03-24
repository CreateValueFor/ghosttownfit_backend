var express = require('express');
var router = express.Router();
const MainCategory = require('../models/main_category')
const SubCategory = require('../models/sub_category')

const mainCategory = [
    {
        name: 'top',
        subCategory: [
            { name: "sleeveless" },
            { name: "t-shirts" },
            { name: "hoodies&sweatshirt" },
            { name: "jackets" },

        ]
    },
    {
        name: 'bottom',
        subCategory: [
            { name: "shorts" },
            { name: "patns&joggers" },
        ]
    },
    {
        name: 'accessories',
        subCategory: [
            { name: "socks" },
        ]
    },

]
/* GET home page. */
router.get('/category', async (req, res, next) => {

    mainCategory.forEach(async item => {
        const main = await MainCategory.create({
            name: item.name,
        })
        item.subCategory.forEach(async item => {

            const sub = await SubCategory.create(item)
            main.addSubCategory(sub)
        })

    })

    res.json({
        code: 200,
        message: "hello"
    })

});

module.exports = router;
