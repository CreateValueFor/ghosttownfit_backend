const Sequelize = require('sequelize')

module.exports = class ProductImage extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            image: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
        }, {
            sequelize,
            timestamps: false,
            modelName: "ProductImage",
            tableName: "gt_product_images",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {
        db.ProductImage.belongsTo(db.ProductColor, { foreignKey: "productColorId", targetKey: 'id' })
    }
}