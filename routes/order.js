var express = require('express');
var router = express.Router();
const { verify } = require('../modules/jwt');
const User = require("../models/user")
const Order = require("../models/order");
const ProductColorSize = require("../models/product_color_size");
const ProductOrder = require("../models/product_order");
const dotenv = require('dotenv');

const axios = require("axios")
dotenv.config()

// 주문번호 설정
router.post("/", verify, async (req, res, next) => {

    const { receiver, phone, address1, address2, postCode, deliveryMessage, productList, discount, purchaseAmount, purchaseMethod } = req.body

    let buyer;

    if (!receiver || !phone || !address1 || !address2 || !postCode || !productList) {
        return res.json({
            success: false,
            message: "정보가 누락되었습니다."
        })
    }

    try {
        // 주문번호 발급 
        buyer = await User.findOne({ where: { id: req.userId } });
        // buyer 없으면스킵
        if (!buyer) {
            return res.json({
                success: false,
                message: "유저가 존재하지 않습니다."
            })
        }

        const serialNumber = getCurrentDate() + phone.replaceAll("-", "");

        const newOrder = await Order.create({
            serialNumber,
            receiver,
            phone,
            address1,
            address2,
            postCode,
            deliveryMessage,
            buyer: buyer.id,
            discount,
            purchaseAmount,
            purchaseMethod
        })


        await Promise.all(

            productList.map(async item => {
                const exSize = await ProductColorSize.findOne({ where: { id: item.id } });

                if (exSize === null) {

                    newOrder.update({
                        status: -2
                    })
                    return res.json({
                        success: false,
                        message: "상품이 존재하지 않음"
                    })
                } else if (exSize.count < item.count) {
                    newOrder.update({
                        status: -1
                    })
                    return res.json({
                        success: false,
                        message: "재고가 부족합니다."
                    })
                } else if (item.count === 0) {
                    return res.json({
                        success: false,
                        message: "주문 수량이 없습니다."
                    })
                }
                else {
                    await ProductOrder.create({
                        count: item.count,
                        OrderId: newOrder.id,
                        ProductColorSizeId: exSize.id
                    })
                }
                // ProductOrder.create({})
            })
        )


        res.json({
            success: true,
            message: "주문 준비 완료",
            serialNumber,
            amount: newOrder.purchaseAmount,
            buyer: {
                name: buyer.name,
                email: buyer.email,
                phone: buyer.phone,
            }

        })

    } catch (error) {

        next(error)

    }



})

router.post("/check", async (req, res, next) => {
    try {
        const { imp_uid } = req.body;

        // const getToken = await axios.

        const getToken = await axios({
            url: "https://api.iamport.kr/users/getToken",
            method: "post", // POST method
            headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
            data: {
                imp_key: process.env.IMPORT_KEY, // REST API 키
                imp_secret: process.env.IMPORT_SECRET// REST API Secret
            }
        })

        const { access_token } = getToken.data.response;

        const getPaymentData = await axios({
            url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
            method: "get", // GET method
            headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });


        const paymentData = getPaymentData.data.response; // 조회한 결제 정보

        const order = await Order.findOne({ where: { serialNumber: paymentData.merchant_uid } });
        // const order = await Order.findOne({ where: { serialNumber: "2022042423245101071796841" } });
        if (!order) {
            return res.json({
                success: false,
                message: "해당 주문이 존재하지 않음"
            })
        }
        const amountToBePaid = order.purchaseAmount - order.discount

        const { amount, status } = paymentData;
        if (amount === amountToBePaid) {
            order.update({
                status: 1
            })
            switch (status) {
                case 'ready':
                    console.log('지원하지 않음');
                    break;
                case 'paid':
                    res.json({
                        success: true,
                        message: "일반 결제 성공"
                    })
            }
        } else {
            res.json({
                success: false,
                message: "잘못된 결제 정보입니다."
            })
        }

    } catch (error) {
        return res.json({
            success: false,
            error
        })
    }
})

module.exports = router;


function getCurrentDate() {
    var date = new Date();
    var year = date.getFullYear().toString();

    var month = date.getMonth() + 1;
    month = month < 10 ? '0' + month.toString() : month.toString();

    var day = date.getDate();
    day = day < 10 ? '0' + day.toString() : day.toString();

    var hour = date.getHours();
    hour = hour < 10 ? '0' + hour.toString() : hour.toString();

    var minites = date.getMinutes();
    minites = minites < 10 ? '0' + minites.toString() : minites.toString();

    var seconds = date.getSeconds();
    seconds = seconds < 10 ? '0' + seconds.toString() : seconds.toString();

    return year + month + day + hour + minites + seconds;
}