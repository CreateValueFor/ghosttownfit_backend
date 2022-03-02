const Sequelize = require('sequelize')

module.exports = class ProductReview extends Sequelize.Model {
    static init(sequelize) {
        return super.init({

            image: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            contents: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            viewed: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0
            },

        }, {
            sequelize,
            timestamps: true,
            modelName: "ProductReview",
            tableName: "gt_product_reviews",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci"
        });
    }
    static associate(db) {
        db.ProductReview.belongsTo(db.Product, { foreignKey: "productId", targetKey: 'id' })
    }
}