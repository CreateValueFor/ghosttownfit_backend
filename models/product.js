const Sequelize = require('sequelize')

module.exports = class Product extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            price: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            size: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            thumb: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            count: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },
            detail: {
                type: Sequelize.TEXT,
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
        db.Product.hasMany(db.ProductDetail, { foreignKey: "productId", sourceKey: 'id' })
        db.Product.hasMany(db.ProductDisplay, { foreignKey: "productId", sourceKey: 'id' })
        db.Product.hasMany(db.ProductReview, { foreignKey: "productId", sourceKey: 'id' })
    }
}