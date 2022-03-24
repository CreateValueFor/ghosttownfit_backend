var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({
    code: 200,
    message: "hello"
  })
  res.sendFile(path.join(__dirname, 'public/build/index.html'))
});

module.exports = router;
