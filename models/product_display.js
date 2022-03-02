const Sequelize = require('sequelize')

module.exports = class ProductDisplay extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            image: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
        }, {
            sequelize,
            timestamps: false,
            modelName: "ProductDisplay",
            tableName: "gt_product_displaies",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {
        db.ProductDisplay.belongsTo(db.Product, { foreignKey: "productId", targetKey: 'id' })
    }
}