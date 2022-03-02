const Sequelize = require('sequelize');
const User = require('./user')
const Inquiry = require('./inquiry')
const Product = require("./product")
const ProductDetail = require("./product_detail")
const ProductDisplay = require("./product_display")
const ProductReview = require("./product_review")
const ProductInquiry = require("./product_inquiry")
const Partner = require("./partner")
const LookBook = require('./lookbook')
const Calendar = require("./calendar")

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Inquiry = Inquiry;
db.Product = Product;
db.ProductDetail = ProductDetail;
db.ProductDisplay = ProductDisplay;
db.ProductReview = ProductReview;
db.ProductInquiry = ProductInquiry;
db.Partner = Partner
db.Calendar = Calendar
db.LookBook = LookBook

User.init(sequelize)
Inquiry.init(sequelize)
Product.init(sequelize)
ProductDetail.init(sequelize)
ProductDisplay.init(sequelize)
ProductReview.init(sequelize)
ProductInquiry.init(sequelize)
Partner.init(sequelize)
Calendar.init(sequelize)
LookBook.init(sequelize)

User.associate(db);
Inquiry.associate(db);
Product.associate(db);
ProductDetail.associate(db);
ProductDisplay.associate(db);
ProductReview.associate(db);
ProductInquiry.associate(db);

module.exports = db;
