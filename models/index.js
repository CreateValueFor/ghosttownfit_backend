const Sequelize = require('sequelize');
const User = require('./user')
const Inquiry = require('./inquiry')
const Product = require("./product")
const ProductColor = require("./product_color")
const ProductColorSize = require("./product_color_size")
const ProductInventory = require("./product_inventory")
const Order = require("./order")
const ProductOrder = require("./product_order")

const ProductDisplay = require("./product_display")
const ProductImage = require("./product_images")
const ProductReview = require("./product_review")
const ProductInquiry = require("./product_inquiry")
const Partner = require("./partner")
const LookBook = require('./lookbook')
const Calendar = require("./calendar")
const Token = require('./token')
const MainCategory = require('./main_category')
const SubCategory = require('./sub_category')

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Inquiry = Inquiry;
db.Product = Product;
db.ProductColor = ProductColor;
db.ProductColorSize = ProductColorSize;
db.ProductInventory = ProductInventory;
db.ProductImage = ProductImage;
db.Order = Order;

db.ProductDisplay = ProductDisplay;
db.ProductReview = ProductReview;
db.ProductInquiry = ProductInquiry;
db.Partner = Partner
db.Calendar = Calendar
db.LookBook = LookBook
db.Token = Token
db.MainCategory = MainCategory
db.SubCategory = SubCategory
db.ProductOrder = ProductOrder

User.init(sequelize)
Inquiry.init(sequelize)
Product.init(sequelize)
ProductColor.init(sequelize)
ProductInventory.init(sequelize)
ProductColorSize.init(sequelize)
ProductImage.init(sequelize)
Order.init(sequelize)
ProductOrder.init(sequelize)

ProductDisplay.init(sequelize)
ProductReview.init(sequelize)
ProductInquiry.init(sequelize)
Partner.init(sequelize)
Calendar.init(sequelize)
LookBook.init(sequelize)
Token.init(sequelize)
MainCategory.init(sequelize)
SubCategory.init(sequelize)



User.associate(db);
Inquiry.associate(db);
Product.associate(db);
ProductColor.associate(db);
ProductInventory.associate(db)
ProductColorSize.associate(db)
ProductImage.associate(db);
Order.associate(db);
ProductOrder.associate(db)
ProductDisplay.associate(db);
ProductReview.associate(db);
ProductInquiry.associate(db);
Token.associate(db);
MainCategory.associate(db)
SubCategory.associate(db)

module.exports = db;
