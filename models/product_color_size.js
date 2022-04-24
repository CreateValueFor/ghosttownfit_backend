const Sequelize = require('sequelize')
const ProductOrder = require("./product_order")
module.exports = class ProductColorSize extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            size: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },

        }, {
            sequelize,
            timestamps: true,
            modelName: "ProductColorSize",
            tableName: "gt_product_color_size",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {
        // db.Product.hasMany(db.ProductDetail, { foreignKey: "productId", sourceKey: 'id' })
        // db.ProductColor.hasMany(db.ProductDisplay, { foreignKey: "productId", sourceKey: 'id' })
        db.ProductColorSize.belongsTo(db.ProductColor, { foreignKey: "productColorId", targetKey: 'id' })
        db.ProductColorSize.belongsToMany(db.Order, { through: ProductOrder })
    }
}