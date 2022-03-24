const Sequelize = require('sequelize')

module.exports = class ProductColor extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            detail: {
                type: Sequelize.TEXT,
                allowNull: false,
                defaultValue: ''
            },
            thumb: {
                type: Sequelize.STRING(200),
                allowNull: false
            },

        }, {
            sequelize,
            timestamps: true,
            modelName: "ProductColor",
            tableName: "gt_product_colors",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {
        // db.Product.hasMany(db.ProductDetail, { foreignKey: "productId", sourceKey: 'id' })
        db.ProductColor.hasMany(db.ProductDisplay, { foreignKey: "productId", sourceKey: 'id' })
        db.ProductColor.belongsTo(db.Product, { foreignKey: "productId", targetKey: 'id' })
    }
}