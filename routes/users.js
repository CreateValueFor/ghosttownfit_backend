var express = require('express');
var passport = require('passport')
var LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const saltRounds = 10
var db = require('../models')
const User = require("../models/user")
var router = express.Router();


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// router.post('/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login',
//   failureFlash: true
// }));

router.post('/login', async (req, res, next) => {
  const { userid, password } = req.body
  const exUser = await User.findOne({
    where: { userid }
  })
  if (!exUser) {
    return res.status(400).json({
      code: 400,
      message: "유저가 존재하지 않습니다.",
      success: false
    })
  }
  const isCorrect = await bcrypt.compare(password, exUser.password)
  if (isCorrect) {
    delete exUser.password
    res.json({
      code: 200,
      success: true,
      message: "로그인 성공",
      data: {
        id: exUser.id,
        userid: exUser.userid,
        name: exUser.name,
        phone: exUser.phone,
        email: exUser.email,
        point: exUser.point,
        level: exUser.level
      }
    })
  } else {
    res.json({
      code: 400,
      success: false,
      message: "로그인 실패"
    })
  }
})

router.get('/loginCheck', (req, res) => {
  if (req.session.loginData) {
    res.send({ loggedIn: true, loginData: req.session.loginData })
  } else {
    res.send({ loggedIn: false })
  }
})

router.post('/register', async (req, res, next) => {
  const { userid, password, name, phone, email } = req.body
  if (!userid || !password || !name || !phone || !email) {
    res.json({
      code: 400,
      message: "인자가 잘못됨"
    })
  }
  const exUser = await db.User.findOne({ where: { userid: "test" } })
  if (exUser) {
    res.json({
      code: 400,
      message: "중복되는 아이디"
    })
  }
  await bcrypt.hash(password, saltRounds, (error, hash) => {
    db.User.create(
      { userid, password: hash, name, phone, email })
    res.json({
      code: 201,
      message: "회원가입되었습니다."
    })
  })
})



module.exports = router;
