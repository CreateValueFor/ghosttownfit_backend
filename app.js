const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors')

dotenv.config();

const authRouter = require('./routes/auth');
const inquiryRouter = require('./routes/inquiry');
const adminRouter = require("./routes/admin")
const settingRouter = require("./routes/setting")
const calendarRouter = require("./routes/calendar")
const partnerRouter = require("./routes/partner")
const productRouter = require("./routes/product")

const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
app.use(cors())
passportConfig(); // 패스포트 설정
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});
sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public/build')));
// app.use('/public/products', express.static('public/products'));
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public/build/index.html'))
})

app.use('/auth', authRouter);
app.use('/inquiry', inquiryRouter)
app.use('/admin', adminRouter)
app.use('/setting', settingRouter)
app.use('/calendar', calendarRouter)
app.use('/partner', partnerRouter)
app.use('/product', productRouter)

const index = path.resolve(__dirname, './public/build/index.html')

app.use('*', (req, res) => {
    res.sendFile(index)
})

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.json({
        error: err
    })
    // res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});