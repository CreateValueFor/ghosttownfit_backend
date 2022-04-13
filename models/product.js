const Sequelize = require('sequelize')

module.exports = class Product extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            price: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            productCode: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
            },
            sojae: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            fit: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            detail: {
                type: Sequelize.TEXT,
                allowNull: false,
                defaultValue: ''
            },
            model: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            setak: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            count: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            hasOption: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            flag: {
                type: Sequelize.TINYINT,
                defaultValue: 1
            },
        }, {
            sequelize,
            timestamps: true,
            modelName: "Product",
            tableName: "gt_products",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {
        db.Product.hasMany(db.ProductInquiry, { foreignKey: "productId", sourceKey: 'id' })
        db.Product.hasMany(db.ProductReview, { foreignKey: "productId", sourceKey: 'id' })
        db.Product.hasMany(db.ProductColor, { foreignKey: "productId", sourceKey: 'id', onDelete: 'cascade' })
        db.Product.belongsTo(db.SubCategory, { foreignKey: "categoryId", targetKey: 'id' })
    }
}