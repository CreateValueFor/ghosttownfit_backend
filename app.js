var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { sequelize } = require('./models');

var app = express();

app.set("port", process.env.PORT || 8000);

sequelize.sync({ force: true })
    .then(() => {
        console.log('데이터베이스 연결 성공')
    })
    .catch((err) => {
        console.error(err)
    })

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
    error.status = 404;
    next(error)
})

app.use((err, req, res, next) => {
    res.json({
        code: err.status
    })
})

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});

// module.exports = app;
