var express = require('express');
var router = express.Router();
const Calendar = require('../models/calendar')

/* GET 모든 일정 */
router.get('/', async (req, res, next) => {

    const data = await Calendar.findAll();

    return res.json({
        code: 200,
        message: "일정 다운",
        data
    })

});

// 일정 등록
router.post('/', async (req, res, next) => {
    const { title, start, end } = req.body;

    const newPlan = await Calendar.create({
        title, start, end
    });
    return res.json({
        code: 200,
        message: "일정 등록",
        data: newPlan
    })
})


module.exports = router;
